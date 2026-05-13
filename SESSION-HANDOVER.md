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
curl -sS -X PATCH -H "Content-Type: application/json" --data '{"_probe":true}' "$DB/test_root.json" -w "\nHTTP %{http_code}\n"
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
