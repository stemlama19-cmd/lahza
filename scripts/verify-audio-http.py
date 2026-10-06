"""Check built Worker audio delivery and byte-range seeking; no browser playback claim."""
import asyncio
import hashlib
import json
import os
import signal
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def verify():
    recording = json.loads((ROOT / 'data/adhan-recording.json').read_text())
    url = 'http://127.0.0.1:8788' + recording['playbackUrl']
    with urllib.request.urlopen(url, timeout=25) as response:
        body = response.read()
        assert response.status == 200
        assert response.headers.get_content_type() == 'audio/mpeg'
        assert hashlib.sha256(body).hexdigest() == recording['mp3Sha256']
    request = urllib.request.Request(url, headers={'Range': 'bytes=0-1023'})
    with urllib.request.urlopen(request, timeout=25) as response:
        partial = response.read()
        assert response.status == 206, response.status
        assert response.headers['Content-Range'] == f'bytes 0-1023/{len(body)}'
        assert partial == body[:1024]
    for value, start, end in [('bytes=0-1', 0, 1), ('bytes=1024-', 1024, len(body)-1), ('bytes=-128', len(body)-128, len(body)-1)]:
        req = urllib.request.Request(url, headers={'Range': value})
        with urllib.request.urlopen(req, timeout=25) as response:
            assert response.status == 206
            assert response.read() == body[start:end+1]
    try:
        urllib.request.urlopen(urllib.request.Request(url, headers={'Range': f'bytes={len(body)}-'}), timeout=25)
        raise AssertionError('Expected 416')
    except urllib.error.HTTPError as error:
        assert error.code == 416
    with urllib.request.urlopen(urllib.request.Request(url, method='HEAD'), timeout=25) as response:
        assert response.status == 200 and int(response.headers['Content-Length']) == len(body)
        assert response.read() == b''
    with urllib.request.urlopen(urllib.request.Request(url, headers={'Range': 'bytes=0-1', 'If-Range': '"different"'}), timeout=25) as response:
        assert response.status == 200 and response.read() == body
    print(json.dumps({'version': json.loads((ROOT / 'package.json').read_text())['version'], 'scope': 'Local built Worker HTTP, not browser audio output',
                      'status': 200, 'contentType': 'audio/mpeg', 'bytes': len(body),
                      'sha256Matches': True, 'rangeStatus': 206, 'rangeBytes': len(partial), 'additionalChecks': ['two-byte probe', 'open-ended range', 'suffix range', 'invalid range 416', 'HEAD', 'If-Range mismatch']}), flush=True)


async def main():
    process = await asyncio.create_subprocess_exec(
        'node', '--import', './scripts/sites-env.mjs', './node_modules/wrangler/bin/wrangler.js',
        'dev', '--config', 'dist/server/wrangler.json', '--local', '--persist-to', '.wrangler/audio-check',
        '--ip', '127.0.0.1', '--inspector-port', '0', '--port', '8788', cwd=ROOT,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.STDOUT, start_new_session=True)
    try:
        async def ready():
            while True:
                line = await process.stdout.readline()
                if not line:
                    raise RuntimeError('Worker exited before ready')
                if b'Ready on' in line:
                    return
        await asyncio.wait_for(ready(), 50)
        drain = asyncio.create_task(process.stdout.read())
        await asyncio.to_thread(verify)
    finally:
        if process.returncode is None:
            os.killpg(process.pid, signal.SIGTERM)
            try:
                await asyncio.wait_for(process.wait(), 8)
            except asyncio.TimeoutError:
                os.killpg(process.pid, signal.SIGKILL)
                await process.wait()


asyncio.run(main())
