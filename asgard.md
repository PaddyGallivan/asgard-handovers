# Asgard / Falkor — handover 2026-05-13

**Naming:** Asgard = platform. Falkor = AI agent brain. Don't conflate.

## Current state

**Progress: 65% of Asgard Final Build.**

### Core worker fleet (all healthy, verified 2026-05-13)
| Worker | URL | Version | Key capability |
|---|---|---|---|
| asgard-ai | asgard-ai.luckdragon.io | 6.5.0 | LLM router + 38 admin endpoints + agentic tool loop |
| falkor-agent | falkor-agent.luckdragon.io | 2.10.0 | Main chat orchestrator, calls asgard-ai /chat/smart |
| falkor-brain | falkor-brain.luckdragon.io | 1.0.0 | Vector memory (falkor-memory, 841 vecs, 384d) + D1 facts |
| falkor-workflows | falkor-workflows.luckdragon.io | 3.13.0 | Cron jobs, morning brief, smart alerts |
| falkor-ui | falkor-ui.pgallivan.workers.dev | 9.26.0 | Chat PWA (model picker + image gen + voice + vision) |
| asgard-tools | asgard-tools.pgallivan.workers.dev | 1.5.2 | /brief entry point, /version, /admin/projects |
| asgard-vault | asgard-vault.pgallivan.workers.dev | 1.4.1 | 69-key secrets store, X-Pin: 535554 |

### Vault (69 keys)
All API keys now centralised. AGENT_PIN = 535554 (standardised across all workers 2026-05-13).
Key names: CF_FULLOPS_TOKEN, CF_API_TOKEN, CF_TOKEN_LD, OPENAI_API_KEY, GEMINI_API_KEY,
GROQ_API_KEY, ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, TAVILY_API_KEY, SERPER_API_KEY,
GH_ADMIN_TOKEN, GITHUB_TOKEN, VERCEL_TOKEN, SLACK_BOT_TOKEN, DISCORD_BOT_TOKEN (+4 Discord),
LD_GOOGLE_REFRESH_TOKEN, GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN_ASGARD_AI,
RESEND_API_KEY, STRIPE_SECRET_KEY, CARNIVAL_PUBLISH_PIN, PADDY_PIN (2967), JACKY_PIN, GEORGE_PIN.

### asgard-ai admin endpoints (38 total, all PIN-gated via X-Pin: 535554)
**Workers:** /admin/deploy, /admin/worker-source, /admin/worker-settings
**D1:** /admin/d1/list, /admin/d1/query, /admin/d1/create
**KV:** /admin/kv/namespaces, /admin/kv/create, /admin/kv/get, /admin/kv/put, /admin/kv/list-keys
**R2:** /admin/r2/buckets, /admin/r2/create
**Pages:** /admin/pages/projects, /admin/pages/deployments, /admin/pages/retry
**Queues:** /admin/queues
**Workers fleet:** /admin/workers/list, /admin/workers/health-roll-call
**Project hub:** /admin/projects/list, /admin/projects/get, /admin/projects/update
**Vectorize:** /admin/vectorize/describe, /admin/vectorize/query
**GitHub:** /admin/github/commit, /admin/github/read
**Google:** /admin/google-probe, /admin/enable-google-api, /admin/oauth-broader-url
**Misc:** /admin/capabilities, /admin/cf-token-gaps, /admin/mirror-to-vault

### Falkor agentic loop (/chat/agentic)
Works with OpenAI models (gpt-4o-mini recommended, gpt-4o for harder tasks).
VERIFIED 2026-05-13: full read→edit→deploy loop tested on asgard-tools.
Tools available: get_worker_code, deploy_worker, get_secret, http_request,
drive_upload, drive_search, drive_read, github_get_file, github_write_file,
send_email, vercel_list_projects (+ more).

**Critical fix applied 2026-05-13:** get_worker_code and deploy_worker previously
called asgard-ai itself (self-call 522 loop). Now both call CF API directly.
deploy_worker preserves ALL bindings (including Vectorize/AI/D1) via versions API.

### Known gaps (need CF dashboard to fix)
1. Vectorize CRUD — no token with Vectorize Edit scope. Create CF_VECTORIZE_TOKEN.
2. DNS records — no token with Zone DNS Edit scope. Create CF_DNS_TOKEN.
3. Google Calendar API — needs OAuth re-consent (broader scope URL at /admin/oauth-broader-url).
4. falkor.luckdragon.io routes to falkor-tools (tool backend), not the chat PWA.
   PWA is live at falkor-ui.pgallivan.workers.dev.
5. schoolstaffhub.com.au — never registered (VentraIP order #2916516 rejected 2026-04-27).
   Re-place order with Aus ID.
6. longrangetipping.com.au — NS updated (coraline+renan), Vercel domains added.
   Waiting for CF zone to flip from pending to active (DNS records pending DNS token).

### Project hub
D1: project-hub-db (UUID 3708c025-cf0d-442a-a57b-67f2a304932f). 54 rows. ~160KB detail content.
Asgard Final Build = row id 65, status active, progress 65%.

### Infrastructure
Account: a6f47c17811ee2f8b6caeb8f38768c20 | Zone luckdragon.io: ca610439808e918e36072fb3f66d9640
152 deployed workers. ~$4-6/month total cost.

## Pickup protocol
1. Read this doc
2. Hit https://asgard-tools.pgallivan.workers.dev/brief?pin=535554 for live brief
3. Run smoke test: check /health on asgard-ai, falkor-brain, falkor-workflows, falkor-ui
4. Check project_hub row 65 for Asgard Final Build session notes

## Next sprint queue
- Tool palette in Falkor PWA (Drive/GitHub/Calendar/Email buttons)
- Memory inspector + conversation history sidebar in PWA
- Asgard hub launchpad at luckdragon.io
- Voice clone via ElevenLabs + morning brief cron
- Add Anthropic tool_use to agentic loop (currently OpenAI only)
- Resolve falkor-tools hollow routes or remove worker
- CF token creation for Vectorize Edit + Zone DNS Edit

## Session start protocol (updated 2026-05-13)
D1 `project_state` table is now live and auto-syncing — query it first for session context.

**Step 1 — D1 project state (primary context):**
```sql
SELECT current_state FROM project_state WHERE project_id='proj_asgard';
-- Sport Portal: project_id='proj_017'
-- Full project list: SELECT id, name, status FROM projects ORDER BY updated_at DESC
```
D1 asgard-prod: `b6275cb4-9c0f-4649-ae6a-f1c2e70e940f`

**Step 2 — Live brief:** `https://asgard-tools.pgallivan.workers.dev/brief?pin=535554`

**Step 3 — GitHub handover:** Read `SESSION-HANDOVER.md` + relevant project `.md` from `github.com/Luck-Dragon-Pty-Ltd/asgard-handovers`

**Step 4 — Smoke test:** `/health` on asgard-ai, falkor-brain, falkor-workflows, falkor-ui

**On wrap-up:**
1. Overwrite project `.md` in asgard-handovers
2. Prepend new block to `SESSION-HANDOVER.md`
3. `UPSERT INTO project_state` with current JSON blob
4. `INSERT INTO project_events` with session summary
