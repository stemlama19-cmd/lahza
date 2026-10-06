import batch from '../data/moments-batch1.json';
export type Language='ar'|'en';
export type Claim={claimId:string;text_ar:string;text_en:string;sourceIds:string[];reviewStatus:string;momentId:string;branchId:string;order?:number;repeat?:number};
export const approved=(s:string)=>s==='approved'||s==='approved_with_edits';
export const claims:Claim[]=batch.moments.flatMap(m=>m.explanation.branches.flatMap(b=>b.claims.map(c=>({claimId:c.claimId,text_ar:c.text_ar,text_en:c.text_en,sourceIds:c.sourceIds,reviewStatus:c.reviewStatus,momentId:m.id,branchId:b.id,...("order" in c?{order:c.order,repeat:c.repeat}:{})}))));
export const validClaim=(c:Claim)=>approved(c.reviewStatus)&&c.sourceIds.length>0&&c.sourceIds.every(id=>batch.sources.some(s=>s.id===id&&/^https:\/\//.test(s.url)));
export function visibleClaims(review=false){return claims.filter(c=>validClaim(c)||(review&&c.reviewStatus==='pending'));}
export function contentPayload(review=false){return {review,version:batch.schemaVersion,moments:batch.moments.map(m=>({id:m.id,name_ar:m.name_ar,name_en:m.name_en,modality:m.modality,branches:m.explanation.branches.map(b=>({id:b.id,title_ar:b.title_ar,title_en:b.title_en,claimIds:b.claims.filter(c=>validClaim({...c,momentId:m.id,branchId:b.id})||(review&&c.reviewStatus==='pending')).map(c=>c.claimId)}))})),claims:visibleClaims(review),sources:batch.sources.map(s=>({id:s.id,title_ar:s.title_ar,title_en:s.title_en,url:s.url})),approvedCount:claims.filter(validClaim).length,pendingCount:claims.filter(c=>c.reviewStatus==='pending').length};}
const norm=(s:string)=>s.normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
const stopWords=new Set(['what','is','the','why','how','a','of','do','does','to','about','in','ما','هو','هي','في','من','عن','كيف','لماذا','هذا','هذه','هل','ماذا','ان']);
export function retrieveClaims(question:string,branchId?:string,sourceClaims:Claim[]=claims){
 const words=norm(question).split(/[^a-z\u0600-\u06ff]+/).filter(x=>x.length>1&&!stopWords.has(x));
 return sourceClaims.filter(validClaim).map(c=>{const m=batch.moments.find(m=>m.id===c.momentId);const b=m?.explanation.branches.find(b=>b.id===c.branchId);const text=norm([c.text_ar,c.text_en,m?.name_ar,m?.name_en,b?.title_ar,b?.title_en].join(' '));return {c,score:words.filter(w=>text.includes(w)).length+(branchId&&c.branchId===branchId?4:0)};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,12).map(x=>x.c);
}
export function verifySelected(ids:unknown,retrieved:Claim[],language:Language){
 if(!Array.isArray(ids)||ids.length>4||ids.some(id=>typeof id!=='string'||!retrieved.some(c=>c.claimId===id&&validClaim(c))))throw Error('citation_gate');
 return [...new Set(ids)].map(id=>{const c=retrieved.find(c=>c.claimId===id)!;return {claimId:c.claimId,momentId:c.momentId,text:language==='ar'?c.text_ar:c.text_en,sources:c.sourceIds.map(id=>{const s=batch.sources.find(s=>s.id===id)!;return {id,url:s.url,title:language==='ar'?s.title_ar:s.title_en};})};});
}
export function followups(exclude:string[]=[]){return batch.moments.flatMap(m=>m.explanation.branches.filter(b=>b.claims.some(c=>validClaim({...c,momentId:m.id,branchId:b.id}))).map(b=>({id:b.id,ar:b.title_ar,en:b.title_en}))).filter(b=>!exclude.includes(b.id)).slice(0,3);}
