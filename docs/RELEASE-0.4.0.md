# LAHZA 0.4.0 · 5 October 2026

## Changes
- Short answer controls for bank questions, while preserving typed replies and uncertainty.
- Evidence appears in the confirmation sentence before the tentative event name.
- At most one revision after a rejection with new information; a second rejection stops. Model output must match the current state's allowed decision set.
- Three clear explanation topics replace repeated depth controls.
- Human-readable conversation card with editable remaining question, HTML download and browser print/PDF. Escaping prevents visitor text from becoming active HTML.
- Explanation calls preserve returned provider model/request IDs; all model calls specify store:false.
- About/source page and a sanitized public source archive with current setup instructions.
- Narrow-screen control wrapping, accessible modal focus, printable card and minimum touch targets.

## Verification
- 30 existing retrieval/API tests and 22 mocked discovery/contract tests passed. These include new revision guard, observed evidence ordering, provider metadata and escaped card export.
- Real-model smoke script successfully reached production v0.3.8: two clarification questions then tentative adhan confirmation and all three source-checked topics; the shop recitation scene stopped after two questions without adhan confirmation. Exact synthetic transcript: `LIVE-SMOKE-0.3.8.json`. A post-deployment run will check v0.4.0.
- Managed mobile browser inspection unavailable because the required control-browser capability is not exposed. CSS/type checks do not establish real-device compatibility.
- No invented scientific review, workbook results, visitor study or comparative scores.

## Required external checks
1. Named scholarly/language reviewer approves or corrects the four claims and question bank, recording date and scope.
2. Run the smoke script from a network that reaches the site, or complete the two scenes in the browser and export My journeys.
3. Inspect Arabic and English at 320/390px and on a real phone: input, quick answers, confirmation, all topics, source links, card scrolling and PDF.
4. Create the required public team repository and upload the source archive. A source-download URL is not a repository URL.
5. Complete the agreed independent scenario evaluation before claiming an accuracy figure.
