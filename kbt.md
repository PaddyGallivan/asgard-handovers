# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 6 — all gaps resolved)

## Live — Everything Working ✅
- **Website:** knowbrainertrivia.com.au
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, all with Save to Library)
- **Host admin:** kbt-trial.pgallivan.workers.dev (and kbt-trial.vercel.app)
- **API:** kbt-api.luckdragon.io

## APIs
- /api/save-question — R2 + kbt_question + bridge to questions table
- /api/check-answer — fuzzy (Levenshtein + AI), returns correct/method/confidence
- /api/score-event — persists to kbt_sess + kbt_teams.score
- /api/generate-event-deck-v2 — full Google Slides deck, all 68 question types
- /api/ai-text, /api/deezer/*, /api/fal-* — all working

## Slides Templates — ALL 68 TYPES COVERED ✅
Templates in Drive folder 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx (paddy@luckdragon.io)
Original types (1-48): existing canonical templates
New types (49-68): created 2026-05-13, copies of closest existing format
  - Image types (baby_photo, pixel_reveal, city_skyline, close_up, country_outline,
    flag_mashup, movie_frame, silhouette, title_sequence) → based on name_the_brain
  - Audio types (instrument_solo, intro_only, sound_and_pic, voice_id, wrong_speed) → based on soundmash
  - Text types (backwards, emoji_song, first_letters, stats_puzzle, text_message,
    translator_fail) → based on classic

## Google Cloud
- SA: kbt-slides@asgard-493906.iam.gserviceaccount.com (key 1d0357a894da)
- Drive proxy: asgard-ai /admin/drive-op (PIN 535554)
- Base deck: 1R7xJwPwd811x2nUlLe2R1V8YbYuEQI6Rc099BdGcPX8
- Output folder: 1LI91ZcUTl5UGR_LWN3nQyS9uDigRM0L3

## External Services
- ElevenLabs: sk_9a903983b77... stored in kbt-api + asgard-ai + Vault ✅
- Deezer: free public API (no key)
- FAL.ai: key in kbt-api
- Anthropic: key in kbt-api

## Database (Supabase huvfgenbcaiicatvtxak.supabase.co)
- questions: 6,099 active (real bank)
- kbt_question_candidates: engine pipeline (20 pending)
- kbt_qtype: 68 rows
- kbt_teams: registrations per event
- kbt_sess: historical scores

## Question Engine (every 6hrs)
- Sources: Wikipedia Random, Wikipedia OnThisDay, Reddit TIL, Wikipedia Featured, Guardian News
- Types: Classic, Closest Wins, Famous Firsts, Two Truths One Lie, Emoji Decode, Before & After, Guess The Year, Anagram, Willywood, Connections
- Approve: bridges candidate → questions table (active)

## Remaining (minor)
- question_success tracking (field exists, nothing writes to it)
- Player-facing answer submission app
- Team/player wrap analytics
