import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'لَحْظَة | LAHZA',description:'افهم ما حولك، لحظة بلحظة. يحدث الآن، استكشف، الرحلات، وجواز لحظاتك. Explore moments with source-verified, source-linked content.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
