import {readFileSync,writeFileSync} from 'node:fs';
const input=JSON.parse(readFileSync(new URL('../docs/content/adhan-review.json',import.meta.url),'utf8'));
const approved=input.claims.filter(c=>['معتمد','معتمد بتعديل'].includes(c.reviewStatus));
const sources=[];
for(const c of approved){
 if(!/^(BUK|MUS|ABD)-\d+$/.test(c.sourceId)||!['sunnah.com','hadeethenc.com'].includes(new URL(c.url).hostname))throw Error('Approved claim requires resolved source: '+c.id);
 let s=sources.find(x=>x.id===c.sourceId);
 if(!s){s={id:c.sourceId,authority:c.sourceName,name:c.sourceName,reference:c.sourceId,url:c.url,original:'',language:'ar',approvedTranslation:null,translationStatus:'Reviewer workbook paraphrase',scope:'Only the approved linked statements',scientificReview:'Statement status imported from reviewer workbook; no review assigned by software.',linguisticReview:'See source workbook',reviewedAt:null,retrievedAt:'2026-10-05',approvedForPrototype:true,claims:[]};sources.push(s);}
 s.claims.push({id:c.id,topic:c.topic,ar:c.ar,en:c.en,terms:[c.topic,'adhan','الأذان'],reviewStatus:c.reviewStatus});
}
writeFileSync(new URL('../lib/approved-content.json',import.meta.url),JSON.stringify(sources,null,2)+'\n');
writeFileSync(new URL('../lib/approved-topics.json',import.meta.url),JSON.stringify([...new Set(approved.map(c=>c.topic))])+'\n');
console.log(JSON.stringify({approvedClaims:approved.length,withheldClaims:input.claims.length-approved.length}));
