import {runAgent,verify,type Result,type RequestInput} from '@/lib/agent';
import {corpus} from '@/lib/knowledge';
import {selectEvidence,vectorRetrieve} from '@/lib/provider';
function stopProvider(result:Result,reason:string):Result{return {...result,state:'stop',answer:result.language==='ar'?'تعذر التحقق من الدليل عبر الخدمة الآن. لن أقدّم إجابة غير موثوقة. يمكنك المحاولة مجددًا أو إعداد إحالة.':'The evidence service could not verify this answer. I will not offer an unverified answer. Please retry or prepare a handoff.',reason,claims:[],passages:[],gate:{decision:'Stop',checks:[reason],repairs:0},trace:[...result.trace,'provider-stop']};}
export async function POST(request:Request){
 if(Number(request.headers.get('content-length')||0)>8192)return Response.json({error:'Request too large'},{status:413});
 try{const text=await request.text();if(text.length>8192)return Response.json({error:'Request too large'},{status:413});const body=JSON.parse(text);if(typeof body.question!=='string'||!['ar','en'].includes(body.language)||!['10','30','120'].includes(body.depth)||typeof body.confirmed!=='boolean')return Response.json({error:'Invalid input'},{status:400});
 const input:RequestInput={question:body.question,language:body.language,depth:body.depth,confirmed:body.confirmed,human:body.human===true};let result=runAgent(input);
 // Apply scope and moment confirmation before model calls. No user-controlled network endpoints.
 if(result.state==='answer'&&process.env.LLM_API_KEY&&process.env.LLM_MODEL){
  try{
   const config={baseURL:process.env.LLM_BASE_URL||'https://api.openai.com/v1',apiKey:process.env.LLM_API_KEY,model:process.env.LLM_MODEL};
   if(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
    const er=await fetch(config.baseURL.replace(/\/$/,'')+'/embeddings',{method:'POST',signal:AbortSignal.timeout(10000),headers:{Authorization:'Bearer '+config.apiKey,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.EMBEDDING_MODEL||'text-embedding-3-small',input:input.question,dimensions:1536})});
    if(!er.ok)throw Error('embedding-service-unavailable');const ed=await er.json() as {data:{embedding:number[]}[]};
    const hits=await vectorRetrieve({url:process.env.SUPABASE_URL,serviceKey:process.env.SUPABASE_SERVICE_ROLE_KEY,embedding:ed.data[0].embedding}) as {chunk_id:string;source_id:string;similarity:number}[];
    if(!Array.isArray(hits))throw Error('invalid-vector-result');const ids=new Set(hits.filter(h=>h.similarity>=0.25).map(h=>h.source_id+':'+h.chunk_id));
    const retrieved=corpus.map(s=>({...s,claims:s.claims.filter(c=>ids.has(s.id+':'+c.id))})).filter(s=>s.claims.length);
    result=runAgent(input,retrieved);result.trace.push('supabase-vector-retrieval');result.mode='Supabase pgvector retrieval; provider-backed evidence selection';
   }
   if(result.state==='answer'){
    const claimIds=await selectEvidence(config,input.question,result.passages.map(p=>({claimId:p.claim.id,sourceId:p.source.id,text:p.claim[input.language]})));
    const selected=result.passages.filter(p=>claimIds.includes(p.claim.id));if(!selected.length)throw Error('model-found-no-evidence');
    const claims=selected.slice(0,input.depth==='10'?1:6).map(p=>({claimId:p.claim.id,sourceId:p.source.id,text:p.claim[input.language],url:p.source.url}));const gate=verify(claims,result.passages,input.language);
    if(gate.decision!=='Pass')throw Error('model-evidence-verification-failed');result={...result,claims,answer:claims.map(c=>c.text).join('\n\n'),gate,mode:process.env.SUPABASE_URL?'Supabase vector retrieval + model evidence selection':'Local retrieval + model evidence selection',trace:[...result.trace,'model-select-evidence','verify-model-selection']};
   }
  }catch{result=stopProvider(result,'configured-provider-failed');}
 }
 return Response.json(result,{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Invalid request'},{status:400});}
}
