# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 7 — all gaps fully resolved)

## EVERYTHING WORKING ✅

### Core Platform
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, all with Save to Library)
- **Host admin:** kbt-trial.pgallivan.workers.dev (admin, scoring, question tools)
- **Player app:** kbt-trial.pgallivan.workers.dev/player-app (registration, quiz, wrap)
- **Vercel mirror:** kbt-trial.vercel.app (GitHub: Luck-Dragon-Pty-Ltd/kbt-trial, commit df3da3d8)
- **API:** kbt-api.luckdragon.io
- **Question engine:** every 6hrs (Wikipedia + Reddit TIL + Guardian News)

### APIs (kbt-api.luckdragon.io)
- /api/save-question — R2 + kbt_question + bridge to questions table
- /api/check-answer — fuzzy (Levenshtein + AI), returns correct/method/confidence
- /api/submit-answer — open-text answer with inline fuzzy check → kbt_live_answers
- /api/score-event — persists kbt_sess + kbt_teams.score + updates question stats
- /api/update-question-stats — update times_used/success_rate/last_used_at per question
- /api/team-wrap — historical stats: events_played, avg_score, best_score, recent, trend
- /api/generate-event-deck-v2 — full Google Slides deck, all 68 question types
- /api/ai-text, /api/deezer/*, /api/fal-* — all working

### Scoring Flow
1. Host admin → Live Scoring → openScoring(eventId)
2. Leaderboard with +1/-1 buttons, auto-sort by score
3. Built-in answer checker (fuzzy matching)
4. Save All → kbt_teams.score + kbt_sess + question stats updated

### Player Flow
1. Scan QR → kbt-trial.pgallivan.workers.dev/player-app
2. Register team (name, captain, members)
3. Quiz tab → polls /api/question every 2s → submit MCQ or open text
4. Wrap tab → loads /api/team-wrap → shows real history

### Question Stats Tracking
- Every score-event call updates times_used + last_used_at for all event questions
- /api/update-question-stats for per-question correct/incorrect tracking
- success_rate calculated as rolling average

### Slides Templates
- All 68 question types covered
- Types 1-48: original canonical templates
- Types 49-68: created 2026-05-13, Drive folder 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx
- TEMPLATE_IDS map in kbt-api.js has all 68 types

### Database (Supabase huvfgenbcaiicatvtxak.supabase.co)
- questions: 6,099 active (with times_used/success_rate/last_used_at now being written)
- kbt_question_candidates: engine pipeline (20 pending)
- kbt_teams: team registrations per event
- kbt_sess: historical scores per team per event
- kbt_live_answers: player answer submissions

### External Services
- ElevenLabs: sk_9a903983b77... kbt-api + asgard-ai + Vault ✅ (10k chars/month)
- Deezer: free public API
- FAL.ai, Anthropic: keys in kbt-api
- Google: SA kbt-slides@asgard-493906, asgard-ai drive-op PIN 535554

### Note on Vercel
kbt-trial.vercel.app is under "luck-dragon" Vercel team scope.
Current personal token (pgallivan) can't deploy to it.
CF Worker (kbt-trial.pgallivan.workers.dev) serves both admin AND player-app directly.
To update Vercel: get a team token from Vercel dashboard → add to Vault as VERCEL_LUCK_DRAGON_TOKEN.
