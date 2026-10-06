'use client';
import {useEffect,useImperativeHandle,useRef,useState,type Ref} from 'react';
import {BookOpen,Headphones,Pause,Play,RotateCcw,SkipBack,SkipForward,Volume2} from 'lucide-react';
import {Sheet,SheetContent,SheetDescription,SheetTitle} from '@/components/ui/sheet';
import {SourceDisclosure,QuotedText} from '@/components/moment-content';
import type {Claim,contentPayload,Language} from '@/lib/content-library';
import recording from '@/data/adhan-recording.json';
import {cueAt,formatAudioTime} from '@/lib/adhan-playback';

type Content=ReturnType<typeof contentPayload>;
export type AdhanPlayerHandle={start:()=>void};
const eligible=(c:Claim)=>['approved','approved_with_edits'].includes(c.reviewStatus);

export default function AdhanPlayer({open,onOpenChange,language,content,controller,onExplore}:{open:boolean;onOpenChange:(value:boolean)=>void;language:Language;content:Content|null;controller:Ref<AdhanPlayerHandle>;onExplore:()=>void}){
 const ar=language==='ar',t=(a:string,e:string)=>ar?a:e;
 const audio=useRef<HTMLAudioElement|null>(null),scroller=useRef<HTMLDivElement|null>(null),lineNodes=useRef<Record<string,HTMLButtonElement|null>>({}),playAttempt=useRef(0);
 const [seconds,setSeconds]=useState(0),[duration,setDuration]=useState(recording.duration),[playing,setPlaying]=useState(false),[waiting,setWaiting]=useState(false),[error,setError]=useState(''),[volume,setVolume]=useState(0.8);
 const lines=(content?.claims||[]).filter(c=>c.branchId==='adhan-lines'&&eligible(c)).sort((a,b)=>(a.order||0)-(b.order||0));
 const explanation=content?.claims.find(c=>c.claimId==='adhan-words'&&eligible(c));
 const ready=lines.length===7&&recording.cues.every(cue=>lines.some(c=>c.claimId===cue.claimId&&cue.repetition<=Number(c.repeat)));
 const index=cueAt(recording.cues,seconds),cue=recording.cues[index],current=lines.find(c=>c.claimId===cue.claimId),ended=seconds>=duration-0.1;
 function sync(){if(audio.current){setSeconds(audio.current.currentTime);if(Number.isFinite(audio.current.duration)&&audio.current.duration>0)setDuration(audio.current.duration);}}
 async function play(){
  const el=audio.current;if(!el||!ready)return;
  const attempt=++playAttempt.current;setError('');setWaiting(true);
  if(el.ended||el.currentTime>=duration-0.1)el.currentTime=0;
  if(el.error)el.load();
  try{await el.play();if(attempt===playAttempt.current){setPlaying(!el.paused);setWaiting(false);}}
  catch(e){if(attempt!==playAttempt.current)return;setPlaying(false);setWaiting(false);setError(e instanceof Error&&e.name==='NotAllowedError'?t('اضغط تشغيل لبدء الصوت.','Press play to start the audio.'):t('تعذّر تشغيل التسجيل. تحقق من اتصالك ثم أعد المحاولة.','Could not play the recording. Check your connection and try again.'));}
 }
 function pause(){playAttempt.current++;audio.current?.pause();setPlaying(false);setWaiting(false);}
 function seek(time:number,resume=false){const el=audio.current;if(!el||!ready)return;const target=Math.max(0,Math.min(duration,time));el.currentTime=target;setSeconds(target);if(resume)void play();}
 function seekCue(next:number){seek(recording.cues[Math.max(0,Math.min(next,recording.cues.length-1))].start,true);}
 function close(value:boolean){if(!value)pause();onOpenChange(value);}
 useImperativeHandle(controller,()=>({start(){onOpenChange(true);void play();}}));
 useEffect(()=>{if(!open)pause();},[open]);
 useEffect(()=>{const el=audio.current;return ()=>{playAttempt.current++;el?.pause();};},[]);
 useEffect(()=>{if(audio.current)audio.current.volume=volume;},[volume]);
 useEffect(()=>{
  if(!open||!current)return;
  const box=scroller.current,node=lineNodes.current[current.claimId];if(!box||!node)return;
  const target=box.scrollTop+node.getBoundingClientRect().top-box.getBoundingClientRect().top-box.clientHeight*0.22;
  box.scrollTo({top:Math.max(0,target),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 },[open,current?.claimId]);
 return <>
  <audio ref={audio} src={recording.playbackUrl} preload="metadata" onTimeUpdate={sync} onLoadedMetadata={sync} onPlay={()=>setPlaying(true)} onPlaying={()=>{setPlaying(true);setWaiting(false);}} onWaiting={()=>setWaiting(true)} onPause={()=>{setPlaying(false);setWaiting(false);}} onEnded={()=>{sync();setPlaying(false);setWaiting(false);}} onError={()=>{setPlaying(false);setWaiting(false);setError(t('تعذّر تحميل التسجيل. تحقق من اتصالك ثم أعد المحاولة.','Could not load the recording. Check your connection and try again.'));}}/>
  <Sheet open={open} onOpenChange={close}><SheetContent side="bottom" className="lahza-sheet adhan-lyrics-sheet" closeLabel={t('إغلاق الاستماع','Close listening')} dir={ar?'rtl':'ltr'}>
   <header className="adhan-lyrics-header"><span className="adhan-recording-tag"><Headphones size={15} aria-hidden/>{t('أذان الحرم المكي · تسجيل','Makkah Haram adhan · Recording')}</span><SheetTitle>{t('افهم كلمات الأذان','Understand the words of the adhan')}</SheetTitle><SheetDescription>{t('استمع، واتبع الكلمات. المس أي عبارة لتسمعها.','Listen and follow along. Tap a phrase to hear it.')}</SheetDescription></header>
   {!ready?<div className="adhan-unavailable" role="status">{t('انتظر تحميل الكلمات لبدء الاستماع.','Wait for the words to load before listening.')}</div>:<>
    <div ref={scroller} className="adhan-lyrics-scroll" tabIndex={0} aria-label={t('كلمات الأذان القابلة للتمرير','Scrollable adhan words')}><ol className="adhan-lyrics-list">{lines.map(c=>{const active=c.claimId===current?.claimId;return <li key={c.claimId}><button ref={node=>{lineNodes.current[c.claimId]=node;}} className={'adhan-lyric'+(active?' is-current':'')} aria-current={active?'step':undefined} data-claim-id={c.claimId} onClick={()=>seekCue(recording.cues.findIndex(item=>item.claimId===c.claimId))}><span className="adhan-lyric-ar" lang="ar" dir="rtl">{c.text_ar}</span>{!ar&&<span className="adhan-lyric-translation" lang="en" dir="ltr">{c.text_en}</span>}<small>{t('التكرار','Repetition')} <bdi>{active?cue.repetition:1} / {c.repeat}</bdi></small></button></li>;})}</ol>
     <div className="adhan-recording-credit"><details><summary>{t('عن التسجيل ومصدره','About this recording and its source')}</summary><p>{ar?recording.title_ar:recording.title_en}</p><p>{recording.creator} · <a href={recording.licenseUrl} target="_blank" rel="noopener noreferrer">{ar?recording.license_ar:recording.license_en}</a></p><p>{ar?recording.changes_ar:recording.changes_en}</p><a href={recording.sourceUrl} target="_blank" rel="noopener noreferrer">{t('صفحة التسجيل الأصلية','Original recording page')}</a></details><button className="adhan-explore-link" onClick={()=>{pause();onOpenChange(false);onExplore();}}><BookOpen size={16}/>{t('ماذا وراء هذه الكلمات؟','What is behind these words?')}</button></div>
    </div>
    <div className="adhan-meaning-panel"><span>{t('معنى الكلمات','Meaning')}</span><p>{ar?(explanation?<QuotedText text={explanation.text_ar}/>:current?.text_ar):current?.text_en}</p><SourceDisclosure ids={ar?(explanation?.sourceIds||current?.sourceIds||[]):current?.sourceIds||[]} sources={content?.sources||[]} language={language}/></div>
   </>}
   <footer className="adhan-transport">
    {ended&&<button className="adhan-after-listening" onClick={()=>{pause();onOpenChange(false);onExplore();}}><BookOpen size={18}/>{t('ماذا وراء هذه الكلمات؟','What is behind these words?')}</button>}
    {error&&<p className="adhan-audio-error" role="alert">{error}</p>}
    <label className="sr-only" htmlFor="adhan-seek">{t('موضع الاستماع','Playback position')}</label><input id="adhan-seek" className="adhan-seek" type="range" min={0} max={duration} step={0.1} value={Math.min(seconds,duration)} disabled={!ready} onChange={e=>seek(Number(e.target.value))} aria-valuetext={formatAudioTime(seconds)+' / '+formatAudioTime(duration)} style={{'--progress':`${seconds/duration*100}%`} as React.CSSProperties}/>
    <div className="adhan-time" dir="ltr"><span>{formatAudioTime(seconds)}</span><span>{waiting?t('جارٍ التحميل…','Loading…'):formatAudioTime(duration)}</span></div>
    <div className="adhan-controls" dir="ltr"><button className="adhan-small-control" onClick={()=>seek(0,playing)} disabled={!ready} aria-label={t('إعادة من البداية','Restart from beginning')}><RotateCcw size={21}/></button><button className="adhan-skip" onClick={()=>seekCue(index-1)} disabled={!ready||index===0} aria-label={t('العبارة السابقة','Previous phrase')}><SkipBack size={26}/></button><button className="adhan-play" onClick={()=>playing?pause():void play()} disabled={!ready} aria-label={playing?t('إيقاف مؤقت','Pause'):ended?t('استمع مرة أخرى','Play again'):t('ابدأ الاستماع','Start listening')}>{playing?<Pause size={31} fill="currentColor"/>:<Play size={31} fill="currentColor"/>}</button><button className="adhan-skip" onClick={()=>seekCue(index+1)} disabled={!ready||index===recording.cues.length-1} aria-label={t('العبارة التالية','Next phrase')}><SkipForward size={26}/></button><label className="adhan-volume"><Volume2 size={18} aria-hidden/><span className="sr-only">{t('مستوى الصوت','Volume')}</span><input type="range" min={0} max={1} step={0.05} value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label></div>
   </footer>
  </SheetContent></Sheet>
 </>;
}
