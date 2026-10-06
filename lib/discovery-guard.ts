import type {Session,QuestionId} from './discovery-contract';
// Conservative Arabic/English evidence gate. Only visitor observations are inspected.
// These operational criteria govern this release, not religious identification rules.
export function observations(s:Session){
 const text=s.messages.filter(m=>m.role==='user').map(m=>m.text).join('\n').normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').toLowerCase();
 const has=(r:RegExp)=>r.test(text);
 const audio=has(/سمعت|صوت|نداء|يرتل|مكبر|voice|sound|heard|speaker|recit|chant|repeating.*phrase/);
 const fixed=has(/(?:من|على|خارج).*?(?:مبنى|مسجد|مئذنة|برج)|(?:from|on|outside).*?(?:building|mosque|minaret|tower)/);
 const single=has(/صوت واحد|one voice|single voice|a man's voice/);
 const pauses=has(/عبارات.*وقفات|phrases.*pauses/);
 const phrase=has(/الله اكبر|allahu akbar|حي على الصلاة|hayya.*salah/);
 const moving=has(/سيارة|مركبة|taxi|\bvan\b|\bcar\b|vehicle/);
 const previous=has(/نداء.*اطول.*قبل|قبله.*نداء اطول|نداء.*قصير.*اطول|short.*call.*(?:after|longer)|longer call.*(?:earlier|before)/);
 const group=has(/ترديد جماعي|جماعة.*تكرر|group.*repeat|repeat.*together/);
 const continuous=has(/(?:ترتيل|قراءة|حديث|يتحدث).*?(?:متصل|طويل)|continuous.*(?:recit|chant)|speech|كالخطاب/);
 const music=has(/موسيقى|music/)&&!has(/(?:ليس|ليست|بدون|بلا).*موسيقى|(?:wasn't|not|no|without) music/);
 const recitation=has(/يرتل|ترتيل|recit/);
 const contrary=recitation||moving||previous||group||continuous||music||!audio;
 const known=new Set<QuestionId>(s.asked);
 if(has(/مكبر|من المسجد|من مبنى|من الهاتف|هاتف.*اصدر|داخل متجر|speaker|from.*(?:mosque|building|tower)|taxi|phone.*(?:made|sound)|conference/))known.add('Q1');
 if(has(/دقيق|ثوان|طويل|قصير|minutes?|seconds?|long|short/))known.add('Q2');
 if(pauses||group||continuous||has(/recited|يرتل/))known.add('Q3');
 if(phrase||has(/labbayk|لب.?يك|word.*allah/))known.add('Q4');
 if(previous||has(/لم اسمع.*قبله|did not hear.*before/))known.add('Q5');
 if(has(/الجمعة|friday|tuesday/))known.add('Q6');
 if(has(/الناس.*(?:تمشي|يتجه|جلوس|ملابس)|everyone stayed silent|people.*(?:walk|came|sat)|men.*(?:washing|repeating)/))known.add('Q7');
 if(has(/ينحنون|صفوف|washing|bowing|sitting.*floor/))known.add('Q8');
 const inscription=!audio&&has(/كتابة|خط مزخرف|inscription|writing|calligraphy/);
 const clearOutside=has(/alarm|انذار/);
 const clearNoContent=has(/ينحنون|washing.*hands.*faces.*feet/)||continuous&&has(/مسجد|mosque/);
 const allowedQuestions=(['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8'] as QuestionId[]).filter(q=>!known.has(q)&&(audio||!['Q1','Q2','Q3','Q4','Q5','Q6','Q7'].includes(q)));
 return {recitation,inscription,known:[...known],allowedQuestions,clearOutside,clearNoContent,audio,fixed,single,pauses,phrase,moving,previous,group,continuous,music,contrary,canConfirm:audio&&fixed&&!contrary&&((single&&pauses)||phrase)};
}
export function confirmationSummary(s:Session){
 const o=observations(s),ar=s.language==='ar';
 const pattern=o.single&&o.pauses?(ar?'صوت واحد بعبارات بينها وقفات':'one voice with phrases and pauses'):(ar?'عبارة متذكّرة من النداء مع قرينة المصدر':'a recalled call phrase together with the source clue');
 return ar?`${pattern}، من مبنى`:`${pattern}, from a building`;
}
