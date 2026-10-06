export const PERSONAL_MOMENTS='lahza-personal-moments-v1';
export type PersonalMoment={id:string;momentId:string;city:string;before:string;after:string;at:string;language:'ar'|'en';learned:boolean};
export const personalId=(momentId:string,city:string)=>`${momentId}:${city}`;
export function readPersonalMoments(value:unknown):PersonalMoment[]{
 if(!Array.isArray(value))return [];
 return value.filter((v):v is PersonalMoment=>!!v&&typeof v==='object'&&typeof v.id==='string'&&typeof v.momentId==='string'&&typeof v.city==='string'&&v.id===personalId(v.momentId,v.city)&&typeof v.before==='string'&&typeof v.after==='string'&&typeof v.at==='string'&&Number.isFinite(Date.parse(v.at))&&['ar','en'].includes(v.language)&&typeof v.learned==='boolean').slice(-30).map(v=>({...v,before:v.before.slice(0,360),after:v.after.slice(0,360)}));
}
export function upsertPersonalMoment(records:PersonalMoment[],record:PersonalMoment){return [...records.filter(r=>r.id!==record.id),record].slice(-30);}
