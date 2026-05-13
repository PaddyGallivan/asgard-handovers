# KBT — Know Brainer Trivia
Last updated: 2026-05-13 (session 4)

## Live
- **Website:** knowbrainertrivia.com.au
- **Tools hub:** kbt.luckdragon.io/tools (31 tools, 8 categories)
- **API worker:** kbt-api.luckdragon.io
- **Source:** github.com/LuckDragonAsgard/kbt-trivia-tools

## Deck Generation — WORKING ✅
- **Endpoint:** POST /api/generate-event-deck-v2
- **Architecture:**
  1. Drive copy via asgard-ai /admin/drive-op (PIN 535554) — uses paddy@luckdragon.io token
  2. Slides batchUpdate via SA token (kbt-slides@asgard-493906) — direct Slides API
  3. Output folder: 1LI91ZcUTl5UGR_LWN3nQyS9uDigRM0L3 (KBT Generated Decks, shared with paddy)
- **Base template:** 1R7xJwPwd811x2nUlLe2R1V8YbYuEQI6Rc099BdGcPX8 (KBT Master Event Deck v2)
- **Templates folder:** 1BhuxB_9YrjXYR5zWGbxkHXYEez74AAHx (KBT Templates - Canonical, paddy@luckdragon.io)
- **Auth chain:** GOOGLE_SA_JSON (asgard-493906 kbt-slides SA) for Slides API; asgard-ai drive-op proxy for Drive copy

## Asset Storage — R2 ✅
- **Bucket:** kbt-assets (Cloudflare R2)
- **Public URL:** https://pub-1a54ecdb73db411abfee3ed3772db25e.r2.dev
- **Save to Library:** all 31 tools → R2 + Supabase

## DB
- **Supabase:** huvfgenbcaiicatvtxak.supabase.co
- **kbt_qtype:** 68 rows (IDs 1–68)
- **New Qs:** status=draft

## asgard-ai /admin/drive-op (PIN 535554)
- op: copy — { src_id, parent, name } → { ok, id, url }
- op: slides-get — { presentation_id } → { ok, slides, title }
- op: slides-update — { presentation_id, requests } → { ok, replies }
- Uses GOOGLE_REFRESH_TOKEN (paddy@luckdragon.io, drive + calendar scope)

## Weekly workflow
1. Tools → 💾 Save → R2 + Supabase (draft)
2. Admin → approve questions
3. Friday → generate-event-deck-v2 with event_id or inline questions → Google Slides deck

## kbt_qtype IDs (key)
face_morph=19, soundmash=26, crack_the_code=14, name_the_brain=24
New types 49–68: baby_photo, backwards, pixel_reveal, city_skyline, close_up,
country_outline, emoji_song, first_letters, flag_mashup, instrument_solo,
intro_only, movie_frame, silhouette, sound_and_pic, stats_puzzle, text_message,
title_sequence, translator_fail, voice_id, wrong_speed
