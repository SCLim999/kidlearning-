# Momo 学英文·国文·数学·科学 — project notes for Claude Code

Kids learning web app for a Malaysian SJKC (华小) Year 1 child, built in a claude.ai chat and
hosted on GitHub Pages: https://sclim999.github.io/kidlearning-/

## Files
- `index.html` — the whole app: HTML + CSS + vanilla JS in one file. No build step, no framework.
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png` — Add-to-Home-Screen support.
- `sw.js` — service worker for offline use (network first, cache fallback); registered only on https/localhost. Bump `CACHE` if the cached file list changes.
- `README.md` — Chinese overview for parents.

## Audience and style
- Child is SJKC Year 1. UI text is Chinese (华文). English and Malay are the target languages; Malay is called 国文 in the UI.
- Maths and Science are Chinese-medium (SJKC teaches them in Chinese), so questions are read aloud with a zh voice.
- Cute "toy block" look: thick outlined buttons with a solid bottom shadow, font Baloo 2 + PingFang SC fallbacks, panda mascot "Momo" drawn as inline SVG (`panda()`; `pandaDressed()` adds accessories).
- Colours are CSS variables on `:root` with a dark-mode set; keep all new colours as tokens.
- Must work on iPad Safari, Android Chrome and Windows Edge; big touch targets; respects `prefers-reduced-motion`.

## Data model (localStorage key `momo-learn.v1`)
`ALL = {v:2, cur, kids:{id: S}, updatedAt}`; `S` is the current child, see `blank()` for every field:
stars, bamboo (pet currency, +1 per star in `addStars`), days{YYYY-MM-DD:{stars,correct,wrong,mins,secs,rec,mc,sc,extra}},
words{"lang:topic:en":{c,w,m,iv,due}} (mastered at c>=3; then spaced review every 1/3/7/14/30 days via `due`), math{}, sci{}, cn{}, sessions[], pet{owned,wear,bg,fed,happy},
adv{done{}}, missions{date,done[]}, custom[{id,name,lang,words[{w,zh,e}]}] (parent's school word lists), mist{w{wordKey:ts},m{'game:level':n}} (错题本), tests[{d,s,n}] (每周小测), letterWk, settings (lang, subj, showZh, sound, goal, limit).
`ALL.lastBackup` = time of the last backup download; `ALL.pin` = optional 4-digit parent PIN (`needPin(cb)` guards settings, word-list editing and extra time).
Old saves and imported backups are upgraded in `normalize()` / `fixKid()`; keep it backward compatible.
Voice choices are per device in `momo-voice`.
In the claude.ai artifact version, `initCloud()` also syncs `ALL` via `window.claude.use('db')`; on GitHub Pages that is skipped and data stays on the device.

## Where things live in index.html
- `TOPICS` — 11 English/BM word topics (Super Minds 1 Units 1–4 + BM everyday themes), each with `sent` sentence templates.
- Custom word lists: `syncCustom()` (called in `render()`) turns `S.custom` into topics with id `my-<id>` and `only:<lang>`, appended to `TOPICS`. `BASE` = built-in topics only (album, duel, growth totals use it). Custom words may have no emoji: draw pictures with `pic(w)`, which falls back to the Chinese meaning. Word key uses `w.k||w.en`.
- Backup: `exportData()` downloads `momo-backup-YYYY-MM-DD.json` (`{app:'momo-learn',data:ALL}`); `importData()` replaces `ALL` after a confirm.
- `MODES` — word game modes: learn, listen, read, spell, dict (听写), sent, match, bubble (+ internal review/boss/math/sci). A question may carry its own `q.lang` (used by 错题本 and 小测 which mix English and BM).
- `MG` — 10 maths games (incl. clock, story problems), `SG` — 8 science games (incl. soil), `CG` — 3 华文 games (`HZ` character list with pinyin). `GKIND(g)`/`GAME(g)` look a game up across all three; `isMG(mode)` is true for math/sci/cn. Each has `gen(level)` returning `{title, say, html(hint), opts[{v,l}], ans, explain, sayAns}`; they all run on the shared engine (`startMath`, `vMath`, `answer`).
- `SHOP`, `BGS` — Momo pet items; `STATIONS`, `REGIONS` — adventure map (20 stations incl. 4 bosses); `MISSIONS` — daily real-life tasks; duel = `D`, `startDuel`, `vDuel`. `startMist`/`vMist` (错题本), `startTest`/`vTest` (每周小测), `vPrint` (printable sticker chart, `@media print`), `maybeLetter`/`showLetter` (Momo's weekly letter), `startSay` (speech-recognition check in learn mode).
- Home (`vHome`) is a big subject picker (`SUBJS`: en, ms, math, sci, cn → `data-act="pick"`) plus a small "更多好玩的" feature grid; `vSubject` shows the chosen subject's topics/games (`curSubj()`), and topic pages go back to it with `data-act="subjpage"`.
- Views are template-string functions (`vHome`, `vSubject`, `vTopic`, `vGame`, `vGrowth`, `vPet`, `vMap`, `vAlbum`, `vMissions`, `vDuel`, `vSettings`…) chosen in `render()`.
- All clicks go through one delegated handler: `data-act` + `data-v` → `switch(a)` at the bottom.
- Speech: Web Speech API via `speak(text, lang, queue)`; Malay falls back to Indonesian if no ms voice.

## Conventions
- Keep it a single self-contained file; no external requests besides Google Fonts.
- Every new game must record progress (`recordWord` / `recordMath`) and work with the combo, stars, cards and time-limit hooks (`overLimit()` at game start).
- Give every question a hint (`💡`) and a short child-friendly explanation after answering.
- Test with Playwright (headless Chromium): play each mode to the end and check `pageerror` is empty. Headless Chromium has a native `SpeechRecognition` that never answers: mock both `SpeechRecognition` and `webkitSpeechRecognition` to test 说说看.

## Deploy
Commit to `main`; GitHub Pages serves the repo root.

## Ideas not done yet
- Align BM vocabulary exactly to the SJKC Year 1 Bahasa Melayu textbook units (needs the textbook's word lists).
- Align the 华文 character list to the SJKC Year 1 华文 textbook.
- Year 2 content.
