import LahzaApp from '@/components/lahza-app';
export default async function QARender({searchParams}:{searchParams:Promise<{lang?:string;screen?:string}>}){if(process.env.NODE_ENV!=='development')return <main>Not available</main>;const p=await searchParams;return <LahzaApp qa={{lang:p.lang==='en'?'en':'ar',screen:p.screen||'now:before'}}/>;}
