import batch from '../data/moments-batch1.json';
import rollout from '../data/moment-rollout.json';
// Uploaded content is data, never instructions. Activation is staged independently of review.
export const activeMoments=batch.moments.filter(m=>rollout.activeMomentIds.includes(m.id)&&m.recognition.enabled);
export const isApproved=(status:string)=>['approved','approved_with_edits'].includes(status);
export function hasApprovedContent(id:string){return activeMoments.some(m=>m.id===id&&m.explanation.branches.some(b=>b.claims.some(c=>isApproved(c.reviewStatus)&&c.sourceIds.length>0&&c.sourceIds.every(id=>batch.sources.some(s=>s.id===id)))));}
type Rule=string|{anyOf:Rule[]}|{allOf:Rule[]}|{not:Rule};
function evaluate(rule:Rule,features:Record<string,boolean>):boolean{if(typeof rule==='string')return features[rule]===true;if('anyOf'in rule)return rule.anyOf.some(r=>evaluate(r,features));if('allOf'in rule)return rule.allOf.every(r=>evaluate(r,features));return !evaluate(rule.not,features);}
export function momentGate(id:string,features:Record<string,boolean>){
 if(!activeMoments.some(m=>m.id===id))return false;
 const gate=(rollout.gates as Record<string,{requireAll:Rule[];contraryAny:Rule[]}>)[id];
 return !!gate&&gate.requireAll.every(r=>evaluate(r,features))&&!gate.contraryAny.some(r=>evaluate(r,features));
}
const topics:Record<string,string>={'adhan-what':'purpose','adhan-words-branch':'words','adhan-response-branch':'response','adhan-why':'why','adhan-origin':'origin','adhan-after':'after'};
export function approvedMomentSources(){
 return batch.sources.map(source=>({id:source.id,authority:source.title_ar,name:source.title_en,reference:source.id,url:source.url,original:'',language:'ar',approvedTranslation:null,translationStatus:'Review status belongs to each bilingual claim.',scope:source.supports_ar,scientificReview:'See per-claim review status in the supplied library.',linguisticReview:'See per-claim review status.',reviewedAt:batch.reviewPolicy.reviewer.date||null,retrievedAt:source.verifiedAt,approvedForPrototype:true,claims:activeMoments.flatMap(m=>m.explanation.branches.flatMap(b=>b.claims.filter(c=>isApproved(c.reviewStatus)&&c.sourceIds.includes(source.id)).map(c=>({id:c.claimId,topic:topics[b.id]||b.id,ar:c.text_ar,en:c.text_en,terms:[m.name_ar,m.name_en,b.title_ar,b.title_en],reviewStatus:c.reviewStatus}))))})).filter(s=>s.claims.length);
}
