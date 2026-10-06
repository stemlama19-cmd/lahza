"""Package current application source, excluding secrets, runtime state and visitor data."""
from pathlib import Path
import subprocess, zipfile, json, re
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
names=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard'],cwd=root,text=True).splitlines()
allowed_roots={'data','app','build','components','db','docs','drizzle','examples','hooks','lib','public','scripts','supabase','tests','vendor'}
allowed_rootfiles={'.env.example','.gitignore','.npmrc','README.md','cloudflare-env.d.ts','components.json','drizzle.config.ts','eslint.config.mjs','next.config.ts','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','postcss.config.mjs','tsconfig.json','vite.config.ts'}
files=[]
for name in sorted(set(names)):
 path=Path(name)
 if path.parts[0] not in allowed_roots and name not in allowed_rootfiles: continue
 if name.startswith(('docs/baseline-','public/downloads/')):continue
 file=root/name
 if not file.is_file() or file.is_symlink():continue
 if file.suffix in {'.ts','.tsx','.js','.mjs','.json','.md','.txt','.sh'} or name=='.env.example':
  content=file.read_text(errors='replace')
  if re.search(r'\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}',content):raise SystemExit('Secret-like value found: archive not created')
 files.append(name)
out=root/'public'/'downloads'/f'lahza-source-v{version}.zip';out.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as archive:
 archive.writestr('lahza/.openai/hosting.json',json.dumps({'d1':None,'r2':None})+'\n')
 for name in files:archive.write(root/name,arcname='lahza/'+name)
print(json.dumps({'archive':str(out),'files':len(files),'bytes':out.stat().st_size}))
