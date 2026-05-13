# SportPortal — Current State (2026-05-12)

Live domains all 200:
- sportportal.com.au (marketing)
- schoolsportportal.com.au (portal + districts/divisions/regions hierarchy)
- sportcarnival.com.au (carnival event pages with cross-linking banner)
- carnivaltiming.com (per-event live results pages)

Canonical URL scheme (per Paddy 2026-05-12):
- sportportal.com.au = home (.com is unowned, registered with Uniregistry, not acquirable)
- schoolsportportal.com.au/williamstownps = WPS school page
- schoolsportportal.com.au/district/primary/williamstown = Williamstown District
- schoolsportportal.com.au/division/primary/{hobsonsbay,wyndham}
- schoolsportportal.com.au/login?as=<account_id> for admin disambiguation
- sportcarnival.com.au/williamstownps/{XC26,Athletics26,Swim26}
  (XC26 -> 302 redirect to district XC; no standalone WPS XC carnival exists)
- sportcarnival.com.au/district/primary/williamstown/XC26
- carnivaltiming.com/{wps-athletics-2026,wps-swimming-2026,wd-crosscountry-2026} live timing
- carnivaltiming.com/marketing preserves the old marketing landing
- District legacy: district.luckdragon.io -> 301 -> /district/primary/williamstown
- WPS Athletics legacy: wps-athletics-2026.pages.dev -> meta-refresh -> canonical Athletics26

Firebase status: production code is fully off Firebase. /fl/, /wps_aths_2026, /carnivalResults paths still exist in Firebase Realtime DB as mirror, but no live writer/reader. Anonymous writes still possible until rules are pasted (paddy attempted 2026-05-12 but rules did not take effect).

Source of truth: D1 via carnival-results worker (db_id 4c39e40c-b6ca-40db-83bb-e8c69bad6537). API: /api/list, /api/results?carnival=CODE, POST /api/results/{code} (auth: X-Publish-Pin header or session cookie).

Publish PIN: vault key CARNIVAL_PUBLISH_PIN. Used by marshal apps via sessionStorage prompt.

See SESSION-HANDOVER.md for full session detail.
