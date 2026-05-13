# Asgard — Current State (2026-05-13)

## Status: Active build | Progress: ~45%

## Live versions
| Worker | Version | URL |
|---|---|---|
| falkor-ui (PWA) | v9.33.0 | falkor.luckdragon.io + asgard.luckdragon.io |
| asgard-ai | v6.5.0 | asgard-ai.luckdragon.io |
| falkor-agent | v2.10.0 | falkor-agent.luckdragon.io |
| falkor-workflows | v3.13.0 | falkor-workflows.luckdragon.io |
| falkor-brain | v1.0.0 | falkor-brain.luckdragon.io |
| falkor-push | v1.1.2 | falkor-push.luckdragon.io |
| falkor-calendar | v1.2.0 | falkor-calendar.luckdragon.io |
| asgard-vault | v1.4.1 | asgard-vault.pgallivan.workers.dev |
| falkor-code | v1.5.0 | falkor-code.luckdragon.io |

## Infrastructure
- CF account: a6f47c17811ee2f8b6caeb8f38768c20
- 153 workers, 28 D1 databases
- Cost: ~$4-6/mo
- Vault PIN: 535554 | Paddy PIN: 2967

## asgard-ai tools (38 admin + agentic)
New this session: rate_doc, get_doc_ratings, drive_patch, docs_replace_text, docs_append_text, image/generate-and-store

## Falkor PWA
- v9.33.0, no Babel, pre-compiled JSX, loads ~1s
- Falkor dog mascot (Cavalier KC Spaniel) on login + loading + error screens
- FALKOR_MASCOT constant: 6 poses in Supabase generated-images/falkor-mascot/
- Auto-update: SW + version polling every 5min + on tab focus
- KNOWN: browser may have old asgard-workers cached — fix: incognito or clear site data

## Self-healers
- **falkor-code** (every 15min): smoke tests 11 probes + stale worker check. All probes now passing.
- **falkor-workflows watchdog** (every min): checks asgard-ai deployment ID vs vault canonical, redeploys from GitHub if overwritten
- **auto-handover** (21:30 UTC daily): writes session block to SESSION-HANDOVER.md

## Outstanding
1. longrangetipping.com.au — dns_activate task auto-completes once CF zone activates
2. Enable Docs/Sheets/Slides APIs in GCP project 205533966048
3. schoolstaffhub.com.au — VentraIP registration needed
4. Commit falkor-agent (history fix) + falkor-ui (v9.33.0) to asgard-source on GitHub
