# Sources and licenses
Knowledge pack v1 uses authenticated hadith collections referenced in the submitted pitch. Publisher approval or a formal scientific endorsement of LAHZA is not claimed.

| ID | Reference | URL | Use |
|---|---|---|---|
| BUK-631 | Sahih al-Bukhari 631; book 10 hadith 28 | https://sunnah.com/bukhari:631 | Call when prayer time begins; caller within the group |
| MUS-385 | Sahih Muslim 385; book 4 hadith 14 | https://sunnah.com/muslim:385 | Selected phrases and listener response |

Cross-check for Bukhari: https://hadeethenc.com/ar/browse/hadith/3059 and its English page. Retrieved 2026-10-04. This page is not a new source for unrelated claims.
Ancient Arabic texts are represented by short excerpts with omissions explicit. English UI explanation is original project paraphrase, not a certified translation. No Quran translation is included yet; future Quran moment must use King Fahd Complex material as specified in the pitch, with reuse terms recorded. No bulk scraping or full modern translations bundled. Linking and source checking do not imply a license to copy publisher databases. Human scientific and linguistic reviewers remain unassigned; reviewed_at=null. Prototype inclusion means only that a published reference has been checked, not expert signoff.

Original submission and guide remain unmodified team/reference materials in baseline records; do not infer permission to redistribute third-party guide in a public repo. Exclude it from public release until reuse permission is confirmed.
React/Next.js/TypeScript/Vite: MIT; Vinext: see installed package LICENSE; Lucide: ISC. Dependency lockfile pins actual versions; package copyright and licenses remain with authors. Tajawal and DM Sans use Google Fonts, SIL Open Font License. No paid illustrations or copied logos. Before 0.6.8 no adhan audio asset was bundled; the new recording and license are documented below.
Team retains project code rights; no blanket license granted to source publishers' material. Specify a team-approved code license before public release.

## UI artwork added 2026-10-04
- `public/art/lahza-arch.jpg`: original raster background extracted losslessly from submitted pitch page 1. No illustration recreated; user specifically requested this reference's visual language. It is not an Icons8 asset.
- `public/art/ouch-mosque.png`: Icons8 Ouch, **Bitmap**, Mosque. Source: https://icons8.com/illustrations/illustration/bitmap-mosque . Official anonymous `png-low` download served by Icons8's public download operation. 368×194 pixels, suitable for the small 230px UI illustration. Watermarked previews were inspected and excluded.
- `public/art/ouch-night-city.png`: Icons8 Ouch, **Scenes**, Night city lights background, Polina G. Source: https://icons8.com/illustrations/illustration/scenes-night-city-lights-background . Official `png-low` download. Decorative general city background, not identified as Riyadh or used as factual evidence.
- Visible clickable footer credit: “Illustrations by Icons8 Ouch” on the page where used. Official free-use guidance: https://icons8.com/license . Governing license: https://intercom.help/icons8-7fb7577e8170/en/articles/5534926-universal-multimedia-license-agreement-for-icons8 . Keep credit and follow current terms; do not redistribute assets as a standalone asset pack. No watermark removed, no paid original accessed.
- Headings: Tajawal Arabic / DM Serif Display English. Body: Tajawal Arabic / Manrope English, Google Fonts under SIL OFL. Functional iconography: Lucide. New custom favicon is original simple compass geometry, not an Icons8 asset.

## 0.6.2 artwork replacement, 2026-10-06
The Now card uses `public/art/neutral-mosque-medallion.png`, created with the built-in OpenAI image generation tool in one request, without reference images. It is an imaginary generic mosque in navy/gold/ivory, not a representation of Riyadh or any named landmark. Prompt: generic invented mosque medallion, dome, doorway and one minaret, stylized drawing, transparent background, no text, people or logos. No third-party license or exclusive rights are asserted for this generated asset.
The prior Icons8 Mosque is listed by its publisher as a Bitmap illustration. Icons8 free-use guidance requires attribution links; the previous UI included them. Its appearance was nevertheless inappropriate for an unspecified Riyadh scene. The current Now card no longer uses that asset. Historical assets and credits remain documented above.
Verification: https://icons8.com/illustrations/illustration/bitmap-mosque and https://icons8.com/license, checked 2026-10-06.

## 0.6.3 scene and welcome, 2026-10-06
`components/sky-scene.tsx` is an original, code-drawn SVG silhouette made for this release at the owner’s explicit request: generic buildings and a minaret, no source image and no named landmark. The five sky gradients, glow and ripples are CSS/SVG.
The welcome screen reuses `public/art/lahza-arch.jpg` at the owner’s express request of 2026-10-06. Its recorded provenance is the owner-supplied pitch, page 1. The record does not identify a separate artwork license or establish third-party ownership clearance; this release does not claim otherwise.

## 0.6.7 official external media, 2026-10-06
The owner requested Haram adhan/Friday-sermon media or links to a broadcasting channel. These are ordinary outbound links, not downloaded, copied, rebroadcast or synchronized recordings. No recording license or partnership is asserted. All rights remain with the publishers. The UI marks the media as external; the claim verification badge is not applied to it. Media is not ingested into the claim pack or model context.

| Destination | Official source | Use |
|---|---|---|
| Quran TV live, Arabic | https://aloula.sba.sa/live/quran | Opens Aloula’s live Quran TV page; adhan is heard according to the broadcaster’s schedule in Makkah, not on demand |
| Quran TV live, English | https://aloula.sba.sa/en/live/quran | Same channel, English page |
| Official Quran TV YouTube channel | https://www.youtube.com/@SaudiQuranTv | Alternative channel link, explicitly linked from https://sba.sa/ (redirects to https://sba.sa/ar) |
| Friday-sermon archive | https://prh.gov.sa/ar/component/content/article?Itemid=461&id=274 | The official Presidency page separates Grand Mosque and Prophet’s Mosque sermons; Grand Mosque section appears first |
| English and other translations | https://services.prh.gov.sa/en/khotab_makka.php?mode=makkah | Official Grand Mosque sermon translation page, including English |

All destination pages and the official-channel attribution were inspected on 2026-10-06. Browser audio/video playback was not verified. No public stream URL is extracted or republished, and LAHZA does not control availability on the external services.

## On-demand adhan recording added in 0.6.8 (2026-10-06)

- Asset: public/audio/adhan-adam-synagda.mp3, approximately 154 seconds.
- Creator: Adam-synagda. Source: https://commons.wikimedia.org/wiki/File:Beautiful_adhan.ogg (Beautiful adhan.ogg, dated 29 April 2022; uploaded 1 May 2022).
- License: CC0 1.0, https://creativecommons.org/publicdomain/zero/1.0/. The source page states the creator's public-domain dedication. Attribution and the source link are retained in the player even though CC0 does not require attribution.
- The source does not establish a Haram location; LAHZA does not label this recording as a Haram recording or live broadcast.
- Conversion: original Ogg converted to mono 44.1 kHz, 96 kbit/s MP3; no trimming, speed change or phrase rearrangement.
- Original SHA-256: 35fe06b08fe80505c550c33fed8a783fa9901ddc81ac884958b4be048f5b2a79
- MP3 SHA-256: ece2eb55d81445325679a99071b2fd473f466f64c7433ffbb55804ec93dabdfd
- Fifteen approximate phrase cues link to the existing seven approved adhan-lines claims. Acoustic pauses and automated alignment informed the timings; human listening verification has not been completed. Approximate timing is disclosed in the recording details. No speech-recognition output becomes religious content or model evidence.
- The displayed Arabic words, repetitions, English translations and Arabic overall explanation are unchanged owner-supplied claims. No new religious explanation was authored for this player.

## Current adhan recording: 0.6.9 (2026-10-06)

- Performer: Ali ibn Ahmad Mulla (علي بن أحمد ملا), associated with Al-Haram Al-Maki in the source catalogue.
- File: public/audio/adhan-haram-ali-mulla.mp3, 198.164898 seconds, 128 kbit/s, stereo 44.1 kHz.
- Source: https://github.com/Kiwifu/adhan-mp3/blob/b9180a2bb769f74cff8e378ef2cc7aaf8db5cd5b/Ali_Ibn_Ahmad_Mala_HQ.mp3
- Collection: Kiwifu/adhan-mp3, which explicitly describes the collection as free for Islamic apps, prayer-time software, and personal use: https://github.com/Kiwifu/adhan-mp3
- This is reliance on the collection's stated availability, not a CC0 or Creative Commons license claim. The repository does not provide a separate formal recording license or complete original-publisher rights chain. The earlier recording's CC0 license does not transfer to this file. No association or endorsement by the Haram or performer is claimed.
- The file is copied byte for byte, with no editing, resampling, tempo change or audio generation. Original and deployed SHA-256: 2eeda3f5d3677d53ed8fae7ec3d51e066d0be60a6e0f4d4bdd7aa739afb9ac0e.
- Fifteen approximate cues preserve the supplied seven Arabic phrases and 4,2,2,2,2,2,1 repetitions. Pauses and local automated speech recognition informed alignment. Automated recognition output is not displayed or used as religious evidence. No human listening verification is claimed.
- User requested a Haram voice after finding the previous recording difficult to understand. The previous Adam-synagda asset is removed from the current player and source tree; historical release archives preserve their own credits.
- The Islamweb candidate was not redistributed because its published terms restrict public reuse. Wikimedia field recordings were investigated but not selected for this learning player.

## Souvenir skyline: 0.6.10

`public/art/lahza-skyline.svg` reuses the exact imaginary skyline path geometry from `components/sky-scene.tsx`, previously drawn in code at the owner’s explicit request. It adds a static version of the navy/gold sky for the personal souvenir. It is not a photograph or a depiction of a named landmark; no external asset or new third-party license is involved.
