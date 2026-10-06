import type {Conversation,Lang} from './discovery-contract';

export function conversationCard(c:Conversation,question:string,language:Lang){
 const ar=language==='ar';
 const t=(a:string,e:string)=>ar?a:e;
 const explanations=[...new Set(c.turns.flatMap(turn=>turn.explanation?[turn.explanation]:[]))];
 const sources=[...new Map(c.turns.flatMap(turn=>turn.sources||[]).map(s=>[s.url,s])).values()];
 return {title:t('بطاقة رحلتي','My journey card'),language,version:c.version,moment:c.initialDescription,question:question.trim()||c.initialDescription,explanations,sources,note:t('هذه خلاصة لما استكشفته، وليست إثباتًا لتحديد الحدث أو قياسًا لفهمي. لم تُرسل إلى أي شخص.','This records what I explored. It does not verify the event or measure my understanding. It has not been sent to anyone.')};
}
export type JourneyCard=ReturnType<typeof conversationCard>;
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function cardHtml(card:JourneyCard){
 const ar=card.language==='ar',t=(a:string,e:string)=>ar?a:e;
 // All visitor-provided text is escaped. The export is a standalone, script-free document.
 return `<!doctype html><html lang="${card.language}" dir="${ar?'rtl':'ltr'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(card.title)} · LAHZA</title><style>body{font:18px/1.9 system-ui,sans-serif;color:#15344a;background:#fffaf0;max-width:760px;margin:auto;padding:24px;overflow-wrap:anywhere}h1{font-size:32px}h2{font-size:21px;color:#16787c}p{white-space:pre-wrap}section{border-top:1px solid #ddd;padding:12px 0}small{font-size:14px}a{color:#146c72}@media print{body{background:white;padding:0}}</style><body><small>لَحْظَة · LAHZA v${escape(card.version)}</small><h1>${escape(card.title)}</h1><section><h2>${t('ما لاحظته','What I noticed')}</h2><p>${escape(card.moment)}</p></section><section><h2>${t('ما استكشفته','What I explored')}</h2>${card.explanations.length?card.explanations.map(x=>`<p>${escape(x)}</p>`).join(''):`<p>${t('لم أستكشف شرحًا بعد.','I have not explored an explanation yet.')}</p>`}</section><section><h2>${t('سؤالي للحوار','My question for a conversation')}</h2><p>${escape(card.question)}</p></section><section><h2>${t('المصادر','Sources')}</h2>${card.sources.map(s=>`<p>${escape(s.id)}: ${escape(s.url)}</p>`).join('')||'—'}</section><p><small>${escape(card.note)}</small></p><p><small>${t('يمكن حفظ هذه الصفحة أو طباعتها بصيغة PDF من قائمة المتصفح. مراجعة المحتوى العلمية واللغوية البشرية معلّقة.','Save this page or print it to PDF from your browser menu. Human scholarly and language review is pending.')}</small></p></body></html>`;
}
export function downloadCard(card:JourneyCard){
 const url=URL.createObjectURL(new Blob([cardHtml(card)],{type:'text/html;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='lahza-journey-card.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
