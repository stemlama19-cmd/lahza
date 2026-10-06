# LAHZA 0.3.0: discovery workflow

Challenge date: 4 October 2026. Parent source: cf34eb323891d304201bf5ca3c5dbaf439fc5287 (published visual version 2). Product scope: adhan explanations only. Human scholarly and language review remains pending.

## Implemented

- `POST /api/discovery`: real HTTP model integration for every valid discovery turn. No rules-based classifier or mock fallback in production. Requires a server-side OpenAI-compatible API key.
- Three structured decisions: ask, confirm, stop. Model selects Q1–Q8. App renders bilingual bank wording and its associated reviewed-for-wording rationale; the rationale is not a claim to expose internal model reasoning. Scientific review of the bank remains pending.
- Quoted evidence is checked against user messages, not assistant messages. This checks provenance, not semantic sufficiency. Confirmation uses a fixed tentative template. Free generated messages are not rendered.
- Signed, one-hour session state; two-question guard; repeated/unknown IDs rejected; accept/explain requires a signed confirmation. No extra inference attempt after malformed output. Invalid output, timeout, missing key and provider failure are technical errors, not successful abstention.
- After user acceptance of adhan, local lexical retrieval supplies the existing source-linked claims to a real model evidence selector. Citation gate checks selected claim IDs and exact supported paraphrases. No new free-form religious prose.
- `/judge`: original description, actual question, user reply, displayed text, successive decisions, quoted evidence, model and provider request ID when available. No automatic accuracy scores. Diagnostic errors are explicit.
- Last 20 conversations are stored in sessionStorage in the current tab. Transcript JSON and handoff-card JSON are created locally. No shared server transcript database, no live human booking. Browser session restore may retain sessionStorage; deletion is available in judge view.
- Existing sourced educational example remains available and is explicitly labelled as an example, never sound identification.

## Activation boundary

On inspection the Site runtime environment had no API key. OpenAI Developers was reported installed, but its required trusted `openai-platform-api-key` setup skill was absent from available executor/cloud skills and local skill files. No key was fabricated, exposed in chat, or provisioned through an improvised flow. Consequently no live model call has been verified in this delivery. API returns `503 model_not_configured` until a key is configured.

Configure `OPENAI_API_KEY` as a Site secret through the approved key setup flow (legacy `LLM_API_KEY` is also accepted). Optional server configuration: `LLM_MODEL` (default `gpt-4.1-mini`), `LLM_BASE_URL` (default `https://api.openai.com/v1`). Never use NEXT_PUBLIC_ for secrets. `/api/health` reports configuration, not a successful connectivity check. Do not interpret `discoveryModelConfigured` as live verification.

The supplied UI JSON was tightened into a strict schema plus server cross-field validation. API reference: https://developers.openai.com/api/docs/guides/structured-outputs . Model API is Chat Completions with `response_format.json_schema`, `strict:true`, `store:false`; provider retention policy is separate from `store:false`.

## Validation

`node scripts/test-discovery.mjs`: mocked provider contract and guard tests. These verify integration behavior without claiming model accuracy. `node scripts/test.mjs`: existing 30 checks. `node_modules/.bin/tsc --noEmit`: type check. Build via Sites build helper.

The 20-case development workbook has not been run against a live model. No performance percentages are claimed. Mobile/browser visual QA was unavailable because the required managed-preview browser skill was absent.

## Still pending

Safe API-key activation and live inference; live 20-case diagnostic cycle; independent comparison; Supabase/pgvector activation; scholarly/language approval; public GitHub repository; final presentation and video. These were not replaced with mocked demonstrations.
