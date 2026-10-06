import ts from 'typescript';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const names=['moment-library','discovery-contract','discovery-guard','knowledge','agent'];
fs.mkdirSync('.test-build/moments',{recursive:true});
for(const name of names){let s=fs.readFileSync('lib/'+name+'.ts','utf8');s=s.replace(/import (\w+) from ['"]([^'"]+\.json)['"];?/g,(_,v,path)=>'const '+v+' = '+fs.readFileSync(new URL('../lib/'+path,import.meta.url).pathname.replace('/scripts/lib/','/lib/'),'utf8')+';');for(const n of names)s=s.replaceAll("'./"+n+"'","'./"+n+".mjs'");fs.writeFileSync('.test-build/moments/'+name+'.mjs',ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);}
const lib=await import('../.test-build/moments/moment-library.mjs');
const {corpus}=await import('../.test-build/moments/knowledge.mjs');
const {runAgent}=await import('../.test-build/moments/agent.mjs');
const {questionBank}=await import('../.test-build/moments/discovery-contract.mjs');
assert.deepEqual(lib.activeMoments.map(m=>m.id),['adhan']);assert.equal(lib.hasApprovedContent('adhan'),false);assert.equal(corpus.length,0);assert.equal(questionBank.length,8);assert.ok(!questionBank.some(q=>q.id==='Q9'));
const keys=['audio','fixed','single','pauses','phrase','moving','previous','group','continuous','music','recitation'];
for(let mask=0;mask<2**keys.length;mask++){const o=Object.fromEntries(keys.map((k,i)=>[k,!!(mask&(1<<i))]));const old=o.audio&&o.fixed&&!(o.recitation||o.moving||o.previous||o.group||o.continuous||o.music||!o.audio)&&((o.single&&o.pauses)||o.phrase);assert.equal(lib.momentGate('adhan',o),old);assert.equal(lib.momentGate('wudu',o),false);}
for(const language of ['ar','en'])for(const topic of ['purpose','words','response','why','origin','after']){const r=runAgent({question:language==='ar'?'ما هو الأذان؟':'What is adhan?',language,topic,depth:'10',confirmed:true});assert.equal(r.claims.length,0);assert.equal(r.state,'stop');}
console.log('PASS: staged activation; 2048 gate-equivalence inputs; approval gate on all 12 language/topic combinations; Q9 excluded. These are deterministic tests, not live-model results.');
