# Asgard Fleet Audit — 2026-05-14

## Headline
**154 workers** in the account. Activity is healthy — 139 of them touched within the last 30 days. The revert-loop problem that's been costing time has been hardened: the asgard-ai watchdog now only reverts on catastrophic conditions, not on every benign deploy.

## Activity buckets

| Bucket | Count | Notes |
|---|---|---|
| Touched today | 20 | Currently working on these |
| Touched this week | 19 | Recent work |
| Touched this month | 100 | Active project surface |
| Touched in last quarter | 0 | All work has been in the last month |
| **Stale (>3 months untouched)** | **15** | Retire candidates |

## Stale workers — propose retire (none deleted yet, your call)

1. `asgard-staging` — old staging mirror, superseded by versioned deploys
2. `bout-transcribe` — old project, probably dead
3. `falkor-school` — superseded by `falkor-school` route logic in newer workers? check first
4. `family-comp-manager` — old
5. `kbt-trial` — old KBT trial endpoint
6. `lesson-handler` — superseded
7. `paddy-finance` — old finance worker, probably superseded
8. `rate-limiter-ip` — superseded by `rate-limiter`
9. `registry` — old worker registry; project_hub now does this in D1
10. `route-bootstrap-now` — one-shot setup script, can delete
11. `savemyseat` — superseded by SaveMySeat product (different name?)
12. `schoolsportportal` — possibly superseded by `ssp-portal`
13. `sly-score-cron` — check if still in Sly Tipping rotation
14. `superleague-ai` — old
15. `superleague-yeah-v4` — old (yeah-v5 exists?)

To check whether any are safe to delete: ask Falkor "is `<name>` still in use? show me what calls it." Or just rename them with a `__retired-` prefix as a soft delete.

## Revert-risk audit — what can write to what

There are **exactly two** auto-redeploy paths in the fleet. Every other deploy is human/chat triggered.

### 1. `falkor-workflows` — asgard-ai watchdog (HARDENED v3.14.0)

- **Cron**: `* * * * *` (every minute), throttled by KV stamp to **once per 14 minutes**
- **Target**: only `asgard-ai`
- **Source of truth**: GitHub `Luck-Dragon-Pty-Ltd/asgard-source/workers/asgard-ai.js`
- **Trigger (NEW v3.14.0)**: redeploys only on catastrophic conditions
  - `/health` probe returns non-200, OR
  - live source size drops below 30% of canonical (massive shrink/corruption), OR
  - live source contains `__ROGUE_DEPLOY__` marker
- **Benign mismatch handling**: if version_id differs from canonical but live is healthy and size is reasonable, **auto-bump canonical to current** (no revert). This kills the false-positive class.
- **Kill switch**: clear `ASGARD_AI_CANONICAL_DEPLOY_ID` in vault → watchdog returns `{ skipped: true, reason: 'no canonical id in vault' }`.

### 2. `falkor-code` — fleet self-heal (unchanged, already safe)

- **Cron**: `*/15 * * * *` (every 15 min)
- **Targets**: only workers in its monitor list with `autoHeal: true`. Currently:
  `falkor-agent`, `falkor-kbt`, `falkor-brain`, `falkor-workflows`, `falkor-school`, `falkor-web`, `falkor-calendar`, `falkor-push`, `falkor-sport`, `falkor-ui`, `falkor-widget`, `falkor-ct-ai`, `falkor-ssp-ai`, `falkor-sportcarnival-ai`
- **Source of truth**: GitHub `Luck-Dragon-Pty-Ltd/asgard-source/workers/<name>.js`
- **Trigger**: ONLY when `/health` probe returns non-200 (already conservative — it does not heal healthy workers)
- **Kill switch**: change the worker's entry to `autoHeal: false` in `falkor-code/index.js`

### What is NOT auto-redeployed
- `asgard-ai` itself (only watchdog touches it, and only on catastrophe now)
- All other 138 workers — only chat/manual deploys

## Deploy contract — how to change any worker safely

**Rule 1 — GitHub is the source of truth for self-healed workers.**
For any worker in the falkor-code monitor list with `autoHeal: true`, the canonical version is the latest commit on `asgard-source/workers/<name>.js`. If you deploy to CF without committing to GitHub, and the worker's /health later fails (even briefly), self-heal will restore the GitHub version and lose your change.

**Rule 2 — Three-step deploy that survives self-heal:**
1. Commit your change to `asgard-source/workers/<name>.js` on `main`.
2. Deploy to Cloudflare via `PUT /workers/scripts/<name>/content` (preserves bindings).
3. For `asgard-ai` only — update `ASGARD_AI_CANONICAL_DEPLOY_ID` + `ASGARD_AI_CANONICAL_SIZE` in vault. (The hardened watchdog will auto-bump these for you on benign changes, but doing it explicitly is faster and prevents the 15-minute auto-bump delay.)

**Rule 3 — Watchdog reaction map**

| Live state | Watchdog action |
|---|---|
| Healthy AND matches canonical | nothing |
| Healthy BUT size differs from canonical | auto-bump canonical to current — no revert |
| Healthy BUT version_id differs from canonical | auto-bump canonical to current — no revert |
| **/health returns non-200** | revert from GitHub source |
| **Size dropped <30% of canonical** | revert from GitHub source |
| **Source contains `__ROGUE_DEPLOY__`** | revert from GitHub source |

**Rule 4 — Don't base patches on stale CF downloads.**
When making consecutive changes to a worker, either consolidate them into one push or always pull the latest from `raw.githubusercontent.com/.../<name>.js` (which is always current with the latest commit) instead of the CF API (which can be one deploy behind during the propagation window).

## Verification right now

- `falkor-workflows` deployed at v3.14.0 with hardened watchdog
- Vault canonical for asgard-ai matches current live deploy
- Next watchdog cron run will: see current==canonical, return healthy, no action. If you deploy a benign change, watchdog will auto-bump canonical instead of reverting.

## Pending follow-ups

1. Decide on the 15 stale workers — keep, delete, or rename with `__retired-` prefix
2. Add `__ROGUE_DEPLOY__` marker to the static-text-check list of asgard-ai's own source so anyone deploying with the marker triggers an instant revert (safety net for known-bad code patterns)
3. Optional: add a similar canonical-pinning mechanism for `falkor-ui` and `falkor-agent` — these are autoHeal:true so they're already protected, but having an explicit canonical pointer would let benign changes auto-bump rather than revert if /health hiccups
4. Optional: deploy ledger in D1 — every deploy logged with name + version_id + actor + reason + commit_sha for forensic reviewability
