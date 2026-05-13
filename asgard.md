# Asgard — Current State (2026-05-14)

## Status: Active build | Progress: ~50% | Self-heal revert-loop CLOSED

## Live versions
| Worker | Version | URL |
|---|---|---|
| falkor-ui (PWA) | v9.33.0 | falkor.luckdragon.io + asgard.luckdragon.io |
| asgard-ai | v6.5.0 (238,256 B) | asgard-ai.luckdragon.io |
| falkor-agent | v2.10.0 | falkor-agent.luckdragon.io |
| falkor-workflows | v3.13.0 | falkor-workflows.luckdragon.io |
| falkor-brain | v1.0.0 | falkor-brain.luckdragon.io |
| falkor-push | v1.1.2 | falkor-push.luckdragon.io |
| falkor-calendar | v1.2.0 | falkor-calendar.luckdragon.io |
| asgard-vault | v1.4.1 | asgard-vault.pgallivan.workers.dev |
| falkor-code | v1.5.0 | falkor-code.luckdragon.io |

## Infrastructure
- CF account: a6f47c17811ee2f8b6caeb8f38768c20
- 154 workers, 28 D1 databases
- Cost: ~$4-6/mo
- Vault PIN: 535554 | Paddy PIN: 2967

## asgard-ai canonical state (THE FIX from 2026-05-14)
Three versions had been fighting each other across chats:
- GitHub source was 244,876 B (latest pushed code from another chat, never deployed)
- Live deployment was 238,256 B (the clean post-session-9 version)
- Vault canonical_deploy_id was `cb8d4bc1...` / canonical_size 227,737 B (an older revision)

Every minute the falkor-workflows watchdog compared live vs vault canonical, fetched GitHub source, redeployed, and updated canonical to its own redeploy. So any chat's change to asgard-ai was reverted ~14 min later (watchdog throttle).

**Resolution:** adopted current live as truth.
1. Pushed live asgard-ai bytes → GitHub `Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js` (commit `383c61d3`)
2. Vault `ASGARD_AI_CANONICAL_DEPLOY_ID` = `89867dc1-b568-4dd4-ad65-4d686fac140c`
3. Vault `ASGARD_AI_CANONICAL_SIZE` = `238256`
4. Cleared watchdog throttle stamp in KV (`ASGARD_KV / watchdog:asgard-ai:last-check`)
5. Verified: live ID == canonical ID == GitHub source size. System at rest.

**Going forward, to change asgard-ai without the watchdog reverting:**
- Commit the new bytes to `asgard-source/workers/asgard-ai.js` FIRST
- Deploy to CF
- PUT the new deployment_id into vault `ASGARD_AI_CANONICAL_DEPLOY_ID` (and size into `_CANONICAL_SIZE`)

Without step 3, the watchdog will redeploy from GitHub (which now matches anyway, so it's a no-op churn instead of a hostile revert).

## Self-healers map (audit)
- **falkor-workflows watchdog** (cron `* * * * *`, throttled to once per 14 min via `ASGARD_KV` stamp): heals asgard-ai by reverting any deploy that doesn't match `ASGARD_AI_CANONICAL_DEPLOY_ID` in vault, using GH `asgard-source` as source of truth. Uses `GH_ADMIN_TOKEN` from vault. ON.
- **falkor-code self-heal** (cron `*/15 * * * *`): asgard-ai entry has `autoHeal: false` — it monitors but does NOT redeploy asgard-ai. Other workers may have autoHeal: true.
- **auto-handover** (cron `30 21 * * *`): writes daily session block to SESSION-HANDOVER.md.

## asgard-ai tools (38 admin + agentic)
rate_doc, get_doc_ratings, drive_patch, docs_replace_text, docs_append_text, image/generate-and-store, plus the standard chat/agentic loop tools.

## Falkor PWA
v9.33.0, no Babel, pre-compiled JSX, ~1s load. Falkor dog mascot on login + loading + error. FALKOR_MASCOT constant: 6 poses in Supabase generated-images/falkor-mascot/. Auto-update via SW + 5-min version poll + tab-focus poll. Known: browsers may serve old asgard-workers cache — fix by incognito or clearing site data.

## Outstanding (carried over)
1. longrangetipping.com.au — `dns_activate` task auto-completes once CF zone activates
2. Enable Docs/Sheets/Slides APIs in GCP project 205533966048
3. schoolstaffhub.com.au — VentraIP registration needed (ID verification)
4. Calendar API consent — `/admin/oauth-broader-url?pin=535554`
5. CF tokens — Zone DNS Edit + Vectorize Edit for remaining zones
6. Asgard Final Build — Tier 2→1 promotion list, Tier 3 triage, 52 workers without `/health` to decide on
