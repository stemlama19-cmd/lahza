import type {Conversation} from './discovery-contract';
const KEY='lahza-dialogues-v030';
export function readConversations():Conversation[]{try{const v=JSON.parse(sessionStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[];}catch{return [];}}
export function saveConversation(c:Conversation):boolean {try{const all=readConversations().filter(x=>x.id!==c.id);sessionStorage.setItem(KEY,JSON.stringify([...all,c].slice(-20)));return true;}catch{return false;}}
export function clearConversations(){sessionStorage.removeItem(KEY);}
export function downloadJson(value:unknown,name:string){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
