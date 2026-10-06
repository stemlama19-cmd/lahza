import {hasApprovedContent} from '@/lib/moment-library';
import approvedTopics from '@/lib/approved-topics.json';
import {APP_VERSION,PROMPT_VERSION,renderDecision,type Session,type Lang} from '@/lib/discovery-contract';
import {decide,modelConfig,seal,unseal,DiscoveryError} from '@/lib/discovery';
import {runAgent,verify} from '@/lib/agent';
import {selectEvidenceResult} from '@/lib/provider';
const headers={'Cache-Control':'no-store'};
export async function POST(request:Request){
 const config=modelConfig();
 if(!config)return Response.json({error:'model_not_configured',technical:true,version:APP_VERSION},{status:503,headers});
 try {
  if(Number(request.headers.get('content-length')||0)>120000)throw new DiscoveryError('invalid_request',400);
  const raw=await request.text();if(raw.length>120000)throw new DiscoveryError('invalid_request',400);
  const b=JSON.parse(raw);if(!['start','reply','accept','reject','unsure','explain'].includes(b.action))throw new DiscoveryError('invalid_request',400);
  const text=typeof b.text==='string'?b.text.trim():'';if(text.length>1200)throw new DiscoveryError('invalid_request',400);
  let s:Session;
  if(b.action==='start'){
   if(!text||!['ar','en'].includes(b.language))throw new DiscoveryError('invalid_request',400);
   s={version:APP_VERSION,language:b.language as Lang,messages:[{role:'user',text}],asked:[],last:null,accepted:false,expires:Date.now()+14400000};
  } else {
   if(typeof b.token!=='string')throw new DiscoveryError('invalid_session',400);
   s=await unseal(b.token,config.apiKey);
   if(b.action!=='explain'&&s.messages.length>=60)throw new DiscoveryError('session_limit',400);
   if(b.action==='reply'&&(s.last?.decision!=='ask'||!text))throw new DiscoveryError('invalid_transition',400);
   if(['accept','reject','unsure'].includes(b.action)&&s.last?.decision!=='confirm')throw new DiscoveryError('invalid_transition',400);
   if(b.action==='explain'&&!s.accepted)throw new DiscoveryError('confirmation_required',400);
   const localized=s.language==='ar'?{accept:'نعم، أريد استكشاف الأذان',reject:'لا، ليس هذا ما أقصده',unsure:'لست متأكدًا'}:{accept:'Yes, I want to explore the adhan',reject:'No, that is not what I meant',unsure:'I am not sure'};
   if(b.action!=='explain')s.messages.push({role:'user',text: text || localized[b.action as keyof typeof localized] || 'Explain more'});
  }
  if(b.action==='accept'||b.action==='explain'){
   if(b.action==='accept'&&s.last?.hypothesis!=='adhan')throw new DiscoveryError('confirmation_required',400);
   if(!hasApprovedContent('adhan')){
    s.last=renderDecision({decision:'stop',question_id:null,hypothesis:'none',hypothesis_text:'',evidence:s.last?.evidence||[],why_this_question:'',stop_type:'no_content',offer_example:false,message:''},s.language);
    s.messages.push({role:'assistant',text:s.last.message});
    return Response.json({kind:'decision',decision:s.last,token:await seal(s,config.apiKey),version:APP_VERSION,promptVersion:PROMPT_VERSION,model:config.model,requestId:null,askedCount:s.asked.length},{headers});
   }
   if(['why','origin','after','phrase_meanings'].includes(b.topic)&&!(approvedTopics as string[]).includes(b.topic))throw new DiscoveryError('content_not_approved',409);
   const topic=['purpose','words','response',...approvedTopics].includes(b.topic)?b.topic:'purpose';
   const questions=s.language==='ar'?{why:'لماذا يوجد الأذان؟',origin:'كيف بدأ الأذان؟',after:'ماذا يحدث بعد النداء؟',phrase_meanings:'معاني عبارات الأذان سطرًا بسطر',purpose:'ما هو الأذان؟',words:'ماذا تعني كلمات الأذان؟',response:'كيف يستجيب من يسمع الأذان؟'}:{why:'Why does the adhan exist?',origin:'How did the adhan begin?',after:'What happens after the call?',phrase_meanings:'Line by line meanings of the adhan',purpose:'What is the adhan?',words:'What do the words of the adhan mean?',response:'How do listeners respond to the adhan?'};
   const depth=['10','30','120'].includes(b.depth)?b.depth:'10';
   const result=runAgent({question:questions[topic as keyof typeof questions],language:s.language,depth,confirmed:true,topic});
   let providerModel=config.model,providerRequestId:string|null=null;
   try {
    const selection=await selectEvidenceResult(config,result.question,result.passages.map(p=>({claimId:p.claim.id,sourceId:p.source.id,text:p.claim[s.language]})));
    providerModel=selection.model;providerRequestId=selection.requestId;
    const selected=result.passages.filter(p=>selection.ids.includes(p.claim.id)).slice(0,depth==='10'?1:6);
    if(!selected.length)throw new DiscoveryError('evidence_unavailable');
    result.claims=selected.map(p=>({claimId:p.claim.id,sourceId:p.source.id,text:p.claim[s.language],url:p.source.url}));
    result.gate=verify(result.claims,selected,s.language);if(result.gate.decision!=='Pass')throw new DiscoveryError('verification_failed');
    result.answer=result.claims.map(c=>c.text).join('\n\n');result.passages=selected;result.mode='Local lexical retrieval + live LLM evidence selection + deterministic citation gate';result.trace.push('live-model-evidence-selection');
   }catch(e){if(e instanceof DiscoveryError)throw e;throw new DiscoveryError('explanation_service_failed');}
   s.accepted=true;
   return Response.json({kind:'explanation',result,token:await seal(s,config.apiKey),version:APP_VERSION,promptVersion:PROMPT_VERSION,model:providerModel,requestId:providerRequestId,askedCount:s.asked.length},{headers});
  }
  if(b.action==='reject'&&text)s.revisions=(s.revisions||0)+1;
  const output=await decide(s,config,b.action);
  if((b.action==='reject'&&!text)||(b.action==='unsure'&&s.asked.length>=2)){
   if(output.decision.decision!=='stop')throw new DiscoveryError('invalid_transition_from_model');
  }
  if(output.decision.decision==='ask')s.asked.push(output.decision.question_id!);
  s.last=output.decision;
  s.messages.push({role:'assistant',text:output.decision.message+(output.decision.why_this_question?'\n'+output.decision.why_this_question:'')});
  return Response.json({kind:'decision',...output,token:await seal(s,config.apiKey),version:APP_VERSION,promptVersion:PROMPT_VERSION,askedCount:s.asked.length},{headers});
 }catch(e){const error=e instanceof DiscoveryError?e:new DiscoveryError('invalid_request',400);console.warn(JSON.stringify({event:'discovery_failure',code:error.code,version:APP_VERSION}));return Response.json({error:error.code,technical:true,version:APP_VERSION},{status:error.status,headers});}
}
