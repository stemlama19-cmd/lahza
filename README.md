# لَحْظَة | LAHZA 0.6.2

A bilingual mobile experience using source-verified sentences supplied by the project owner.

Live site: https://lahza-discovery.stemlama.chatgpt.site

## Interface update 0.6.2

The Arabic countdown sits beneath the heading in its own column. Unsupported audio affordances are removed. Arabic interface numbers use 0–9. The third demo tab is shortened, with a visible scroll indicator. English prayer names have plain-language meanings at first appearance; the timeline uses Dawn, Midday, Afternoon, Sunset and Night. The content pack and model decision logic are unchanged from 0.6.1.

## Current behavior

- Now, Explore, first learning journey and earned passport stamps are enabled in Arabic and English.
- `data/moments-batch1.json` exactly matches the updated upload. Of 29 claims, 14 are `approved`, 13 are `approved_with_edits`, one is `rejected` and one is `needs_source`. Only the first two statuses are eligible. Historical `note` fields never override `reviewStatus`.
- Every displayed claim uses the exact supplied language text, the label “Verified against its source” / “مطابَق على مصدره”, and named external source links. No claim of scholarly approval is made.
- The text-only adhan reader uses the seven `adhan-lines` claims in their supplied order and repeats them 4,2,2,2,2,2,1 times, totaling 15 steps. No audio is played.
- Source-only chat selects eligible claim IDs; the server returns the exact supplied sentences and sources. It abstains when the supplied evidence does not answer the question.
- The original 0.4.11 discovery core is preserved, apart from version and audited transport. A separate layer handles the four additional supplied moments, with explicit conservative stops for meal washing and ordinary spoken announcements.
- Demo time stays pinned to the selected scenario. Real time uses device-side Umm al-Qura calculation for five Saudi cities; displayed iqamah intervals are approximate.
- A failed model request shows one service-unavailable message without clarification questions. `/judge` opens directly without onboarding.
- Learning progress, stamps, preferences and conversation cards are saved on the device. Booking, sample visits and tickets remain clearly marked demonstrations.

## Content limitations

Personalized purpose lines are not supplied, so that text is hidden. No religious sentences have been authored to fill the gap. No audio recording, image/audio recognition, real booking, payments, account system or cross-device sync is provided.

## Privacy and secrets

The deployed model key is configured as a Sites runtime secret. It is never put in client code, source archives or logs. `.env.example` contains placeholders only. Descriptions are sent to the configured model provider when needed using `store:false`; no provider zero-retention claim is made. Model audit entries record status, duration and request IDs, not conversation text.

The app keeps up to 200 interaction records in localStorage, plus preferences, progress, passport and card. Legacy history uses sessionStorage. Geolocation is requested only by an explicit user action, and coordinates are neither retained nor sent by the app.

## Validation

`docs/release-0.6.1/deterministic.json` covers exact content bytes, 27 visible claims, hidden exclusions, bilingual sources, adhan sequence, journey readiness, immutable demo scenarios, unavailable-provider behavior, the eight added recognition boundaries, and normalized equality of the three original discovery core files.

`live-before-publish.json` records the fresh 20 original + 8 supplied cases on 0.6.0 before publication. The post-publication live run and bilingual screenshots are delivered separately with the final 0.6.1 release log. Invalid test-transport attempts are retained separately and are not counted as product results. Automated testing is not scholarly review.

## Development and packaging

Use the pinned pnpm version and Node 22.13 or newer. Install from the lockfile, configure the provider privately using `.env.example`, then run `pnpm dev`. Checks: `node scripts/compile-qa.mjs`, `node scripts/test-v061.mjs`, `node node_modules/typescript/bin/tsc --noEmit`. The release check also compares against the exact uploaded pack and original git commit. Live tests read the historical 0.4.11 test log from the documented sibling input path and receive authorization only via hidden stdin.

`python3 scripts/package-source.py` produces `public/downloads/lahza-source-v0.6.2.zip`, excluding secrets, runtime data, hosting identity and nested download archives. The source repository is the existing private Sites Git repository.

The saved archive-backed 0.4.11 version remains available for authorized rollback. Its project/version IDs are recorded in `docs/release-0.6.0/rollback.json`. Development-only `/qa` renders bilingual screenshot frames and is unavailable in production.

Images: the Now card uses a newly generated illustration of an imaginary mosque, with no specific city or landmark. See `docs/SOURCES-LICENSES.md` for this asset and inherited asset credits.
