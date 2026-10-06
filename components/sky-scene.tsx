import {useId} from 'react';
import type {skyState} from '@/lib/sky-scene';

export default function SkyScene({sky}: {sky: ReturnType<typeof skyState>}) {
  const glowId = useId();
  return <div className={'city-scene sky-' + sky.phase} data-sky={sky.phase} aria-hidden="true">
    <svg viewBox="0 0 520 320" preserveAspectRatio="xMidYMax slice" className="city-skyline">
      <defs><radialGradient id={glowId}><stop stopColor="#ffeab6"/><stop offset="1" stopColor="#ffeab6" stopOpacity="0"/></radialGradient></defs>
      <g className="sky-stars" fill="#fff3d2">
        <circle cx="58" cy="47" r="1.4"/><circle cx="128" cy="99" r="1"/>
        <circle cx="207" cy="33" r="1.3"/><circle cx="326" cy="72" r="1.1"/>
        <circle cx="409" cy="40" r="1.5"/><circle cx="469" cy="113" r="1"/>
        <circle cx="368" cy="133" r=".9"/>
      </g>
      <circle cx="260" cy="143" r="83" fill={'url(#' + glowId + ')'} opacity={sky.glow} className="minaret-glow"/>
      {sky.calling && <g className="call-rings" fill="none" stroke="#ffebba" strokeWidth="1.2">
        <circle cx="260" cy="143" r="17" className="call-ring"/>
        <circle cx="260" cy="143" r="17" className="call-ring call-ring-second"/>
      </g>}
      <g fill="currentColor">
        <path d="M0 267H24V249H60V233H88V262H114V223H143V250H164V239H191V265H214V258H231V320H0Z"/>
        <path d="M286 260H310V236H337V251H359V213H388V246H410V232H443V263H466V243H493V265H520V320H286Z"/>
        <path d="M225 274V261Q225 229 260 217Q295 229 295 261V274H320V320H199V274Z"/>
        <path d="M250 239V177H246V169H251V149H247V144H251Q252 130 258 125V113H262V125Q268 130 269 144H273V149H269V169H274V177H270V239Z"/>
        <path d="M0 295Q119 285 211 296T520 295V320H0Z"/>
      </g>
    </svg>
  </div>;
}
