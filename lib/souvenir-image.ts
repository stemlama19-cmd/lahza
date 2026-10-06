import type {PersonalMoment} from '@/lib/personal-moments';
function wrap(c:CanvasRenderingContext2D,text:string,width:number){
 const lines:string[]=[];for(const paragraph of text.split('\n')){let line='';for(const word of paragraph.split(/\s+/)){if(!word)continue;const next=line?line+' '+word:word;if(c.measureText(next).width<=width){line=next;continue;}if(line)lines.push(line);line='';for(const char of Array.from(word)){if(c.measureText(line+char).width>width&&line){lines.push(line);line='';}line+=char;}}lines.push(line);}return lines;
}
export async function exportSouvenir(record:PersonalMoment,language:'ar'|'en',cityName:string,momentName:string){
 await document.fonts.ready;await document.fonts.load('500 34px Tajawal');
 const image=new Image();image.src='/art/lahza-skyline.svg';await image.decode();
 const canvas=document.createElement('canvas');canvas.width=1080;const c=canvas.getContext('2d');if(!c)throw Error('canvas');
 c.font='500 34px Tajawal';const before=wrap(c,record.before,880),after=wrap(c,record.after,880);
 canvas.height=Math.max(1420,1100+(record.before?before.length*54:0)+(record.after?after.length*54:0));
 const ar=language==='ar',t=(a:string,e:string)=>ar?a:e;c.fillStyle='#f8f4e9';c.fillRect(0,0,1080,canvas.height);c.drawImage(image,0,0,1080,410);
 c.textAlign='center';c.fillStyle='#e8bd64';c.font='bold 42px Tajawal';c.fillText('لَحْظَة | LAHZA',540,85);
 c.fillStyle='#13253b';c.direction=ar?'rtl':'ltr';c.font='bold 48px Tajawal';c.fillText(t('لحظة فهم من '+cityName,'A moment of understanding'),540,485,900);c.font='32px Tajawal';c.fillText(ar?momentName:cityName+' · '+momentName,540,545,900);
 let y=630;
 const paragraph=(label:string,text:string,lines:string[])=>{if(!text)return;c.direction=ar?'rtl':'ltr';c.textAlign=ar?'right':'left';c.fillStyle='#8b621e';c.font='bold 28px Tajawal';c.fillText(label,ar?980:100,y);y+=55;const rtl=/[\u0600-\u06ff]/.test(text);c.direction=rtl?'rtl':'ltr';c.textAlign=rtl?'right':'left';c.fillStyle='#13253b';c.font='500 34px Tajawal';for(const line of lines){c.fillText(line,rtl?980:100,y);y+=54;}y+=44;};
 paragraph(t('قبل التجربة','Before exploring'),record.before,before);paragraph(t('ما فهمته الآن','What I understand now'),record.after,after);
 c.direction=ar?'rtl':'ltr';c.textAlign='center';c.fillStyle='#657184';c.font='25px Tajawal';c.fillText(t('تأمل شخصي كتبه الزائر','A personal reflection written by the visitor'),540,canvas.height-275);
 if(record.learned){c.strokeStyle='#ad7d2e';c.lineWidth=3;c.beginPath();c.arc(540,canvas.height-155,73,0,Math.PI*2);c.stroke();c.fillStyle='#8b621e';c.font='bold 25px Tajawal';c.fillText(t('ختم تعلّم','LEARNING'),540,canvas.height-163);c.font='22px Tajawal';c.fillText('LAHZA',540,canvas.height-128);}
 c.fillStyle='#657184';c.font='22px Tajawal';c.fillText(new Intl.DateTimeFormat(ar?'ar-SA-u-nu-latn':'en',{day:'numeric',month:'long',year:'numeric',calendar:'gregory'}).format(new Date(record.at)),540,canvas.height-35);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('image')),'image/png'));return {url:URL.createObjectURL(blob),file:new File([blob],'lahza-moment.png',{type:'image/png'})};
}
