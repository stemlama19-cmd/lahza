type Item={id:string;type:string;at:string;label:string};
export async function exportPassport(stamps:Item[],lang:'ar'|'en'){
 await document.fonts.ready;const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const c=canvas.getContext('2d');if(!c)throw Error('canvas');
 c.fillStyle='#f8f4e9';c.fillRect(0,0,1080,1350);c.fillStyle='#13253b';c.fillRect(0,0,1080,230);c.textAlign='center';c.fillStyle='#e8bd64';c.font='bold 48px Tajawal';c.fillText('لَحْظَة | LAHZA',540,105);c.fillStyle='#ffffff';c.font='32px Tajawal';c.fillText(lang==='ar'?'جواز لحظاتي':'MY MOMENT PASSPORT',540,175);
 c.direction=lang==='ar'?'rtl':'ltr';c.fillStyle='#13253b';c.font='36px Tajawal';c.fillText(lang==='ar'?'كل ختم، نافذة جديدة.':'Every stamp, a new window.',540,305);
 const items=stamps.slice(0,8);if(!items.length){c.fillStyle='#657184';c.font='30px Tajawal';c.fillText(lang==='ar'?'بانتظار لحظتي الأولى':'Waiting for my first moment',540,650);}
 items.forEach((s,i)=>{const x=i%2===0?300:780,y=455+Math.floor(i/2)*245;c.save();c.translate(x,y);c.rotate((i%2?1:-1)*.06);c.strokeStyle=s.type==='visit-demo'?'#78787b':'#a27021';c.lineWidth=4;c.beginPath();c.arc(0,0,102,0,Math.PI*2);c.stroke();c.lineWidth=1.5;c.beginPath();c.arc(0,0,91,0,Math.PI*2);c.stroke();c.fillStyle='#13253b';c.font='bold 25px Tajawal';c.fillText(s.label,0,-8,172);c.font='18px Tajawal';c.fillText(s.type==='visit-demo'?(lang==='ar'?'نموذج تجريبي':'DEMO ONLY'):'LAHZA',0,30);c.restore();});
 c.fillStyle='#657184';c.font='24px Tajawal';c.fillText(lang==='ar'?'رحلة تخصّني، محفوظة على جهازي.':'My journey, kept on my device.',540,1295);
 const blob=await new Promise<Blob>((res,rej)=>canvas.toBlob(b=>b?res(b):rej(Error('image')),'image/png'));const file=new File([blob],'lahza-passport.png',{type:'image/png'});
 return {url:URL.createObjectURL(blob),file};
}
