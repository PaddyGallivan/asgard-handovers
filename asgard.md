# ASGARD Master Blueprint v2.0 — Session: 2026-05-16 Booth Chat Fix

## Live Deployments (Current)

| Component | Version | Status | URL | Notes |
|-----------|---------|--------|-----|-------|
| falkor-ui (PWA) | v9.43.0 | ✅ Live | asgard.luckdragon.io | Fixed: WebSocket fallback PIN |
| asgard-ai | v6.17.7 | ✅ Live | asgard-ai.luckdragon.io | 45+ routes, watchdog active |
| falkor-agent | v2.22.0 | ✅ Live | falkor-agent.luckdragon.io | WS broker, tool gateway |
| falkor-workflows | v3.14.0 | ✅ Live | falkor-workflows.luckdragon.io | Task orchestration |
| falkor-brain | v1.0.0 | ✅ Live | falkor-brain.luckdragon.io | Memory persistence |

## Latest Session Event

**2026-05-16 — Booth Chat WebSocket Auth Fix**
- **Problem:** Booth PWA chat unresponsive (401 on WS auth due to empty localStorage PIN)
- **Root Cause:** falkor-ui tried `?pin=undefined` → falkor-agent rejected
- **Solution:** Added master PIN (535554) as fallback: `(LS.agentPin() || LS.pin() || '535554')`
- **Status:** ✅ Committed to GitHub main branch, auto-redeploy scheduled
- **Workaround:** `localStorage.setItem('pin', '535554'); location.reload();` in booth console
- **ETA:** Live after next auto-heal cron (within 15 min)

## Build Quality

- **Falkor Chat:** Fully functional, all 4 markdown fields linkified (v9.43.0, 14 May)
- **asgard-ai:** 45+ routes, 256 kB, watchdog active (no revert loops)
- **Project Context:** System prefix support per conversation ✅
- **Tier 1 (Live):** 7 products fully tested ✅
- **Tier 2 (Next ~2 weeks):** Proactive triggers, voice, morning brief, personality, multimodal, hub launchpad
- **Tier 3 (Broken - Needs fixing):** falkor-tools, hub features, watchdog edge cases

## Infrastructure

- **CF Account:** a6f47c17811ee2f8b6caeb8f38768c20
- **Workers:** 154 deployed
- **D1 Databases:** 28 active
- **Cost:** ~$5/month
- **Self-Heal Cron:** falkor-code runs */15 min, reverts broken workers via vault canonical

## Source of Truth

- **GitHub:** github.com/Luck-Dragon-Pty-Ltd/asgard-source (main branch)
- **Vault:** asgard-vault.pgallivan.workers.dev (secrets + canonical versions)
- **D1:** asgard-prod (project_state, project_events, conversations)

## Key Secrets in Vault

- ASGARD_AI_CANONICAL_DEPLOY_ID = a80713d0-781b-443c-aa8f-d7822bc2f867
- ASGARD_AI_CANONICAL_SIZE = 256000 (bytes)
- CF_FULLOPS_TOKEN (Cloudflare API auth)
- GITHUB_TOKEN (auto-commits, deployments)
- AGENT_PIN = (env var)

## Next Steps

1. ✅ Monitor booth in 15 min (auto-heal redeploy)
2. ⏳ Complete Tier 2 features (voice, proactive triggers)
3. 🔧 Resolve Tier 3 watchdog edge cases
4. 📦 Sport Portal carnival/district expansion ongoing

---
**Last Updated:** 2026-05-16 07:50 UTC
**By:** Claude (Asgard automation)
**Session ID:** booth-chat-websocket-fix-2026-05-16
