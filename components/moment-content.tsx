import {BookOpen,ChevronDown,ExternalLink,ShieldCheck} from 'lucide-react';
import type {Claim,contentPayload,Dimension,Language} from '@/lib/content-library';
import {quotedParts} from '@/lib/quoted-text';

type Content=ReturnType<typeof contentPayload>;
type Source=Content['sources'][number];
export const meaningTitle:Record<Language,string>={ar:'ماذا تعني هذه اللحظة للمسلمين؟',en:'What does this moment mean to Muslims?'};
const eligible=(claim:Claim)=>claim.reviewStatus==='approved'||claim.reviewStatus==='approved_with_edits';

export function QuotedText({text}:{text:string}){
 return <>{quotedParts(text).map((part,index)=>part.quoted?<strong className="source-quote" key={index}>{part.text}</strong>:part.text)}</>;
}

// A stable component preserves a visitor's expanded section when the live clock ticks.
export function SourceDisclosure({ids,sources,language}:{ids:string[];sources:Source[];language:Language}){
 const ar=language==='ar';
 return <details className="source-disclosure"><summary><span>{ar?'للمزيد':'Learn more'}</span><ChevronDown size={15} aria-hidden/></summary><div className="source-disclosure-body"><span className="badge verified"><ShieldCheck size={14} aria-hidden/>{ar?'مطابَق على مصدره':'Verified against its source'}</span><div className="source-links">{[...new Set(ids)].map(id=>{const src=sources.find(s=>s.id===id);return src?<a key={id} className="source-chip" href={src.url} target="_blank" rel="noopener noreferrer"><BookOpen size={14} aria-hidden/><span>{ar?src.title_ar:src.title_en}</span><ExternalLink size={12} aria-hidden/></a>:null;})}</div></div></details>;
}

export function ClaimView({claim,language,sources}:{claim:Claim;language:Language;sources:Source[]}){
 if(!eligible(claim))return null;
 return <div className="claim" data-claim-id={claim.claimId}><p><QuotedText text={language==='ar'?claim.text_ar:claim.text_en}/></p><SourceDisclosure ids={claim.sourceIds} sources={sources} language={language}/></div>;
}

export function MeaningBranch({momentId,content,language}:{momentId:string;content:Content|null;language:Language}){
 const branch=content?.moments.find(m=>m.id===momentId)?.branches.find(b=>b.id.endsWith('-meaning'));
 const claims=content?.claims.filter(c=>c.branchId===branch?.id&&eligible(c))||[];
 if(!branch||!claims.length||!content)return null;
 const dimensions:Dimension[]=['spiritual','value','educational'];
 return <section className="moment-meaning" aria-label={meaningTitle[language]} data-meaning-branch={branch.id}><h2>{meaningTitle[language]}</h2>{dimensions.map(dimension=>{const rows=claims.filter(c=>c.dimension===dimension);return rows.length?<div className={'meaning-dimension meaning-'+dimension} key={dimension}><h3>{content.displayGuidance.labels[dimension][language]}</h3>{rows.map(claim=><ClaimView key={claim.claimId} claim={claim} language={language} sources={content.sources}/>)}</div>:null;})}</section>;
}
