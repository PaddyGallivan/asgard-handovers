# SportPortal — Current State (2026-05-13)

## Status: FULLY OPERATIONAL — 58/58 tests passing

## Live domains
- sportportal.com.au (marketing hub)
- schoolsportportal.com.au (portal + hierarchy)
- www.schoolsportportal.com.au (serves full portal — DNS change needed for strict 301, low priority)
- sportcarnival.com.au (carnival event pages)
- carnivaltiming.com (per-event live results pages, D1-backed)

## Canonical URL scheme
- sportportal.com.au = home (.com unowned, Uniregistry)
- schoolsportportal.com.au/williamstownps = WPS school
- schoolsportportal.com.au/district/primary/williamstown = Williamstown District
- schoolsportportal.com.au/division/primary/{hobsonsbay,wyndham}
- schoolsportportal.com.au/{district,division,region,state} = hierarchy indexes
- schoolsportportal.com.au/login?as=<account_id> = admin disambiguation
- sportcarnival.com.au/williamstownps/{Athletics26,Swim26} = school carnival apps
- sportcarnival.com.au/williamstownps/XC26 → 302 → /district/primary/williamstown/XC26
- sportcarnival.com.au/district/primary/williamstown/XC26 = WD XC carnival
- carnivaltiming.com/{wps-athletics-2026,wps-swimming-2026,wd-crosscountry-2026} = live timing
- carnivaltiming.com/marketing = old marketing landing (preserved)
- Legacy redirects: district.luckdragon.io→/district/primary/williamstown; wps-athletics-2026.pages.dev→/Athletics26

## Firebase status: FULLY DECOMMISSIONED
- No production code executes any Firebase SDK
- Firebase rules locked: anon writes return 401 on all paths
- Public reads still work on /fl, /wps_aths_2026, /carnivalResults (timing pages)
- Service account: firebase-rules-admin@willy-district-sport.iam.gserviceaccount.com
- Vault key: FIREBASE_ADMIN_KEY_WILLY_DISTRICT_SPORT

## Data source: D1 (canonical)
- carnival-results worker, db_id 4c39e40c-b6ca-40db-83bb-e8c69bad6537
- GET /api/list → carnival list
- GET /api/results?carnival={CODE} → race results
- POST /api/results/{CODE} → publish (requires X-Publish-Pin header)
- Vault key: CARNIVAL_PUBLISH_PIN (20 chars, marshal prompt once per session)

## Workers
- ssp-portal: schoolsportportal.com.au + www (full portal, hierarchy, admin)
- sportcarnival-hub: sportcarnival.com.au (all event pages, nav banner injection)
- carnival-results: /api/* endpoints, D1-backed
- carnival-timing-html: carnivaltiming.com (per-event live results pages)

## Next actions
- First carnival day: give marshal CARNIVAL_PUBLISH_PIN from Vault
- Post-carnival: verify D1 results, schedule GCP project deletion after 1 clean month
- www.schoolsportportal.com.au strict 301: needs DNS edit permission for schoolsportportal.com.au zone
