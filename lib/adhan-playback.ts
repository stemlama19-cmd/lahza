export type AudioCue={claimId:string;repetition:number;start:number;end:number};
export function cueAt(cues:AudioCue[],seconds:number){
 for(let i=cues.length-1;i>=0;i--)if(seconds>=cues[i].start)return i;
 return 0;
}
export function formatAudioTime(seconds:number){
 const value=Math.max(0,Math.floor(Number.isFinite(seconds)?seconds:0));
 return `${Math.floor(value/60)}:${String(value%60).padStart(2,'0')}`;
}
