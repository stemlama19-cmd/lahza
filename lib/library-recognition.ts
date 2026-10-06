import batch from '../data/moments-batch1.json';
import adapters from '../data/recognition-patterns.json';
import {validClaim,claims} from './content-library';
const norm=(s:string)=>s.normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').toLowerCase();
// Explicit contrary observations stop recognition without inventing a new question.
export function libraryBoundary(messages:{role:string;text:string}[]):'out_of_scope'|'insufficient_evidence'|'no_content'|null{
 const n=norm(messages.filter(m=>m.role==='user').map(m=>m.text).join('\n'));
 const patterns=adapters.cues as Record<string,string[]>;
 const cue=(id:string)=>!!patterns[id]?.every(p=>new RegExp(p,'iu').test(n));
 if(cue('wudu-x-meal')&&/يغسل|غسل|wash/.test(n)&&!cue('wudu-context'))return 'out_of_scope';
 if(cue('iqamah-x-spoken')&&/اعلان|نداء|announcement|call/.test(n))return 'insufficient_evidence';
 if(/park|حديقة|حديقه/.test(n)&&cue('jamaah-x-music'))return 'out_of_scope';
 if(cue('khutbah-x-other-day')&&/المسجد|mosque/.test(n)&&/يتحدث|يتكلم|talk|speaking|speech/.test(n))return 'no_content';
 return null;
}
export function needsOutdoorContext(messages:{role:string;text:string}[]){
 const n=norm(messages.filter(m=>m.role==='user').map(m=>m.text).join('\n'));const patterns=adapters.cues as Record<string,string[]>;
 const cue=(id:string)=>!!patterns[id]?.every(p=>new RegExp(p,'iu').test(n));
 return /park|حديقة|حديقه/.test(n)&&cue('jamaah-rows')&&cue('jamaah-together')&&!cue('jamaah-x-music')&&!/foreheads|سجود|سجد/.test(n);
}
// Every adapter represents observable evidence, not an inferred religious fact.
export function libraryCandidates(messages:{role:string;text:string}[]){
 const raw=messages.filter(m=>m.role==='user').map(m=>m.text).join('\n');let n=norm(raw);n=n.replace(/لا موسيقى|بدون موسيقى|بلا موسيقى|no music|without music/g,'');
 const patterns=adapters.cues as Record<string,string[]>;
 const cue=(id:string)=>!!patterns[id]?.every(p=>new RegExp(p,'iu').test(n));
 const candidates=batch.moments.filter(m=>m.id!=='adhan'&&m.recognition.enabled&&m.recognition.requireAll.every(c=>cue(c.id))&&!m.recognition.contrary.some(c=>cue(c.id)));
 // Outdoor rows and bowing alone can be exercise. Keep outside-library live.
 return candidates.filter(m=>m.id!=='congregational-prayer'||!/park|حديقه|حديقة/.test(n)||/foreheads|سجود|سجد/.test(n)).map(m=>({id:m.id,name_ar:m.name_ar,name_en:m.name_en,required:m.recognition.requireAll,contrary:m.recognition.contrary,hasContent:claims.some(c=>c.momentId===m.id&&validClaim(c))}));
}
export function recognitionOnlyHint(messages:{role:string;text:string}[]){const n=norm(messages.filter(m=>m.role==='user').map(m=>m.text).join('\n'));
 // Cues can rank comparison candidates; they never prove Quran identity.
 return batch.recognitionOnly.map(m=>({id:m.id,cues:m.cues_ar.concat(m.cues_en),rank:m.cues_ar.concat(m.cues_en).filter(c=>n.includes(norm(c))).length})).filter(m=>m.rank>0);
}
