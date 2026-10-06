// No prompts, answers, credentials, location or IPs are added to application logs.
export async function auditedFetch(input:RequestInfo|URL,init?:RequestInit):Promise<Response>{
 const started=Date.now(),callId=crypto.randomUUID();
 try{const r=await fetch(input,init);console.info(JSON.stringify({event:'llm_call',callId,at:new Date(started).toISOString(),durationMs:Date.now()-started,status:r.status,requestId:r.headers.get('x-request-id'),version:'0.6.2'}));return r;}
 catch(e){console.info(JSON.stringify({event:'llm_call',callId,at:new Date(started).toISOString(),durationMs:Date.now()-started,status:'connection_failed',version:'0.6.2'}));throw e;}
}
