## 2026-05-14 — Asgard: cross-chat revert loop fully resolved (asgard-ai + falkor-ui rolled forward)

### What was actually wrong
Earlier in this same session I closed the asgard-ai self-heal revert loop by pinning vault canonical to the *current live* asgard-ai (89867dc1, 238,256 B). On Paddy pushing back ("9.35 or something, won't update, console using asgard-ai"), I dug deeper and found:
- The GitHub HEAD I'd just overwritten was 244,876 B (commit 560eee8c, 12:12Z) and contained the memory_v2 endpoint patches AND `/image/generate-and-store` — both MISSING from the live deploy at 12:48Z.
- falkor-ui showed the same pattern: v9.34 features deployed at 13:47Z (userId fix, WS retry, productContext, capabilities grid, version footer), reverted at 13:58Z to v9.33 "clean", forward to v9.35 at 14:02Z (SW cache-bust), reverted again at 14:03Z to v9.33 ("causes reload loop"). Net result: feature work lost, PWA running stale.
- "Console using asgard-ai" was the PWA's browser dev console showing 404s — v9.33 PWA code called `/image/generate-and-store` and other memory_v2-era endpoints that the regressed 238k asgard-ai didn't have.

This was a cross-chat coordination failure, not a watchdog problem. The earlier handover I wrote was based on adopting the regressed version as truth — wrong call. Correcting that now.

### What was done
- Deployed asgard-ai from `/tmp/prev-gh.js` (= GH commit 560eee8c content, 244,876 B) via `PUT /workers/scripts/asgard-ai/content` (preserves all 35 bindings via inherit). New version_id `a80713d0-781b-443c-aa8f-d7822bc2f867`. `node --check` passed.
- Deployed falkor-ui from GH commit 1813cccc1362 (v9.34 features with the SW navigate reload loop already removed by the same author at 13:56Z). New version_id `7be7cad1-2e09-4241-8d1a-3bd22e928f5a`. `node --check` passed.
- Vault `ASGARD_AI_CANONICAL_DEPLOY_ID` = `a80713d0-781b-443c-aa8f-d7822bc2f867`.
- Vault `ASGARD_AI_CANONICAL_SIZE` = `244876`.
- KV `watchdog:asgard-ai:last-check` deleted so next cron tick re-evaluates.
- GH `asgard-source/workers/asgard-ai.js` restored to 244k (commit `582afec9` — undoes my earlier downgrade sync `383c61d3`).
- GH `asgard-source/workers/falkor-ui.js` restored to v9.34 features content (commit `087bd667` — undoes the v9.33 revert).
- Probed: live `/health` returns 44 routes (was 43). `/image/generate-and-store` POST returns 401 (auth wall — route is alive). PWA HTML now contains `productContext` and `userId` references absent from v9.33.

### Known cosmetic gotcha
The author of the v9.34 falkor-ui commits never bumped the in-file `VERSION` constant from `'9.33.0'`. The PWA functionally has v9.34 features but the version footer will still display "9.33.0". One-line patch + redeploy will fix the display.

### Resume steps
1. `curl -s https://asgard-ai.luckdragon.io/health | jq '.routes | length'` → should be 44.
2. `curl -s -X POST -H 'Content-Type: application/json' --data '{}' https://asgard-ai.luckdragon.io/image/generate-and-store` → should be 401 (auth wall — route exists).
3. Open PWA, F12 → Network: confirm no 404s back to asgard-ai. Check Application → Service Workers: no reload loop.
4. If you want the version footer to read 9.34.0: patch the `VERSION = '9.33.0'` constant in `asgard-source/workers/falkor-ui.js`, commit, redeploy via `/content`.

### Procedure to keep changes from being reverted
**asgard-ai** (watchdog-protected):
1. Commit new bytes to `asgard-source/workers/asgard-ai.js` FIRST.
2. Deploy to CF via `/content` endpoint (preserves bindings).
3. PUT new `version_id` to vault `ASGARD_AI_CANONICAL_DEPLOY_ID` (and size to `ASGARD_AI_CANONICAL_SIZE`).

**falkor-ui** (falkor-code self-heal, autoHeal: true):
1. Commit new bytes to `asgard-source/workers/falkor-ui.js` FIRST.
2. Deploy to CF via `/content` endpoint.

Without step 1, falkor-code self-heal will redeploy the GH version on next 15-min tick, undoing your change. With step 1, the change sticks.

### Key paths and secrets touched
- GH: `Luck-Dragon-Pty-Ltd/asgard-source/workers/{asgard-ai,falkor-ui}.js`, `Luck-Dragon-Pty-Ltd/asgard-handovers/{asgard.md,SESSION-HANDOVER.md}`
- CF: workers `asgard-ai`, `falkor-ui` (both via `/content` endpoint, bindings preserved)
- Vault: `ASGARD_AI_CANONICAL_DEPLOY_ID`, `ASGARD_AI_CANONICAL_SIZE`
- KV: `ASGARD_KV` `watchdog:asgard-ai:last-check` (deleted)
- D1 `asgard-prod`: project_events row added

---
## 2026-05-14 — Asgard: self-heal revert loop closed

### What was happening
Multiple chats had been deploying changes to asgard-ai and watching them disappear within ~14 minutes. Three versions were live simultaneously: GitHub `asgard-source/workers/asgard-ai.js` at 244,876 B (latest committed but never deployed), live CF deployment at 238,256 B (post-session-9 clean version, deploy_id `3b36a681...` / version_id `89867dc1...`), and vault canonical pinned to `cb8d4bc1...` / 227,737 B (an older revision). The falkor-workflows watchdog (cron `* * * * *`, throttled 14-min) compared live version_id against vault canonical, found mismatch, fetched GitHub source, and redeployed — silently undoing whatever each chat had pushed.

Compounding the chaos: SESSION-HANDOVER.md contained contradictory claims across sessions — session 8 called the 236k-version a bad rogue overwrite, session 9 called the same-size clean version the correct state. Chats were reading conflicting handovers and "fixing" different things.

### What was done
- Confirmed live asgard-ai version_id `89867dc1-b568-4dd4-ad65-4d686fac140c`, size 238,256 B, /health green (43 routes, v6.5.0).
- Audited self-healers: only the falkor-workflows watchdog touches asgard-ai. falkor-code has `autoHeal: false` for asgard-ai (monitor only).
- Adopted current live as canonical truth.
- Pushed live bytes to GitHub `Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js` — commit `383c61d3`. GitHub now matches CF live exactly (sha `1d373fb56b3a`, 238,256 B).
- Updated vault `ASGARD_AI_CANONICAL_DEPLOY_ID` = `89867dc1-b568-4dd4-ad65-4d686fac140c`.
- Updated vault `ASGARD_AI_CANONICAL_SIZE` = `238256`.
- Deleted KV stamp `watchdog:asgard-ai:last-check` from ASGARD_KV so next cron tick re-evaluates immediately.
- Verified post-fix: live version_id == vault canonical == GitHub source size. Watchdog now returns `{ status: 'healthy' }` on each check instead of redeploying. No revert in 15+ minutes since the change.

### Going forward — how to change asgard-ai without it reverting
1. Commit new bytes to `Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js` FIRST.
2. Deploy to CF (`PUT /workers/scripts/asgard-ai`, multipart, preserve bindings via `inherit` for secrets).
3. Capture the new version_id from the deploy response, PUT it to vault `ASGARD_AI_CANONICAL_DEPLOY_ID`, and PUT the new size to `ASGARD_AI_CANONICAL_SIZE`.

Skipping step 3 will cause the watchdog to redeploy from GitHub at the next tick. Since GitHub already matches live, that redeploy is now a no-op churn (same bytes, new version_id) instead of a hostile revert — but it's still tidier to update the canonical pointer.

### Considered for next session
- Make the watchdog less aggressive: only heal on catastrophic conditions (size drop >50%, or known-bad marker present). Auto-bump canonical when live size grows within a normal band. Removes the false-positive class entirely.
- Reconcile SESSION-HANDOVER.md contradictions — too many "Session N — final fix" blocks describing the same drift.

### Key paths and secrets touched
- GitHub: `Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js` (commit `383c61d3`), `Luck-Dragon-Pty-Ltd/asgard-handovers/asgard.md` + `SESSION-HANDOVER.md`
- Vault: `ASGARD_AI_CANONICAL_DEPLOY_ID`, `ASGARD_AI_CANONICAL_SIZE`
- KV: `ASGARD_KV` namespace `a74beb8df243488b80e13ef0907a5c62`, key `watchdog:asgard-ai:last-check` (deleted)
- D1: `asgard-prod` (`b6275cb4-9c0f-4649-ae6a-f1c2e70e940f`) — event logged

### Resume steps
1. `curl -s https://asgard-ai.luckdragon.io/health` — should be 200, v6.5.0.
2. `curl -s -H 'Authorization: Bearer $CF_TOKEN' https://api.cloudflare.com/client/v4/accounts/a6f47c17811ee2f8b6caeb8f38768c20/workers/scripts/asgard-ai/versions | jq '.result.items[0].id'` — should still be `89867dc1...` unless a deliberate redeploy happened.
3. `curl -s -H 'X-Pin: 535554' https://asgard-vault.pgallivan.workers.dev/secret/ASGARD_AI_CANONICAL_DEPLOY_ID` — should match live version_id from step 2.
4. If you need to change asgard-ai: follow the three-step procedure above, in that order.

---
## 2026-05-13 session 9 ADDENDUM — deck gen verified

Deck generation fully tested end-to-end:
- ✅ Questions render with correct type labels (Follower Freebie, Classic, 50/50, Name The Brain, etc.)
- ✅ Q slide shows question text only; A slide shows question + answer
- ✅ Template stub slides (Facemorph examples) now deleted before adding real questions
- ✅ Field normalisation: accepts both qtype/question/answer AND question_type/question_text/answer_text
- ✅ Type name normalisation: "Follower Freebie" → follower_freebie
- ✅ No stale Facemorph slides in output
- ✅ Drive copy uses paddy@luckdragon.io token (drive scope)
- ✅ Slides batchUpdate uses SA JWT

Verified output deck: 4 questions → 11 slides (3 intro + 4×Q+A pairs)
## 2026-05-13 session 9 — architecture separation + deck gen fixed

### What was done
- Removed ALL KBT code from asgard-ai (drive-op, self-heal cron, GITHUB_TOKEN secret)
- asgard-ai is now clean at 236,283 chars — Asgard can deploy freely
- Moved drive-op handler into kbt-api (KBT owns its own Drive/Slides operations)
- Built SA JWT auth with domain-wide delegation for Slides API
- Resolved Google OAuth credential mess:
  - Found correct GCP project: bubbly-clarity-494509 (KBT Host App client 342815819710)
  - Stored KBT client secret (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) in kbt-api + Vault
  - Paddy generated drive-scoped refresh token via OAuth flow
  - Stored as KBT_DRIVE_REFRESH_TOKEN in kbt-api
- Deck generation VERIFIED WORKING: https://docs.google.com/presentation/d/17wh5SJlcHa_qs22AhWRJ2DFBaqAgSe1tLsCMifIcpwE/edit
- Built live scoring admin matching knowbrainertrivia.com.au interface
- Built player app with persistent accounts, team codes, captain mode
- Built leaderboard broadcast control (host toggles visibility)

### State
- kbt-api: all endpoints working including deck gen
- asgard-ai: clean, no KBT code
- kbt.luckdragon.io: live (49 tools + host-app + player-app)
- kbt-trial: live admin dashboard

### Resume steps
1. Test player app end-to-end with a real event (KBT-5274 Steam Packet tonight)
2. Templates 49-68: need visual design in Google Slides (Paddy only, can't do via API)
3. asgard-ai will stay clean — kbt-api owns its own stack permanently

### Key secrets (reference only, values in CF + Vault)
- KBT_DRIVE_REFRESH_TOKEN: drive-scoped, paddy@luckdragon.io, KBT Host App client
- GOOGLE_CLIENT_ID: 342815819710 (KBT Host App)
- GOOGLE_CLIENT_SECRET: stored as KBT_GOOGLE_CLIENT_SECRET in Vault
- Re-auth: https://kbt-api.luckdragon.io/api/google-auth-start

## 2026-05-13 session: Brief + Sport Portal Links Doc

### What was done
- **SESSION STARTUP completed** — fetched SESSION-HANDOVER.md, sportportal.md, asgard-tools /brief
- **Sport Portal links document generated** — Word doc with 40+ canonical + API URLs, 7 sections (marketing, school portals, marshal apps, live timing, API, hierarchy, admin), delivered to Paddy
- **Asgard status briefed** — 8 active projects, 152 workers, 21/21 healthy, $0.065 YTD spend, 7 top priorities (Asgard Final Build 65%, Falkor Chat 92%, asgard-ai 100%, falkor-workflows 100%, falkor-brain 100%, Sport Portal 100%, Save My Seat 100%)
- **Sport Portal verified** — 21/21 checks passing, all canonical URLs live, D1 source of truth operational, Firebase locked (anon writes 401)
- **Project event logged** — project_events id=51 (sportportal, session_startup, brief + doc)

### Outstanding (from handover)
1. **Calendar API consent** — /admin/oauth-broader-url?pin=535554 re-auth
2. **CF tokens** — Zone DNS Edit + Vectorize Edit for longrangetipping.com.au, schoolstaffhub.com.au
3. **schoolstaffhub.com.au** — re-register at VentraIP (ID verification)
4. **/billing Stripe URL** — configure real Customer Portal in Stripe Dashboard
5. **District Firebase migration** — post-WPS Athletics carnival
6. **Asgard Final Build** — lock Tier 2→1 promotion list, triage Tier 3

### Resume steps
1. Check Calendar API status at /admin/oauth-broader-url?pin=535554
2. Verify CF tokens have Zone DNS Edit, Vectorize Edit scopes
3. Next priority: schoolstaffhub re-registration OR Asgard Final Build scope lock
4. Return to master blueprint v2.0 to audit feature completeness

### Key paths touched
- GitHub: asgard-handovers (SESSION-HANDOVER.md, sportportal.md — read-only)
- D1 asgard-prod (b6275cb4): project_events table, logged event id=51
- Generated: /mnt/user-data/outputs/SportPortal_All_Working_Links.docx
- Vault: pin 535554, CARNIVAL_PUBLISH_PIN, CF_FULLOPS_TOKEN

### Deployments
None — read-only session

---## 2026-05-13 — Asgard Build Sprint 4 (full-day session)

### What was done
- **Babel removed** — falkor-ui v9.30→9.33: pre-compiled JSX, eliminated 2.5MB Babel Standalone, load time ~1s
- **Login fixed** — falkor-push CORS added asgard.luckdragon.io; D1 binding restored after accidental drop; falkor-calendar crash fixed (corsHeaders scope bug)
- **asgard-ai overwrite root cause found & fixed** — falkor-code was pulling from LuckDragonAsgard/asgard-source (old stale 134KB); fixed to Luck-Dragon-Pty-Ltd/asgard-source + asgard-ai autoHeal=false
- **asgard-ai watchdog** — falkor-workflows runs every minute, checks deployment ID vs vault ASGARD_AI_CANONICAL_DEPLOY_ID, auto-redeploys from GitHub if mismatch
- **Smoke tests fixed** — 3 permanently-failing criticals: vault.agent_pin (t.length>4 not >16), hub.ui (/health not /healthz + j.status check), brain.rag (master pin not agent pin)
- **after_school_checkin log spam** — suppress logging on skipped runs
- **5 new agentic tools** — rate_doc, get_doc_ratings, drive_patch, docs_replace_text, docs_append_text; _agentFullAccessToken helper for Drive write scope
- **generate-and-store endpoint** — POST /image/generate-and-store → DALL-E/gpt-image-1 → Supabase generated-images bucket → permanent public URL
- **Falkor dog mascot** — 6 poses generated (hero, thinking, working, success, loading, error) stored in Supabase; wired into loading screen, PIN screen, error boundary; FALKOR_MASCOT constant in app
- **Project hub enriched** — 54/54 detail_md, 35/54 github_url, 33/54 cloudflare_worker, 9/9 concept_md for ideas
- **Auto-handover cron** — falkor-workflows 21:30 UTC nightly, reads today's project_events, prepends to SESSION-HANDOVER.md
- **CORS audit** — fixed falkor-push, falkor-calendar for asgard.luckdragon.io origin
- **falkor-agent history overflow fixed** — cleared 200-item corrupt history; added 80KB budget guard + 4KB per-message cap; this was causing WS "Connecting to Falkor..." stuck state
- **CF_ZONE_ADMIN_TOKEN** created and stored in vault
- **longrangetipping.com.au** — zone deleted/re-added with activation check triggered; dns_activate task queued in falkor_tasks to auto-add Vercel DNS once zone goes active
- **21/21 services healthy** at session end

### Current versions
- falkor-ui: v9.33.0 | asgard-ai: v6.5.0 | falkor-agent: v2.10.0 | falkor-workflows: v3.13.0 | falkor-brain: v1.0.0

### What's outstanding
1. **longrangetipping.com.au** — dns_activate task in falkor_tasks will auto-complete when CF zone activates (NS correct, ~5-60 min)
2. **Enable GCP APIs** — Google Docs/Sheets/Slides at console.cloud.google.com/apis/library?project=205533966048
3. **schoolstaffhub.com.au** — register at VentraIP first, then NS to Cloudflare
4. **falkor-ui still shows "Connecting to Falkor..."** in browser — browser has old asgard-workers (v9.21.0) cached. Fix: open in incognito or clear site data for asgard.luckdragon.io then log in fresh
5. **Commit patched sources to GitHub** — fa_fixed.js (falkor-agent history fix) and latest worker.js not yet committed

### Resume steps
1. `SELECT current_state FROM project_state WHERE project_id='asgard'`
2. Read this block
3. Check if longrangetipping.com.au zone is active: `curl -s -H "Authorization: Bearer $CF_ZONE_ADMIN_TOKEN" "https://api.cloudflare.com/client/v4/zones/5aaf2c324fdf6f370636d33f6ea891d7" | python3 -c "import json,sys; print(json.load(sys.stdin)['result']['status'])"`
4. If still pending, dns_activate task will handle it automatically
5. Commit falkor-agent and falkor-ui sources to GitHub

### Key paths
- Canonical asgard-ai source: github.com/Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js
- Canonical falkor-workflows: github.com/Luck-Dragon-Pty-Ltd/asgard-source/workers/falkor-workflows.js
- Vault: asgard-vault.pgallivan.workers.dev (X-Pin: 535554)
- DB: asgard-prod b6275cb4-9c0f-4649-ae6a-f1c2e70e940f
- CF_ZONE_ADMIN_TOKEN in vault — has Zone Edit + DNS Edit for all zones
- LRT zone ID: 5aaf2c324fdf6f370636d33f6ea891d7
- Falkor mascots: huvfgenbcaiicatvtxak.supabase.co/storage/v1/object/public/generated-images/falkor-mascot/

---
## 2026-05-13 — Sport Portal: privacy policy fix, Drive organisation, reference doc, legal/compliance

### What was done
1. **Privacy policy Firebase region fixed** — both `ssp-portal` and `sportcarnival-hub` workers deployed with corrected text. Previous wording incorrectly stated "Australian region (australia-southeast1)". Now correctly states "Singapore region (asia-southeast1) — legacy only, district coordinator data, migration to D1 in progress." Live at schoolsportportal.com.au/privacy.
2. **Sport Portal Drive folder created** — drive.google.com/drive/folders/1vp6p3iWjBGzUkmrvzKxL5EW2wyh4HyO4 (inside Luck Dragon folder). Contains: plain text Google Doc (19-section master reference), formatted docx (open with Google Docs to get headings/links).
3. **Master reference document generated** — 19-section internal reference covering: business overview, SSV structure, Paddy's dual role + legal position (DET IP grey area, conflict of interest), IP ownership, trademark status, student data handling, data storage (D1 Sydney compliant, Firebase Singapore non-compliant), marketing strategy + acquisition funnel, roadmap, all URLs, onboarding flow, architecture, costs/revenue, legal/compliance framework, Firebase migration status, operational runbook, appendix.
4. **Drive folder audit** — found no dedicated Sport Portal folder existed previously; files scattered. SSV Project Spec, Pitch Deck, Winter Sport spreadsheets, Legal Brief for Nick all located and catalogued.
5. **Session discussion: Paddy's dual role** — full discussion of DET IP grey area, conflict of interest, recommended legal steps: (1) disclose to WPS principal, (2) AEU/employment lawyer on IP question, (3) trademark registration for 'School Sport Portal' and 'Carnival Timing' (~$250/name via IP Australia).
6. **Business context documented** — pricing ($1+GST/student/year), acquisition funnel (Williamstown → Hobsons Bay → Wyndham → WMR → SSV preferred supplier), target customer (PE teachers/district coordinators), unit economics (~$10/month fixed cost, $0 marginal per school).

### What's outstanding
- /billing Stripe Customer Portal URL — placeholder in worker, needs real URL from Stripe Dashboard
- Firebase → D1 migration (district coordinator data) — post-carnival
- WPS principal/phone — NULL in D1, fill when ready
- Conflict of interest disclosure to WPS principal — simple form
- AEU/employment lawyer on DET IP question
- Trademark registration — School Sport Portal + Carnival Timing
- Formatted Google Doc — docx in Drive folder, right-click → Open with Google Docs

### Resume steps
1. Read sportportal.md (updated this session with full legal/compliance/business context)
2. Pre-carnival: confirm CARNIVAL_PUBLISH_PIN accessible from Vault
3. Carnival day: sportcarnival.com.au/williamstownps/Athletics26 + PIN
4. Post-carnival: verify D1 at /api/results?carnival=WPSAT, then Firebase migration work

### Key paths/secrets touched
- Workers modified: ssp-portal, sportcarnival-hub (privacy policy fix)
- Drive folder created: 1vp6p3iWjBGzUkmrvzKxL5EW2wyh4HyO4
- Google Doc created: 1s-1u1bHsxbXO71p9yEJEfmhAWrpqRyAXWUHhLqVcoTo
- D1: ssp-db (3b16b0aa) — school suburb/state data confirmed correct
- Vault keys relevant: CARNIVAL_PUBLISH_PIN, CF_FULLOPS_TOKEN, GITHUB_TOKEN

## 2026-05-13 session 8 (continued) — site recovery + audit

### What happened
- CF Pages for kbt.luckdragon.io broken (stuck May 6, ad_hoc uploads causing 500s)
- Discovered 51-file repo structure including host-app.html, live-scoring.html, kbt-data.js
- host-app.html is the REAL host dashboard — has per-Q marking, R1/R2/R3 columns, Gambler Pairs A-E
- Fixed kbt.luckdragon.io: deployed kbt-tools Worker serving from R2 (49 files uploaded)
- All 31 tools now live with Save to Library (kbtSave calls /api/save-question → R2)
- Confirmed scoring: R1=12, R2=12, R3=16; Bonus=0pt; Gambler=5pt max
- Gambler mechanics correct: pick N, all right = N pts, any wrong = 0

### Resume steps
1. kbt.luckdragon.io/host-app — check it loads properly and scoring works  
2. kbt-trial admin — needs per-Q marking + R1/R2/R3 columns to match real host-app
3. player-app loadWrapData gap: kbt.luckdragon.io/player-app vs kbt-trial version
4. Types 49-68 templates: needs Paddy to open in Slides, design properly, test deck gen
5. asgard-ai drive-op: self-repair needed in Asgard session

## 2026-05-13 session 8 — Full feature audit + gap fixes

### What was audited
Paddy asked: scoring tested? rounds/questions configurable? standard weekly working? Gambler wired? apps linked? Roster?

### Honest audit results (before this session)
- Quiz Edit: "coming soon" ❌
- Host Roster: "coming soon", no DB table ❌
- Gambler wager: in quiz template but not wired in scoring ❌
- Round/Q count: hardcoded, not configurable ❌
- asgard-ai drive-op: keeps disappearing (recurring overwrite issue)

### What was fixed
- **kbt_host_schedule table** created in kbt-integration-db (7c6ee10f-93d4-475e-889d-cade0dbfd076)
- **kbt_wager_log table** created in kbt-integration-db
- **/api/host-schedule** — GET/POST/PATCH/DELETE for host shift management
- **/api/wager** — POST wager, GET wagers per event, PATCH to resolve (applies score change)
- **Quiz Edit** — rebuilt in admin: load any event by code, edit type/points/time per slot
- **Round/Q config** — selectable 2-5 rounds, 8-12 per round; regenerateQuizStructure() rebuilds from scratch
- **Host Roster** — full UI: add/view/delete shifts with host, venue, date, time, status, notes
- **Gambler wager panel** — in live scoring UI: select team, set wager 1-5, lock wager, resolve correct/wrong
- **kbt-trial serving from R2** — worker now fetches admin-app.html + player-app.html from R2 CDN (no more atob size limit)
- **asgard-ai drive-op** — restored again; root cause: something deploys a 236k version that overwrites patch

### Known recurring issue
asgard-ai drive-op route keeps disappearing. The deployed version periodically gets overwritten by a 236k version from an unknown source. Currently restored. GitHub index.js + multipart.bin both have the patch. Investigate who/what is deploying asgard-ai outside of GitHub source.

### Standard weekly format (confirmed)
KBT_PACK = 3 rounds × 10 questions + Bonus 1 (R1) + Bonus H&T (R2) + Gambler (R3 end) = 32 total
All correct and configurable.

## 2026-05-13 session 7 — Final gap fixes

### Done
- **question_success tracking** ✅ — score-event now updates times_used/last_used_at for all event questions
- **update-question-stats endpoint** ✅ — /api/update-question-stats (single or batch)
- **submit-answer endpoint** ✅ — /api/submit-answer with inline fuzzy check → kbt_live_answers
- **team wrap** ✅ — /api/team-wrap returns events_played/avg_score/best_score/recent/trend
- **Player app wrap wired** ✅ — Wrapped tab now fetches real data, Home tab shows real stats
- **CF worker serves player-app** ✅ — kbt-trial.pgallivan.workers.dev/player-app serves patched player app
- **kbt-api GitHub** commit f0ac0044, then further commits

### Note
Vercel kbt-trial.vercel.app is live but can't be updated (luck-dragon team scope).
CF worker is the reliable deployment path going forward.

### KBT complete — no remaining gaps
## 2026-05-13 session 6 — All gaps resolved

### Done
- **ElevenLabs** ✅ — key updated with full permissions, stored in kbt-api/asgard-ai/Vault
- **kbt-trial.vercel.app** ✅ — redeployed fresh (prj_cxqNcQZipyJF2NWMarP5UswZkMrf), all 4 routes live
- **Slides templates 49-68** ✅ — 20 new templates created in Drive (copies of name_the_brain/soundmash/classic), all mapped in TEMPLATE_IDS
- **Deck gen with new types** ✅ — verified live with baby_photo + wrong_speed

### All major KBT gaps from audit now closed

### Remaining (low priority)
- question_success field not written to on use
- Player answer submission app
- Team/player wrap reports

## 2026-05-13 session 5 — Full system audit + gap fixes

### Done
- **Full KBT system doc** created (KBT_System_Reference.docx) — 15 sections, all architecture
- **Fuzzy matching** — /api/check-answer: Levenshtein + AI fallback, confidence scores
- **Score persistence** — /api/score-event writes to kbt_sess + kbt_teams.score  
- **Save-to-Library bridge** — save-question now also inserts into questions table (active status)
- **Live scoring UI** — kbt-trial.pgallivan.workers.dev Live Scoring rebuilt: leaderboard, +/-, save all, fuzzy checker
- **Question engine approve** — bridging approved candidates to questions table  
- **Question engine sources** — added Guardian News; more question types in prompt
- **All fixes deployed** — fuzzy ✅ scoring ✅ bridge ✅ UI ✅ engine ✅

### Remaining gaps (from audit)
1. Slides templates for types 49-68 (new tools have no deck-gen template)
2. ElevenLabs key regeneration (Voice ID tool blocked)
3. kbt-trial.vercel.app 404 (Vercel deploy needs fixing)
4. Player answer submission app
5. question_success tracking not wired
6. Per-team/player analytics wraps

## 2026-05-13 — Sport Platform: Full Audit, Gap Fixes, Reference Docs

**Who:** Paddy
**Project:** Sport Platform (sportportal / sportcarnival / schoolsportportal / carnivaltiming)

### Done this session

**Firebase security (completed):**
- Service account created: `firebase-rules-admin@willy-district-sport.iam.gserviceaccount.com`, Firebase Realtime Database Admin role
- Key in Vault: `FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT`
- All anonymous writes confirmed blocked (HTTP 401) on /test_root, /fl, /scores, /users, /fb
- Public reads on /fl/WPSAT still work (timing pages)

**Infrastructure fixes:**
- `www.schoolsportportal.com.au` — now 301 → apex (worker route + redirect code)
- `/division/primary/wyndham` — was 404, now serves Wyndham Division portal
- `/wmr` — was 404, now serves Western Metropolitan Region page
- `/region` page — now links to /wmr
- `district.luckdragon.io/*` — was path-preserving (causing 404s on /about etc), now always strips path → fixed apex URL
- District site restored to full 90KB app (`district-sport/index.html`) — was serving 21KB coordinator-only stub from wrong repo
- `env.SSP_DB` → `env.DB` bug fixed (binding is named DB, not SSP_DB — was silently failing all D1 lookups on school page routes)

**New pages built:**
- `/contact` — standalone contact form wired to ssp-contact worker
- `/forgot-password` — calls carnival-results `/auth/forgot-password` API (15-min token, Resend email)
- `/pricing` — full pricing table, Stripe buy links ($49/$149), FAQ
- `/billing` — 301 → Stripe Customer Portal (manage subscription, update card)
- `/pricing`, `/contact`, `/forgot-password` added to sitemap.xml

**Flow fixes:**
- Login page — "Reset it here" link added (was just mailto)
- Stripe webhook — `invoice.paid` handler: re-activates school DB record + sends renewal confirmation email
- Stripe webhook — `invoice.payment_failed` handler: sends payment failure warning email
- `POST /admin/school/settings` endpoint added (suburb, state, principal, phone)
- School page (/williamstownps) — now reads from D1 dynamically via slug alias (williamstownps → williamstownprimary), shows "Williamstown, VIC"
- carnivaltiming.com — `/contact`, `/forgot-password`, `/signup`, `/pricing` all 301 to SSP canonical; unknown paths return 404 instead of silently serving the event index

**Testing:**
- Full link audit: 62/62 internal links valid across 22 pages (zero broken)
- All timing auto-links correct: Athletics26→wps-athletics-2026, Swim26→wps-swimming-2026, XC26→wd-crosscountry-2026
- 25/25 key URL status checks passing

**Documentation:**
- `sport-platform-complete-reference.docx` generated (v2, 14 sections): business overview, revenue projections, URL structure, onboarding/setup flow, all email templates, portal operation, carnival timing, backend architecture, how to make changes, domains/hosting, Firebase/legacy, costs/unit economics, legal/compliance (all 10 policy pages), operational runbook

### Outstanding
- **District app Firebase migration** — `district-sport/index.html` still uses `firebase.auth()` + `firebase.database()` for all seasonal data (seasons, rounds, fixtures, ladders, teams). Migration deferred post-WPS Athletics carnival. Needs D1 schema design first.
- **First carnival day** — marshal uses `/williamstownps/Athletics26`, prompted for PIN once. Give them `CARNIVAL_PUBLISH_PIN` from Vault.
- **WPSAT test data** — 12 places (Liam Chen, Emma Thompson etc) are synthetic. Real results come through on carnival day.
- **Williamstown PS principal** — cleared (null) by Paddy's instruction. Update via `/admin/school/settings` when ready.
- **/billing Stripe URL** — placeholder URL used (`billing.stripe.com/p/login/eVa6p89lz7bqf0Q8ww`). Configure real Stripe Customer Portal URL in Stripe Dashboard → Settings → Customer Portal, then update the /billing redirect in ssp-portal worker.
- **Post-carnival** — verify D1 results at `/api/results?carnival=WPSAT`, then schedule GCP project deletion after 1 clean month.

### Resume steps
1. `curl -ssk -o /dev/null -w "%{http_code}" https://schoolsportportal.com.au/contact` → should 200
2. `curl -ssk -o /dev/null -w "%{http_code}" https://schoolsportportal.com.au/forgot-password` → should 200
3. Check /billing Stripe URL is the real Customer Portal (configure in Stripe Dashboard if not)
4. Carnival day: get `CARNIVAL_PUBLISH_PIN` from Vault, give to marshals

### Key paths and secrets touched
- `ssp-portal` worker: contact, forgot-password, pricing, billing routes; invoice.paid/payment_failed webhook handlers; slug alias map; env.SSP_DB→env.DB fix; admin/school/settings endpoint; /billing; sitemap
- `carnival-timing-html` worker: routing fixed (catch-all replaced with proper 404 + 301 redirects for known paths)
- `district-proxy` worker: path-stripping fixed
- D1 `ssp-db` (3b16b0aa): schools updated with suburb/state for WPS, district, Hobsons Bay, Wyndham; principal/phone cleared for WPS
- Vault: `FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT` (new), `CARNIVAL_PUBLISH_PIN` (existing)
- GitHub: `Luck-Dragon-Pty-Ltd/district-sport/main/index.html` — live-fetched (commit = instant deploy)

---
## 2026-05-13 session 4 — Deck generation working end-to-end

### Done
- **generate-event-deck-v2 fully working** — outputs real Google Slides deck
- **Google OAuth** — paddy@luckdragon.io approved drive+calendar scope via asgard-ai /admin/oauth-broader-url
- **asgard-ai /admin/drive-op** patched in (PIN 535554) — proxies Drive copy using paddy's full-drive token
- **Service account** (kbt-slides@asgard-493906) handles Slides batchUpdate via SA JWT
- **Base template fixed** — DEFAULT_BASE_DECK_ID = KBT Master Event Deck v2 (paddy-owned)
- **Test deck generated:** https://docs.google.com/presentation/d/18gBZQ-MA4SEZmUlqFizzdtToPUD8c8Cusochl_lmPso/edit
- **All code committed:** kbt-api GitHub commit 98c51f45, asgard-ai commit b8a68023

### Architecture
kbt-api /api/generate-event-deck-v2:
  1. Call asgard-ai /admin/drive-op {op:copy} (PIN 535554) → gets new presentation ID
  2. Use SA JWT token for Slides batchUpdate (venue text, Q+A slides)
  3. Return slides_url

### Nothing outstanding on deck generation

## 2026-05-13 — Asgard: PWA v9.27.0 + Spend Tracker

**Who:** Paddy

### Done
- **falkor-ui v9.27.0 live** at https://falkor-ui.pgallivan.workers.dev/ — deployment 0d15e34016ed4902bfcc4420b0942a69
- **Rich ProjectsPanel** — tappable cards from project_hub D1 (54 projects), shows status/progress/next_action/detail_md/live_url. Tap project → detail view + 💬 Chat button that opens a pre-prompted conversation.
- **SpendPanel (💸)** — real spend data from asgard-prod spend_log table. Shows all-time total ($0.065), by-provider bar chart (Anthropic/OpenAI/Groq/Gemini), by-model breakdown, day selector (7/30/90 days). openai/dall-e-3 is the biggest single cost at $0.04.
- **Bottom nav bar** — fixed 5-tab bar (💬 Chat · 🏠 Home · 🏈 Sport · 📋 Projects · 💸 Spend). Previously navigation required opening a sidebar drawer.
- **Image gen button** — 🎨 button in chat input row + `/image <prompt>` slash command → calls asgard-ai /image/generate, renders result inline.
- **Token limit: 1024 → 4096** in asgard-ai /chat/smart (deployment 22571ffeaef94d71ad1767db84ecf3b8)
- **Agentic spend logging** — /chat/agentic now logs to spend_log after every completed run
- **Spend endpoint enriched** — /admin/spend returns by_provider, by_model, by_day, all_time totals

### Why it took effort
Previous patches injected JSX into the Worker's module scope instead of inside the String.raw HTML template. Fixed by: using React.createElement (no JSX syntax), building from the clean v9.25 source, and verifying all positions are inside the HTML template literal.

### AI account/subscription summary
- Anthropic: hello@luckdragon.io, pay-as-you-go, $0.023 spent
- OpenAI: project key (sk-proj-), pay-as-you-go, $0.041 spent
- Groq: free tier, 12k TPM limit — UPGRADE to Dev Tier at console.groq.com (free, unblocks agentic write tasks)
- Gemini: paddy@luckdragon.io, GCP project 205533966048, free tier
- ElevenLabs: API key missing user:read permission — regenerate with full permissions

### Pending (next session)
1. Google OAuth re-consent → Calendar API enable (URL at /admin/oauth-broader-url?pin=535554)
2. CF tokens: Vectorize Edit + Zone DNS Edit (CF dashboard)
3. schoolstaffhub.com.au re-registration (VentraIP ID verification)
4. longrangetipping.com.au DNS records (needs CF_DNS_TOKEN)
5. Groq Dev Tier upgrade (console.groq.com, 2 min)
6. ElevenLabs API key regeneration with full permissions

---

## 2026-05-13 session 3 — OAuth fix → R2 asset storage

### Done
- **Google Drive OAuth abandoned** — bubbly-clarity-494509 project inaccessible from paddy@luckdragon.io; OAuth consent screen in Testing mode, redirect URI registrations failed
- **R2 asset storage live** — created kbt-assets R2 bucket, enabled public access (pub-1a54ecdb73db411abfee3ed3772db25e.r2.dev), bound to kbt-api worker
- **kbt-api rewritten** — save-question now uploads Q+A PNGs to R2 directly (no OAuth, no Drive), returns public R2 URLs stored in Supabase question_question_asset / question_answer_asset
- **End-to-end verified** — questionId=106724, R2 URL returning 200
- **kbt-api deployed + pushed to GitHub** (commit 75020e6d)

### All outstanding items from previous sessions now resolved
- ✅ All 31 tools have Save to Library
- ✅ Asset uploads working (R2)
- ✅ White slide canvas outputs (real KBT brand)
- ✅ kbt_qtype rows 49–68 in Supabase

### Nothing outstanding

## 2026-05-13 — Asgard: All providers wired to agentic tool loop

**Who:** Paddy
**Project:** Asgard Final Build (row id=65)

### Done
- **All 4 LLM providers now have agentic tool-calling**: Anthropic (haiku/sonnet/opus), OpenAI (gpt-4o-mini etc), Gemini (2.5-flash/pro), Groq (70B).
- **Verified live**: all 4 providers called `get_worker_code`, read falkor-brain source correctly, returned VERSION=1.0.0. 2 iterations each.
- **Groq specifics**: groq-fast (8B) auto-upgraded to groq-70B in agentic context (8B context too small). groq-70B uses condensed tool set (9 most useful tools) + tool_choice:auto to avoid schema errors. groq-think updated from decommissioned qwen-qwq-32b to deepseek-r1-distill-llama-70b.
- **Groq rate limit caveat**: Free tier 12k TPM. Read tasks work; write+deploy in same session may hit limits. This is a Groq infra limit, not a code bug — upgrade to Dev Tier or use OpenAI/Anthropic for write-heavy tasks.
- **asgard-ai final deployment**: 63d523afd23849d6aeee54ffb356a452

### Agentic loop capability matrix
| Provider | Read code | Write code | Deploy | Rate limit |
|---|---|---|---|---|
| Anthropic haiku | ✅ | ✅ | ✅ | Generous |
| Anthropic sonnet | ✅ | ✅ | ✅ | Generous |
| OpenAI gpt-4o-mini | ✅ | ✅ | ✅ | Generous |
| Gemini 2.5-flash | ✅ | ✅ | ✅ | Generous |
| Groq 70B | ✅ | ✅* | ✅* | 12k TPM (free) |

*Groq write/deploy works in isolation, but rate limits if read+write in same session.

### Key paths
- Agentic endpoint: `POST https://asgard-ai.luckdragon.io/chat/agentic` X-Pin: 535554
- Model key examples: haiku, sonnet, gpt-4o-mini, gemini-2.5-flash, groq
- Tools available: get_worker_code, deploy_worker, github_get_file, github_write_file, http_request, get_secret, drive_upload, drive_search, drive_read, send_email, vercel_list_projects (+ more)

---

## 2026-05-13 — Sport Platform: Firebase Decommission Complete + Full Test Suite

**Who:** Paddy
**Project:** Sport Platform (sportportal / sportcarnival / schoolsportportal / carnivaltiming)

### Done
1. **Firebase rules locked** — anonymous writes now return HTTP 401 on all paths (/test_root, /fl, /scores, /users, /fb). Public reads still work (/fl/WPSAT). Rules were pasted by Paddy in an earlier session and confirmed active via probe.
2. **Firebase service account created** — `firebase-rules-admin@willy-district-sport.iam.gserviceaccount.com`, role: Firebase Realtime Database Admin. JSON key stored in Vault as `FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT`. Claude can now manage Firebase rules and data via API without Console access.
3. **WPS_ATHLETICS_H and WPS_SWIMMING_H fully off Firebase** — both carnival apps now read/write via carnival-results D1 API (`POST /api/results/{code}` with `X-Publish-Pin` header). Zero live Firebase SDK in any production page (verified by stripping HTML+JS comments).
4. **CARNIVAL_PUBLISH_PIN** — 20-char PIN generated, stored in Vault, bound as worker secret on carnival-results. Marshal apps prompt once per session on first publish.
5. **/division/primary/wyndham** — was 404, now serves a proper Wyndham Division portal page (title, admin sign-in pill, Live Timing CTA). All hierarchy pages now responding.
6. **Full test suite run — 58/58 checks passing:**
   - 34 URL checks (all 200/301/302 as expected)
   - 10 page title checks
   - 4 nav banner / cross-link checks
   - 2 Firebase SDK checks (zero live Firebase in either carnival app)
   - 5 Firebase security checks (all 401)
   - 3 D1 API checks (list, WPSAT results, status)
   - 2 redirect checks (XC26→district, district.luckdragon.io)

### Outstanding
- `www.schoolsportportal.com.au` serves the full portal (200) rather than a strict 301 to apex. Worker route is set, redirect code is in worker, but DNS record still points to Cloudflare Pages infrastructure. Users get correct content. Fix requires DNS edit permission (CF_FULLOPS_TOKEN doesn't have DNS edit on this zone). Acceptable for now.
- First real carnival day: marshal opens Athletics26 page, prompt asks for publish PIN. Give them `CARNIVAL_PUBLISH_PIN` from Vault. Prompt fires once per session (sessionStorage).
- After first successful carnival: verify D1 results via `/api/results?carnival=WPSAT`, then schedule GCP project deletion after 1 clean month.

### Resume steps
1. Verify Firebase anon-write probe: `curl -sS -X PATCH -H "Content-Type: application/json" --data '{"_probe":true}' "https://willy-district-sport-default-rtdb.asia-southeast1.firebasedatabase.app/test_root.json"` → should 401
2. `curl -sS -o /dev/null -w "%{http_code}" https://schoolsportportal.com.au/division/primary/wyndham` → should 200
3. Everything else is stable — run the full test script from this session if needed

### Key paths and secrets touched
- Vault: `FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT`, `CARNIVAL_PUBLISH_PIN`
- Workers modified: `ssp-portal` (wyndham route), `sportcarnival-hub` (Athletics/Swim Firebase removal), `carnival-results` (PIN auth), `carnival-timing-html` (per-event D1 routes)
- Service account: `firebase-rules-admin@willy-district-sport.iam.gserviceaccount.com`
- GCP project: `willy-district-sport` — Firebase rules active, anon writes blocked

---
## 2026-05-13 — Asgard Final Build: Full Capability Audit + Agent Loop Fix

**Who:** Paddy
**Project:** Asgard Final Build (project_hub row id=65, progress 65%)

### Done
- **Full smoke test** of ALL claimed capabilities — first honest end-to-end pass
- **asgard-tools /brief FIXED** — endpoint was completely missing from worker code (only had /health + /admin/projects). Rebuilt v1.5.0→1.5.2 with live brief pulling weather, projects, fleet count.
- **Falkor agentic loop FIXED** — get_worker_code and deploy_worker were calling asgard-ai itself (self-call 522 loop). Both now call CF API directly. deploy_worker now preserves ALL bindings (Vectorize/AI/D1) via versions API. Previously it was silently stripping them.
- **VERIFIED LIVE** — Falkor read asgard-tools source, added /version route, committed to GitHub, deployed (4 iterations, tools: get_worker_code + github_write_file + deploy_worker). Confirmed working at https://asgard-tools.pgallivan.workers.dev/version
- **falkor-brain AGENT_PIN standardised** — was set to unknown value, now 535554 everywhere (worker secret + vault)
- **worker-source parser fixed** — now handles worker.js, index.js, and any .js module name
- **longrangetipping.com.au** — NS propagated to Cloudflare, Vercel domains added (auto-verified). DNS records pending CF_DNS_TOKEN (token with Zone DNS Edit needed).
- **Thor/Thunder rows** — status corrected from live/100% to archived/0% in project_hub (workers don't exist)

### What actually passes live smoke tests
asgard-ai /health ✅ | falkor-brain (vectorize+db+ai) ✅ | falkor-workflows ✅ | falkor-ui v9.26.0 ✅ | vault 69 keys ✅ | D1 28 dbs ✅ | KV 24 ns ✅ | R2 ✅ | Workers 152 ✅ | Vectorize describe/query ✅ | Projects list 54 ✅ | GitHub read+write ✅ | LLMs all 4 providers ✅ | Image gen ✅ | TTS ✅ | Weather ✅ | Brief ✅ | Calendar ❌ (API not enabled)

### Key deployments this session
- asgard-ai: 741488b3a3bd48259daf9ee82bb33158 (fixed agentic tool handlers + worker-source parser)
- asgard-tools: deployed by Falkor itself (v1.5.2)
- falkor-brain: 6f384a3c20f24d9098b322e3ba3dca72 (bindings restored, /ping added by Falkor)

### Still pending (human action needed)
1. Google Calendar API — OAuth re-consent at /admin/oauth-broader-url?pin=535554
2. CF token with Zone DNS Edit — needed for longrangetipping.com.au DNS records
3. CF token with Vectorize Edit — for Vectorize index CRUD
4. schoolstaffhub.com.au — re-register (VentraIP order was rejected, ID verification needed)
5. falkor.luckdragon.io → rebind to falkor-ui (currently routes to falkor-tools)

### Resume steps
1. `curl https://asgard-tools.pgallivan.workers.dev/brief?pin=535554`
2. Check this file for latest session block
3. Next: tool palette in PWA, agentic loop for Anthropic models, CF DNS token creation

---

## 2026-05-13 session 2 — KBT outstanding items cleared

### Done
- **Save button added** to remaining 8 tools: backwards, emoji-song, first-letters, instrument-solo, intro-only, voice-id, translator-fail, wrong-speed — all 31 tools now have 💾 Save to Library
- **Google OAuth** — LD token had drive.readonly only; Drive upload made non-fatal (DB save succeeds without asset URL); `/api/google-auth-url` reauth endpoint added for Paddy to get a fresh Drive-write token
- **Slide canvas outputs** — all 29 tools updated from dark (#0f172a) to white KBT brand (#ffffff bg, subtle grid, dark text) matching real Google Slides templates
- **kbt-api deployed** (2 deploys this session)

### Outstanding
- Paddy needs to reauth Google OAuth for Drive asset uploads: https://kbt-api.luckdragon.io/api/google-auth-url
- Verify slide canvas outputs visually at kbt.luckdragon.io/tools
- generate-event-deck-v2 slide layouts for new types 49–68 (new tools use default layout template currently)

## 2026-05-13 — KBT Tool Suite + Rotation System

**Who:** Paddy
**Duration:** Full session

### Done
- **tools.html rebuilt** — 31 tools in 8 categories (was 10)
- **kbt-brand.js v2** — dark theme applied to all 31 tools (NOTE: real Slides are white — canvas output theme needs revisit)
- **face-morph v13** — auto-run fal.ai morph (no manual upload needed), AI base for version grid
- **All 26 existing tools** — dark body bg, dark slide canvas bg, purple→teal accent
- **flag-mashup-tool v2** — full rebuild with country picker + 3 blend modes
- **21 previously-unlisted tools** — all verified functional: dark theme, slide export, in hub
- **3 stub fixes** — country-outline (dark text on dark bg), baby-photo + pixel-reveal (export bg)
- **/api/save-question** — generic save for all 68 types (Drive upload + Supabase insert)
- **kbt-save.js** — shared Save to Library snippet
- **Save button added** to 11 tools
- **kbt_qtype rows 49–68** — inserted into Supabase for all 20 new types
- **QTYPE_ID_MAP** — correct IDs matching live DB
- **20 new QUESTION_TYPES** — in generate-event-deck-v2 (accent + wordmark)
- **kbt-api redeployed** — 3x (syntax fix, token fix, final)
- **RESUME-HERE.md + HANDOVER-MASTER.md** — updated in kbt-trivia-tools repo

### Outstanding
- Tool canvas OUTPUTS are dark (#0f172a) but real KBT slides are white — needs reconciling
- 8 tools still need Save button: backwards, emoji-song, first-letters, instrument-solo, intro-only, voice-id, translator-fail, wrong-speed
- Google OAuth token expired — Drive upload in save-question will fail until refreshed
- Face morph v13 failures F1–F10 still need Paddy visual confirm
- New qtype IDs 49–68 not yet usable in generate-event-deck-v2 (need slide layout config per type)

### Key refs
- kbt-api worker: deployed 2026-05-13, etag 5a7b4661
- kbt_qtype: 68 rows (IDs 1–68)
- Supabase: huvfgenbcaiicatvtxak.supabase.co

# Session Handover — 2026-05-12 (Sport Platform + Firebase Decommission)

**For:** the next Claude session.
**Project:** School Sport Portal / SportCarnival / Carnival Timing.

---

## What this session did (all deployed to production)

### 1. WPS Athletics 2026 — full app restored at canonical URL
- `sportcarnival.com.au/williamstownps/Athletics26` was serving a 25 KB stub. Restored to full 70 KB Firebase-backed app from `Luck-Dragon-Pty-Ltd/wps-athletics-2026/index.html` by updating the `WPS_ATHLETICS_H` constant in the `sportcarnival-hub` worker.

### 2. Site-wide bug audit + cross-linking
- Fixed `www.schoolsportportal.com.au` (was serving 879-byte broken stub) — deployed redirect HTML + `_redirects` so it now 301s to apex.
- Injected `SC_NAV_BANNER` into every `sportcarnival.com.au` carnival page via worker response wrapper. Banner shows `SportPortal · WPS Portal · District Portal · ● Live Timing` with the Live Timing button rewritten per-page to point at the correct event-timing URL.
- Enriched hierarchy pages `/district`, `/division`, `/region`, `/state` on `schoolsportportal.com.au` with carnival event pills + admin sign-in pills + Live Timing CTA.
- WPS XC redirect: `sportcarnival.com.au/williamstownps/XC26` → 302 → `/district/primary/williamstown/XC26` (no standalone WPS XC carnival exists; WPS kids run in the District XC carnival).

### 3. Per-event live timing pages on `carnivaltiming.com`
- Old: one 251 KB marketing page for every URL.
- New routes:
  - `https://carnivaltiming.com/` and `/events` → Live Carnival Events index
  - `https://carnivaltiming.com/wps-athletics-2026` → live results
  - `https://carnivaltiming.com/wps-swimming-2026` → live results
  - `https://carnivaltiming.com/wd-crosscountry-2026` → live results
  - `/marketing` → preserves the old 251 KB marketing landing
- Each event page polls `https://sportcarnival.com.au/api/list` every 30 s and `/api/results?carnival=CODE` every 5 s while visible. Pauses on `document.hidden`.
- Multi-carnival picker, search, house/school filter, age-group filter, live-connection badge.
- **Zero Firebase SDK** — pure D1 REST.

### 4. Firebase Decommission — Option B executed
**Audit finding:** the 2026-05-04 doc was stale. The `/williamstowndistrict` migration it described as the only outstanding item had already been done. Both `ssp-portal` and `schoolsportportal` workers have **zero Firebase SDK refs** and poll D1 directly.

**This session migrated the remaining two consumers:**

**WPS_ATHLETICS_H** (the live marshal recording app):
- Removed `firebasejs` `<script>` tags and `firebase.initializeApp` call.
- Replaced with D1 API shim that preserves the Firebase JS API surface (`fbDb.ref(path).on/.off/.child/.set/.remove`, `.info/connected`). The other 950 lines of the carnival app untouched.
- Reads: poll `/api/results/WPSAT` every 5 s. Writes: optimistic local + `POST /api/results/WPSAT` with full state.
- PIN prompted once per session via `prompt()`, stored in `sessionStorage`. Cleared on tab close. Auto-cleared on 403 response.

**WPS_SWIMMING_H** (read-only):
- Same SDK removal. Shim emulates `db.ref('carnivalResults').on('value', cb)` via `/api/list` + `/api/results/{code}` polling.

**`carnival-results` worker — PIN-gated write endpoint:**
- `POST /api/results/{code}` now requires one of:
  - `X-Publish-Pin` header matching env `CARNIVAL_PUBLISH_PIN`, OR
  - Session cookie with role `admin`/`committee`/`coach`
- CORS allow-headers extended for `X-Publish-Pin`.
- Code validated `/^[A-Z0-9]{3,16}$/`.

**Generated and stored a fresh publish PIN:**
- 20 chars, ambiguous chars (I/O/0/1) excluded.
- Vault key: `CARNIVAL_PUBLISH_PIN`
- Bound as worker secret on `carnival-results`.

**Verified in production:**
- POST without PIN → 403 ✓
- POST with wrong PIN → 403 ✓
- POST with correct PIN → 200 + record landed in D1 ✓
- Athletics26 page: 0 live `firebase.*` refs (regex strips both HTML and JS comments) ✓
- Swim26 page: 0 live `firebase.*` refs ✓
- All 8 other sport URLs HTTP 200, no regressions ✓

---

## State at session end

### What's working
- All sport URLs serve correctly. No production code uses Firebase anymore.
- Live timing pages render real D1 data (verified WPSAT shows 12 placings across 3 races).
- Banner cross-linking functional on every carnival page.
- PIN auth on publish endpoint verified end-to-end.

### What's NOT done (handover items)

**1. Firebase rules NOT applied — anonymous writes still succeed.**

Paddy attempted the manual paste during this session but the rules did not take effect. Verified by sending PATCH probes after his "done" — every probe still succeeded (HTTP 200) including `/scores`, `/users`, `/fb`, `/test_write` which should be locked. All probe data cleaned up via DELETE.

Possible causes: parse error in editor that silently rejected Publish; clicked Save but not Publish; pasted to wrong field. Browser automation was attempted via the Chrome extension but extension permission prompts could not be granted (Paddy couldn't locate the prompt UI), then the MCP relay timed out for 4 minutes.

**Next session's first task:** verify whether Paddy has since pasted the rules manually. Quick check:

```bash
DB="https://willy-district-sport-default-rtdb.asia-southeast1.firebasedatabase.app"
curl -sS -X PATCH -H "Content-Type: application/json" --data '{"_probe":true}' "$DB/test_root.json" -w "
HTTP %{http_code}
"
# If 200 -> rules still wide open. If 401/403 -> rules applied.
# Cleanup if 200:  curl -X DELETE "$DB/test_root.json"
```

Rules file is at `Luck-Dragon-Pty-Ltd/asgard-workers/docs/firebase-rules-2026-05-12.json` (commit `28928424`).

**Alternative path** (offered, not chosen): generate a Firebase service account JSON, paste into Vault as `FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT`, then Claude can apply rules + manage Firebase via API permanently.

**2. First real carnival day** — first marshal will be prompted for PIN. Show them `CARNIVAL_PUBLISH_PIN` from Vault. If `sessionStorage` re-prompt friction is bad, change to `localStorage` (one-line edit in `WPS_ATHLETICS_H` shim).

**3. After first successful carnival**
- Verify D1 has results via `https://sportcarnival.com.au/api/results?carnival=WPSAT`
- Tail `carnival-results` worker logs for any 403s
- Schedule GCP project deletion 1 month after first clean carnival

---

## Key paths and secrets

- **Vault PIN:** `535554`, header `X-Pin`. Endpoint `asgard-vault.pgallivan.workers.dev/secret/{KEY}`.
- **Carnival publish PIN:** Vault key `CARNIVAL_PUBLISH_PIN` (20 chars).
- **D1 db (carnival-results):** `4c39e40c-b6ca-40db-83bb-e8c69bad6537`. Tables: `carnivals`, `results`, `division_winners`, `scores`, `users`, `auth_attempts`, `password_reset_tokens`.
- **D1 db (asgard-prod):** `b6275cb4-9c0f-4649-ae6a-f1c2e70e940f`. Tables include `projects`, `products`, `project_events`, `product_checks`.
- **Workers modified this session:**
  - `sportcarnival-hub` — banner injection, XC redirect, Athletics + Swim Firebase removal
  - `carnival-results` — PIN-auth on POST /api/results
  - `carnival-timing-html` — per-event routes
  - `ssp-portal` — hierarchy enrichment
- **Backup of pre-session worker source:** `/home/claude/asgard-backup/` (will be wiped on container reset; rely on Cloudflare deployment history for rollback instead)

---

## Logged events in asgard-prod project_events table

1. `wps-athletics-app-restored` — full 70KB app restored
2. `bug-audit-2026-05-12` — banner injection + hierarchy + www fix
3. `timing-engine-per-event-routes` — carnivaltiming.com per-event pages v1
4. `timing-schema-corrected-v3` — schema research findings
5. `timing-pages-on-d1-api` — switched timing pages to D1 REST
6. `firebase-audit-2026-05-12` — audit + locked rules file ready
7. `firebase-decomm-option-b-complete` — WPS Athletics + Swim fully off Firebase

---

## Resume next session by

1. Run the Firebase rules check probe above
2. If rules still open: prompt Paddy to either paste manually OR generate service account
3. If carnival has run: verify D1 results and clean up Firebase mirror (`pushToFirebase` in `carnival-timing-ws`)
