import {ExternalLink,Radio,Headphones} from 'lucide-react';

type Language='ar'|'en';
type Moment='adhan'|'khutbah'|'all';

// Official publisher destinations checked on 2026-10-06. No recordings are copied.
export const haramMediaSources={
 live:{ar:'https://aloula.sba.sa/live/quran',en:'https://aloula.sba.sa/en/live/quran'},
 channel:'https://www.youtube.com/@SaudiQuranTv',
 sermons:'https://prh.gov.sa/ar/component/content/article?Itemid=461&id=274',
 translations:'https://services.prh.gov.sa/en/khotab_makka.php?mode=makkah',
};

export default function HaramMedia({language,moment='all',compact=false}:{language:Language;moment?:Moment;compact?:boolean}){
 const ar=language==='ar',t=(a:string,e:string)=>ar?a:e;
 const external=t('يفتح في تبويب جديد','Opens in a new tab');
 return <section className={'haram-media'+(compact?' compact':'')} aria-label={t('استمع وشاهد من الحرم','Listen and watch from Makkah')}>
  {moment==='all'&&<h2 className="section-title">{t('استمع وشاهد من الحرم','Listen and watch from Makkah')}</h2>}
  {(moment==='all'||moment==='adhan')&&<article className="haram-media-card">
   <div className="haram-media-heading"><Radio size={22} aria-hidden/><div><small>{t('بث خارجي مباشر','External live broadcast')}</small><h3>{t('صوت الحرم المكي','Sounds of the Grand Mosque')}</h3></div></div>
   <p>{t('تابع قناة القرآن الكريم من المسجد الحرام. يُسمع الأذان عند رفعه في مكة؛ البث ليس تسجيل أذان عند الطلب.','Watch Quran TV from the Grand Mosque in Makkah. Hear the adhan, the call to prayer, when it takes place there. This is a live broadcast, not an on-demand adhan recording.')}</p>
   <a className="outlined link-button haram-media-primary" href={haramMediaSources.live[language]} target="_blank" rel="noopener noreferrer" title={external}>{t('افتح بث الحرم','Open the Makkah broadcast')}<ExternalLink size={17} aria-hidden/></a>
   <a className="haram-media-secondary" href={haramMediaSources.channel} target="_blank" rel="noopener noreferrer" title={external}>{t('القناة الرسمية على YouTube','Official YouTube channel')}<ExternalLink size={14} aria-hidden/></a>
   <small className="haram-media-provider">{t('قناة القرآن الكريم · هيئة الإذاعة والتلفزيون','Quran TV · Saudi Broadcasting Authority')}</small>
  </article>}
  {(moment==='all'||moment==='khutbah')&&<article className="haram-media-card">
   <div className="haram-media-heading"><Headphones size={22} aria-hidden/><div><small>{t('خطب مسجّلة وترجمات','Recorded sermons and translations')}</small><h3>{t('خطب الجمعة من الحرم','Friday sermons from Makkah')}</h3></div></div>
   <p>{t('اختر خطبة من مكتبة الرئاسة، أو افتح صفحة الترجمات للاستماع بالإنجليزية ولغات أخرى.','Choose a Friday sermon from the official archive, or open the translations page to listen in English and other languages.')}</p>
   <a className="outlined link-button haram-media-primary" href={ar?haramMediaSources.sermons:haramMediaSources.translations} target="_blank" rel="noopener noreferrer" title={external}>{t('شاهد خطب الجمعة','Listen with English translation')}<ExternalLink size={17} aria-hidden/></a>
   <a className="haram-media-secondary" href={ar?haramMediaSources.translations:haramMediaSources.sermons} target="_blank" rel="noopener noreferrer" title={external}>{t('استمع مع الترجمة الإنجليزية','Browse sermons in Arabic')}<ExternalLink size={14} aria-hidden/></a>
   <small className="haram-media-provider">{t('رئاسة الشؤون الدينية بالمسجد الحرام والمسجد النبوي','Presidency of Religious Affairs at the Two Holy Mosques')}</small>
  </article>}
  <p className="haram-media-note">{t('يفتح المصدر الرسمي في تبويب جديد. ارجع إلى لَحْظَة لمتابعة الفهم.','The official source opens in a new tab. Return to LAHZA to keep exploring.')}</p>
 </section>;
}
