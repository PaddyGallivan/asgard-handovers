# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 2)

## Live
- **Website:** knowbrainertrivia.com.au
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, 8 categories)
- **API worker:** kbt-api.luckdragon.io (deployed 2026-05-13 session 2)
- **Question engine:** kbt-question-engine.pgallivan.workers.dev (cron every 6h)
- **Source:** github.com/LuckDragonAsgard/kbt-trivia-tools

## DB
- **Supabase:** huvfgenbcaiicatvtxak.supabase.co
- **Key tables:** kbt_question, kbt_qtype (68 rows), kbt_quiz
- **New Qs land as:** status=draft, review in admin before use

## Tools — all 31 live
All tools: dark UI chrome, white slide canvas outputs (real KBT brand), Save to Library wired.

## Save to Library
- `/api/save-question` — generic, all 68 types, Drive upload non-fatal
- All 31 tools have 💾 Save button
- Saves land in kbt_question as status=draft

## Google OAuth — Drive upload
- LD_GOOGLE_REFRESH_TOKEN has drive.readonly only — Drive uploads will skip silently (Q saves to DB without asset URL)
- To fix: visit https://kbt-api.luckdragon.io/api/google-auth-url → complete OAuth → copy token to vault (LD_GOOGLE_REFRESH_TOKEN_KBT) + kbt-api secret (GOOGLE_REFRESH_TOKEN)
- Until fixed: questions save fine, just no Drive asset URL attached

## kbt_qtype IDs
face_morph=19, ghost_actors=20, linked_pics=22, name_the_brain=24, soundmash=26,
crack_the_code=14, brands=17, carmen_sandiego=23, guess_the_year=8
New: baby_photo=49, backwards=50, pixel_reveal=51, city_skyline=52, close_up=53,
country_outline=54, emoji_song=55, first_letters=56, flag_mashup=57,
instrument_solo=58, intro_only=59, movie_frame=60, silhouette=61,
sound_and_pic=62, stats_puzzle=63, text_message=64, title_sequence=65,
translator_fail=66, voice_id=67, wrong_speed=68

## Weekly rotation
1. Use tools → 💾 Save to Library → status=draft
2. Admin → review → approve
3. Friday: pick Qs → generate-event-deck-v2 → Slides

## Outstanding
- OAuth reauth needed for Drive asset uploads (see above)
- Slide canvas outputs now white — verify visually at kbt.luckdragon.io/tools
- generate-event-deck-v2 slide layouts for new types 49–68 (currently uses default layout)
