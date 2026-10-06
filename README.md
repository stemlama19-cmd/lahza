# لَحْظَة | LAHZA 0.6.13

A bilingual web app using source-verified sentences supplied by the project owner.

Live site: https://lahza-discovery.stemlama.chatgpt.site
Direct question-impact page: https://lahza-discovery.stemlama.chatgpt.site/judge

Opening the app now keeps the welcome screen visible until the visitor explicitly continues or skips it, including on return visits. Saved language, interests and local records are retained; returning visitors continue in one step. `/judge` remains directly accessible.

The 0.6.12 welcome artwork frames the visitor and host with a responsive SVG viewport, excluding the original empty text panel. The original image, welcome copy and navigation behavior are unchanged.

## 0.6.13 transparency update

Discovery and chat show a permanent, non-dismissible AI disclosure above each writing field in Arabic and English, with a 16px default font and accessible field descriptions. The disclosure also remains on discovery states without a writing field. The model, evidence gates and religious content are unchanged. Three requested published-chat checks used the live gpt-4.1 model on 6 October 2026: two matched the expected behavior and the personal-fatwa question partially matched (abstention without referral). Raw answers, timestamps and production request IDs are recorded in `docs/release-0.6.13/`. These three checks do not replace the full 28-case regression or a browser walkthrough.

## Current behavior

- **0.6.10 curiosity and personal meaning:** The listening entry offers an optional before reflection. At the recording’s end, “What is behind these words?” opens the existing approved Spiritual / Values / Character claims, unchanged, with sources collapsed. The same action is available beneath the lyrics before playback ends. After exploring meaning, the visitor may write an optional after reflection and keep a learning stamp. Other approved moment details also offer this personal-memory flow.
- Before/after reflections are explicitly device-local, stored under `lahza-personal-moments-v1`, never submitted to the model. The passport reopens the latest card per moment/city (up to 30). Refresh preserves it; Clear my data removes it. A failed save preserves the entered text and reports the failure. Closing an unsaved edit discards that edit.
- A souvenir image uses the existing imaginary skyline, selected city, moment, visitor reflection and learning stamp. The visitor generates a PNG, previews it and downloads it with a normal download link. Personal writing is clearly labelled and is never marked source-verified. Text is limited to 360 characters per answer; export height grows to fit wrapped text.
- Arabic and English remain the two working languages. Français, 中文 and اردو appear in onboarding and Settings with **Coming soon** badges. Tapping one explains that it is planned and keeps the current language. No French, Chinese or Urdu content translation is claimed.

- 0.6.8 adds an on-demand, bundled MP3 adhan recording with a lyrics-style player in the existing navy/gold palette. In 0.6.10, “Listen and discover its meaning” first offers an optional before-listening reflection. Both listening buttons in that sheet call audio.play() synchronously from the visitor’s click. All seven supplied Arabic phrases remain scrollable, with the current phrase highlighted by the audio clock and a 15-occurrence repeat counter. A fixed /api/adhan-audio endpoint serves byte ranges from the bundled asset for browser seeking. Play/pause, seeking, phrase selection, previous/next, restart and volume controls are included; closing pauses playback.
- 0.6.9 replaces the recording with Ali ibn Ahmad Mulla's approximately 3:18 adhan, identified with Makkah's Haram in the source catalogue. The Kiwifu/adhan-mp3 collection states availability for Islamic apps; this is not a CC0 claim. The MP3 is byte-identical to the pinned source. Credits, provenance limitations, source/availability links and the new approximate phrase cues are documented in data/adhan-recording.json and docs/SOURCES-LICENSES.md. Audio is versioned to avoid reusing the previous cached recording.
- English translations accompany each phrase. A persistent explanation panel shows the current supplied English translation or the supplied overall Arabic explanation (adhan-words). Separate Arabic explanations for each phrase were not supplied. Sources remain collapsed under Learn more. No religious text or model logic changed.
- Official external media links from 0.6.7 remain in Explore and moment details: Quran TV on Aloula, its official YouTube channel, the Presidency’s Friday-sermon archive and translations. These open in a new tab and are separate from the on-demand recording. Nothing plays automatically on page load or at prayer times. No recording transcript enters model retrieval. External destination pages were checked on 2026-10-06; visitor-browser playback has not been verified.

- Real time is the default. Onboarding has two steps, language and interests, with Continue fixed at the bottom of step two. There is no mode-selection step.
- Earlier preferences migrate to real time while retaining language, interests and city. A later deliberate preview choice stays selected until changed.
- Below the first screen, “Preview today's moments / استعرض لحظات اليوم” opens optional pinned previews labelled “Preview / معاينة”. “Return to now / العودة إلى الآن” restores real time.
- Between prayers, the scene shows the next prayer and remaining duration, then opens the adhan listening player.
- The first screen has a full-width original SVG city and minaret, with dawn, day, afternoon, sunset and night palettes tied to the selected city’s clock. Before a call its glow increases over ten minutes; at a calculated call time two slow ripples appear. A compact curiosity entry above the skyline offers “I heard something” and “I saw something”, both opening the existing text-description discovery. The city/time, heading, question and listening button precede the secondary timeline, sourced text, questions and previews.
- The welcome screen reuses the illustration from the owner-supplied pitch at the owner’s request. Its provenance is documented, but no separate third-party license is asserted. Newly earned stamps drop briefly and flash gold. Motion respects prefers-reduced-motion.
- The player preserves the supplied repetitions 4,2,2,2,2,2,1, totaling 15 audio cues. Reduced-motion preferences disable smooth lyric scrolling.
- Now, Explore, the first learning journey and earned learning stamps work in Arabic and English. Arabic interface numbers use 0–9; English prayer names have plain-language meanings.
- Journey stops use five different claims in order: `adhan-purpose`, `adhan-words`, `wudu-what-1`, `iqamah-what-1`, `jamaah-what-1`, then a sixth stamp stop. The quiz uses claim two and the final matching prompt uses claim five.
- Empty chat suggests three questions backed by eligible supplied claims. Meaning and impact questions retrieve the supplied meaning claims. An ambiguous follow-up can refer to the last source-backed answer; explicit new topics take precedence. Discovery, the selection-only model prompt and output validation remain unchanged.
- Guided-tour booking is now a complete, labelled prototype: city-based catalogue → tour and guide specialty → date/time, language and guests → review → ticket. Ten proposed experiences cover the five available cities. The conversation card opens only when explicitly requested elsewhere; its question can be optionally attached to the booking.
- Prototype tickets have a unique reference, persist on this device, and can be reopened, downloaded as printable HTML, rescheduled or cancelled. Dates and programmes are demonstration data; no payment or real partner reservation is made. See [the booking flow and destination sources](docs/BOOKING-PROTOTYPE.md).
- Legacy visit stamps are excluded from the visible/exported passport. Prototype tickets do not award real visit stamps. Old booking links open the new catalogue; ticket links open saved tickets.
- Moment detail URLs include the moment and branch, restoring the selected content after refresh, including prayer-time details.
- `/judge` renders “أثر السؤال” in server HTML and skips onboarding. Meta description is exactly `Explore moments with source-verified content`.

See [the capability table](docs/CAPABILITIES.md) and its [CSV](docs/capabilities-0.6.10.csv).

## Content and model boundaries

`data/moments-batch1.json` matches the owner-supplied `lahza_moments_batch1 (2).json` byte for byte (SHA-256 `dd042548837cf9f9afb93e02c7dbbd9555be57284ef81fd3b8532d1487e97664`). It contains 44 claims: 29 approved, 13 approved_with_edits, one rejected and one needs_source. Exactly 42 are eligible, including 15 new meaning claims. Eligibility depends on reviewStatus and valid linked sources; old note fields do not override it. Neither public nor review-mode responses expose the two excluded claims.

Each moment card puts its supplied `-meaning` branch after the scene description. Spiritual / Values / Character labels come from displayGuidance.labels. Quotation marks and all words remain verbatim; quoted spans are bold. Book names, numbers and the source-verification badge are inside initially collapsed Learn more sections. Links open their supplied source in a new tab. Source matching is not scholarly approval; interpretiveLink is preserved as supplied metadata.

Chat retrieval prioritizes a named moment’s new meaning claims when the visitor asks about meaning or impact, or selects that branch. It still uses only eligible evidence, the existing selection-only model prompt and exact-text citation gate. The chat endpoint now accepts the last answer’s canonical claim IDs and preceding question as bounded context, reconstructing religious evidence from the supplied file. Invalid, excluded or mixed-moment context is ignored; a refusal clears context. The discovery backend, selection-only system prompt and exact-text validation gate are unchanged. A failed request shows one service-unavailable message without clarification questions. Retry reuses the original request without adding another question bubble. UI version is 0.6.12; chat remains 0.6.5 and unchanged discovery endpoints retain their earlier engine-version labels.

No image/recording recognition, live partner bookings, operational guided visits, payments, accounts or cross-device sync is implemented. The complete booking and ticket interaction is a labelled prototype. Personalized purpose text was not supplied and remains hidden.

## Prayer times

The clock uses adhan 4.4.3, CalculationMethod.UmmAlQura and the selected city time zone. Isha uses 120 minutes in Ramadan and 90 otherwise. Iqamah and prayer intervals are estimates, not verified mosque schedules.

For Riyadh on 2026-10-06, coordinates 24.7136, 46.6753, the app calculates Fajr 04:29, Dhuhr 11:41, Asr 15:03, Maghrib 17:35 and Isha 19:05, in Asia/Riyadh.

**Official comparison remains pending.** The official page returned HTTP 500 and its indexed content was dated 2026-09-15. No official values for 2026-10-06 were obtained, so no minute differences are asserted. The app uses local calculations, not an official daily data feed. See [the record](docs/release-0.6.3/prayer-times.json).

Official source: https://www.ummulqura.org.sa/ar/prayer-times/riyadh

## Privacy

The model key is a Sites runtime secret and is excluded from client code, source archives and logs. The env template has empty placeholders. Requests use store:false, which does not establish zero provider retention. Audit logs record status, duration and request IDs, not conversation text.

Preferences, progress, learning stamps, the conversation card, prototype tickets and booking drafts, and up to 200 interaction records stay on the device. The city is selected manually. Prototype booking details are not sent to an external party. Clear my data removes current and legacy local records, resets in-memory journey progress and conversations, removes prototype tickets and drafts, and cancels pending requests. Late responses cannot recreate cleared records.

## Validation

The 0.6.11 welcome fix passed eight focused component-event checks and TypeScript validation. Tests cover fresh/returning visits in Arabic and English, explicit continuation, retained data, reload, clearing data, deep links and direct `/judge` access. Run `node scripts/test-v0611-welcome.mjs`; results are in `docs/release-0.6.11/`. These are controlled local checks, not browser or live-model verification.

For 0.6.9, run node scripts/test-v069-recording.mjs for the replacement recording and current cue timeline. The unchanged audio endpoint's HTTP checks are reusable with python3 scripts/verify-audio-http.py after building. No human listening, actual browser playback or visual capture is claimed. Technical decoding, source attribution and automated phrase recognition cannot certify subjective clarity.

The 0.6.8 player passed 10 focused checks: real MP3 decoding and duration/hash, approved cue order and repetitions, user-action playback initiation, audio-clock highlights and seeks, transport controls, pause on close, stale-promise protection, recoverable play denial, bilingual supplied text, and the unchanged content-file hash. Run node scripts/test-v068-player.mjs; results are in docs/release-0.6.8/player-checks.json. Component tests use controlled media events, not an actual browser speaker. Run python3 scripts/verify-audio-http.py after a production build to check MP3 delivery, MIME type and byte-range seeking against the local built Worker. The built Worker passed full delivery/hash, byte-range, two-byte probe, open-ended/suffix range, invalid-range, HEAD and If-Range checks; see docs/release-0.6.8/audio-http-checks.json. Browser sound-output, visual capture and human listening verification remain pending because the required managed-preview browser skill is unavailable.

A follow-up audit on 6 October 2026 passed 56 deterministic checks, 19 core component-handler checks, and all 12 booking checks (87 total). The fresh production access attempt was blocked at HTTP 403 / 1010; the required managed-preview control-browser skill remains unavailable. Recent native production logs show page/content HTTP 200 responses, with no observed model call in the sampled hour. Results: `docs/release-0.6.6-audit/`. The welcome shortcut is now “تجاوز المقدمة / Skip introduction”. Meaning headings and suggested questions now display “ماذا تعني هذه اللحظة للمسلمين؟ / What does this moment mean to Muslims?”; the uploaded claim file and model backend are unchanged.

The 0.6.6 booking update passed 12 focused component-handler and booking-function checks in `docs/release-0.6.6/booking-checks.json`. Reproduce with `node scripts/test-v066-booking.mjs`. These cover the full Arabic/English flow, persistence, rescheduling, cancellation, failure handling, download HTML, validation, catalogue city filtering and unchanged religious/model files. This is controlled local execution, not a browser walkthrough.

The 0.6.5 local checks passed: 56 deterministic content/render/retrieval/API checks, and 21 component-handler interaction checks. They cover the unchanged 42 eligible claims, 15 meaning claims, ten bilingual contextual follow-ups, explicit topic changes, source-gate rejection, retry without duplication, detail restoration, journey reset and a late-response race guard. The interaction runner uses controlled hooks, storage, UI primitive wrappers and injected network responses. It is not a browser walkthrough. The historical harnesses target the corresponding source version: `node scripts/test-v065.mjs` and `node scripts/test-v065-ui.mjs`; results are in `docs/release-0.6.5/`.

The unchanged passport-export function also generated 1080×1350 PNGs in both languages using a native Canvas adapter and a substitute font. This checks PNG creation, not browser downloads, native sharing, or the production font. Type checking and a production build are required before publication.

Historical 0.6.1 live-model tests are retained. **No new live-model run is claimed for 0.6.5 or the booking-only 0.6.6 update.** Direct production requests from this execution environment were blocked (HTTP 403 / 1010); the required browser-control skill was unavailable. This access limitation is not evidence of a Site outage. A fresh live discovery/chat run, including the original 28 cases, remains pending.

The short-screen scene uses a compact copy area and keeps secondary content below the first viewport. **Visual measurement at 700px, the ten bilingual sky screenshots and the earlier seven requested captures remain pending:** the available browser could not resume and a separate local renderer could not be installed. No earlier screenshot is presented as evidence of this release.

## 0.6.10 verification

28 local checks passed: 12 reflection/language/export/content checks, 11 player checks, and 5 parent-app interaction checks. Reports are in `docs/release-0.6.10/`; run `node scripts/test-v0610-experience.mjs`, `node scripts/test-v0610-player.mjs`, and `node scripts/test-v0610-app.mjs`. The PNG test uses native Canvas with a substitute font and does not prove a browser download. These are **not** the 28 original live-model cases. Browser visual checks, human listening and a fresh live-model run remain unverified. Religious claim data and model logic are unchanged. Type checking passed; the publication workflow validates the production build.

## Development and source

Use the pinned pnpm version and Node 22.13 or newer. Install from the lockfile, configure the provider privately using .env.example, then use pnpm dev and pnpm typecheck.

`python3 scripts/package-source.py` creates `public/downloads/lahza-source-v0.6.10.zip`, excluding secrets, visitor records, hosting identity and nested archives. Sites Git is the canonical source. The public mirror at https://github.com/stemlama19-cmd/lahza was last verified for 0.6.2 and needs the new source uploaded separately.

The saved 0.4.11 release remains available under the previously authorized rollback condition. Development-only /qa pages are unavailable in production. The existing imaginary-mosque illustration appears in adhan details and the journey; Now uses a new code-drawn SVG skyline; asset credits are in docs/SOURCES-LICENSES.md.
