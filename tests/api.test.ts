import {test} from 'node:test';import assert from 'node:assert/strict';import {POST} from '../app/api/journey/route';
const post=(body:unknown)=>POST(new Request('https://test.invalid/api/journey',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));
test('26 HTTP journey asks confirmation for unknown sound',async()=>{const r=await post({question:'What is this sound?',language:'en',depth:'10',confirmed:false});assert.equal(r.status,200);assert.equal((await r.json() as {state:string}).state,'confirm');});
test('27 HTTP journey returns traceable Arabic source',async()=>{const r=await post({question:'ما هو الأذان؟',language:'ar',depth:'10',confirmed:true});const d=await r.json() as {state:string;claims:{sourceId:string}[]};assert.equal(d.state,'answer');assert.equal(d.claims[0].sourceId,'BUK-631');assert.equal(r.headers.get('cache-control'),'no-store');});
test('28 HTTP rejects invalid language',async()=>{assert.equal((await post({question:'adhan',language:'xx',depth:'10',confirmed:true})).status,400);});
test('29 HTTP rejects oversized request',async()=>{assert.equal((await post({question:'a'.repeat(9000),language:'en',depth:'10',confirmed:true})).status,413);});
test('30 HTTP rejects malformed JSON',async()=>{assert.equal((await POST(new Request('https://test.invalid/api/journey',{method:'POST',body:'{'}))).status,400);});
