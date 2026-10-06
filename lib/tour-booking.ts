import catalogue from '../data/guided-tours.json';
export type TourLanguage='ar'|'en';
export type Tour=typeof catalogue.tours[number];
export type TourDraft={id:string;tourId:string;date:string;time:string;guests:number;language:TourLanguage;name:string;question:string};
export type TourBooking=TourDraft&{prototype:true;status:'confirmed'|'cancelled';createdAt:string;updatedAt:string};
export const TOUR_BOOKINGS='lahza-prototype-tickets-v1';
export const TOUR_DRAFT='lahza-prototype-booking-draft-v1';
export const tours=catalogue.tours;
export const tourTimes=['09:00','16:30','19:00'];
export const prototypeNotice={ar:'الحجز نموذج تجريبي؛ ستُفعّل التذاكر والرحلات الفعلية لاحقًا.',en:'Booking prototype. Live tickets and guided tours will be activated later.'};
export const tourById=(id:string)=>tours.find(t=>t.id===id);
export function bookingDates(now=new Date()){
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Riyadh',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
 return Array.from({length:14},(_,i)=>new Date(new Date(today+'T12:00:00Z').getTime()+(i+1)*86400000).toISOString().slice(0,10));
}
export function dateLabel(date:string,language:TourLanguage){return new Intl.DateTimeFormat(language==='ar'?'ar-SA-u-nu-latn':'en-GB',{weekday:'short',day:'numeric',month:'long',year:'numeric',calendar:'gregory',timeZone:'Asia/Riyadh'}).format(new Date(date+'T12:00:00Z'));}
export function emptyDraft(language:TourLanguage):TourDraft{return {id:'',tourId:'',date:'',time:'',guests:1,language,name:'',question:''};}
export function validDraft(value:unknown):value is TourDraft{
 if(!value||typeof value!=='object')return false;const d=value as TourDraft;
 return typeof d.id==='string'&&/^LHZ-[A-F0-9]{12}$/.test(d.id)&&typeof d.tourId==='string'&&!!tourById(d.tourId)&&typeof d.date==='string'&&(d.date===''||/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&!Number.isNaN(Date.parse(d.date+'T12:00:00Z')))&&typeof d.time==='string'&&(d.time===''||tourTimes.includes(d.time))&&Number.isInteger(d.guests)&&d.guests>=1&&d.guests<=8&&['ar','en'].includes(d.language)&&typeof d.name==='string'&&d.name.length<=80&&typeof d.question==='string'&&d.question.length<=300;
}
export function readyToBook(d:TourDraft,now=new Date()){return validDraft(d)&&bookingDates(now).includes(d.date)&&tourTimes.includes(d.time);}
export function validBooking(value:unknown):value is TourBooking{const b=value as TourBooking;return validDraft(b)&&!!b.date&&!!b.time&&b.prototype===true&&['confirmed','cancelled'].includes(b.status)&&typeof b.createdAt==='string'&&!Number.isNaN(Date.parse(b.createdAt))&&typeof b.updatedAt==='string'&&!Number.isNaN(Date.parse(b.updatedAt));}
export function readBookings(raw:string|null):TourBooking[]{const data=JSON.parse(raw||'[]');return Array.isArray(data)?data.filter(validBooking).slice(0,50):[];}
export function newBookingId(){return 'LHZ-'+crypto.randomUUID().replaceAll('-','').slice(0,12).toUpperCase();}
export function confirmBooking(draft:TourDraft,previous:TourBooking[],now=new Date()):TourBooking[]{
 if(!readyToBook(draft,now))throw Error('invalid_booking');
 const old=previous.find(b=>b.id===draft.id);if(!old&&previous.length>=50)throw Error('ticket_limit');
 const ticket:TourBooking={...draft,name:draft.name.trim(),question:draft.question.trim(),prototype:true,status:'confirmed',createdAt:old?.createdAt||now.toISOString(),updatedAt:now.toISOString()};
 return [ticket,...previous.filter(b=>b.id!==ticket.id)];
}
export function ticketHTML(ticket:TourBooking,language:TourLanguage,cityName:string){
 const tour=tourById(ticket.tourId);if(!tour||!validBooking(ticket))throw Error('invalid_ticket');
 const t=(a:string,e:string)=>language==='ar'?a:e,escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
 const rows=[[t('المدينة','City'),cityName],[t('الموقع','Venue'),tour.place[language]],[t('الموعد','Date and time'),dateLabel(ticket.date,language)+' · '+ticket.time+' (GMT+3)'],[t('المدة','Duration'),tour.duration+' '+t('دقيقة','minutes')],[t('عدد الزوار','Guests'),String(ticket.guests)],[t('لغة الجولة','Tour language'),ticket.language==='ar'?'العربية':'English'],[t('المرشد','Guide'),t('مرشد ديني متخصص في ','A specialist religious guide in ')+tour.specialty[language]],[t('نقطة اللقاء المقترحة','Proposed meeting point'),tour.meeting[language]]];
 if(ticket.name)rows.unshift([t('الاسم','Name'),ticket.name]);if(ticket.question)rows.push([t('سؤالك للمرشد','Your question for the guide'),ticket.question]);
 return `<!doctype html><html lang="${language}" dir="${language==='ar'?'rtl':'ltr'}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LAHZA · ${escape(ticket.id)}</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#f8f5ed;color:#15283f;font:16px/1.8 Arial,sans-serif}main{max-width:640px;margin:auto;background:white;border:1px solid #d6c69e;border-radius:24px;overflow:hidden}header{padding:28px;background:#15283f;color:white}header small{color:#e9bb60}section,footer{padding:24px}h1{font-size:26px;line-height:1.5}dl{margin:0;display:grid;grid-template-columns:1fr 2fr;gap:12px}dt{color:#667181}dd{margin:0;overflow-wrap:anywhere;font-weight:bold}footer{border-top:2px dashed #d6c69e;font-size:13px;color:#667181}code{font-size:19px}button{display:block;margin:24px auto;padding:14px 24px;border:0;border-radius:12px;background:#15283f;color:white;font:inherit}@media print{body{background:white;padding:0}button{display:none}main{border:1px solid #ddd}}</style><main><header><small>لَحْظَة | LAHZA · ${t('تذكرة تجريبية','Prototype ticket')}</small><h1>${escape(tour.title[language])}</h1><p>${ticket.status==='cancelled'?t('حجز ملغى','Cancelled booking'):t('تم تأكيد الحجز التجريبي','Prototype booking confirmed')}</p><code dir="ltr">${escape(ticket.id)}</code></header><section><dl>${rows.map(([k,v])=>'<dt>'+escape(k)+'</dt><dd>'+escape(v)+'</dd>').join('')}</dl></section><footer>${prototypeNotice[language]} ${t('الأوقات ونقطة اللقاء ضمن سيناريو العرض؛ هذه ليست تذكرة دخول فعلية.','Times and meeting point belong to the demo scenario; this is not an admission ticket.')}</footer></main><button onclick="window.print()">${t('طباعة / حفظ PDF','Print / Save as PDF')}</button></html>`;
}
