import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import {renderToStaticMarkup} from 'react-dom/server';
import React from 'react';

const require=createRequire(import.meta.url),root=process.cwd(),cache=new Map();
let modelIds=[],modelInput;
function load(file){
 const full=path.resolve(root,file);
 if(cache.has(full))return cache.get(full).exports;
 if(full.endsWith('.json'))return JSON.parse(fs.readFileSync(full,'utf8'));
 const module={exports:{}};cache.set(full,module);
 const code=ts.transpileModule(fs.readFileSync(full,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const localRequire=id=>{
  if(id==='@/lib/discovery')return {modelConfig:()=>({baseURL:'https://mock.invalid',apiKey:'local-test-placeholder',model:'mock-selection-only'})};
  if(id==='@/lib/model-audit')return {auditedFetch:async(_url,options)=>{modelInput=JSON.parse(options.body);return Response.json({model:'mock-selection-only',choices:[{finish_reason:'stop',message:{content:JSON.stringify({claimIds:modelIds})}}]});}};
  if(!id.startsWith('.')&&!id.startsWith('@/'))return require(id);
  const base=id.startsWith('@/')?path.join(root,id.slice(2)):path.resolve(path.dirname(full),id);
  const resolved=[base,base+'.ts',base+'.tsx',base+'.json'].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
  if(!resolved)throw Error('Missing test import: '+id);
  return load(resolved);
 };
 vm.runInNewContext(code,{module,exports:module.exports,require:localRequire,console,Response,Request,crypto:globalThis.crypto,AbortSignal,TextEncoder,TextDecoder,URL,Date,Intl,process},{filename:full});
 return module.exports;
}
const plain=value=>JSON.parse(JSON.stringify(value));
const report={version:'0.6.4',at:new Date().toISOString(),kind:'Deterministic content, rendered markup, retrieval and mocked API integration; not live model inference or browser screenshots',checks:[]};
async function check(name,fn){try{await fn();report.checks.push({name,pass:true});}catch(e){report.checks.push({name,pass:false,error:e.message});}}
const batch=load('data/moments-batch1.json');
const lib=load('lib/content-library.ts');
const {quotedParts}=load('lib/quoted-text.ts');
const {ClaimView,MeaningBranch}=load('components/moment-content.tsx');
const {POST:chat}=load('app/api/chat/route.ts');
const payload=lib.contentPayload();
const base='2330b07f9b3b49e3d60cf7278fc8852e9c7f6c46';
const before=JSON.parse(execFileSync('git',['show',base+':data/moments-batch1.json'],{encoding:'utf8'}));

await check('Owner upload retained byte for byte',()=>assert.equal(createHash('sha256').update(fs.readFileSync('data/moments-batch1.json')).digest('hex'),'dd042548837cf9f9afb93e02c7dbbd9555be57284ef81fd3b8532d1487e97664'));
await check('Exactly 42 of 44 claims eligible, including 15 meaning claims',()=>{assert.equal(lib.claims.length,44);assert.equal(payload.claims.length,42);assert.equal(payload.claims.filter(c=>c.dimension).length,15);assert.ok(payload.claims.every(lib.validClaim));});
await check('Excluded claims absent from public and review payloads and retrieval',()=>{for(const review of [false,true]){const p=JSON.stringify(lib.contentPayload(review));for(const id of ['iqamah-shorter-1','jamaah-place-1'])assert.ok(!p.includes(id));}assert.ok(lib.retrieveClaims('iqamah shorter outside prayer').every(lib.validClaim));});
await check('Old notes never change eligibility; internal adjudication notes not exposed',()=>{assert.ok(payload.claims.some(c=>c.claimId==='adhan-purpose'));for(const claim of payload.claims){assert.ok(!('note' in claim));assert.ok(!('reviewerNote' in claim));}});
await check('Original claim text and reviewStatus preserved',()=>{for(const m of before.moments)for(const b of m.explanation.branches)for(const c of b.claims){const now=lib.claims.find(x=>x.claimId===c.claimId);assert.equal(now.text_ar,c.text_ar);assert.equal(now.text_en,c.text_en);assert.equal(now.reviewStatus,c.reviewStatus);}});
await check('Source gate rejects invented IDs, excluded claims and unknown references',()=>{for(const id of ['invented','iqamah-shorter-1','jamaah-place-1'])assert.throws(()=>lib.verifySelected([id],lib.claims,'en'));assert.equal(lib.validClaim({...payload.claims[0],sourceIds:['absent']}),false);assert.equal(lib.validClaim({...payload.claims[0],reviewStatus:'pending'}),false);});
await check('Every claim and quotation survives formatting verbatim in both languages',()=>{for(const c of lib.claims)for(const language of ['ar','en']){const text=c['text_'+language],parts=quotedParts(text);assert.equal(parts.map(p=>p.text).join(''),text);for(const part of parts.filter(p=>p.quoted))assert.ok(text.includes(part.text));}});
for(const language of ['ar','en'])for(const moment of payload.moments){
 await check(moment.id+' meaning renders three supplied dimensions and collapsed sources ('+language+')',()=>{
  const html=renderToStaticMarkup(React.createElement(MeaningBranch,{momentId:moment.id,content:payload,language}));
  for(const dimension of ['spiritual','value','educational'])assert.ok(html.includes(batch.displayGuidance.labels[dimension][language]));
  assert.equal((html.match(/data-claim-id=/g)||[]).length,3);
  assert.equal((html.match(/<details /g)||[]).length,3);
  assert.ok(!/<details[^>]*\sopen(?:[\s=>])/.test(html));
  assert.ok(html.includes(language==='ar'?'للمزيد':'Learn more'));
  assert.ok(html.includes('target="_blank" rel="noopener noreferrer"'));
  assert.ok(html.includes('class="source-quote"'));
 });
}
await check('Source references and badge occur only inside collapsed details',()=>{for(const c of payload.claims){const html=renderToStaticMarkup(React.createElement(ClaimView,{claim:c,language:'en',sources:payload.sources}));const start=html.indexOf('<details '),end=html.indexOf('</details>');assert.ok(start>=0&&end>start);const outside=html.slice(0,start)+html.slice(end+10);assert.ok(!outside.includes('source-chip'));assert.ok(!outside.includes('Verified against its source'));}});
const questions=[
 ['adhan','ما البعد الروحي للأذان؟','Why does the call to prayer matter to Muslims?'],
 ['iqamah','ما أثر الإقامة في القلب؟','What is the spiritual meaning of iqamah?'],
 ['congregational-prayer','ما القيم في صلاة الجماعة؟','What values are reflected when people pray together?'],
 ['wudu','ما المعنى الروحي للوضوء؟','What is the spiritual meaning of wudu?'],
 ['khutbah','ما الأثر التربوي لخطبة الجمعة؟','What is the character lesson of the Friday sermon?']
];
for(const [momentId,ar,en] of questions)for(const [language,question] of [['ar',ar],['en',en]]){
 await check(momentId+' meaning retrieval and exact-text mocked API answer ('+language+')',async()=>{
  const expected=payload.claims.filter(c=>c.momentId===momentId&&c.dimension);
  const retrieved=lib.retrieveClaims(question);
  assert.deepEqual(plain(retrieved.slice(0,3).map(c=>c.claimId).sort()),expected.map(c=>c.claimId).sort());
  modelIds=expected.map(c=>c.claimId);
  const response=await chat(new Request('https://test.invalid/api/chat',{method:'POST',body:JSON.stringify({question,language})}));
  const result=await response.json();assert.equal(response.status,200);assert.equal(result.kind,'answer');
  assert.equal(result.claims.length,3);assert.ok(modelInput.messages[0].content.includes('Never answer with prose'));
  for(const claim of result.claims){const original=expected.find(c=>c.claimId===claim.claimId);assert.equal(claim.text,original['text_'+language]);assert.ok(claim.sources.length>0);}
 });
}
await check('Explicit meaning branches put all three new claims first',()=>{for(const m of payload.moments){const ids=lib.retrieveClaims('Why it matters to them',m.id+'-meaning').slice(0,3);assert.ok(ids.every(c=>c.branchId===m.id+'-meaning'));}});
await check('Unsupported model selection gives one service error, no fabricated answer',async()=>{modelIds=['invented'];const response=await chat(new Request('https://test.invalid/api/chat',{method:'POST',body:JSON.stringify({question:questions[0][2],language:'en'})}));const result=await response.json();assert.equal(response.status,502);assert.equal(result.error,'temporarily_unavailable');assert.ok(!result.claims&&!result.next);});
await check('Adhan order, repetitions and distinct journey claims unchanged',()=>{const lines=payload.claims.filter(c=>c.branchId==='adhan-lines').sort((a,b)=>a.order-b.order);assert.deepEqual(plain(lines.map(c=>c.order)),[1,2,3,4,5,6,7]);assert.deepEqual(plain(lines.map(c=>c.repeat)),[4,2,2,2,2,2,1]);const j=load('data/experience.json').journey;assert.deepEqual(j.claimIds,['adhan-purpose','adhan-words','wudu-what-1','iqamah-what-1','jamaah-what-1']);});
await check('Discovery, model routes, prompts and refusal gates unchanged',()=>{for(const file of ['lib/discovery.ts','lib/discovery-contract.ts','lib/discovery-guard.ts','lib/library-recognition.ts','lib/model-audit.ts','app/api/chat/route.ts','app/api/moments/route.ts'])assert.equal(fs.readFileSync(file,'utf8'),execFileSync('git',['show',base+':'+file],{encoding:'utf8'}));});
await check('All supplied recognition test cases remain unchanged',()=>assert.deepEqual(batch.testCases,before.testCases));
const recognition=load('lib/library-recognition.ts');
const expected={101:'congregational-prayer',102:null,103:'wudu',104:null,105:'iqamah',106:null,107:'khutbah',108:null};
for(const row of batch.testCases)await check('Recognition case '+row.id+' deterministic gate',()=>{const result=recognition.libraryCandidates([{role:'user',text:row.description}]);if(expected[row.id])assert.ok(result.some(m=>m.id===expected[row.id]&&m.hasContent));else assert.equal(result.length,0);});
await check('Original 20-case recorded turns still pass unchanged boundary rules',()=>{const history=JSON.parse(fs.readFileSync('docs/release-0.6.1/live-before-publish.json'));assert.equal(history.runs.filter(r=>r.id<=20).length,20);for(const run of history.runs.filter(r=>r.id<=20)){const messages=[];for(const turn of run.turns){if(['start','reply'].includes(turn.action))messages.push({role:'user',text:turn.input});assert.equal(recognition.needsOutdoorContext(messages),false);assert.equal(recognition.libraryBoundary(messages),null);}}});
fs.mkdirSync('docs/release-0.6.4',{recursive:true});
report.summary={checks:report.checks.length,passed:report.checks.filter(c=>c.pass).length,failed:report.checks.filter(c=>!c.pass).length,liveModelRun:false,browserScreenshots:false};
fs.writeFileSync('docs/release-0.6.4/deterministic.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({summary:report.summary,failures:report.checks.filter(c=>!c.pass)},null,2));
process.exitCode=report.summary.failed?1:0;
