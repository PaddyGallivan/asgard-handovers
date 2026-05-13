# SportPortal — Current State (2026-05-13)

## Status: FULLY OPERATIONAL — 21/21 checks passing

## Live domains
- sportportal.com.au (marketing hub)
- schoolsportportal.com.au (portal + hierarchy)
- www.schoolsportportal.com.au → 301 → apex
- sportcarnival.com.au (carnival event pages + marshal apps)
- carnivaltiming.com (per-event live results pages, D1-backed)

## Canonical URL scheme
- sportportal.com.au — home
- schoolsportportal.com.au — portal home
- schoolsportportal.com.au/williamstownps — WPS school (D1-dynamic, slug alias williamstownps→williamstownprimary)
- schoolsportportal.com.au/district/primary/williamstown — full 92KB district app (live-fetched from GitHub)
- schoolsportportal.com.au/division/primary/{hobsonsbay,wyndham}
- schoolsportportal.com.au/{district,division,region,state} — hierarchy indexes
- schoolsportportal.com.au/wmr — Western Metropolitan Region
- schoolsportportal.com.au/login?as=<id> — admin sign-in
- schoolsportportal.com.au/forgot-password — password reset (calls carnival-results /auth/forgot-password)
- schoolsportportal.com.au/contact — contact form (POSTs to ssp-contact.pgallivan.workers.dev)
- schoolsportportal.com.au/pricing — pricing page (Stripe buy links)
- schoolsportportal.com.au/billing — 301 → Stripe Customer Portal (⚠ PENDING: configure real URL in Stripe Dashboard → Settings → Customer Portal)
- schoolsportportal.com.au/setup?token=<tok> — first-time account setup (48hr token from welcome email)
- schoolsportportal.com.au/thanks — post-Stripe payment confirmation
- sportcarnival.com.au/williamstownps/Athletics26 — WPS Athletics marshal app
- sportcarnival.com.au/williamstownps/Swim26 — WPS Swimming marshal app
- sportcarnival.com.au/williamstownps/XC26 → 302 → /district/primary/williamstown/XC26
- sportcarnival.com.au/district/primary/williamstown/XC26 — WD XC marshal app
- sportcarnival.com.au/api/list, /api/results?carnival=CODE, /api/status — D1 API
- carnivaltiming.com/events — event index
- carnivaltiming.com/marketing — original marketing landing (preserved)
- Legacy: district.luckdragon.io/* → 301 → /district/primary/williamstown (path always stripped)
- Legacy: wps-athletics-2026.pages.dev → meta-refresh → /williamstownps/Athletics26

## D1 source of truth
- carnival-results-db: 4c39e40c-b6ca-40db-83bb-e8c69bad6537 (carnivals, results, users, auth_tokens, scores)
- ssp-db: 3b16b0aa-9a4b-4e46-91f1-5769f278e920 (schools, students, carnivals, organisations, sessions)
  - CRITICAL: D1 binding in ssp-portal worker is named DB (not SSP_DB) — caused silent failures, now fixed

## D1 school data (as of 2026-05-13)
- williamstownprimary: suburb=Williamstown, state=VIC; principal/phone=NULL (Paddy's instruction)
- williamstown-district: suburb=Williamstown, state=VIC
- hobsonsbay: suburb=Williamstown, state=VIC
- wyndham: suburb=Williamstown, state=VIC

## Stripe flow (fully wired)
- Form on homepage → ssp-contact.pgallivan.workers.dev → Stripe checkout session created + Paddy notified by email
- Stripe webhook at /stripe-webhook handles:
  - checkout.session.completed → INSERT school record + send setup email (48hr token)
  - invoice.paid → re-activate school record + send renewal confirmation email
  - invoice.payment_failed → send payment failure warning email
- Stripe price IDs: SSP_PRICE_ID = price_1TTcFlAm8bVflPN0biv8zblH
- Buy links: $49 = buy.stripe.com/8x26oGgux9IT3wQckm9IQ05, $149 = buy.stripe.com/7sY3cu3HL8EP4AUesu9IQ06
- CT access webhook: we_1TS4y0Am8bVflPN0qCkWbAkO

## Privacy policy (FIXED 2026-05-13)
- Both ssp-portal and sportcarnival-hub workers updated
- Firebase region now correctly stated as Singapore (asia-southeast1), NOT Australian region
- Previous wording was incorrect and a compliance risk under APP 8
- Correct wording: "Google Firebase Realtime Database — Singapore region (asia-southeast1) — legacy only, district coordinator seasonal data. Migration to Cloudflare D1 (Sydney) in progress."

## Firebase status
- WPS_ATHLETICS_H, WPS_SWIMMING_H — D1 API via PIN auth ✓
- Carnival timing pages — D1 API ✓
- SSP portal — never used Firebase ✓
- **District coordinator app (district-sport/index.html) — STILL on Firebase** (seasons/fixtures/ladders/historical data). Migration deferred post-first carnival.
- Firebase DB: willy-district-sport-default-rtdb.asia-southeast1.firebasedatabase.app (Singapore — non-compliant with APP 8, migration pending)
- Firebase rules locked: anon writes 401. Public reads on /fl, /wps_aths_2026 still open (timing fallback).
- Service account: firebase-rules-admin@willy-district-sport.iam.gserviceaccount.com → Vault: FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT

## Workers (key)
- ssp-portal: all schoolsportportal.com.au routes incl. contact, forgot-password, pricing, billing, Stripe webhook, D1 school page rendering
- sportcarnival-hub: sportcarnival.com.au — carnival apps, nav banner, API endpoints
- carnival-results: REST API over D1 (PIN auth for marshals, session auth for admins, race-day reminder cron, forgot-password API)
- carnival-timing-html: carnivaltiming.com — event index, per-event live results, proper 404 for unknown paths, 301 for known SSP paths
- district-proxy: district.luckdragon.io → 301 → fixed URL (all paths stripped)

## Legal & compliance (as of 2026-05-13)
- Entity: Luck Dragon Pty Ltd (ABN 64 697 434 898, GST registered 23 April 2026)
- Paddy holds dual role: DET employee (PE teacher + district convenor) AND Luck Dragon director
- IP: platform built on personal time/hardware — Luck Dragon owns all IP, but grey area under DET policy (software used in performance of DET duties). Needs AEU/employment lawyer opinion before commercial scale.
- Conflict of interest: Paddy sells software to DET schools incl. his own — PENDING disclosure to WPS principal (simple form)
- Trademark: 'School Sport Portal' and 'Carnival Timing' not yet registered — recommended before scaling (~$250/name via IP Australia)
- Firebase Singapore = APP 8 non-compliance (cross-border disclosure) — fix is D1 migration

## Business context
- Pricing: $1 + GST per student per year
- Target: PE teachers/district coordinators across Victorian primary schools
- Acquisition funnel: Williamstown District (done) → Hobsons Bay Division → Wyndham → WMR → SSV preferred supplier → state
- One real paying customer: WPS (Paddy's own school, pilot)
- Revenue pre-commercial. Cost: ~$10 AUD/month fixed.

## Google Drive
- Luck Dragon folder: 1Chdl4d-RbIqXH2dPyrC9THtRBJqGn04V
- Sport Portal folder (new, 2026-05-13): 1vp6p3iWjBGzUkmrvzKxL5EW2wyh4HyO4
  - Contains: plain text Google Doc (19-section reference), formatted docx (open with Google Docs to convert), HTML source
- SSV Project Spec (docx): 1JmVSD2HCM3eqwvYa-CUFl5BNhsviAKIN
- SSV Pitch Deck (pptx): 1dYGV8XFw66Kfyc4GqatVCIHNEPzyPqMe
- Legal Brief for Nick Zavatierri (Google Doc): 1F6d5PkBc8dnITwM8zEYTh5ccTyq5J--ZwYSyoWtal3I

## Carnival day checklist
1. Get CARNIVAL_PUBLISH_PIN from Vault
2. Open sportcarnival.com.au/williamstownps/Athletics26 on marshal device
3. Enter PIN when prompted (once per session)
4. Results appear on carnivaltiming.com within ~5s
5. Post-carnival: verify at sportcarnival.com.au/api/results?carnival=WPSAT

## Outstanding / pending
- ⚠ /billing Stripe URL = placeholder — configure real Customer Portal URL in Stripe Dashboard → Settings → Customer Portal
- ⚠ District app Firebase migration — post-carnival, needs D1 schema for seasons/fixtures/ladders/teams
- ⚠ WPSAT 12 places = test data (Liam Chen etc) — real results on carnival day
- ⚠ WPS principal/phone = NULL in D1 — add when ready via /admin/school/settings
- ⚠ Conflict of interest disclosure to WPS principal — pending
- ⚠ AEU/employment lawyer on DET IP question — pending
- ⚠ Trademark registration for 'School Sport Portal' + 'Carnival Timing' — pending
- ⚠ Formatted Google Doc — docx in Drive folder, right-click → Open with Google Docs to convert
