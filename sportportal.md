# SportPortal — Current State (2026-05-13)

## Status: FULLY OPERATIONAL — 25/25 URL checks, 62/62 link checks passing

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
- schoolsportportal.com.au/billing — 301 → Stripe Customer Portal (configure real URL in Stripe Dashboard)
- schoolsportportal.com.au/setup?token=<tok> — first-time account setup (48hr token from welcome email)
- schoolsportportal.com.au/thanks — post-Stripe payment confirmation
- sportcarnival.com.au/williamstownps/Athletics26 — WPS Athletics marshal app
- sportcarnival.com.au/williamstownps/Swim26 — WPS Swimming marshal app
- sportcarnival.com.au/williamstownps/XC26 → 302 → /district/primary/williamstown/XC26
- sportcarnival.com.au/district/primary/williamstown/XC26 — WD XC marshal app
- sportcarnival.com.au/api/list, /api/results?carnival=CODE, /api/status — D1 API
- carnivaltiming.com/{wps-athletics-2026,wps-swimming-2026,wd-crosscountry-2026} — live results
- carnivaltiming.com/events — event index
- carnivaltiming.com/marketing — original marketing landing (preserved)
- Legacy: district.luckdragon.io/* → 301 → /district/primary/williamstown (path always stripped)
- Legacy: wps-athletics-2026.pages.dev → meta-refresh → /williamstownps/Athletics26

## D1 source of truth
- carnival-results-db: 4c39e40c-b6ca-40db-83bb-e8c69bad6537 (carnivals, results, users, auth_tokens, scores)
- ssp-db: 3b16b0aa-9a4b-4e46-91f1-5769f278e920 (schools, students, carnivals, organisations, sessions)
  - D1 binding in ssp-portal worker is named DB (not SSP_DB) — critical, took time to find

## Stripe flow (fully wired)
- Form on homepage → ssp-contact.pgallivan.workers.dev → Stripe checkout session created + Paddy notified by email
- Stripe webhook at /stripe-webhook handles:
  - checkout.session.completed → INSERT school record + send setup email (48hr token)
  - invoice.paid → re-activate school record + send renewal confirmation email
  - invoice.payment_failed → send payment failure warning email
- Stripe price IDs: SSP_PRICE_ID = price_1TTcFlAm8bVflPN0biv8zblH
- Buy links: $49 = buy.stripe.com/8x26oGgux9IT3wQckm9IQ05, $149 = buy.stripe.com/7sY3cu3HL8EP4AUesu9IQ06

## Firebase status: FULLY DECOMMISSIONED from production apps
- WPS_ATHLETICS_H, WPS_SWIMMING_H — D1 API via PIN auth ✓
- Carnival timing pages — D1 API ✓
- SSP portal — never used Firebase ✓
- **District coordinator app (district-sport/index.html) — STILL on Firebase** (seasons/fixtures/ladders/historical data). Migration deferred post-first carnival. Requires D1 schema design.
- Firebase rules locked: anon writes 401. Public reads on /fl, /wps_aths_2026 still open (timing fallback).
- Service account: firebase-rules-admin@willy-district-sport.iam.gserviceaccount.com → Vault: FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT

## Workers (key)
- ssp-portal: all schoolsportportal.com.au routes incl. contact, forgot-password, pricing, billing, Stripe webhook, D1 school page rendering
- sportcarnival-hub: sportcarnival.com.au — carnival apps, nav banner, API endpoints
- carnival-results: REST API over D1 (PIN auth for marshals, session auth for admins, race-day reminder cron, forgot-password API)
- carnival-timing-html: carnivaltiming.com — event index, per-event live results, proper 404 for unknown paths, 301 for known SSP paths
- district-proxy: district.luckdragon.io → 301 → fixed URL (all paths stripped)

## Carnival day checklist
1. Get CARNIVAL_PUBLISH_PIN from Vault
2. Open sportcarnival.com.au/williamstownps/Athletics26 on marshal device
3. Enter PIN when prompted (once per session)
4. Results appear on carnivaltiming.com/wps-athletics-2026 within ~5s
5. Post-carnival: verify at sportcarnival.com.au/api/results?carnival=WPSAT

## Outstanding
- District app Firebase migration (post-carnival, needs D1 schema)
- WPSAT 12 places = test data (Liam Chen etc) — real results on carnival day
- WPS principal/phone cleared — add when ready via /admin/school/settings or D1 directly
- /billing Stripe URL = placeholder — configure real Customer Portal URL in Stripe Dashboard
