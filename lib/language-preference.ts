import type {Lang} from './discovery-contract';
const KEY='lahza-language';
export function preferredLanguage():Lang{try{const saved=localStorage.getItem(KEY);if(saved==='ar'||saved==='en')return saved;}catch{}const languages=navigator.languages?.length?navigator.languages:[navigator.language];for(const language of languages){const base=language.toLowerCase().split('-')[0];if(base==='ar'||base==='en')return base;}return 'en';}
export function saveLanguage(language:Lang){try{localStorage.setItem(KEY,language);}catch{}}
