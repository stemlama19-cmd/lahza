import {CalculationMethod, Coordinates, PrayerTimes} from 'adhan';
import {dayParts, timesFor, type City} from './prayer-clock';

export type SkyPhase = 'dawn' | 'day' | 'afternoon' | 'sunset' | 'night';

/** Decorative daylight only. Does not alter prayer calculations or model decisions. */
export function skyState(date: Date, city: City) {
  const parts = dayParts(date, city.zone);
  const solar = new PrayerTimes(new Coordinates(city.lat, city.lng), new Date(+parts.year, +parts.month - 1, +parts.day, 12), CalculationMethod.UmmAlQura());
  const times = timesFor(date, city);
  const now = date.getTime(), minute = 60_000;
  const fajr = times[0].date.getTime(), asr = times[2].date.getTime(), sunset = times[3].date.getTime();
  const phase: SkyPhase = now < fajr ? 'night' : now < solar.sunrise.getTime() + 20 * minute ? 'dawn' : now < asr ? 'day' : now < sunset - 30 * minute ? 'afternoon' : now < sunset + 30 * minute ? 'sunset' : 'night';
  const calling = times.some(p => now >= p.date.getTime() && now < p.date.getTime() + 3 * minute);
  const next = times.find(p => p.date.getTime() > now) || timesFor(new Date(now + 24 * 60 * minute), city)[0];
  const untilCall = next.date.getTime() - now;
  const glow = untilCall <= 10 * minute ? .12 + .7 * (1 - untilCall / (10 * minute)) : 0;
  return {phase, calling, glow};
}

/** Development-only capture fixtures. The public app never selects these dates. */
export const skyCaptureDates: Record<SkyPhase, string> = {
  dawn: '2026-10-06T02:00:00Z', day: '2026-10-06T08:00:00Z',
  afternoon: '2026-10-06T13:00:00Z', sunset: '2026-10-06T14:31:00Z',
  night: '2026-10-06T19:00:00Z',
};
