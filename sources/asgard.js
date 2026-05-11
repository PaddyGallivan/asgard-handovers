// asgard worker v7.9.2 — Drive references purged, bridge installers point to GitHub
// Built on top of v6.5.0 (Claude-style chat layout). PROJECTS list and chat behavior unchanged.

const VERSION = '7.9.2';
const TOOLS_URL = 'https://asgard-tools.pgallivan.workers.dev';

// Live inventory pulled from CF API + GitHub. 39 projects.
const PROJECTS = [
  {
    "id": "bomber-boat",
    "name": "Bomber Boat",
    "url": "https://bomberboat.com.au",
    "repo": "LuckDragonAsgard/bomber-boat",
    "tag": "CF Pages",
    "context": "Bomber Boat is a Vic Football boat-spotting game. CF Pages project: bomber-boat. NEVER touch deploy-spots-fix scripts."
  },
  {
    "id": "bulldogs-boat",
    "name": "Bulldogs Boat",
    "url": "https://bulldogsboat.com.au",
    "repo": "?",
    "tag": "CF Pages",
    "context": "Bulldogs version of the Bomber Boat game. Domain migrated from Squarespace to VentraIP."
  },
  {
    "id": "sport-portal",
    "name": "Sport Portal",
    "url": "https://sportportal.com.au",
    "repo": "LuckDragonAsgard/sport-portal",
    "tag": "CF Pages",
    "context": "Main sports carnival/timing platform. Pages project: sportportal."
  },
  {
    "id": "schools-sport",
    "name": "Schools Sport Portal",
    "url": "https://schoolsportportal.com.au",
    "repo": "?",
    "tag": "CF Pages",
    "context": "Schools-flavoured Sport Portal. Pages project: schoolsportportal."
  },
  {
    "id": "carnival-timing",
    "name": "Carnival Timing",
    "url": "https://carnivaltiming.com",
    "repo": "LuckDragonAsgard/district-sport",
    "tag": "CF Pages",
    "context": "Carnival Timing site. Pages project: carnival-timing. Repo is district-sport."
  },
  {
    "id": "kbt-trivia",
    "name": "KBT Trivia",
    "url": "https://kbt-trial.vercel.app/host-app",
    "repo": "LuckDragonAsgard/kbt-trivia-tools",
    "tag": "Vercel",
    "context": "KBT Trivia hosting tool. Prod on Vercel; also auto-deploys to CF Pages (kbt-trial-9gu.pages.dev) via gh-push."
  },
  {
    "id": "superleague",
    "name": "Superleague",
    "url": "https://superleague.pgallivan.workers.dev",
    "repo": "LuckDragonAsgard/superleague",
    "tag": "CF Worker",
    "context": "Superleague v4 CF Worker. MUST include KV binding SLY_STATIC=4f427724561e48f682d4a7c6153d7124 on deploy or worker 500s."
  },
  {
    "id": "division-hub",
    "name": "Division Hub",
    "url": "https://luckdragonasgard.github.io/division-hub/",
    "repo": "LuckDragonAsgard/division-hub",
    "tag": "GH Pages",
    "context": "Division Hub on GitHub Pages."
  },
  {
    "id": "cyms-club",
    "name": "CYMS Club App",
    "url": "https://github.com/LuckDragonAsgard/cyms-club-app",
    "repo": "LuckDragonAsgard/cyms-club-app",
    "tag": "Repo",
    "context": "CYMS Club App. Code only \u2014 no live deployment yet."
  },
  {
    "id": "falkor-app",
    "name": "Falkor",
    "url": "https://github.com/LuckDragonAsgard/falkor-app",
    "repo": "LuckDragonAsgard/falkor-app",
    "tag": "Repo",
    "context": "Falkor app. Code only."
  },
  {
    "id": "asgard",
    "name": "Asgard Dashboard",
    "url": "https://asgard.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Asgard 7.0 dashboard worker. Source on GitHub: PaddyGallivan/asgard-source/workers/asgard.js. Deploy via asgard-tools /admin/deploy. main_module is asgard.js."
  },
  {
    "id": "asgard-tools",
    "name": "Asgard Tools",
    "url": "https://asgard-tools.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Asgard agent loop worker. Endpoints: /health, /chat/smart, /tools, /admin/deploy. Source on GitHub: PaddyGallivan/asgard-source/workers/asgard-tools.js. main_module is asgard-tools.js."
  },
  {
    "id": "asgard-brain",
    "name": "Asgard Brain",
    "url": "https://asgard-brain.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "D1 SQL service. POST /d1/write and /d1/query, X-Pin: 2967."
  },
  {
    "id": "asgard-vault",
    "name": "Asgard Vault",
    "url": "https://asgard-vault.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Secret storage. GET /secret/{KEY} with X-Pin: 2967."
  },
  {
    "id": "asgard-ai",
    "name": "Asgard AI (proxy)",
    "url": "https://asgard-ai.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Holds ANTHROPIC_API_KEY binding; legacy AI proxy. Mostly superseded by asgard-tools."
  },
  {
    "id": "asgard-email",
    "name": "Asgard Email",
    "url": "https://asgard-email.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Email-handling worker."
  },
  {
    "id": "asgard-email-ui",
    "name": "Asgard Email UI",
    "url": "https://asgard-email-ui.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "UI for asgard-email."
  },
  {
    "id": "asgard-memory",
    "name": "Asgard Memory",
    "url": "https://asgard-memory.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Memory store worker."
  },
  {
    "id": "asgard-monitor",
    "name": "Asgard Monitor",
    "url": "https://asgard-monitor.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Monitoring worker."
  },
  {
    "id": "asgard-watchdog",
    "name": "Asgard Watchdog",
    "url": "https://asgard-watchdog.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Watchdog worker."
  },
  {
    "id": "asgard-pingtest",
    "name": "Asgard Pingtest",
    "url": "https://asgard-pingtest.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Connectivity test."
  },
  {
    "id": "asgard-build",
    "name": "Asgard Build",
    "url": "https://asgard-build.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Build worker."
  },
  {
    "id": "asgard-deploy",
    "name": "Asgard Deploy Helper",
    "url": "https://asgard-deploy-helper.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Deploy helper."
  },
  {
    "id": "asgard-comms",
    "name": "Asgard Comms",
    "url": "https://asgard-comms.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Comms worker."
  },
  {
    "id": "asgard-auth",
    "name": "Asgard Auth",
    "url": "https://asgard-auth.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Auth worker."
  },
  {
    "id": "asgard-agent",
    "name": "Asgard Agent",
    "url": "https://asgard-agent.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Agent worker."
  },
  {
    "id": "asgard-intel",
    "name": "Asgard Intelligence",
    "url": "https://asgard-intelligence.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Intelligence worker."
  },
  {
    "id": "asgard-rank",
    "name": "Asgard Ranking",
    "url": "https://asgard-ranking.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Ranking worker."
  },
  {
    "id": "asgard-workers",
    "name": "Asgard Workers",
    "url": "https://asgard-workers.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Workers worker (meta)."
  },
  {
    "id": "gh-push",
    "name": "gh-push",
    "url": "https://gh-push.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "GitHub push helper. POST body {owner, repo, path, content (base64), message, branch} + Authorization: Bearer GITHUB_TOKEN."
  },
  {
    "id": "craftsman",
    "name": "Craftsman",
    "url": "https://craftsman.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Code-build/deploy worker."
  },
  {
    "id": "bomber-boat-api",
    "name": "Bomber Boat API",
    "url": "https://bomber-boat-api.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Backend API for Bomber Boat."
  },
  {
    "id": "bulldogs-api",
    "name": "Bulldogs Boat API",
    "url": "https://bulldogs-boat-api.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Backend API for Bulldogs Boat."
  },
  {
    "id": "bout-transcribe",
    "name": "Bout Transcribe",
    "url": "https://bout-transcribe.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Audio transcription worker."
  },
  {
    "id": "comms-hub",
    "name": "Comms Hub",
    "url": "https://comms-hub.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Comms hub."
  },
  {
    "id": "comms-hub-int",
    "name": "Comms Hub Integrator",
    "url": "https://comms-hub-integrator.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Comms hub integrator."
  },
  {
    "id": "circuit-breaker",
    "name": "Circuit Breaker",
    "url": "https://circuit-breaker.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Circuit breaker pattern worker."
  },
  {
    "id": "cf-bootstrap",
    "name": "CF Route Bootstrap",
    "url": "https://cf-route-bootstrap.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "Route setup helper."
  },
  {
    "id": "ai-job-proc",
    "name": "AI Job Processor",
    "url": "https://ai-job-processor.pgallivan.workers.dev",
    "repo": "?",
    "tag": "CF Worker",
    "context": "AI job processing queue."
  }
];

// Tool/function shortcuts shown in the left sidebar (prefill the composer with a useful prompt)
const TOOLS = [
  { id: 'deploy',   name: 'Deploy worker',        prompt: 'Deploy the latest source for ' },
  { id: 'gh-push',  name: 'Push to GitHub',       prompt: 'Push this file to LuckDragonAsgard/' },
  { id: 'health',   name: 'Health check all',     prompt: 'Check the health of all Asgard sites and report back which are up/down.' },
  { id: 'workers',  name: 'List CF workers',      prompt: 'List all my deployed Cloudflare Workers with their versions.' },
  { id: 'pages',    name: 'List CF pages',        prompt: 'List my Cloudflare Pages projects and their custom domains.' },
  { id: 'commits',  name: 'Recent commits',       prompt: 'Show me the last 10 commits across all LuckDragonAsgard repos.' },
  { id: 'd1',       name: 'Query D1',             prompt: 'Run this SQL against asgard-brain D1: ' },
  { id: 'secret',   name: 'Read a secret',        prompt: 'Get the value of secret ' },
  { id: 'read-src', name: 'Read worker source',   prompt: 'Show me the source code of the ' },
  { id: 'edit-src', name: 'Patch worker source',  prompt: 'In worker XYZ replace `OLD` with `NEW` and redeploy.' },
  { id: 'image',    name: 'Generate image (DALL-E)',prompt: '/image ' },
  { id: 'drive-up', name: 'Upload to Drive',       prompt: 'Use drive_upload to save a file called  to my Drive containing: ' },
  { id: 'drive-find', name: 'Search Drive',        prompt: 'Use drive_search to find Drive files matching ' },
  { id: 'gh-write', name: 'Write GitHub file',     prompt: 'Use github_write_file to update the path  in repo  with the new content: ' },
  { id: 'email',    name: 'Send email',            prompt: 'Use send_email to send a message to  with subject  and body ' },
  { id: 'vercel-d', name: 'Vercel deployments',    prompt: 'Use vercel_list_deployments with limit 10 and tell me which are live and which failed.' },
  { id: 'vercel-p', name: 'Vercel projects',       prompt: 'Use vercel_list_projects to show all my Vercel projects with their latest deployment URLs.' },
  { id: 'stripe-p', name: 'Stripe products',       prompt: 'Use stripe_list_products to list my Stripe products with prices.' },
  { id: 'stripe-l', name: 'Stripe payment links',  prompt: 'Use stripe_list_payment_links to show my live payment links.' },
  { id: 'sb-q',     name: 'Supabase query',        prompt: 'Use supabase_select on table  to fetch the latest rows.' },
  { id: 'web-search', name: 'Web search',          prompt: 'Use web_search to find ' },
  { id: 'discord',  name: 'Post to Discord',       prompt: 'Use discord_send to post the following message to my Discord: ' },
  { id: 'br-shot',  name: 'Screenshot a URL',      prompt: 'Use browser_screenshot to capture https:// — show me the result.' },
  { id: 'br-md',    name: 'URL → Markdown',        prompt: 'Use browser_markdown on https:// and summarise the page.' },
  { id: 'br-extract', name: 'AI extract from URL', prompt: 'Use browser_json on https:// with prompt: ' },
  { id: 'br-scrape', name: 'Scrape selector',      prompt: 'Use browser_scrape on https:// with selector ' },
  { id: 'br-pdf',   name: 'Render URL as PDF',     prompt: 'Use browser_pdf to convert https:// into a PDF.' },
  // Chrome bridge (real browser)
  { id: 'cr-shot',  name: 'Chrome screenshot',     prompt: 'Use chrome_screenshot to capture my current browser tab.' },
  { id: 'cr-extract', name: 'Chrome extract',      prompt: 'Use chrome_extract on my current tab and summarise what you see.' },
  { id: 'cr-nav',   name: 'Chrome navigate',       prompt: 'Use chrome_navigate to go to https://' },
  // Desktop bridge (real desktop)
  { id: 'ds-shot',  name: 'Desktop screenshot',    prompt: 'Use desktop_screenshot to capture my screen and tell me what is focused.' },
  { id: 'ds-key',   name: 'Desktop keystroke',     prompt: 'Use desktop_key with keys ' },
  { id: 'ds-run',   name: 'Desktop run command',   prompt: 'Use desktop_run with command: ' }
];

// Model picker — id is the API model name, label is what we show.
// Costs are per-million tokens for input / output. Cached pricing class — verify with Anthropic for exact current values.
const MODELS = [
  // Anthropic — full tool agent loop via asgard-tools
  { id: 'claude-opus-4-6',     label: 'Opus 4.6',         provider: 'anthropic', tools: true,  in: 15.00, out: 75.00, blurb: 'Highest capability — long horizons, complex reasoning' },
  { id: 'claude-sonnet-4-5',   label: 'Sonnet 4.5',       provider: 'anthropic', tools: true,  in:  3.00, out: 15.00, blurb: 'Balanced — default, fast enough, smart enough' },
  { id: 'claude-haiku-4-5',    label: 'Haiku 4.5',        provider: 'anthropic', tools: true,  in:  1.00, out:  5.00, blurb: 'Fastest, cheapest Claude — quick checks, high volume' },
  // OpenAI — full tool agent loop via asgard-ai /chat/agentic
  { id: 'gpt-5.5',             label: 'GPT-5.5',          provider: 'openai',    tools: true,  in:  5.00, out: 30.00, blurb: 'OpenAI flagship (Apr 2026) — strongest reasoning + coding' },
  { id: 'gpt-5.4',             label: 'GPT-5.4',          provider: 'openai',    tools: true,  in:  2.50, out: 15.00, blurb: 'Previous flagship — balanced, 1M context' },
  { id: 'gpt-4o-mini',         label: 'GPT-4o mini',      provider: 'openai',    tools: true,  in:  0.15, out:  0.60, blurb: 'Cheapest OpenAI — quick chat' },
  { id: 'o3-mini',             label: 'o3-mini',          provider: 'openai',    tools: true,  in:  1.10, out:  4.40, blurb: 'OpenAI reasoning, smaller' },
  // Google Gemini — chat-only via asgard-ai
  { id: 'gemini-2.5-pro',      label: 'Gemini 2.5 Pro',   provider: 'gemini',    tools: true,  in:  1.25, out: 10.00, blurb: 'Long context (1M+), strong reasoning — no Asgard tools yet' },
  { id: 'gemini-2.5-flash',    label: 'Gemini 2.5 Flash', provider: 'gemini',    tools: true,  in:  0.30, out:  2.50, blurb: 'Cheap and fast Gemini — no tools' }
];

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#d97757">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Asgard">
<meta name="mobile-web-app-capable" content="yes">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icon.svg">
<link rel="icon" type="image/svg+xml" href="/icon.svg">
<title>Asgard</title>
<style>
  :root {
    --bg: #1a1a1a; --sidebar: #141414; --panel: #1f1f1f; --panel2: #252525; --border: #2a2a2a;
    --text: #ececec; --text-soft: #b8b8b8; --muted: #888; --accent: #d97757; --accent-soft: #b25d3c;
    --good: #4ade80; --bad: #f87171; --warn: #facc15;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "Helvetica Neue", sans-serif; background: var(--bg); color: var(--text); overflow: hidden; }
  .app { display: flex; height: 100vh; }

  /* Sidebar */
  .sidebar { width: 260px; min-width: 260px; background: var(--sidebar); border-right: 1px solid var(--border); display: flex; flex-direction: column; transition: margin-left .2s; }
  .sb-head { padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 16px; }
  .brand-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--good); box-shadow: 0 0 10px var(--good); }
  .icon-btn { background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 6px; border-radius: 6px; }
  .icon-btn:hover { background: var(--panel); color: var(--text); }
  .new-chat { margin: 12px 12px 0; padding: 10px 14px; background: var(--accent); border: 0; color: white; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .new-chat:hover { background: var(--accent-soft); }
  .sb-section { padding: 18px 12px 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
  .sb-section .count { color: var(--muted); font-weight: 500; }
  .sb-list { padding: 0 8px; overflow-y: auto; min-height: 0; }
  .sb-list.flex-1 { flex: 1; }
  .sb-list.fixed { flex: none; max-height: 220px; }
  .sb-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 13px; color: var(--text-soft); margin-bottom: 2px; user-select: none; position: relative; }
  .sb-item:hover { background: var(--panel); color: var(--text); }
  .sb-item.active { background: var(--panel2); color: var(--text); }
  .sb-item .title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sb-item .del { display: none; background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 2px 4px; border-radius: 4px; font-size: 14px; }
  .sb-item:hover .del { display: block; }
  .sb-item .del:hover { background: var(--bad); color: white; }
  .sb-item .pill { font-size: 10px; padding: 2px 6px; border-radius: 999px; background: var(--panel2); color: var(--muted); }
  .sb-item.active .pill { background: var(--panel); }
  .sb-item .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); flex-shrink: 0; }
  .sb-item .dot.up { background: var(--good); } .sb-item .dot.down { background: var(--bad); } .sb-item .dot.checking { background: var(--warn); }
  .sb-empty { padding: 12px; font-size: 12px; color: var(--muted); font-style: italic; }
  .sb-foot { padding: 12px; border-top: 1px solid var(--border); font-size: 11px; color: var(--muted); display: flex; justify-content: space-between; align-items: center; }
  .sb-foot a { color: var(--muted); text-decoration: none; }
  .sb-foot a:hover { color: var(--text); }

  /* Main */
  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .topbar { padding: 14px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; }
  .topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .menu-btn { display: none; }
  .ctx-pill { display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: var(--panel); border: 1px solid var(--border); border-radius: 999px; font-size: 13px; color: var(--text-soft); }
  .ctx-pill .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .ctx-pill .clear { cursor: pointer; color: var(--muted); margin-left: 4px; }
  .ctx-pill .clear:hover { color: var(--bad); }
  .ctx-pill a { color: var(--muted); text-decoration: none; font-size: 11px; }
  .topbar-right { display: flex; gap: 8px; align-items: center; font-size: 12px; color: var(--muted); }
  .model-picker { position: relative; }
  .model-btn { background: var(--panel); border: 1px solid var(--border); color: var(--text); padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 12px; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
  .model-btn:hover { border-color: var(--accent); }
  .model-btn .caret { color: var(--muted); font-size: 10px; }
  .model-menu { position: absolute; top: calc(100% + 6px); right: 0; background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 60; min-width: 320px; display: none; }
  .model-menu.open { display: block; }
  .model-opt { padding: 10px 12px; border-radius: 6px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
  .model-opt:hover { background: var(--panel2); }
  .model-opt.active { background: var(--panel2); }
  .model-opt .row1 { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .model-opt .name { font-weight: 600; font-size: 13px; color: var(--text); }
  .model-opt .price { font-size: 11px; color: var(--muted); font-family: 'SF Mono', Menlo, Consolas, monospace; }
  .model-opt .blurb { font-size: 11px; color: var(--text-soft); margin-top: 2px; }
  .model-opt .provider-tag { font-size: 10px; padding: 1px 6px; border-radius: 999px; background: var(--panel2); color: var(--muted); margin-left: 4px; vertical-align: middle; }
  .tool-badge { display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 999px; margin-left: 6px; }
  .tool-badge.yes { background: rgba(74,222,128,0.15); color: var(--good); }
  .tool-badge.no { background: rgba(136,136,136,0.15); color: var(--muted); }
  .view-tabs { display: flex; gap: 4px; }
  .private-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-soft); cursor: pointer; padding: 4px 10px; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; }
  .private-toggle input { accent-color: var(--accent); }
  .private-toggle:has(input:checked) { color: var(--accent); border-color: var(--accent); }
  .lock-pill { display: inline-block; font-size: 10px; padding: 2px 6px; border-radius: 999px; background: var(--panel2); color: var(--muted); margin-left: 4px; }
  .view-tab { padding: 6px 12px; background: transparent; border: 1px solid var(--border); color: var(--text-soft); border-radius: 6px; cursor: pointer; font-size: 12px; }
  .view-tab.active { background: var(--panel2); color: var(--text); border-color: var(--accent); }

  /* Chat area */
  .chat { flex: 1; overflow-y: auto; padding: 24px 0 12px; }
  .chat-inner { max-width: 760px; margin: 0 auto; padding: 0 24px; }
  .welcome { text-align: center; padding: 36px 20px 16px; color: var(--text-soft); }
  .welcome h1 { font-size: 26px; font-weight: 700; margin: 0 0 6px; color: var(--text); }
  .welcome p { font-size: 14px; margin: 0 0 18px; }

  /* Project tiles grid (the new bit) */
  .tiles-wrap { padding: 0 24px 24px; }
  .tiles-filter { display: flex; gap: 6px; flex-wrap: wrap; max-width: 1100px; margin: 0 auto 14px; }
  .tile-chip { background: var(--panel); border: 1px solid var(--border); color: var(--text-soft); padding: 5px 12px; border-radius: 999px; cursor: pointer; font-size: 12px; }
  .tile-chip.active { background: var(--accent); color: white; border-color: var(--accent); }
  .tile-chip:hover:not(.active) { border-color: var(--accent); color: var(--text); }
  .tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; max-width: 1100px; margin: 0 auto; }
  .tile { background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 14px; cursor: pointer; transition: border-color .15s, transform .15s; display: flex; flex-direction: column; gap: 8px; min-height: 120px; }
  .tile:hover { border-color: var(--accent); transform: translateY(-1px); }
  .tile .row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .tile .name { font-weight: 600; font-size: 14px; color: var(--text); }
  .tile .tag { font-size: 10px; padding: 2px 8px; border-radius: 999px; background: var(--panel2); color: var(--muted); white-space: nowrap; }
  .tile .url { font-size: 11px; color: var(--accent); text-decoration: none; word-break: break-all; }
  .tile .url:hover { text-decoration: underline; }
  .tile .ctx { font-size: 12px; color: var(--text-soft); line-height: 1.45; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .tile .health { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); }
  .tile .health .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); }
  .tile .health .dot.up { background: var(--good); } .tile .health .dot.down { background: var(--bad); } .tile .health .dot.checking { background: var(--warn); }

  /* Project detail page */
  .pd { max-width: 760px; margin: 0 auto; padding: 24px; }
  .pd .back { background: transparent; border: 0; color: var(--muted); cursor: pointer; font-size: 13px; padding: 4px 0; margin-bottom: 12px; }
  .pd .back:hover { color: var(--text); }
  .pd h1 { font-size: 24px; font-weight: 700; margin: 0 0 6px; color: var(--text); }
  .pd .meta { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 18px; align-items: center; }
  .pd .meta .tag { font-size: 11px; padding: 3px 10px; border-radius: 999px; background: var(--panel2); color: var(--text-soft); }
  .pd .meta .health { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-soft); }
  .pd .meta .health .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
  .pd .meta .health .dot.up { background: var(--good); } .pd .meta .health .dot.down { background: var(--bad); } .pd .meta .health .dot.checking { background: var(--warn); }
  .pd .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .pd .actions a, .pd .actions button { background: var(--panel); border: 1px solid var(--border); color: var(--text); padding: 8px 14px; border-radius: 8px; text-decoration: none; font-size: 13px; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
  .pd .actions a:hover, .pd .actions button:hover { border-color: var(--accent); color: var(--accent); }
  .pd .actions .primary { background: var(--accent); color: white; border-color: var(--accent); }
  .pd .actions .primary:hover { background: var(--accent-soft); border-color: var(--accent-soft); color: white; }
  .pd .field { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .pd .field .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 6px; font-weight: 600; }
  .pd .field .val { font-size: 14px; color: var(--text); word-break: break-all; line-height: 1.5; }
  .pd .field .val a { color: var(--accent); text-decoration: none; }
  .pd .field .val a:hover { text-decoration: underline; }

  /* Messages */
  .msg { display: flex; gap: 14px; margin-bottom: 24px; align-items: flex-start; }
  .msg .avatar { width: 30px; height: 30px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .msg.user .avatar { background: #4a4a4a; color: var(--text); }
  .msg.assistant .avatar { background: var(--accent); color: white; }
  .msg .body { flex: 1; min-width: 0; padding-top: 4px; line-height: 1.65; font-size: 15px; word-wrap: break-word; }
  .msg .body p { margin: 0 0 12px; }
  .msg .body p:last-child { margin-bottom: 0; }
  .msg .body code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; font-family: "SF Mono", Menlo, Consolas, monospace; }
  .msg .body pre { background: #0d0d0d; border: 1px solid var(--border); padding: 14px; border-radius: 8px; overflow-x: auto; margin: 12px 0; font-size: 13px; }
  .msg .body pre code { background: transparent; padding: 0; font-size: 13px; }
  .msg .body a { color: var(--accent); }
  .msg .body ul, .msg .body ol { padding-left: 22px; margin: 0 0 12px; }
  .msg .body strong { font-weight: 600; }
  .msg-tools { margin-top: 8px; font-size: 11px; color: var(--muted); padding: 6px 10px; background: var(--panel); border-radius: 6px; display: inline-block; }
  .msg.error .body { color: var(--bad); }
  .typing { display: inline-block; padding: 12px 16px; background: var(--panel); border-radius: 12px; }
  .typing span { display: inline-block; width: 6px; height: 6px; background: var(--muted); border-radius: 50%; margin: 0 2px; animation: bounce 1.4s infinite ease-in-out; }
  .typing span:nth-child(2) { animation-delay: .2s; }
  .typing span:nth-child(3) { animation-delay: .4s; }
  @keyframes bounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }

  /* Composer */
  .composer { padding: 12px 24px 20px; }
  .composer-inner { max-width: 760px; margin: 0 auto; }
  .composer-box { display: flex; gap: 10px; align-items: flex-end; background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 10px; transition: border-color .15s; }
  .composer-box:focus-within { border-color: var(--accent); }
  .composer textarea { flex: 1; background: transparent; border: 0; color: var(--text); font-size: 15px; padding: 8px 10px; resize: none; outline: none; max-height: 220px; line-height: 1.4; font-family: inherit; }
  .composer button { background: var(--accent); border: 0; color: white; font-weight: 600; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-size: 14px; min-height: 38px; }
  .composer button:hover { background: var(--accent-soft); }
  .composer button:disabled { opacity: 0.4; cursor: not-allowed; }
  .composer-hint { text-align: center; padding-top: 6px; font-size: 11px; color: var(--muted); }

  /* Modals */
  .modal-scrim { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: none; }
  .modal-scrim.open { display: block; }
  .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--panel); border: 1px solid var(--border); border-radius: 12px; min-width: 480px; max-width: 90vw; max-height: 85vh; display: none; flex-direction: column; z-index: 110; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
  .modal.open { display: flex; }
  .modal-large { min-width: 720px; }
  .modal-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .modal-head h2 { margin: 0; font-size: 16px; font-weight: 600; }
  .modal-close { background: transparent; border: 0; color: var(--muted); font-size: 22px; cursor: pointer; padding: 0 6px; }
  .modal-body { padding: 16px 20px; overflow-y: auto; flex: 1; }
  .setting { margin-bottom: 14px; display: flex; flex-direction: column; gap: 6px; }
  .setting.setting-row { flex-direction: row; gap: 10px; align-items: center; }
  .setting label { font-size: 12px; color: var(--text-soft); font-weight: 500; }
  .setting select, .setting input[type="text"], .setting textarea { background: var(--panel2); border: 1px solid var(--border); color: var(--text); padding: 8px 10px; border-radius: 6px; font-size: 13px; font-family: inherit; }
  .setting textarea { font-family: 'SF Mono', Menlo, Consolas, monospace; resize: vertical; }
  .setting input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); }
  .setting.muted, .muted { color: var(--muted); font-size: 11px; }
  .btn { background: var(--panel2); border: 1px solid var(--border); color: var(--text); padding: 8px 14px; border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 13px; }
  .btn:hover { border-color: var(--accent); color: var(--accent); }
  .btn-primary { background: var(--accent); border: 0; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 13px; font-weight: 600; }
  .btn-primary:hover { background: var(--accent-soft); }
  .btn-danger { background: rgba(248,113,113,0.15); border: 1px solid var(--bad); color: var(--bad); padding: 8px 14px; border-radius: 6px; cursor: pointer; font-family: inherit; font-size: 13px; }
  .btn-danger:hover { background: var(--bad); color: white; }

  /* Stats grid */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .stat-card { background: var(--panel2); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
  .stat-card .num { font-size: 22px; font-weight: 700; color: var(--accent); }
  .stat-card .label { font-size: 11px; color: var(--muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-list { margin-top: 14px; max-height: 240px; overflow-y: auto; background: var(--panel2); border-radius: 8px; padding: 8px; }
  .stat-list .item { font-size: 12px; padding: 4px 8px; color: var(--text-soft); font-family: 'SF Mono', Menlo, Consolas, monospace; }

  /* Welcome stats card */
  .stats-mini { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 600px; margin: 0 auto 16px; }
  .stats-mini .stat-card { padding: 10px; text-align: center; }
  .stats-mini .num { font-size: 18px; }

  /* TTS button on assistant messages */
  .msg-actions { display: flex; gap: 6px; margin-top: 6px; }
  .msg-action { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-family: inherit; }
  .msg-action:hover { border-color: var(--accent); color: var(--accent); }
  .msg-action.playing { color: var(--accent); border-color: var(--accent); }

  /* Image attachment chip in composer + image bubble in messages */
  .attach-row { display: flex; gap: 6px; flex-wrap: wrap; padding: 6px 4px 4px; }
  .attach-chip { background: var(--panel2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; font-size: 11px; color: var(--text-soft); display: flex; align-items: center; gap: 6px; }
  .attach-chip .x { cursor: pointer; color: var(--muted); }
  .attach-chip .x:hover { color: var(--bad); }
  .attach-btn { background: transparent; border: 1px solid var(--border); color: var(--muted); padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 14px; }
  .attach-btn:hover { border-color: var(--accent); color: var(--accent); }
  .msg-image { max-width: 320px; max-height: 240px; border-radius: 8px; margin: 6px 0; display: block; border: 1px solid var(--border); }

  /* Mobile */
  @media (max-width: 760px) {
    .modal { min-width: 0; width: calc(100vw - 24px); max-height: 90vh; }
    .modal-large { min-width: 0; }
    .sidebar { position: fixed; left: 0; top: 0; bottom: 0; z-index: 50; margin-left: -280px; box-shadow: 2px 0 20px rgba(0,0,0,0.5); padding-top: env(safe-area-inset-top); }
    .sidebar.open { margin-left: 0; }
    .menu-btn { display: block; padding: 8px; font-size: 18px; }
    .scrim { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }
    .scrim.open { display: block; }
    .topbar { padding: max(12px, env(safe-area-inset-top)) 16px 12px; }
    .chat-inner, .composer-inner { padding: 0 16px; }
    .composer { padding-bottom: max(20px, env(safe-area-inset-bottom)); }
    .sb-item { padding: 12px 12px; font-size: 14px; }
    .new-chat { padding: 14px; font-size: 15px; }
    .composer button { min-height: 44px; padding: 12px 18px; }
    .model-btn { padding: 5px 10px; font-size: 12px; }
    .model-menu { right: -40px; min-width: 300px; max-width: calc(100vw - 32px); }
    .composer textarea { font-size: 16px; }
    .tiles { grid-template-columns: 1fr; }
    .tiles-wrap { padding: 0 16px 16px; }
    .welcome { padding: 22px 4px 8px; }
    .welcome h1 { font-size: 22px; }
    .pd { padding: 18px; }
    .msg { gap: 10px; margin-bottom: 18px; }
    .msg .body { font-size: 15px; }
  }
  @media all and (display-mode: standalone) {
    .sb-head { padding-top: max(16px, env(safe-area-inset-top)); }
  }
</style>
</head>
<body>
<div class="app">
  <aside class="sidebar" id="sidebar">
    <div class="sb-head">
      <div class="brand"><div class="brand-dot"></div>Asgard</div>
      <button class="icon-btn" id="closeSidebar" title="Close" aria-label="Close sidebar" style="display:none">×</button>
    </div>
    <button class="new-chat" id="newChat">+ New chat</button>
    <div class="sb-section">Recent</div>
    <div class="sb-list flex-1" id="conversations"></div>
    <div class="sb-section">Tools <span class="count" id="toolsCount"></span></div>
    <div class="sb-list fixed" id="tools" style="max-height:200px"></div>
    <div class="sb-section">System</div>
    <div class="sb-list fixed" id="sysList" style="max-height:140px"></div>
    <div class="sb-section">Projects <span class="count" id="projectsCount"></span></div>
    <div class="sb-list fixed" id="projects" style="max-height:240px"></div>
    <div class="sb-foot">
      <span>v__VERSION__</span>
      <span><a href="/health">health</a> · <a href="/tools">tools</a></span>
    </div>
  </aside>
  <div class="scrim" id="scrim"></div>

<div class="modal-scrim" id="modalScrim"></div>

<div class="modal" id="settingsModal">
  <div class="modal-head"><h2>Settings</h2><button class="modal-close" data-close="settingsModal" aria-label="Close settings">×</button></div>
  <div class="modal-body">
    <div class="setting"><label>Default model</label><select id="setDefaultModel"></select></div>
    <div class="setting"><label>Theme</label><select id="setTheme"><option value="dark">Dark (default)</option><option value="light">Light</option></select></div>
    <div class="setting"><label>Show debug info on messages (token counts, iters)</label><input type="checkbox" id="setDebug"></div>
    <div class="setting"><label>X-Pin (for non-Claude providers)</label><input type="text" id="setPin" placeholder="2967"></div>
    <div class="setting"><label>Slack channel (for Send-to-Slack button)</label><input type="text" id="setSlackChan" placeholder="#asgard-alerts or C0123ABCDEF"></div>
    <div class="setting"><label>Telegram chat ID (for Send-to-Telegram button)</label><input type="text" id="setTelegramChat" placeholder="-1001234567890"></div>
    <div class="setting"><label>Shared facts (injected as system context for every chat)</label><textarea id="setFacts" rows="5" placeholder="e.g. Paddy is a PE teacher in Williamstown. CF account: a6f47c... GitHub org: LuckDragonAsgard. Telegram chat: -1001234..."></textarea></div>
    <div class="setting"><label><input type="checkbox" id="setCloudSync" style="margin-right:6px;vertical-align:middle"> Cloud-sync conversations (chats survive across devices via asgard-brain D1)</label></div>
    <div class="setting setting-row"><button class="btn" id="btnSyncNow">Sync now</button><button class="btn" id="btnSyncRestore">Restore from cloud</button><span id="syncStatus" class="muted"></span></div>
    <div class="setting"><label><input type="checkbox" id="setPinGate" style="margin-right:6px;vertical-align:middle"> Require PIN to open Asgard (gates the dashboard)</label></div>
    <div class="setting setting-row"><button class="btn-danger" id="btnClearChats">Clear all conversations</button><button class="btn" id="btnExport">Export conversations (JSON)</button></div>
    <div class="setting muted">Asgard <span id="setVersion"></span> · localStorage <span id="setStorageUsed"></span></div>
  </div>
</div>

<div class="modal" id="statsModal">
  <div class="modal-head"><h2>Live stats</h2><button class="modal-close" data-close="statsModal" aria-label="Close stats">×</button></div>
  <div class="modal-body" id="statsBody"><div class="muted">Loading…</div></div>
</div>

<div class="modal modal-large" id="bridgesModal">
  <div class="modal-head"><h2>Install Asgard Bridges</h2><button class="modal-close" data-close="bridgesModal" aria-label="Close bridges">×</button></div>
  <div class="modal-body">
    <p style="font-size:13px;color:var(--text-soft);margin-top:0">Two bridges turn Asgard into a full computer-use agent — Chrome controls your real browser with your logged-in sessions, Desktop controls your native apps.</p>

    <div style="background:var(--panel2);border:1px solid var(--border);border-radius:10px;padding:14px;margin:14px 0">
      <h3 style="margin:0 0 8px;font-size:14px">🌐 Chrome Bridge <span id="chromeBridgeStatus" style="font-size:11px;font-weight:400;color:var(--muted)">checking…</span></h3>
      <p style="margin:0 0 10px;font-size:12px;color:var(--text-soft)">Drives your real Chrome with your cookies/sessions. Drag-drop a screenshot, click links, fill forms.</p>
      <ol style="margin:0 0 10px;padding-left:18px;font-size:12px">
        <li>Download the source repo: <a href="https://codeload.github.com/PaddyGallivan/asgard-source/zip/refs/heads/main" style="color:var(--accent)">asgard-source.zip</a></li>
        <li>Unzip → use the <code>bridges/asgard-bridge-extension/</code> folder inside</li>
        <li>Keep the unzipped folder somewhere permanent (don't move/delete it)</li>
        <li>Open <code>chrome://extensions</code> → toggle Developer mode ON → Load unpacked → pick the unzipped folder</li>
        <li>Pin the extension, click it, confirm PIN matches your X-Pin (default 2967), tick Enabled</li>
      </ol>
      <p style="margin:0;font-size:11px;color:var(--muted)">Polls every ~3s. Green dot = connected.</p>
    </div>

    <div style="background:var(--panel2);border:1px solid var(--border);border-radius:10px;padding:14px;margin:14px 0">
      <h3 style="margin:0 0 8px;font-size:14px">🖥 Desktop Bridge <span id="desktopBridgeStatus" style="font-size:11px;font-weight:400;color:var(--muted)">checking…</span></h3>
      <p style="margin:0 0 10px;font-size:12px;color:var(--text-soft)">Drives your native desktop — clicks, types, runs apps. Anywhere outside the browser.</p>
      <ol style="margin:0 0 10px;padding-left:18px;font-size:12px">
        <li>Install Python 3.9+ if you don't have it (built in to macOS)</li>
        <li>Run in a terminal: <pre style="background:#0d0d0d;padding:8px 10px;border-radius:6px;font-size:11px;margin:4px 0">pip install pyautogui pillow requests</pre></li>
        <li><strong>macOS only:</strong> System Settings → Privacy → <em>Accessibility</em> AND <em>Screen Recording</em> → add Terminal</li>
        <li>Save <a href="https://raw.githubusercontent.com/PaddyGallivan/asgard-source/main/bridges/asgard-desktop.py" target="_blank" style="color:var(--accent)">asgard-desktop.py</a> to your home folder (right-click → Save link as)</li>
        <li>Run: <pre style="background:#0d0d0d;padding:8px 10px;border-radius:6px;font-size:11px;margin:4px 0">python ~/asgard-desktop.py</pre></li>
        <li>Leave the terminal open. Failsafe: drag mouse to top-left corner to abort.</li>
      </ol>
      <p style="margin:0;font-size:11px;color:var(--muted)">Polls every ~2s. Setup guide: <a href="https://github.com/PaddyGallivan/asgard-source/blob/main/bridges/README-desktop.md" target="_blank" style="color:var(--accent)">README on GitHub</a>.</p>
    </div>

    <div class="setting setting-row"><button class="btn" id="btnTestBridges">Test bridges now</button><span id="bridgesTestStatus" class="muted"></span></div>
  </div>
</div>

<div class="modal modal-large" id="deployModal">
  <div class="modal-head"><h2>Deploy worker</h2><button class="modal-close" data-close="deployModal" aria-label="Close deploy">×</button></div>
  <div class="modal-body">
    <div class="setting"><label>Worker name</label><input type="text" id="deployName" placeholder="asgard"></div>
    <div class="setting"><label>main_module</label><input type="text" id="deployMain" placeholder="worker.js or asgard.js" value="worker.js"></div>
    <div class="setting"><label>Source code</label><textarea id="deployCode" rows="14" placeholder="export default { async fetch(req, env) { return new Response('hi'); } };"></textarea></div>
    <div class="setting setting-row"><button class="btn-primary" id="btnDeploy">Deploy</button><span id="deployStatus" class="muted"></span></div>
    <hr style="border:0;border-top:1px solid var(--border);margin:18px 0">
    <div class="setting setting-row"><button class="btn" id="btnSmoke">🩺 Run smoke test</button><span id="smokeStatus" class="muted"></span></div>
    <div id="smokeResults" style="font-size:11px;font-family:'Menlo',Consolas,monospace;color:var(--text-soft);margin:6px 0 14px"></div>
    <div class="setting"><label>Rollback — recent versions of this worker</label><button class="btn" id="btnLoadCommits" style="margin-top:4px">Load recent commits for "<span id="rbWorkerLabel">asgard</span>"</button></div>
    <div id="rollbackList" style="font-size:11px;color:var(--text-soft);margin:6px 0"></div>
  </div>
</div>

  <div class="main">
    <div class="topbar">
      <div class="topbar-left">
        <button class="icon-btn menu-btn" id="openSidebar" title="Menu" aria-label="Open menu">☰</button>
        <div id="contextSlot"></div>
      </div>
      <div class="topbar-right">
        <label class="private-toggle" id="privateToggleWrap" style="display:none"><input type="checkbox" id="privateToggle"> <span>🔒 Private</span></label>
        <div class="model-picker" id="modelPicker">
          <button class="model-btn" id="modelBtn" type="button"><span id="modelBtnLabel">Sonnet 4.5</span> <span class="caret">▾</span></button>
          <div class="model-menu" id="modelMenu"></div>
        </div>
        <div class="view-tabs" id="viewTabs">
          <button class="view-tab" data-view="projects">Projects</button>
          <button class="view-tab active" data-view="chat">Chat</button>
        </div>
      </div>
    </div>
    <div class="chat" id="chat"></div>
    <div class="composer" id="composerWrap">
      <div class="composer-inner">
        <form class="composer-box" id="form">
          <textarea id="input" placeholder="Message Asgard…" rows="1"></textarea>
          <button type="submit" id="send" aria-label="Send message">Send</button>
        </form>
        <div class="composer-hint" id="hint">Press Enter to send · Shift+Enter for newline · /image &lt;prompt&gt; for DALL-E</div>
      </div>
    </div>
  </div>
</div>

<script>
let PROJECTS = [];
const BRAIN_URL = 'https://asgard-brain.pgallivan.workers.dev';
const BRAIN_PIN = '2967';
async function loadProductsFromBrain() {
  try {
    const r = await fetch(BRAIN_URL + '/d1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': BRAIN_PIN },
      body: JSON.stringify({
        sql: 'SELECT id, project_name, category, status, live_url, tech_stack, description, next_action, progress_pct, revenue_y1, revenue_y2, revenue_y3, income_priority, key_features, github_url, last_updated FROM products ORDER BY income_priority DESC, project_name ASC',
        params: []
      })
    });
    const d = await r.json();
    PROJECTS = (d.results || []).map(function(p) {
      return {
        id: 'p' + p.id, rawId: p.id, name: p.project_name,
        url: p.live_url || '', repo: p.github_url || '',
        tag: p.category || 'project',
        status: (p.status || 'idea').toLowerCase(),
        revenue_y1: p.revenue_y1 || 0, revenue_y2: p.revenue_y2 || 0, revenue_y3: p.revenue_y3 || 0,
        income_priority: p.income_priority || 0, progress_pct: p.progress_pct || 0,
        description: p.description || '', next_action: p.next_action || '',
        tech_stack: p.tech_stack || '', key_features: p.key_features || '',
        last_updated: p.last_updated || '',
        context: [p.description, p.tech_stack && 'Tech: ' + p.tech_stack, p.next_action && 'Next: ' + p.next_action].filter(Boolean).join(' · ')
      };
    });
    return PROJECTS.length;
  } catch (e) {
    console.error('loadProductsFromBrain failed:', e);
    PROJECTS = [];
    return 0;
  }
}

async function _brainWrite(sql, params) {
  const r = await fetch(BRAIN_URL + '/d1/write', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Pin': BRAIN_PIN },
    body: JSON.stringify({ sql: sql, params: params || [] })
  });
  if (!r.ok) throw new Error('brain ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return r.json();
}
const TOOLS_LIST = __TOOLS_JSON__;
const TOOLS_URL = '__TOOLS_URL__';
const STORAGE_KEY = 'asgard.conversations.v1';
const ACTIVE_KEY = 'asgard.active.v1';
const VIEW_KEY = 'asgard.view.v1';
const FILTER_KEY = 'asgard.filter.v1';
const MODEL_KEY = 'asgard.model.v1';
const PIN_KEY = 'asgard.pin.v1';
const THEME_KEY = 'asgard.theme.v1';
const DEBUG_KEY = 'asgard.debug.v1';
const PIN_GATE_KEY = 'asgard.pinGate.v1';
const PIN_VERIFY_KEY = 'asgard.pinVerify.v1';
const SLACK_CHAN_KEY = 'asgard.slack.v1';
const TELEGRAM_CHAT_KEY = 'asgard.telegram.v1';
const PROJECTS_OVERRIDES_KEY = 'asgard.projectsOverrides.v1';
const SORT_KEY = 'asgard.sort.v1';
const FACTS_KEY = 'asgard.facts.v1';
const CLOUD_SYNC_KEY = 'asgard.cloudSync.v1';
const SYNC_BRAIN_URL = 'https://asgard-brain.pgallivan.workers.dev';
const SYNC_UID = 'paddy';

// ---------- State ----------
function loadConvos() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
function saveConvos(c) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch (e) {
    if (e.name === 'QuotaExceededError' || /quota/i.test(String(e.message || ''))) {
      alert('⚠ Browser storage is full. Export your conversations from Settings, then clear old chats.');
    } else {
      console.error('saveConvos failed:', e);
    }
  }
  if (typeof scheduleSync === 'function') scheduleSync();
}
function loadActive() { return localStorage.getItem(ACTIVE_KEY) || ''; }
function saveActive(id) { if (id) localStorage.setItem(ACTIVE_KEY, id); else localStorage.removeItem(ACTIVE_KEY); }
function loadView() { return localStorage.getItem(VIEW_KEY) || 'projects'; }
function saveView(v) { localStorage.setItem(VIEW_KEY, v); }
function loadFilter() { return localStorage.getItem(FILTER_KEY) || 'all'; }
function saveFilter(f) { localStorage.setItem(FILTER_KEY, f); }
function loadModel() { return localStorage.getItem(MODEL_KEY) || 'claude-sonnet-4-5'; }
function saveModel(m) { localStorage.setItem(MODEL_KEY, m); }
function loadPin() { return localStorage.getItem(PIN_KEY) || '2967'; }
function savePin(p) { localStorage.setItem(PIN_KEY, p); }
function loadTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }
function saveTheme(t) { localStorage.setItem(THEME_KEY, t); document.documentElement.setAttribute('data-theme', t); }
function loadDebug() { return localStorage.getItem(DEBUG_KEY) === '1'; }
function saveDebug(b) { localStorage.setItem(DEBUG_KEY, b ? '1' : '0'); }
function loadPinGate() { return localStorage.getItem(PIN_GATE_KEY) === '1'; }
function savePinGate(b) { localStorage.setItem(PIN_GATE_KEY, b ? '1' : '0'); }
function loadSlackChan() { return localStorage.getItem(SLACK_CHAN_KEY) || ''; }
function saveSlackChan(c) { localStorage.setItem(SLACK_CHAN_KEY, c); }
function loadTelegramChat() { return localStorage.getItem(TELEGRAM_CHAT_KEY) || ''; }
function saveTelegramChat(c) { localStorage.setItem(TELEGRAM_CHAT_KEY, c); }
function loadProjectsOverrides() { try { return JSON.parse(localStorage.getItem(PROJECTS_OVERRIDES_KEY) || '{}'); } catch { return {}; } }
function saveProjectsOverrides(o) { localStorage.setItem(PROJECTS_OVERRIDES_KEY, JSON.stringify(o)); }
function loadSort() { return localStorage.getItem(SORT_KEY) || 'alpha'; }
function saveSort(s) { localStorage.setItem(SORT_KEY, s); }
function loadFacts() { return localStorage.getItem(FACTS_KEY) || ''; }
function saveFacts(f) { localStorage.setItem(FACTS_KEY, f); }
function loadCloudSync() { return localStorage.getItem(CLOUD_SYNC_KEY) === '1'; }
function saveCloudSyncFlag(b) { localStorage.setItem(CLOUD_SYNC_KEY, b ? '1' : '0'); }

// Compose effective project list = baked PROJECTS + user-added/edited/deleted overrides
function getEffectiveProjects() {
  var ov = loadProjectsOverrides();
  var base = PROJECTS.filter(function(p){ return !(ov.deleted || []).includes(p.id); });
  base = base.map(function(p){
    var edit = (ov.edits || {})[p.id];
    return edit ? Object.assign({}, p, edit) : p;
  });
  var added = ov.added || [];
  return base.concat(added);
}

let convos = loadConvos();
let activeId = loadActive();
let currentView = loadView(); // 'projects' | 'chat' | 'detail'
let detailProjectId = null;
let currentFilter = loadFilter();
let selectedModel = loadModel();
let pendingImage = null; // { base64, name, dataUrl }
const MODELS_INLINE = __MODELS_JSON__;

function getActive() { return convos.find(c => c.id === activeId); }
function newConvo(projectId) {
  const id = 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  const conv = { id, title: 'New chat', projectId: projectId || null, messages: [], createdAt: Date.now(), updatedAt: Date.now() };
  convos.unshift(conv);
  activeId = id;
  saveConvos(convos);
  saveActive(id);
  return conv;
}
function deleteConvo(id) {
  convos = convos.filter(c => c.id !== id);
  if (activeId === id) { activeId = convos[0]?.id || ''; saveActive(activeId); }
  saveConvos(convos);
  render();
}
function setProject(projectId) {
  let conv = getActive();
  if (!conv || conv.messages.length > 0) conv = newConvo(projectId);
  else { conv.projectId = projectId; saveConvos(convos); }
  currentView = 'chat'; saveView('chat');
  render();
}
function clearProject() {
  const conv = getActive();
  if (conv) { conv.projectId = null; saveConvos(convos); render(); }
}
function setView(v) { currentView = v; saveView(v); render(); }
function openProjectDetail(pid) { detailProjectId = pid; currentView = 'detail'; render(); }

// ---------- Markdown (minimal, escape-safe) ----------
function escapeHtml(s) {
  return String(s).split('').map(function(c){
    if (c==='&') return '&amp;';
    if (c==='<') return '&lt;';
    if (c==='>') return '&gt;';
    if (c==='"') return '&quot;';
    if (c==="'") return '&#39;';
    return c;
  }).join('');
}
function md(text) {
  // Plain text + line breaks. Markdown can come back later once clicks are stable.
  var safe = escapeHtml(String(text));
  // Blank-line paragraph split using char codes (no regex backslashes that template literals will mangle)
  var nl = String.fromCharCode(10);
  var parts = safe.split(nl + nl);
  return parts.map(function(p){ return '<p>' + p.split(nl).join('<br>') + '</p>'; }).join('');
}

// ---------- DOM refs ----------
const els = {
  sidebar: document.getElementById('sidebar'),
  scrim: document.getElementById('scrim'),
  conversations: document.getElementById('conversations'),
  tools: document.getElementById('tools'),
  projects: document.getElementById('projects'),
  toolsCount: document.getElementById('toolsCount'),
  projectsCount: document.getElementById('projectsCount'),
  chat: document.getElementById('chat'),
  contextSlot: document.getElementById('contextSlot'),
  composerWrap: document.getElementById('composerWrap'),
  viewTabs: document.getElementById('viewTabs'),
  modelBtn: document.getElementById('modelBtn'),
  modelBtnLabel: document.getElementById('modelBtnLabel'),
  modelMenu: document.getElementById('modelMenu'),
  privateToggle: document.getElementById('privateToggle'),
  privateToggleWrap: document.getElementById('privateToggleWrap'),
  sysList: document.getElementById('sysList'),
  modalScrim: document.getElementById('modalScrim'),
  settingsModal: document.getElementById('settingsModal'),
  statsModal: document.getElementById('statsModal'),
  statsBody: document.getElementById('statsBody'),
  deployModal: document.getElementById('deployModal'),
  setDefaultModel: document.getElementById('setDefaultModel'),
  setTheme: document.getElementById('setTheme'),
  setDebug: document.getElementById('setDebug'),
  setPin: document.getElementById('setPin'),
  setSlackChan: document.getElementById('setSlackChan'),
  setTelegramChat: document.getElementById('setTelegramChat'),
  setPinGate: document.getElementById('setPinGate'),
  setFacts: document.getElementById('setFacts'),
  setCloudSync: document.getElementById('setCloudSync'),
  btnSyncNow: document.getElementById('btnSyncNow'),
  btnSyncRestore: document.getElementById('btnSyncRestore'),
  syncStatus: document.getElementById('syncStatus'),
  setVersion: document.getElementById('setVersion'),
  setStorageUsed: document.getElementById('setStorageUsed'),
  btnClearChats: document.getElementById('btnClearChats'),
  btnExport: document.getElementById('btnExport'),
  deployName: document.getElementById('deployName'),
  deployMain: document.getElementById('deployMain'),
  deployCode: document.getElementById('deployCode'),
  btnDeploy: document.getElementById('btnDeploy'),
  deployStatus: document.getElementById('deployStatus'),
  btnSmoke: document.getElementById('btnSmoke'),
  smokeStatus: document.getElementById('smokeStatus'),
  smokeResults: document.getElementById('smokeResults'),
  btnLoadCommits: document.getElementById('btnLoadCommits'),
  rbWorkerLabel: document.getElementById('rbWorkerLabel'),
  rollbackList: document.getElementById('rollbackList'),
  bridgesModal: document.getElementById('bridgesModal'),
  chromeBridgeStatus: document.getElementById('chromeBridgeStatus'),
  desktopBridgeStatus: document.getElementById('desktopBridgeStatus'),
  btnTestBridges: document.getElementById('btnTestBridges'),
  bridgesTestStatus: document.getElementById('bridgesTestStatus'),
  form: document.getElementById('form'),
  input: document.getElementById('input'),
  send: document.getElementById('send'),
  newChat: document.getElementById('newChat'),
  openSidebar: document.getElementById('openSidebar'),
  closeSidebar: document.getElementById('closeSidebar'),
  hint: document.getElementById('hint'),
};

// ---------- Render ----------
var PROJECTS_EFF = [];
function render() {
  // Refresh effective project list with user overrides
  PROJECTS_EFF = getEffectiveProjects();
  // Conversations list
  els.conversations.innerHTML = '';
  if (convos.length === 0) {
    els.conversations.innerHTML = '<div class="sb-empty">No chats yet</div>';
  } else {
    convos.forEach(c => {
      const row = document.createElement('div');
      row.className = 'sb-item' + (c.id === activeId && currentView === 'chat' ? ' active' : '');
      const proj = c.projectId ? PROJECTS_EFF.find(p => p.id === c.projectId) : null;
      row.innerHTML = '<span class="title">' + (c.private ? '🔒 ' : '') + escapeHtml(c.title || 'New chat') + '</span>' +
        (proj ? '<span class="pill">' + escapeHtml(proj.name) + '</span>' : '') +
        '<button class="del" title="Delete">×</button>';
      row.addEventListener('click', (e) => {
        if (e.target.classList.contains('del')) { e.stopPropagation(); if (confirm('Delete this chat?')) deleteConvo(c.id); return; }
        activeId = c.id; saveActive(activeId); currentView = 'chat'; saveView('chat'); render(); closeSidebarMobile();
      });
      els.conversations.appendChild(row);
    });
  }

  // System list
  els.sysList.innerHTML = '';
  var sysItems = [
    { id: 'settings', name: '⚙ Settings',         action: function(){ openModal('settingsModal'); populateSettings(); } },
    { id: 'stats',    name: '📊 Live stats',      action: function(){ openModal('statsModal'); loadStats(); } },
    { id: 'deploy',   name: '🚀 Deploy worker',   action: function(){ openModal('deployModal'); } },
    { id: 'feature',  name: '💡 Suggest feature',  action: function(){ submitFeatureRequest(); } },
    { id: 'bridges',  name: '🔌 Install bridges',  action: function(){ openModal('bridgesModal'); } }
  ];
  sysItems.forEach(function(s) {
    var row = document.createElement('div');
    row.className = 'sb-item';
    row.innerHTML = '<span class="title">' + s.name + '</span>';
    row.addEventListener('click', function(){ s.action(); closeSidebarMobile(); });
    els.sysList.appendChild(row);
  });

  // Presence: heartbeat dots for core workers
  var heartbeats = [
    { name: 'asgard-tools', url: 'https://asgard-tools.pgallivan.workers.dev/health' },
    { name: 'asgard-ai',    url: 'https://asgard-ai.pgallivan.workers.dev/health' },
    { name: 'asgard-brain', url: 'https://asgard-brain.pgallivan.workers.dev/health' },
    { name: 'asgard-vault', url: 'https://asgard-vault.pgallivan.workers.dev/health' },
    { name: 'asgard-browser', url: 'https://asgard-browser.pgallivan.workers.dev/health' }
  ];
  heartbeats.forEach(function(h) {
    var row = document.createElement('div');
    row.className = 'sb-item';
    row.innerHTML = '<span class="dot checking" data-hb="' + h.name + '"></span><span class="title" style="font-size:11px">' + h.name + '</span>';
    row.title = 'Heartbeat for ' + h.name;
    els.sysList.appendChild(row);
    fetch(h.url, { mode: 'cors', cache: 'no-store' }).then(function(r){
      var dot = els.sysList.querySelector('[data-hb="' + h.name + '"]');
      if (dot) { dot.classList.remove('checking'); dot.classList.add(r.ok ? 'up' : 'down'); }
    }).catch(function(){
      var dot = els.sysList.querySelector('[data-hb="' + h.name + '"]');
      if (dot) { dot.classList.remove('checking'); dot.classList.add('down'); }
    });
  });

  // Tools list
  els.tools.innerHTML = '';
  els.toolsCount.textContent = TOOLS_LIST.length;
  TOOLS_LIST.forEach(t => {
    const row = document.createElement('div');
    row.className = 'sb-item';
    row.innerHTML = '<span class="title">' + escapeHtml(t.name) + '</span>';
    row.title = 'Prefill: ' + t.prompt;
    row.addEventListener('click', () => {
      els.input.value = t.prompt;
      els.input.focus();
      els.input.dispatchEvent(new Event('input'));
      currentView = 'chat'; saveView('chat'); render();
      closeSidebarMobile();
    });
    els.tools.appendChild(row);
  });

  // Projects list
  els.projects.innerHTML = '';
  els.projectsCount.textContent = PROJECTS.length;
  PROJECTS_EFF.forEach(p => {
    const row = document.createElement('div');
    row.className = 'sb-item';
    row.innerHTML = '<span class="dot checking" data-pid="' + p.id + '"></span><span class="title">' + escapeHtml(p.name) + '</span>';
    row.title = p.context ? p.name + ' — ' + p.context : p.name;
    row.addEventListener('click', () => { openProjectDetail(p.id); closeSidebarMobile(); });
    els.projects.appendChild(row);
  });

  // Model picker
  var currentModel = MODELS_INLINE.find(function(m){ return m.id === selectedModel; }) || MODELS_INLINE[0];
  els.modelBtnLabel.textContent = currentModel.label;
  els.modelMenu.innerHTML = '';
  MODELS_INLINE.forEach(function(m) {
    var opt = document.createElement('div');
    opt.className = 'model-opt' + (m.id === selectedModel ? ' active' : '');
    var providerLabel = m.provider === 'anthropic' ? 'Claude' : (m.provider === 'openai' ? 'OpenAI' : (m.provider === 'gemini' ? 'Gemini' : m.provider));
    var toolBadge = m.tools ? '<span class="tool-badge yes">tools</span>' : '<span class="tool-badge no">chat only</span>';
    opt.innerHTML =
      '<div class="row1"><span class="name">' + escapeHtml(m.label) + ' <span class="provider-tag">' + providerLabel + '</span></span>' +
      '<span class="price">$' + m.in.toFixed(2) + ' / $' + m.out.toFixed(2) + ' / Mtok</span></div>' +
      '<div class="blurb">' + escapeHtml(m.blurb) + ' ' + toolBadge + '</div>';
    opt.addEventListener('click', function() {
      selectedModel = m.id; saveModel(m.id);
      els.modelMenu.classList.remove('open');
      render();
    });
    els.modelMenu.appendChild(opt);
  });
  // Footer note inside the model menu
  var modelFooter = document.createElement('div');
  modelFooter.style.cssText = 'padding: 8px 12px; font-size: 10px; color: var(--muted); border-top: 1px solid var(--border); margin-top: 4px';
  modelFooter.textContent = 'Pricing per 1M tokens (approximate). Cross-check provider docs for exact billing.';
  els.modelMenu.appendChild(modelFooter);

  // Private toggle — only visible in chat view
  if (currentView === 'chat' && conv) {
    els.privateToggleWrap.style.display = '';
    els.privateToggle.checked = !!conv.private;
    els.privateToggle.onchange = function(){
      conv.private = els.privateToggle.checked;
      saveConvos(convos); render();
    };
  } else {
    els.privateToggleWrap.style.display = 'none';
  }

  // View tabs
  els.viewTabs.querySelectorAll('.view-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.view === (currentView === 'detail' ? 'projects' : currentView));
  });

  // Topbar context pill
  const conv = getActive();
  els.contextSlot.innerHTML = '';
  if (currentView === 'chat' && conv && conv.projectId) {
    const proj = PROJECTS_EFF.find(p => p.id === conv.projectId);
    if (proj) {
      const pill = document.createElement('div');
      pill.className = 'ctx-pill';
      pill.innerHTML = '<div class="dot"></div>Project: <strong style="color:var(--text);margin:0 4px">' + escapeHtml(proj.name) + '</strong><a href="' + proj.url + '" target="_blank" rel="noopener">↗</a><span class="clear" title="Clear project">×</span>';
      pill.querySelector('.clear').addEventListener('click', clearProject);
      els.contextSlot.appendChild(pill);
    }
  }

  // Main panel — three views
  els.chat.innerHTML = '';
  if (currentView === 'projects') {
    renderProjectTiles();
    els.composerWrap.style.display = 'none';
  } else if (currentView === 'detail') {
    renderProjectDetail();
    els.composerWrap.style.display = 'none';
  } else {
    renderChat();
    els.composerWrap.style.display = '';
  }

  probeProjects();
}

function renderProjectTiles() {
  const container = document.createElement('div');
  container.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;';

  const iframe = document.createElement('iframe');
  iframe.src = 'https://falkor-projects.pgallivan.workers.dev/';
  iframe.style.cssText = 'border:none;width:100%;flex:1;background:var(--bg2);';
  iframe.allow = 'clipboard-write';

  container.appendChild(iframe);
  els.chat.appendChild(container);
}

async function addProjectFlow() {
  var name = prompt('Project name:'); if (!name) return;
  var category = prompt('Category (web app / domain / tools / planning):', 'web app') || 'web app';
  var status = prompt('Status (live / in_dev / idea / archived):', 'idea') || 'idea';
  var url = prompt('Live URL (optional):', 'https://') || '';
  var description = prompt('One-line description (optional):', '') || '';
  var next_action = prompt('Next action (optional):', '') || '';
  var rev_y1 = parseInt(prompt('Year 1 revenue $ (number, 0 if none):', '0') || '0', 10) || 0;
  try {
    await _brainWrite(
      'INSERT INTO products (project_name, category, status, live_url, description, next_action, revenue_y1, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, status, url, description, next_action, rev_y1, new Date().toISOString().split('T')[0]]
    );
    await loadProductsFromBrain();
    render();
  } catch (e) {
    alert('Add failed: ' + e.message);
  }
}

async function deleteProjectFlow(pid) {
  if (!confirm('Permanently delete this project from D1? Cannot be undone.')) return;
  var p = (PROJECTS || []).find(function(x){ return x.id === pid; });
  if (!p || !p.rawId) { alert('Cannot delete — project missing rawId'); return; }
  try {
    await _brainWrite('DELETE FROM products WHERE id = ?', [p.rawId]);
    await loadProductsFromBrain();
    detailProjectId = null;
    currentView = 'projects'; saveView('projects');
    render();
  } catch (e) {
    alert('Delete failed: ' + e.message);
  }
}

async function editProjectFlow(pid) {
  var p = (PROJECTS || []).find(function(x){ return x.id === pid; });
  if (!p || !p.rawId) { alert('Cannot edit — project missing rawId'); return; }
  var name = prompt('Name:', p.name); if (!name) return;
  var category = prompt('Category:', p.tag || '') || p.tag;
  var status = prompt('Status (live / in_dev / idea / archived):', p.status || 'idea') || p.status;
  var url = prompt('Live URL:', p.url || '') || '';
  var description = prompt('Description:', p.description || '') || '';
  var next_action = prompt('Next action:', p.next_action || '') || '';
  var rev_y1 = parseInt(prompt('Year 1 revenue $:', String(p.revenue_y1 || 0)) || '0', 10) || 0;
  var progress = parseInt(prompt('Progress %:', String(p.progress_pct || 0)) || '0', 10) || 0;
  try {
    await _brainWrite(
      'UPDATE products SET project_name=?, category=?, status=?, live_url=?, description=?, next_action=?, revenue_y1=?, progress_pct=?, last_updated=? WHERE id=?',
      [name, category, status, url, description, next_action, rev_y1, progress, new Date().toISOString().split('T')[0], p.rawId]
    );
    await loadProductsFromBrain();
    render();
  } catch (e) {
    alert('Edit failed: ' + e.message);
  }
}

function renderProjectDetail() {
  const p = PROJECTS.find(x => x.id === detailProjectId);
  if (!p) { currentView = 'projects'; render(); return; }
  const wrap = document.createElement('div');
  wrap.className = 'pd';
  const repoLink = p.repo && p.repo !== '?' ? 'https://github.com/' + p.repo : null;
  wrap.innerHTML =
    '<button class="back" id="pdBack">← Back to projects</button>' +
    '<h1>' + escapeHtml(p.name) + '</h1>' +
    '<div class="meta">' +
      '<span class="tag">' + escapeHtml(p.tag) + '</span>' +
      '<span class="health"><span class="dot checking" data-pid-detail="' + p.id + '"></span><span data-pid-detail-label="' + p.id + '">checking…</span></span>' +
    '</div>' +
    '<div class="actions">' +
      '<button class="primary" id="pdChat">💬 Chat about this project</button>' +
      (p.url ? '<a href="' + p.url + '" target="_blank" rel="noopener">🌐 Open site</a>' : '') +
      (repoLink ? '<a href="' + repoLink + '" target="_blank" rel="noopener">📦 Open repo</a>' : '') +
      '<button id="pdEdit">✏ Edit</button>' +
      '<button id="pdDelete" style="border-color:var(--bad);color:var(--bad)">🗑 Remove</button>' +
    '</div>' +
    '<div class="field"><div class="label">Status</div><div class="val">' + escapeHtml(p.status || 'idea') + (p.progress_pct ? ' · <span style="color:var(--muted)">' + p.progress_pct + '%</span>' : '') + '</div></div>' +
    '<div class="field"><div class="label">Income priority</div><div class="val">' + (p.income_priority ? '⭐ '.repeat(Math.min(5, p.income_priority)) + ' (' + p.income_priority + ')' : '<em style="color:var(--muted)">unranked</em>') + '</div></div>' +
    '<div class="field"><div class="label">Revenue forecast</div><div class="val" style="font-family:Menlo,Consolas,monospace">Y1 $' + (p.revenue_y1||0).toLocaleString() + ' · Y2 $' + (p.revenue_y2||0).toLocaleString() + ' · Y3 $' + (p.revenue_y3||0).toLocaleString() + '</div></div>' +
    '<div class="field"><div class="label">Last updated</div><div class="val">' + escapeHtml(p.last_updated || '—') + '</div></div>' +
    '<div class="field"><div class="label">Live URL</div><div class="val">' + (p.url ? '<a href="' + p.url + '" target="_blank" rel="noopener">' + escapeHtml(p.url) + '</a>' : '<em style="color:var(--muted)">none</em>') + '</div></div>' +
    '<div class="field"><div class="label">Repo</div><div class="val">' + (repoLink ? '<a href="' + repoLink + '" target="_blank" rel="noopener">' + escapeHtml(p.repo) + '</a>' : '<em style="color:var(--muted)">unknown</em>') + '</div></div>' +
    '<div class="field"><div class="label">Category</div><div class="val">' + escapeHtml(p.tag) + '</div></div>' +
    '<div class="field"><div class="label">Description</div><div class="val">' + escapeHtml(p.description || p.context || '(no description)') + '</div></div>';
  els.chat.appendChild(wrap);
  document.getElementById('pdBack').addEventListener('click', () => { currentView = 'projects'; saveView('projects'); render(); });
  document.getElementById('pdChat').addEventListener('click', () => { setProject(p.id); });
  document.getElementById('pdEdit').addEventListener('click', function(){ editProjectFlow(p.id); });
  document.getElementById('pdDelete').addEventListener('click', function(){ deleteProjectFlow(p.id); });
}

function renderChat() {
  const conv = getActive();
  if (!conv || conv.messages.length === 0) {
    const w = document.createElement('div');
    w.className = 'welcome';
    const proj = conv && conv.projectId ? PROJECTS_EFF.find(p => p.id === conv.projectId) : null;
    var modelLabel = (MODELS_INLINE.find(function(m){return m.id===selectedModel;}) || {}).label || selectedModel;
    w.innerHTML = '<h1>' + (proj ? escapeHtml(proj.name) : 'How can I help?') + '</h1>' +
      '<p>' + (proj ? 'Scoped to ' + escapeHtml(proj.name) + ' — context loaded. Model: ' + escapeHtml(modelLabel) : 'Model: ' + escapeHtml(modelLabel) + ' · I can deploy workers, push to GitHub, query DBs, edit sites.') + '</p>' +
      '<div class="stats-mini">' +
        '<div class="stat-card"><div class="num">' + PROJECTS.length + '</div><div class="label">Projects</div></div>' +
        '<div class="stat-card"><div class="num">' + MODELS_INLINE.length + '</div><div class="label">Models</div></div>' +
        '<div class="stat-card"><div class="num">' + convos.length + '</div><div class="label">Chats</div></div>' +
        '<div class="stat-card"><div class="num">3</div><div class="label">Providers</div></div>' +
      '</div>';
    els.chat.appendChild(w);
    return;
  }
  const inner = document.createElement('div');
  inner.className = 'chat-inner';
  conv.messages.forEach(m => {
    const row = document.createElement('div');
    row.className = 'msg ' + m.role;
    const avatar = m.role === 'user' ? 'You' : 'A';
    var bodyHtml = md(m.content);
    if (m.image) bodyHtml = '<img class="msg-image" src="' + m.image + '" alt="attachment">' + bodyHtml;
    var debugInfo = '';
    if (loadDebug() && m.role === 'assistant') {
      var bits = [];
      if (m.tools && m.tools.length) bits.push('⚙ ' + m.tools.join(' · '));
      if (m.iters) bits.push(m.iters + ' iter');
      if (m.usage) {
        var u = m.usage;
        if (u.input_tokens) bits.push(u.input_tokens + ' in / ' + (u.output_tokens||0) + ' out');
        else if (u.prompt_tokens) bits.push(u.prompt_tokens + ' in / ' + (u.completion_tokens||0) + ' out');
        else if (u.promptTokenCount) bits.push(u.promptTokenCount + ' in / ' + (u.candidatesTokenCount||0) + ' out');
      }
      if (m.provider) bits.push(m.provider);
      if (bits.length) debugInfo = '<div class="msg-tools">' + bits.join(' · ') + '</div>';
    }
    var actions = '';
    if (m.role === 'assistant' && m.content) {
      actions = '<div class="msg-actions"><button class="msg-action" data-speak="1">🔊 Speak</button><button class="msg-action" data-copy="1">📋 Copy</button>';
      if (loadSlackChan()) actions += '<button class="msg-action" data-slack="1">💬 Slack</button>';
      if (loadTelegramChat()) actions += '<button class="msg-action" data-telegram="1">✈️ Telegram</button>';
      actions += '</div>';
    }
    row.innerHTML = '<div class="avatar">' + avatar + '</div><div class="body">' + bodyHtml + debugInfo + actions + '</div>';
    if (m.role === 'assistant' && m.content) {
      var sb = row.querySelector('[data-speak]');
      if (sb) sb.addEventListener('click', function(){ speakMessage(m.content, sb); });
      var cb = row.querySelector('[data-copy]');
      if (cb) cb.addEventListener('click', function(){ navigator.clipboard.writeText(m.content); cb.textContent = '✅ Copied'; setTimeout(function(){ cb.textContent = '📋 Copy'; }, 1500); });
      var slk = row.querySelector('[data-slack]');
      if (slk) slk.addEventListener('click', function(){ sendToSlack(m.content, slk); });
      var tg = row.querySelector('[data-telegram]');
      if (tg) tg.addEventListener('click', function(){ sendToTelegram(m.content, tg); });
    }
    inner.appendChild(row);
  });
  els.chat.appendChild(inner);
  els.chat.scrollTop = els.chat.scrollHeight;
}

function probeProjects() {
  (PROJECTS_EFF.length ? PROJECTS_EFF : PROJECTS).forEach(async p => {
    const sidebarDot = els.projects.querySelector('[data-pid="' + p.id + '"]');
    const tileDot = els.chat.querySelector('[data-pid-tile="' + p.id + '"]');
    const tileLabel = els.chat.querySelector('[data-pid-tile-label="' + p.id + '"]');
    const detailDot = els.chat.querySelector('[data-pid-detail="' + p.id + '"]');
    const detailLabel = els.chat.querySelector('[data-pid-detail-label="' + p.id + '"]');
    if (!p.url) {
      [els.projects.querySelector('[data-pid="' + p.id + '"]'), els.chat.querySelector('[data-pid-tile="' + p.id + '"]'), els.chat.querySelector('[data-pid-detail="' + p.id + '"]')]
        .forEach(d => { if (d) { d.classList.remove('checking', 'up', 'down'); } });
      const lbl = els.chat.querySelector('[data-pid-tile-label="' + p.id + '"]');
      if (lbl) lbl.textContent = 'no URL';
      return;
    }
    let status = 'down';
    try {
      await fetch(p.url, { mode: 'no-cors', cache: 'no-store' });
      status = 'up';
    } catch { status = 'down'; }
    [sidebarDot, tileDot, detailDot].forEach(d => { if (d) { d.classList.remove('checking', 'up', 'down'); d.classList.add(status); } });
    if (tileLabel) tileLabel.textContent = status === 'up' ? 'live' : 'unreachable';
    if (detailLabel) detailLabel.textContent = status === 'up' ? 'live' : 'unreachable';
  });
}

// ---------- Modal helpers ----------
function openModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  els.modalScrim.classList.add('open');
  el.classList.add('open');
  if (id === 'bridgesModal') {
    probeBridge('paddy', els.chromeBridgeStatus);
    probeBridge('paddy-desktop', els.desktopBridgeStatus);
    if (els.btnTestBridges) els.btnTestBridges.onclick = testBridges;
  }
  if (id === 'deployModal') {
    if (els.btnSmoke) els.btnSmoke.onclick = runSmokeTest;
    if (els.btnLoadCommits) els.btnLoadCommits.onclick = loadRecentCommits;
    // Default the rollback worker name to the current deployName field
    if (els.deployName && els.rbWorkerLabel) els.rbWorkerLabel.textContent = els.deployName.value || 'asgard';
  }
  // Move focus into the modal for keyboard users
  setTimeout(function(){
    var first = el.querySelector('input, textarea, select, button:not(.modal-close)');
    if (first && typeof first.focus === 'function') first.focus();
  }, 50);
}
function closeAllModals() { els.modalScrim.classList.remove('open'); ['settingsModal','statsModal','deployModal','bridgesModal'].forEach(function(i){ var el=document.getElementById(i); if(el) el.classList.remove('open'); }); }

function populateSettings() {
  // Default model dropdown
  els.setDefaultModel.innerHTML = '';
  MODELS_INLINE.forEach(function(m){
    var opt = document.createElement('option');
    opt.value = m.id; opt.textContent = m.label + ' (' + m.provider + ')';
    if (m.id === selectedModel) opt.selected = true;
    els.setDefaultModel.appendChild(opt);
  });
  els.setDefaultModel.onchange = function(){ selectedModel = els.setDefaultModel.value; saveModel(selectedModel); render(); };
  els.setTheme.value = loadTheme();
  els.setTheme.onchange = function(){ saveTheme(els.setTheme.value); };
  els.setDebug.checked = loadDebug();
  els.setDebug.onchange = function(){ saveDebug(els.setDebug.checked); render(); };
  els.setPin.value = loadPin();
  els.setPin.onchange = function(){ savePin(els.setPin.value); };
  els.setSlackChan.value = loadSlackChan();
  els.setSlackChan.onchange = function(){ saveSlackChan(els.setSlackChan.value); };
  els.setTelegramChat.value = loadTelegramChat();
  els.setTelegramChat.onchange = function(){ saveTelegramChat(els.setTelegramChat.value); };
  els.setPinGate.checked = loadPinGate();
  els.setPinGate.onchange = function(){ savePinGate(els.setPinGate.checked); };
  els.setFacts.value = loadFacts();
  els.setFacts.onchange = function(){ saveFacts(els.setFacts.value); };
  els.setCloudSync.checked = loadCloudSync();
  els.setCloudSync.onchange = function(){ saveCloudSyncFlag(els.setCloudSync.checked); if (els.setCloudSync.checked) cloudSyncPush(); };
  els.btnSyncNow.onclick = function(){ cloudSyncPush(true); };
  els.btnSyncRestore.onclick = function(){ if (confirm('Replace local conversations with cloud copy? This cannot be undone for the local copy.')) cloudSyncPull(true); };
  els.setVersion.textContent = '__VERSION__';
  try {
    var bytes = 0;
    for (var k in localStorage) if (localStorage.hasOwnProperty(k)) bytes += (localStorage[k] || '').length;
    els.setStorageUsed.textContent = (bytes / 1024).toFixed(1) + ' KB';
  } catch(e) { els.setStorageUsed.textContent = '?'; }
  els.btnClearChats.onclick = function(){
    if (!confirm('Delete ALL conversations? This cannot be undone.')) return;
    convos = []; activeId = ''; saveConvos(convos); saveActive('');
    closeAllModals(); render();
  };
  els.btnExport.onclick = function(){
    var includePrivate = confirm('Include private chats in export?');
    var data = includePrivate ? convos : convos.filter(function(c){ return !c.private; });
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'asgard-conversations-' + Date.now() + '.json'; a.click();
  };
}

async function loadStats() {
  els.statsBody.innerHTML = '<div class="muted">Loading…</div>';
  try {
    var r = await fetch(TOOLS_URL + '/admin/projects');
    var d = await r.json();
    var html = '<div class="stats-grid">' +
      '<div class="stat-card"><div class="num">' + (d.counts && d.counts.workers || 0) + '</div><div class="label">CF Workers</div></div>' +
      '<div class="stat-card"><div class="num">' + (d.counts && d.counts.pages || 0) + '</div><div class="label">CF Pages</div></div>' +
      '<div class="stat-card"><div class="num">' + (PROJECTS.length) + '</div><div class="label">Tracked projects</div></div>' +
      '<div class="stat-card"><div class="num">' + (convos.length) + '</div><div class="label">Local convos</div></div>' +
      '</div>';
    if (d.workers && d.workers.length) {
      html += '<div class="stat-list"><div class="muted" style="padding:4px 8px">Workers:</div>';
      d.workers.forEach(function(w){ html += '<div class="item">' + escapeHtml(w) + '</div>'; });
      html += '</div>';
    }
    if (d.pages && d.pages.length) {
      html += '<div class="stat-list"><div class="muted" style="padding:4px 8px">Pages:</div>';
      d.pages.forEach(function(p){ var doms = (p.domains||[]).join(', '); html += '<div class="item">' + escapeHtml(p.name) + (doms ? ' → ' + escapeHtml(doms) : '') + '</div>'; });
      html += '</div>';
    }
    html += '<div class="muted" style="margin-top:10px">Generated ' + escapeHtml(d.generated_at || '') + '</div>';
    // Recent errors from asgard-ai
    try {
      var er = await fetch('https://asgard-ai.pgallivan.workers.dev/admin/errors?limit=20', { headers: { 'X-Pin': loadPin() } });
      var ed = await er.json();
      if (ed.ok && ed.errors && ed.errors.length) {
        html += '<div style="margin-top:18px;font-weight:600;font-size:13px">Recent errors (' + ed.count + ')</div>';
        html += '<div class="stat-list">';
        ed.errors.forEach(function(e){
          var when = new Date(e.ts).toLocaleString();
          html += '<div class="item" style="display:block;padding:6px 8px;border-bottom:1px solid var(--border)">' +
                  '<div style="display:flex;justify-content:space-between;font-size:11px"><span style="color:var(--bad)">' + escapeHtml(e.endpoint || '?') + '</span><span class="muted">' + escapeHtml(when) + '</span></div>' +
                  '<div style="font-size:11px;color:var(--text-soft);margin-top:2px">' + escapeHtml((e.message || '').substring(0, 200)) + '</div>' +
                  (e.detail ? '<div style="font-size:10px;color:var(--muted);font-family:monospace;margin-top:2px">' + escapeHtml(e.detail.substring(0, 200)) + '</div>' : '') +
                  '</div>';
        });
        html += '</div>';
      } else {
        html += '<div style="margin-top:18px;font-size:12px;color:var(--good)">✅ No recent errors logged</div>';
      }
    } catch(e) {
      html += '<div style="margin-top:18px;font-size:11px;color:var(--muted)">Error log fetch failed: ' + escapeHtml(e.message) + '</div>';
    }
    els.statsBody.innerHTML = html;
  } catch (e) {
    els.statsBody.innerHTML = '<div style="color:var(--bad)">Stats fetch failed: ' + escapeHtml(e.message) + '</div>';
  }
}

async function runSmokeTest() {
  els.smokeStatus.textContent = 'Running...';
  els.smokeResults.innerHTML = '';
  try {
    var r = await fetch(TOOLS_URL + '/admin/smoke');
    var d = await r.json();
    els.smokeStatus.textContent = d.ok ? '✅ All workers green' : '⚠ Some failed';
    els.smokeStatus.style.color = d.ok ? 'var(--good)' : 'var(--bad)';
    var html = '';
    (d.results || []).forEach(function(rr){
      var icon = rr.ok ? '✅' : '❌';
      html += '<div>' + icon + ' ' + escapeHtml(rr.name) + (rr.deployment_id ? ' · <span style="color:var(--muted)">' + rr.deployment_id.substring(0,8) + ' · ' + (rr.created || '').substring(0,10) + '</span>' : (rr.error ? ' <span style="color:var(--bad)">' + escapeHtml(rr.error) + '</span>' : '')) + '</div>';
    });
    els.smokeResults.innerHTML = html;
  } catch (e) {
    els.smokeStatus.textContent = 'Failed: ' + e.message;
    els.smokeStatus.style.color = 'var(--bad)';
  }
}

async function loadRecentCommits() {
  var worker = (els.deployName.value || 'asgard').trim();
  els.rbWorkerLabel.textContent = worker;
  els.rollbackList.innerHTML = '<span class="muted">Loading...</span>';
  try {
    var r = await fetch('https://api.github.com/repos/PaddyGallivan/asgard-source/commits?path=workers/' + worker + '.js&per_page=10');
    var commits = await r.json();
    if (!Array.isArray(commits) || !commits.length) {
      els.rollbackList.innerHTML = '<span class="muted">No commits found for workers/' + escapeHtml(worker) + '.js</span>';
      return;
    }
    var html = '';
    commits.forEach(function(c, i){
      var msg = (c.commit && c.commit.message) || '';
      var short = c.sha.substring(0, 8);
      var when = (c.commit && c.commit.author && c.commit.author.date) || '';
      html += '<div style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px">' +
              '<code style="background:var(--panel2);padding:2px 6px;border-radius:4px;font-size:10px">' + short + '</code>' +
              '<span style="flex:1;font-size:11px">' + escapeHtml(msg.slice(0, 80)) + '</span>' +
              '<span class="muted" style="font-size:10px">' + when.substring(5,16) + '</span>' +
              (i === 0 ? '<span class="muted" style="font-size:10px">(current)</span>' : '<button class="btn" data-rb-sha="' + c.sha + '" data-rb-worker="' + worker + '" style="font-size:10px;padding:3px 8px">Restore</button>') +
              '</div>';
    });
    els.rollbackList.innerHTML = html;
    els.rollbackList.querySelectorAll('[data-rb-sha]').forEach(function(b){
      b.addEventListener('click', function(){ rollbackTo(b.getAttribute('data-rb-worker'), b.getAttribute('data-rb-sha')); });
    });
  } catch (e) {
    els.rollbackList.innerHTML = '<span style="color:var(--bad)">Load failed: ' + escapeHtml(e.message) + '</span>';
  }
}

async function rollbackTo(worker, sha) {
  if (!confirm('Roll ' + worker + ' back to commit ' + sha.substring(0,8) + '?')) return;
  els.rollbackList.innerHTML = '<span class="muted">Rolling back...</span>';
  try {
    var main = worker === 'asgard' ? 'asgard.js' : 'worker.js';
    var r = await fetch(TOOLS_URL + '/admin/rollback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ worker_name: worker, sha: sha, main_module: main })
    });
    var d = await r.json();
    if (d.rolled_back) {
      els.rollbackList.innerHTML = '<span style="color:var(--good)">✅ Rolled ' + escapeHtml(worker) + ' back to ' + sha.substring(0,8) + '</span>';
      setTimeout(loadRecentCommits, 2000);
    } else {
      els.rollbackList.innerHTML = '<span style="color:var(--bad)">❌ ' + escapeHtml(JSON.stringify(d).substring(0, 300)) + '</span>';
    }
  } catch (e) {
    els.rollbackList.innerHTML = '<span style="color:var(--bad)">Error: ' + escapeHtml(e.message) + '</span>';
  }
}

async function doDeploy() {
  var name = els.deployName.value.trim();
  var main = els.deployMain.value.trim() || 'worker.js';
  var code = els.deployCode.value;
  if (!name || !code) { els.deployStatus.textContent = 'Need name and code'; return; }
  els.deployStatus.textContent = 'Deploying…';
  try {
    var b64 = btoa(unescape(encodeURIComponent(code)));
    var r = await fetch(TOOLS_URL + '/admin/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ worker_name: name, code_b64: b64, main_module: main })
    });
    var d = await r.json();
    if (d.deployed) {
      els.deployStatus.textContent = '✅ Deployed ' + name;
      els.deployStatus.style.color = 'var(--good)';
    } else {
      els.deployStatus.textContent = '❌ ' + (JSON.stringify(d.errors || d).substring(0, 200));
      els.deployStatus.style.color = 'var(--bad)';
    }
  } catch (e) {
    els.deployStatus.textContent = 'Error: ' + e.message;
    els.deployStatus.style.color = 'var(--bad)';
  }
}

let currentAudio = null;
async function speakMessage(text, btn) {
  if (currentAudio) { try { currentAudio.pause(); } catch(e){} currentAudio = null; }
  if (btn) btn.classList.add('playing');
  try {
    var r = await fetch('https://asgard-ai.pgallivan.workers.dev/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ text: text.substring(0, 4000) })
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    var blob = await r.blob();
    var url = URL.createObjectURL(blob);
    currentAudio = new Audio(url);
    currentAudio.onended = function(){ if (btn) btn.classList.remove('playing'); currentAudio = null; };
    currentAudio.onerror = function(){ if (btn) btn.classList.remove('playing'); currentAudio = null; };
    currentAudio.play();
  } catch (e) {
    if (btn) btn.classList.remove('playing');
    alert('TTS failed: ' + e.message);
  }
}

// ---------- Cloud sync (D1 via asgard-brain) ----------
let _syncTimer = null;
async function cloudSyncPush(manual) {
  if (!loadCloudSync() && !manual) return;
  if (els.syncStatus) els.syncStatus.textContent = 'Syncing…';
  try {
    // Ensure table exists (idempotent)
    await fetch(SYNC_BRAIN_URL + '/d1/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ sql: 'CREATE TABLE IF NOT EXISTS asgard_sync_state (uid TEXT PRIMARY KEY, blob TEXT, ts INTEGER)', params: [] })
    });
    const blob = JSON.stringify({ convos: convos, ts: Date.now() });
    if (blob.length > 4000000) { if (els.syncStatus) els.syncStatus.textContent = 'Too large to sync (>4MB)'; return; }
    await fetch(SYNC_BRAIN_URL + '/d1/write', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({
        sql: 'INSERT OR REPLACE INTO asgard_sync_state (uid, blob, ts) VALUES (?, ?, ?)',
        params: [SYNC_UID, blob, Date.now()]
      })
    });
    if (els.syncStatus) els.syncStatus.textContent = 'Synced ' + new Date().toLocaleTimeString();
  } catch (e) {
    if (els.syncStatus) els.syncStatus.textContent = 'Sync failed: ' + e.message;
  }
}

async function cloudSyncPull(manual) {
  if (els.syncStatus) els.syncStatus.textContent = 'Restoring…';
  try {
    const r = await fetch(SYNC_BRAIN_URL + '/d1/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ sql: 'SELECT blob, ts FROM asgard_sync_state WHERE uid = ?', params: [SYNC_UID] })
    });
    const d = await r.json();
    const row = d.results && d.results[0];
    if (!row) { if (els.syncStatus) els.syncStatus.textContent = 'No cloud copy yet.'; return; }
    const parsed = JSON.parse(row.blob);
    if (parsed && Array.isArray(parsed.convos)) {
      convos = parsed.convos;
      saveConvos(convos);
      if (els.syncStatus) els.syncStatus.textContent = 'Restored ' + parsed.convos.length + ' chats from ' + new Date(row.ts).toLocaleString();
      render();
    } else {
      if (els.syncStatus) els.syncStatus.textContent = 'Cloud copy malformed.';
    }
  } catch (e) {
    if (els.syncStatus) els.syncStatus.textContent = 'Restore failed: ' + e.message;
  }
}

function scheduleSync() {
  if (!loadCloudSync()) return;
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(function(){ cloudSyncPush(); }, 3000);
}

async function sendToSlack(text, btn) {
  var chan = loadSlackChan();
  if (!chan) { alert('Configure Slack channel in Settings'); return; }
  if (btn) btn.textContent = '⏳ Slack…';
  try {
    var r = await fetch('https://asgard-ai.pgallivan.workers.dev/slack/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ channel: chan, text: text.substring(0, 4000) })
    });
    if (!r.ok) throw new Error('HTTP ' + r.status + ': ' + (await r.text()).substring(0, 200));
    if (btn) { btn.textContent = '✅ Sent'; setTimeout(function(){ btn.textContent = '💬 Slack'; }, 1800); }
  } catch (e) {
    if (btn) btn.textContent = '❌ Slack';
    alert('Slack failed: ' + e.message);
  }
}

async function sendToTelegram(text, btn) {
  var chat = loadTelegramChat();
  if (!chat) { alert('Configure Telegram chat ID in Settings'); return; }
  if (btn) btn.textContent = '⏳ Telegram…';
  try {
    var r = await fetch('https://asgard-ai.pgallivan.workers.dev/telegram/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ chat_id: chat, text: text.substring(0, 4000) })
    });
    if (!r.ok) throw new Error('HTTP ' + r.status + ': ' + (await r.text()).substring(0, 200));
    if (btn) { btn.textContent = '✅ Sent'; setTimeout(function(){ btn.textContent = '✈️ Telegram'; }, 1800); }
  } catch (e) {
    if (btn) btn.textContent = '❌ Telegram';
    alert('Telegram failed: ' + e.message);
  }
}

async function probeBridge(uid, statusEl) {
  if (!statusEl) return;
  try {
    var r = await fetch('https://asgard-ai.pgallivan.workers.dev/bridge/poll?uid=' + encodeURIComponent(uid), { headers: { 'X-Pin': loadPin() } });
    if (r.ok) {
      statusEl.textContent = '· connected';
      statusEl.style.color = 'var(--good)';
    } else {
      statusEl.textContent = '· offline';
      statusEl.style.color = 'var(--bad)';
    }
  } catch (e) {
    statusEl.textContent = '· offline';
    statusEl.style.color = 'var(--bad)';
  }
}

async function testBridges() {
  if (!els.bridgesTestStatus) return;
  els.bridgesTestStatus.textContent = 'Sending tests…';
  try {
    var r1 = await fetch('https://asgard-ai.pgallivan.workers.dev/bridge/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ uid: 'paddy', command: { type: 'screenshot', input: {} } })
    });
    var d1 = await r1.json();
    var r2 = await fetch('https://asgard-ai.pgallivan.workers.dev/bridge/enqueue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ uid: 'paddy-desktop', command: { type: 'screenshot', input: {} } })
    });
    var d2 = await r2.json();
    // Wait 4s for helpers to pick up
    await new Promise(r => setTimeout(r, 4000));
    var c1 = await (await fetch('https://asgard-ai.pgallivan.workers.dev/bridge/result/' + d1.id, { headers: { 'X-Pin': loadPin() } })).json();
    var c2 = await (await fetch('https://asgard-ai.pgallivan.workers.dev/bridge/result/' + d2.id, { headers: { 'X-Pin': loadPin() } })).json();
    var msgs = [];
    msgs.push('Chrome: ' + (c1.status === 'done' ? '✅ responded' : '⏳ no response'));
    msgs.push('Desktop: ' + (c2.status === 'done' ? '✅ responded' : '⏳ no response'));
    els.bridgesTestStatus.textContent = msgs.join(' · ');
    els.bridgesTestStatus.style.color = (c1.status === 'done' && c2.status === 'done') ? 'var(--good)' : 'var(--warn)';
  } catch (e) {
    els.bridgesTestStatus.textContent = 'Test failed: ' + e.message;
    els.bridgesTestStatus.style.color = 'var(--bad)';
  }
}

async function submitFeatureRequest() {
  var text = prompt('What feature would you like to request?');
  if (!text || !text.trim()) return;
  try {
    var r = await fetch('https://asgard-ai.pgallivan.workers.dev/feature-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
      body: JSON.stringify({ body: text.trim(), text: text.trim(), source: 'asgard-dashboard' })
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    alert('✅ Feature request submitted');
  } catch (e) {
    alert('Submission failed: ' + e.message);
  }
}

function attachImageFromFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Not an image: ' + file.type); return; }
  if (file.size > 5 * 1024 * 1024) { alert('Image too large (>5MB)'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    var dataUrl = e.target.result;
    var b64 = dataUrl.split(',')[1] || '';
    pendingImage = { base64: b64, name: file.name, dataUrl: dataUrl };
    renderAttachRow();
  };
  reader.readAsDataURL(file);
}

function renderAttachRow() {
  var existing = document.getElementById('attachRow');
  if (existing) existing.remove();
  if (!pendingImage) return;
  var row = document.createElement('div');
  row.id = 'attachRow';
  row.className = 'attach-row';
  row.innerHTML = '<span class="attach-chip">📎 ' + escapeHtml(pendingImage.name) + ' <span class="x" id="attachClear">×</span></span>';
  document.querySelector('.composer-inner').insertBefore(row, document.querySelector('.composer-box'));
  document.getElementById('attachClear').addEventListener('click', function(){ pendingImage = null; renderAttachRow(); });
}

function buildSystemPrompt(conv) {
  if (!conv || !conv.projectId) return null;
  const proj = PROJECTS_EFF.find(p => p.id === conv.projectId);
  if (!proj) return null;
  return 'You are Asgard, working specifically on the ' + proj.name + ' project right now. Project context: ' + proj.context + ' Live URL: ' + proj.url + '. Repo: ' + proj.repo + '. Scope all answers and actions to this project unless Paddy explicitly says otherwise.';
}

async function send(text) {
  let conv = getActive();
  if (!conv) conv = newConvo(null);

  // Slash command: /image <prompt> → DALL-E
  if (text.toLowerCase().startsWith('/image ')) {
    var prompt = text.slice(7).trim();
    if (!prompt) return;
    conv.messages.push({ role: 'user', content: '/image ' + prompt });
    if (conv.title === 'New chat') conv.title = '🎨 ' + prompt.slice(0, 30);
    saveConvos(convos);
    currentView = 'chat'; saveView('chat');
    render();
    var imgInner = els.chat.querySelector('.chat-inner') || (function(){ var i = document.createElement('div'); i.className = 'chat-inner'; els.chat.appendChild(i); return i; })();
    var imgTypingRow = document.createElement('div');
    imgTypingRow.className = 'msg assistant';
    imgTypingRow.innerHTML = '<div class="avatar">A</div><div class="body"><div class="typing"><span></span><span></span><span></span></div> <span class="muted">generating image…</span></div>';
    imgInner.appendChild(imgTypingRow);
    els.chat.scrollTop = els.chat.scrollHeight;
    els.send.disabled = true;
    var dalleStartedAt = Date.now();
    var progressLabel = imgTypingRow.querySelector('.muted');
    var progressInterval = setInterval(function(){
      if (!progressLabel) return;
      var sec = Math.floor((Date.now() - dalleStartedAt)/1000);
      progressLabel.textContent = 'generating image… ' + sec + 's (DALL-E typically 15–35s)';
    }, 1000);
    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeoutId = setTimeout(function(){ if (ctrl) ctrl.abort(); }, 90000);
    try {
      var r = await fetch('https://asgard-ai.pgallivan.workers.dev/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Pin': loadPin() },
        body: JSON.stringify({ prompt: prompt }),
        signal: ctrl ? ctrl.signal : undefined
      });
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      imgTypingRow.remove();
      if (!r.ok) {
        var errBody = '';
        try { errBody = (await r.text()).substring(0, 200); } catch(e){}
        throw new Error('HTTP ' + r.status + ' ' + errBody);
      }
      var d = await r.json();
      if (!d.url) throw new Error('No image URL in response: ' + JSON.stringify(d).substring(0,200));
      var elapsed = ((Date.now() - dalleStartedAt)/1000).toFixed(1);
      conv.messages.push({ role: 'assistant', content: 'Generated in ' + elapsed + 's: ' + prompt, image: d.url, provider: 'dalle', tools: ['image/generate'] });
      saveConvos(convos);
      render();
    } catch (e) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      imgTypingRow.remove();
      var msg = e.name === 'AbortError'
        ? 'Image generation timed out after 90s. DALL-E was slow today — try again, or simplify the prompt.'
        : ('Image generation failed: ' + e.message);
      conv.messages.push({ role: 'assistant', content: '⚠ ' + msg });
      saveConvos(convos);
      render();
    } finally {
      els.send.disabled = false;
      els.input.focus();
    }
    return;
  }

  conv.messages.push({ role: 'user', content: text });
  if (conv.title === 'New chat') conv.title = text.length > 40 ? text.slice(0, 40) + '…' : text;
  conv.updatedAt = Date.now();
  saveConvos(convos);
  currentView = 'chat'; saveView('chat');
  render();

  const inner = els.chat.querySelector('.chat-inner') || (() => { const i = document.createElement('div'); i.className = 'chat-inner'; els.chat.appendChild(i); return i; })();
  const typingRow = document.createElement('div');
  typingRow.className = 'msg assistant';
  typingRow.innerHTML = '<div class="avatar">A</div><div class="body"><div class="typing"><span></span><span></span><span></span></div></div>';
  inner.appendChild(typingRow);
  els.chat.scrollTop = els.chat.scrollHeight;
  els.send.disabled = true;

  try {
    const sys = buildSystemPrompt(conv);
    var modelMeta = MODELS_INLINE.find(function(m){ return m.id === selectedModel; }) || MODELS_INLINE[0];
    var isClaude = modelMeta.provider === 'anthropic';
    var hasImage = !!pendingImage;
    var endpoint;
    var body;
    if (hasImage) {
      // Vision route — always go through asgard-ai /chat/vision
      endpoint = 'https://asgard-ai.pgallivan.workers.dev/chat/vision';
      body = { message: text, image_base64: pendingImage.base64, model: selectedModel };
      if (sys) body.system = sys;
      // Attach the image to the just-pushed user message so it renders in chat
      conv.messages[conv.messages.length - 1].image = pendingImage.dataUrl;
      saveConvos(convos);
      pendingImage = null; renderAttachRow();
    } else {
      // ALL providers (Claude, OpenAI, Gemini) route to asgard-ai /chat/agentic for unified tool access (drive_*, github_*, send_email, etc.)
      endpoint = 'https://asgard-ai.pgallivan.workers.dev/chat/agentic';
      body = { message: text, messages: conv.messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })), model: selectedModel };
      if (sys) body.system = sys;
    }
    var headers = { 'Content-Type': 'application/json', 'X-Pin': loadPin() };
    const r = await fetch(endpoint, { method: 'POST', headers: headers, body: JSON.stringify(body) });
    typingRow.remove();
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const data = await r.json();
    const reply = data.response || data.reply || data.text || data.content || data.message || '(empty response)';
    conv.messages.push({ role: 'assistant', content: reply, tools: data.tools_executed || [], iters: data.iterations, usage: data.usage, provider: data.provider });
    conv.updatedAt = Date.now();
    saveConvos(convos);
    render();
  } catch (e) {
    typingRow.remove();
    conv.messages.push({ role: 'assistant', content: '⚠ Error: ' + e.message });
    saveConvos(convos);
    render();
  } finally {
    els.send.disabled = false;
    els.input.focus();
  }
}

// ---------- Wiring ----------
els.newChat.addEventListener('click', () => { newConvo(null); currentView = 'chat'; saveView('chat'); render(); closeSidebarMobile(); els.input.focus(); });
els.form.addEventListener('submit', (e) => { e.preventDefault(); const v = els.input.value.trim(); if (!v) return; els.input.value = ''; els.input.style.height = 'auto'; send(v); });
els.input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); els.form.requestSubmit(); } });
els.input.addEventListener('input', () => { els.input.style.height = 'auto'; els.input.style.height = Math.min(els.input.scrollHeight, 220) + 'px'; });
els.openSidebar.addEventListener('click', () => { els.sidebar.classList.add('open'); els.scrim.classList.add('open'); });
els.scrim.addEventListener('click', closeSidebarMobile);
els.modalScrim.addEventListener('click', closeAllModals);
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (els.modalScrim.classList.contains('open')) closeAllModals();
    else if (els.sidebar.classList.contains('open')) closeSidebarMobile();
    else if (els.modelMenu.classList.contains('open')) els.modelMenu.classList.remove('open');
  }
});
document.querySelectorAll('[data-close]').forEach(function(b){ b.addEventListener('click', closeAllModals); });
els.btnDeploy.addEventListener('click', doDeploy);

// Image paste/drop on the composer
document.getElementById('input').addEventListener('paste', function(e){
  var items = (e.clipboardData || {}).items || [];
  for (var i = 0; i < items.length; i++) {
    if (items[i].type && items[i].type.startsWith('image/')) {
      var f = items[i].getAsFile(); if (f) { e.preventDefault(); attachImageFromFile(f); return; }
    }
  }
});
window.addEventListener('dragover', function(e){ if (e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files')) e.preventDefault(); });
window.addEventListener('drop', function(e){
  if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length) return;
  e.preventDefault();
  attachImageFromFile(e.dataTransfer.files[0]);
});

// Apply theme on load
saveTheme(loadTheme());

// Live-sync: poll /health, banner if a newer version is live
var LOADED_VERSION = '__VERSION__';
async function pollVersion() {
  try {
    var r = await fetch('/health', { cache: 'no-store' });
    var d = await r.json();
    if (d.version && d.version !== LOADED_VERSION) {
      var ex = document.getElementById('updateBanner'); if (ex) return;
      var b = document.createElement('div');
      b.id = 'updateBanner';
      b.style.cssText = 'position:fixed;top:0;left:0;right:0;background:var(--accent);color:white;padding:8px 16px;text-align:center;font-size:13px;cursor:pointer;z-index:200;font-weight:500';
      b.textContent = 'New Asgard version live: ' + d.version + ' (you have ' + LOADED_VERSION + ') — click to reload';
      b.addEventListener('click', function(){ location.reload(); });
      document.body.appendChild(b);
    }
  } catch (e) {}
}
setInterval(pollVersion, 60000);
els.modelBtn.addEventListener('click', function(e){ e.stopPropagation(); els.modelMenu.classList.toggle('open'); });
document.addEventListener('click', function(e){ if (!e.target.closest || !e.target.closest('#modelPicker')) els.modelMenu.classList.remove('open'); });
els.viewTabs.addEventListener('click', (e) => {
  const b = e.target.closest('.view-tab'); if (!b) return;
  setView(b.dataset.view);
});
function closeSidebarMobile() { els.sidebar.classList.remove('open'); els.scrim.classList.remove('open'); }

// PIN gate (optional, opt-in via Settings)
function runPinGate(then) {
  if (!loadPinGate()) { then(); return; }
  // Already verified this session?
  if (sessionStorage.getItem(PIN_VERIFY_KEY) === '1') { then(); return; }
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:var(--bg);display:flex;align-items:center;justify-content:center;z-index:9999';
  overlay.innerHTML = '<div style="background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:32px;max-width:340px;width:100%"><h2 style="margin:0 0 14px;font-size:18px">Asgard PIN</h2><p class="muted" style="margin:0 0 14px;font-size:13px">Enter your PIN to continue.</p><input type="password" id="gatePin" style="width:100%;padding:10px;background:var(--panel2);border:1px solid var(--border);color:var(--text);border-radius:6px;font-size:16px;font-family:inherit" autofocus><div id="gateErr" style="color:var(--bad);font-size:12px;margin-top:8px;display:none">Wrong PIN</div><button id="gateBtn" style="width:100%;margin-top:14px;padding:10px;background:var(--accent);border:0;color:white;border-radius:6px;cursor:pointer;font-weight:600;font-size:14px">Unlock</button></div>';
  document.body.appendChild(overlay);
  var input = document.getElementById('gatePin');
  var btn = document.getElementById('gateBtn');
  var err = document.getElementById('gateErr');
  function tryUnlock() {
    if (input.value === loadPin()) {
      sessionStorage.setItem(PIN_VERIFY_KEY, '1');
      overlay.remove();
      then();
    } else {
      err.style.display = 'block';
      input.value = ''; input.focus();
    }
  }
  btn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') tryUnlock(); });
}

runPinGate(function() {
  if (loadCloudSync() && convos.length === 0) {
    cloudSyncPull().then(function(){
      if (convos.length === 0) newConvo(null);
      else if (!activeId || !getActive()) { activeId = convos[0].id; saveActive(activeId); }
      render();
      if (currentView === 'chat') els.input.focus();
    });
  } else {
    if (convos.length === 0) newConvo(null);
    else if (!activeId || !getActive()) { activeId = convos[0].id; saveActive(activeId); }
    render();
    if (currentView === 'chat') els.input.focus();
  }
  // Fetch products from asgard-brain D1 and re-render once loaded
  loadProductsFromBrain().then(function(n){ console.log('[asgard] loaded ' + n + ' products from D1'); render(); });
});
</script>
</body>
</html>`;

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (path === '/health') {
      return Response.json({ status: 'ok', version: VERSION, timestamp: new Date().toISOString() }, { headers: corsHeaders() });
    }

    if (path === '/tools') {
      return Response.json({ tools: ['http_request', 'get_worker_code', 'deploy_worker', 'get_secret'] }, { headers: corsHeaders() });
    }

    if (path === '/manifest.webmanifest' || path === '/manifest.json') {
      return Response.json({
        name: 'Asgard',
        short_name: 'Asgard',
        description: 'Luck Dragon infrastructure AI',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a1a',
        theme_color: '#d97757',
        orientation: 'portrait',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }, { headers: { 'Cache-Control': 'public, max-age=3600', ...corsHeaders() } });
    }

    if (path === '/icon.svg') {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="#1a1a1a"/><circle cx="256" cy="256" r="160" fill="#d97757"/><circle cx="256" cy="256" r="60" fill="#1a1a1a"/><circle cx="256" cy="170" r="22" fill="#1a1a1a"/></svg>`;
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } });
    }

    if (path === '/' || path === '/chat') {
      const html = HTML
        .replace(/__VERSION__/g, VERSION)
        .replace('__PROJECTS_JSON__', JSON.stringify(PROJECTS))
        .replace('__TOOLS_JSON__', JSON.stringify(TOOLS))
        .replace('__MODELS_JSON__', JSON.stringify(MODELS))
        .replace('__TOOLS_URL__', TOOLS_URL);
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders() });
  }
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             