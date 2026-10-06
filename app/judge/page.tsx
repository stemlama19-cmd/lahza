import type {Metadata} from 'next';
import LahzaApp from '@/components/lahza-app';
export const metadata:Metadata={title:'أثر السؤال | لَحْظَة | LAHZA'};
export default function JudgePage(){return <LahzaApp initialView="impact"/>;}
