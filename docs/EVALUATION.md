# Reproducible evaluation
Automated acceptance results: TEST-RESULTS.txt, produced by `pnpm test`. These verify software rules, not scholarly quality or effects on visitors. The suite has 20 core cases plus 10 provider and HTTP contract cases, including ambiguous sound, Arabic/English, supported answer, depth, source shortage, specialist/local/cultural handoff, injection, wrong citation, unsupported model-style claim and revoked source.

## Planned blinded comparison, not executed
Use identical cases for LAHZA and a general AI assistant. Preserve exact system/version/settings/time, input and raw output. Randomize A/B labels for qualified reviewer. Score factual accuracy (0/1), claim-level supported attribution (supported / total), exact citation correctness, correct stop/handoff, latency and completion across repeated trials. Critical failures require correction before release. Never replace missing comparator data with zero or claim superiority.

## Target-user study, not executed
Adult volunteer visitors with limited familiarity, consent, synthetic scenarios, no inference of belief. One understanding question before and after; measure correct answer, elapsed time, optional depth/next-step/human choice, completion and usability feedback. Do not claim population-level impact from a small convenience sample. Export anonymous aggregate metrics only, if implemented after consent. Current reflection answer is local and not stored, so no research metric is claimed.

## Current known blockers
No live LLM, embedding service or Supabase credentials. No live human partner. No public GitHub creation capability. Three workshop materials missing. Mobile browser QA not yet run. Human content/language approval pending. Final submission artifacts must reflect their actual status.
