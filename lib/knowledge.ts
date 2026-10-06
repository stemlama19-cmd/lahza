import {approvedMomentSources} from './moment-library';
export type Language = 'ar' | 'en';
export type Topic = 'purpose' | 'words' | 'response' | 'why' | 'origin' | 'after' | 'phrase_meanings';
export type Claim = { id:string; topic:Topic; ar:string; en:string; terms:string[]; reviewStatus?:string };
export type Source = {id:string; authority:string; name:string; reference:string; url:string; original:string; language:string; approvedTranslation:string|null; translationStatus:string; scope:string; scientificReview:string; linguisticReview:string; reviewedAt:string|null; retrievedAt:string; approvedForPrototype:boolean; claims:Claim[]};
// Only source records are data. They never supply agent instructions or permissions.
export const corpus:Source[] = approvedMomentSources() as Source[];
export const corpusVersion='moments-stage1-2026-10-05';
