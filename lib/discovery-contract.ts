export const APP_VERSION = '0.6.2';
export const PROMPT_VERSION = 'discovery-2026-10-05-v8';
export type Lang = 'ar' | 'en';
export const questionBank = [
 {id:'Q1',ar:'من أين جاء الصوت؟ مكبرات خارج مبنى، داخل المكان، هاتف أو جهاز؟',en:'Where did the sound come from: speakers outside a building, inside the place, or a phone or device?',whyAr:'مصدر الصوت يساعد على فهم السياق، لكنه لا يحدد محتواه وحده.',whyEn:'The source helps establish context, but does not identify the content on its own.'},
 {id:'Q2',ar:'كم استمر تقريبًا؟ أقل من دقيقة، دقائق قليلة، أم أطول بكثير؟',en:'About how long did it last: under a minute, a few minutes, or much longer?',whyAr:'المدة تضيف قرينة إلى وصفك، ولا تحسم نوع الصوت.',whyEn:'Duration adds a clue to your description; it does not determine the sound.'},
 {id:'Q3',ar:'كيف كان الصوت؟ عبارات منغّمة بينها وقفات، قراءة متصلة، حديث كالخطاب، أم جماعة تكرر عبارة؟',en:'What did it sound like: melodic phrases with pauses, continuous reciting, a speech, or a group repeating a phrase?',whyAr:'نمط الصوت يساعد على التمييز بين النداء والحديث والقراءة.',whyEn:'The pattern helps distinguish a call, a speech and recitation.'},
 {id:'Q4',ar:'هل تتذكر كلمة أو عبارة مما سمعت؟ اكتبها كما تتذكرها.',en:'Do you remember a word or phrase you heard? Write it as you remember it.',whyAr:'العبارة قد تساعد مع القرائن الأخرى؛ كلمة واحدة لا تكفي.',whyEn:'A phrase can help alongside other clues; one word is not enough.'},
 {id:'Q5',ar:'هل سمعت قبله بدقائق نداءً أطول من المكان نفسه؟',en:'Did you hear a longer call from the same place a little earlier?',whyAr:'تتابع النداءات قد يغيّر الاحتمال، دون أن يحسمه.',whyEn:'The sequence of calls may change the likely explanation without proving it.'},
 {id:'Q6',ar:'هل كان ذلك قرابة ظهر الجمعة؟',en:'Was it around midday on a Friday?',whyAr:'التوقيت يساعد على فهم سياق الحديث الطويل، ولا يكفي وحده.',whyEn:'The time helps place a longer speech in context, but is not enough by itself.'},
 {id:'Q7',ar:'ماذا فعل الناس حولك؟ اتجهوا إلى مبنى، وقفوا صفوفًا، أم واصلوا شأنهم؟',en:'What did people around you do: walk towards a building, stand in rows, or carry on?',whyAr:'ما فعله الناس يضيف سياقًا إلى ما سمعته.',whyEn:'What people did adds context to what you heard.'},
 {id:'Q8',ar:'ماذا كانوا يفعلون؟ يقفون في صفوف وينحنون معًا، يجلسون ويستمعون لمتحدث، أم يقرأ شخص من كتاب؟',en:'What were they doing: standing in rows and bowing together, sitting and listening to a speaker, or one person reading a book?',whyAr:'الحركات التي لاحظتها تساعد على فهم المشهد.',whyEn:'The actions you noticed help make sense of the scene.'},
] as const;
export type QuestionId = typeof questionBank[number]['id'];
export type Decision = {decision:'ask'|'confirm'|'stop';question_id:QuestionId|null;hypothesis:'adhan'|'other_described'|'none';hypothesis_text:string;evidence:string[];why_this_question:string;stop_type:'insufficient_evidence'|'out_of_scope'|'no_content'|null;offer_example:boolean;message:string};
export type DialogueMessage = {role:'user'|'assistant';text:string};
export type Turn = {at:string;input:string;action:string;decision:Decision|null;displayed:string;model:string|null;requestId:string|null;error?:string;explanation?:string;sources?:{id:string;url:string}[]};
export type Conversation = {id:string;version:string;promptVersion:string;language:Lang;initialDescription:string;startedAt:string;turns:Turn[]};
export type Session = {version:string;language:Lang;messages:DialogueMessage[];asked:QuestionId[];last:Decision|null;expires:number;accepted:boolean;revisions?:number};
export const decisionSchema = {type:'object',additionalProperties:false,required:['decision','question_id','hypothesis','hypothesis_text','evidence','why_this_question','stop_type','offer_example','message'],properties:{
 decision:{type:'string',enum:['ask','confirm','stop']},question_id:{type:['string','null'],enum:[...questionBank.map(q=>q.id),null]},hypothesis:{type:'string',enum:['adhan','other_described','none']},hypothesis_text:{type:'string'},evidence:{type:'array',items:{type:'string'}},why_this_question:{type:'string'},stop_type:{type:['string','null'],enum:['insufficient_evidence','out_of_scope','no_content',null]},offer_example:{type:'boolean'},message:{type:'string'}
}};
export function renderDecision(d:Decision,lang:Lang,summary?:string):Decision {
 const ar=lang==='ar';
 if(d.decision==='ask'){const q=questionBank.find(q=>q.id===d.question_id)!;return {...d,message:ar?q.ar:q.en,why_this_question:ar?q.whyAr:q.whyEn};}
 if(d.decision==='confirm')return {...d,hypothesis_text:ar?'الأذان':'the adhan',why_this_question:'',message:ar?`ما وصفته: ${summary||'نداء تدعمه القرائن التي ذكرتها'}. قد يكون هذا الأذان. هل تريد استكشاف هذا الاحتمال، أم أنك غير متأكد؟`:`You described ${summary||'a call supported by your observations'}. This may be the adhan. Would you like to explore this possibility, or are you unsure?`};
 const messages={insufficient_evidence:ar?'لا أستطيع تحديد اللحظة من المعلومات المتاحة. يمكنك الاحتفاظ بوصفك وسؤالك في بطاقة للحوار.':'I cannot identify the moment from the available information. You can keep your description and question in a conversation card.',out_of_scope:ar?'هذا الوصف خارج نطاق لحظة المتاح حاليًا. يمكنك بدء وصف جديد.':'This description is outside LAHZA’s current scope. You can start a new description.',no_content:ar?'لا تتوفر في الحزمة الحالية مادة موثّقة كافية لشرح هذه اللحظة. يمكنك تجهيز بطاقة للحوار.':'The current knowledge pack does not have enough sourced material for this moment. You can prepare a conversation card.'};
 return {...d,why_this_question:'',message:messages[d.stop_type!],offer_example:d.stop_type==='insufficient_evidence'&&d.offer_example};
}
