import recording from '../data/adhan-recording.json';

// A fixed local asset, never an arbitrary proxy. Explicit byte ranges support
// media seeking even when the underlying static asset server returns HTTP 200.
export async function serveAdhanAudio(request: Request, assets?: Pick<Fetcher, 'fetch'>) {
  if (!['GET', 'HEAD'].includes(request.method)) {
    return new Response(null, {status: 405, headers: {Allow: 'GET, HEAD'}});
  }
  if (!assets) return new Response('Recording unavailable', {status: 503});
  const source = await assets.fetch(new Request(new URL(recording.src, request.url)));
  if (!source.ok) return new Response('Recording unavailable', {status: 503});
  const bytes = await source.arrayBuffer(), size = bytes.byteLength;
  const etag = '"' + recording.mp3Sha256 + '"';
  const headers = new Headers({
    'Content-Type': 'audio/mpeg', 'Content-Length': String(size),
    'Accept-Ranges': 'bytes', 'ETag': etag, 'Cache-Control': 'public, max-age=86400',
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method === 'HEAD') return new Response(null, {headers});
  const range = request.headers.get('Range');
  const ifRange = request.headers.get('If-Range');
  const match = (!ifRange || ifRange === etag) && range?.match(/^bytes=(\d*)-(\d*)$/);
  if (match) {
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if ((!match[1] && !match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= size) {
      return new Response(null, {status: 416, headers: {'Content-Range': `bytes */${size}`, 'Accept-Ranges': 'bytes'}});
    }
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(bytes.slice(start, end + 1), {status: 206, headers});
  }
  return new Response(bytes, {headers});
}
