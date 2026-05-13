# Asgard — Current State (2026-05-14)

## Status: Active build | Progress: ~52% | Cross-chat revert loop resolved

## Live versions
| Worker | Version | URL | Source of truth |
|---|---|---|---|
| falkor-ui (PWA) | v9.34 content (VERSION constant still reads '9.33.0' — file never bumped) | falkor.luckdragon.io + asgard.luckdragon.io | GH commit `087bd667` |
| asgard-ai | v6.5.0, 244,876 B, 44 routes | asgard-ai.luckdragon.io | GH commit `582afec9` |
| falkor-agent | v2.10.0 | falkor-agent.luckdragon.io | |
| falkor-workflows | v3.13.0 | falkor-workflows.luckdragon.io | |
| falkor-brain | v1.0.0 | falkor-brain.luckdragon.io | |
| falkor-push | v1.1.2 | falkor-push.luckdragon.io | |
| falkor-calendar | v1.2.0 | falkor-calendar.luckdragon.io | |
| asgard-vault | v1.4.1 | asgard-vault.pgallivan.workers.dev | |
| falkor-code | v1.5.0 | falkor-code.luckdragon.io | |

## Infrastructure
- CF account: a6f47c17811ee2f8b6caeb8f38768c20
- 154 workers, 28 D1 databases
- Cost: ~$4-6/mo
- Vault PIN: 535554 | Paddy PIN: 2967

## asgard-ai canonical state (2026-05-14 final)
- Vault `ASGARD_AI_CANONICAL_DEPLOY_ID` = `a80713d0-781b-443c-aa8f-d7822bc2f867`
- Vault `ASGARD_AI_CANONICAL_SIZE` = `244876`
- GH `Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js` = same 244,876 B bytes (commit `582afec9`)
- Live CF deployment version_id = same `a80713d0...` (244,876 B)

All three pointers identical. Watchdog returns healthy without redeploying.

44 routes including `/image/generate-and-store`, `/chat/agentic`, `/memory`, `/tts`, `/stt`, `/speak`, `/weather`, `/drive/*`, `/google/*`, `/discord/*`, `/slack/post`, `/telegram/*`, `/vercel/*`, `/github/*`, `/admin/errors`.

## How to change asgard-ai without it being reverted
1. Commit new bytes to `asgard-source/workers/asgard-ai.js` FIRST.
2. Deploy via `PUT /accounts/{acct}/workers/scripts/asgard-ai/content` (multipart, preserves bindings). Capture `version_id` from CF response or `/versions` endpoint.
3. PUT new `version_id` to vault `ASGARD_AI_CANONICAL_DEPLOY_ID`.
4. PUT new size to vault `ASGARD_AI_CANONICAL_SIZE`.

Skip step 3-4 and the watchdog (cron `* * * * *`, throttled to once per 14 min) will redeploy from GitHub at the next tick. Since GitHub matches live, that's a no-op churn instead of a hostile revert.

## Self-healers map
- **falkor-workflows watchdog** (cron `* * * * *`, 14-min throttle via `ASGARD_KV` key `watchdog:asgard-ai:last-check`): only asgard-ai. Source of truth = GH `asgard-source/workers/asgard-ai.js`. Uses `GH_ADMIN_TOKEN` from vault.
- **falkor-code self-heal** (cron `*/15 * * * *`): monitors ~16 workers. asgard-ai is `autoHeal: false` (monitor only). falkor-ui and most other falkor-* workers are `autoHeal: true` — they get redeployed from GH if probe fails. So falkor-ui changes also need to be in GH.
- **auto-handover** (cron `30 21 * * *`): writes daily session block to SESSION-HANDOVER.md.

## Going-in-circles symptom — root cause
Multiple chats deployed forward-progress versions to BOTH asgard-ai AND falkor-ui throughout 2026-05-13. Other chats then "fixed" perceived problems by reverting to the previous version, losing all the forward work. This was not a watchdog issue (the watchdog only affects asgard-ai). Examples on 2026-05-13:
- falkor-ui v9.34 deployed at 13:47 with userId fix, WS retry, productContext, capabilities grid, version footer → reverted to v9.33 at 13:58 ("clean") → forward to v9.35 at 14:02 (cache-bust) → reverted again to v9.33 at 14:03 ("causes reload loop"). Net: lost most of the feature work.
- asgard-ai memory_v2 patches + /image/generate-and-store committed at 12:12 (244,876 B) → smaller deploy at 12:48 (238,256 B) put live, lost the patches.

When the PWA called endpoints on the regressed asgard-ai that didn't exist (e.g. `/image/generate-and-store`), the browser dev console showed 404s — the "console using some asgard-ai" Paddy spotted. Now resolved by ro