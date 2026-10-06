import {claims,validClaim,retrieveClaims,type Language} from './content-library';
import batch from '../data/moments-batch1.json';

export type ChatContext={question:string;claimIds:string[]};
const normalize=(text:string)=>text.normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
const references=/\b(?:it|this|that|they|them|their|those)\b|ذلك|هذا|هذه|هؤلاء|معناه|معناها|اثره|اثرها|اهميته|اهميتها/;
const shortFollowup=/^(?:و?لماذا|و?كيف|وماذا ايضا|why|how|what else)[\s?!؟.]*$/;

export function chatEvidence(question:string,branchId:unknown,rawContext:unknown,language:Language){
 const branch=typeof branchId==='string'?batch.moments.flatMap(m=>m.explanation.branches).find(b=>b.id===branchId&&b.claims.some(validClaim)):undefined;
 const raw=rawContext&&typeof rawContext==='object'?rawContext as Record<string,unknown>:undefined;
 const ids=Array.isArray(raw?.claimIds)&&raw.claimIds.length<=4?raw.claimIds:[];
 const prior=ids.every(id=>typeof id==='string'&&claims.some(c=>c.claimId===id&&validClaim(c)))?claims.filter(c=>ids.includes(c.claimId)&&validClaim(c)):[];
 const moments=[...new Set(prior.map(c=>c.momentId))];
 const normalized=normalize(question);
 // Explicit topics and explicit branch choices take precedence over a previous answer.
 const explicitTopic=/اذان|نداء|اقام[ةه]|جماع[ةه]|المصلين|المصلون|وضوء|وضو|خطب[ةه]|الجمع[ةه]|\b(?:adhan|azaan|iqamah|iqama|wudu|ablution|sermon|khutbah|congregational|friday|rows)\b|call to prayer|pray(?:ing)? together/.test(normalized);
 const contextual=!branch&&!explicitTopic&&moments.length===1&&(references.test(normalized)||shortFollowup.test(normalized));
 const moment=contextual?batch.moments.find(m=>m.id===moments[0]):undefined;
 const previousQuestion=typeof raw?.question==='string'?raw.question.slice(0,1200):'';
 const context=moment?{previousQuestion,momentId:moment.id,moment:language==='ar'?moment.name_ar:moment.name_en,previousClaims:prior.map(c=>({claimId:c.claimId,text:language==='ar'?c.text_ar:c.text_en}))}:undefined;
 const retrievalQuestion=moment?question+' '+moment.name_ar+' '+moment.name_en+(/يعني|تعني/.test(normalized)?' معنى':''):question;
 return {evidence:retrieveClaims(retrievalQuestion,branch?.id),context};
}
