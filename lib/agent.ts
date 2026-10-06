import {corpus, corpusVersion, type Source, type Language, type Claim, type Topic} from './knowledge';
export type RequestInput={question:string;language:Language;depth:'10'|'30'|'120';confirmed:boolean;human?:boolean;topic?:Topic};
export type Passage={source:Source;claim:Claim;score:number};
export type Candidate={claimId:string;sourceId:string;text:string;url:string};
export type Compass='religious'|'cultural'|'local'|'mixed'|'specialist';
export type Result={state:'answer'|'confirm'|'stop'|'handoff';answer:string;compass:Compass;reason:string;passages:Passage[];claims:Candidate[];gate:{decision:'Pass'|'Repair'|'Stop';checks:string[];repairs:number};trace:string[];next:string[];language:Language;question:string;depth:string;corpusVersion:string;mode:string;handoff?:{role:string;moment:string;question:string;language:string;explained:string;sources:string[];reason:string;delivery:string}};
const normalize=(s:string)=>s.toLowerCase().normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[أإآ]/g,'ا');
const tokens=(s:string)=>normalize(s).split(/[^a-z0-9\u0600-\u06ff]+/).filter(Boolean);
const matches=(q:string,terms:string[])=>terms.some(t=>normalize(q).includes(normalize(t)));
const adh=['adhan','adhaan','azan','azaan','أذان','اذان','call to prayer'];
const controls=['source','citation','مصدر','المصدر','مرجع'];
export function retrieve(question:string,topic:Topic, sources:Source[]=corpus):Passage[]{
 const qt=tokens(question); const all=sources.flatMap(source=>source.claims.map(claim=>{const words=tokens(claim.terms.join(' ')+' '+claim.ar+' '+claim.en);const overlap=qt.filter(t=>words.includes(t)).length;return {source,claim,score:overlap+(claim.topic===topic?3:0)};}));
 return all.filter(p=>p.source.approvedForPrototype && p.claim.topic===topic && (['approved','approved_with_edits','معتمد','معتمد بتعديل'].includes(p.claim.reviewStatus||'')) && p.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
}
export function verify(candidates:Candidate[],passages:Passage[],language:Language){
 const checks:string[]=[];
 if(!candidates.length)return {decision:'Stop' as const,checks:['No supported claims'],repairs:0};
 for(const c of candidates){const p=passages.find(p=>p.source.id===c.sourceId&&p.claim.id===c.claimId);if(!p||!p.source.approvedForPrototype||(!['approved','approved_with_edits','معتمد','معتمد بتعديل'].includes(p.claim.reviewStatus||''))){checks.push('Source or claim not retrieved');continue;}if(c.url!==p.source.url)checks.push('Citation mismatch');if(c.text!==p.claim[language])checks.push('Unsupported addition or changed claim');if(/all muslims|every muslim|جميع المسلمين|كل المسلمين/i.test(c.text))checks.push('Generalisation');if(!['sunnah.com','hadeethenc.com'].includes(new URL(c.url).hostname))checks.push('Source host outside allowlist');}
 return {decision:checks.length?'Repair' as const:'Pass' as const,checks:checks.length?checks:['Source allowlist','Claim linked to retrieved evidence','Citation matches','No added claims','No universal generalisation','In-scope descriptive content'],repairs:0};
}
function topicOf(q:string):Topic|null{
 if(matches(q,['respond','repeat','reply','response','أقول','اقول','ردد','يردد','الرد']))return 'response';
 if(matches(q,['words','meaning','means','say','saying','allah','akbar','معنى','كلمات','يقول','تعني','الله اكبر']))return 'words';
 if(matches(q,[...adh,'what is','what’s','why','who','explain','short','brief','ما هو','ماهذا','ما هذا','لماذا','من','اشرح',...controls]))return 'purpose';return null;
}
export function runAgent(input:RequestInput,sources:Source[]=corpus):Result{
 const q=input.question.trim(),ar=input.language==='ar',n=normalize(q);const trace=['capture','identify'];
 const base:Result={state:'stop',answer:'',compass:'religious',reason:'',passages:[],claims:[],gate:{decision:'Stop',checks:[],repairs:0},trace,next:[],language:input.language,question:q,depth:input.depth,corpusVersion,mode:'evidence-constrained retrieval and composition; no LLM connected'};
 const stop=(reason:string,message:string,compass:Compass='specialist')=>({...base,reason,answer:message,compass,gate:{decision:'Stop' as const,checks:[reason],repairs:0},trace:[...trace,'scope-check','stop']});
 if(!q||q.length>1200)return stop('invalid-input',ar?'اكتب وصفًا قصيرًا أو سؤالًا، حتى 1200 حرف.':'Please enter a short question, up to 1,200 characters.','mixed');
 if(matches(q,['ignore instructions','system prompt','ignore all','تجاهل التعليمات','تجاهل كل','نفذ الكود']))return stop('instruction-injection',ar?'يمكنني شرح الأذان من المصادر، ولا أغيّر قواعدي بتعليمات داخل السؤال.':'I can explain the adhan from sources. Instructions inside a question cannot change my rules.');
 const specialist=matches(q,['fatwa','haram','halal','ruling','sin','sect','shia','sunni','different schools','all muslims','every muslim','جميع المسلمين','كل المسلمين','must i','do i have to','واجب','حرام','حلال','حكم','فتوى','مذهب','شيع','سنة و','اختلاف','بدعة','يجب علي']);
 const local=matches(q,['decibel','loudspeaker','volume','riyadh time','today','exact time','loud','مكبر','الصوت مرتفع','علو الصوت','الديسيبل','موعد اليوم','الساعة','اليوم']);
 const cultural=matches(q,['coffee','dress','clothes','saudi custom','قهوة','لباس','زي سعودي','ثقافة','شماغ']);
 if(specialist||local||cultural||input.human){const compass:Compass=specialist?'specialist':local?'local':cultural?'cultural':'religious';const role=specialist?'specialist':(local||cultural)?'cultural-ambassador':'knowledge-volunteer';return {...stop(specialist?'specialist-required':local?'local-evidence-required':cultural?'cultural-context':'user-requested-human',ar?'جهّزت ملخصًا يمكن مشاركته مع الشخص المناسب. خدمة الحوار المباشر لم تُربط بعد.':'A summary is ready to share with the right person. Live human support is not connected yet.',compass),state:'handoff',handoff:{role,moment:'Adhan discovery',question:q,language:input.language,explained:'',sources:[],reason:specialist?'Specialized religious question':local?'Local operational context is not supplied by religious evidence':cultural?'Cultural practice must not be attributed to religion':'User requested a human',delivery:'Downloadable packet only. Not sent.'}};}
 if(matches(q,['bitcoin','stock','code','recipe','weather','medical','pizza','بيتكوين','أسهم','برمجة','طقس','دواء','طبخ']))return stop('outside-scope',ar?'هذا السؤال خارج مسار الأذان. يمكنني مساعدتك على فهم النداء ومعانيه.':'This question is outside the adhan journey. I can help with the call and its meaning.','mixed');
 const identity=matches(q,adh);const ambiguous=matches(q,['sound','sing','music','hear','heard','صوت','سمعت','غناء']);
 if(!input.confirmed&&!identity){return {...base,state:'confirm',answer:ar?'هل سمعت نداءً يدعو إلى الصلاة؟ لا أستطيع تحديد صوت لم أسمعه. أكّد أنه الأذان، أو صف ما سمعت.':'Was it a call inviting people to prayer? I cannot identify a sound I have not heard. Confirm it was the adhan, or describe it.',reason:ambiguous?'low-identification-confidence':'moment-unconfirmed',compass:'mixed',trace:[...trace,'request-confirmation']};}
 if(!input.topic&&matches(q,['history','origin','first','five','5 times','how many','تاريخ','أول','اول','نشأ','خمس','كم مرة']))return stop('insufficient-evidence',ar?'لا تتضمن حزمة المعرفة الحالية دليلًا كافيًا لهذا السؤال. لن أخمّن؛ يمكن إعداد إحالة إلى متطوع معرفي.':'The current knowledge pack does not contain enough evidence for that question. I will not guess. You can prepare a handoff to a knowledge volunteer.','religious');
 const topic=input.topic??topicOf(q);if(!topic)return stop('insufficient-evidence',ar?'لا أجد دليلًا كافيًا يجيب عن هذا السؤال في مسار الأذان الحالي.':'I do not have enough evidence for this question in the current adhan journey.','religious');
 trace.push('retrieve');let passages=retrieve(q,topic,sources);if(input.depth==='120'&&topic==='purpose')passages=[...passages,...retrieve('words meaning', 'words',sources)];
 if(!passages.length)return stop('insufficient-evidence',ar?'لا يوجد دليل موثوق متاح الآن؛ لن أقدّم تفسيرًا بلا مصدر.':'No trusted evidence is available. I will not offer an explanation without a source.','religious');
 const selected=input.depth==='10'?passages.slice(0,1):passages;let claims=selected.map(p=>({claimId:p.claim.id,sourceId:p.source.id,text:p.claim[input.language],url:p.source.url}));trace.push('compose','verify');let gate=verify(claims,passages,input.language);
 if(gate.decision==='Repair'){claims=selected.map(p=>({claimId:p.claim.id,sourceId:p.source.id,text:p.claim[input.language],url:p.source.url}));gate={...verify(claims,passages,input.language),repairs:1};trace.push('repair-once','verify');}
 if(gate.decision!=='Pass')return stop('verification-failed',ar?'توقفت الإجابة لأنها لم تجتز التحقق.':'The answer was stopped because it did not pass verification.','religious');
 trace.push('explain','guide');return {...base,state:'answer',answer:claims.map(c=>c.text).join('\n\n'),reason:'supported-evidence',passages,claims,gate,trace,next:ar?['ماذا تعني كلمات الأذان؟','كيف يستجيب من يسمع الأذان؟']:['What do the words of the adhan mean?','How do listeners respond to the adhan?']};
}
