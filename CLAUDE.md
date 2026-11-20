# Momo 学英文·国文·数学·科学 — project notes for Claude Code

Kids learning web app for a Malaysian SJKC (华小) Year 1 child, built in a claude.ai chat and
hosted on GitHub Pages: https://sclim999.github.io/kidlearning-/

## Files
- `index.html` — the whole app: HTML + CSS + vanilla JS in one file. No build step, no framework.
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png` — Add-to-Home-Screen support.
- `sw.js` — service worker for offline use (network first, cache fallback); registered only on https/localhost. Bump `CACHE` if the cached file list changes.
- `README.md` — Chinese overview for parents.
- `fig/<name>.html` — interactive isometric "anatomy" figures (clock, magnet, plant, soil) shown in an iframe under 「🔍 看看里面」 on a game's page when the game has `fig:'<name>'`. Each is generated: edit `fig/src/<name>.mjs`, then run `node fig/src/<name>.mjs` from the repo root (soil also takes `--audit`). `fig/src/page.mjs` is the shared page writer (theme follows `prefers-color-scheme`, posts its height to the app as `{momoFig,h}`); `fig/src/kit/` is a copy of the anatomy skill's kit. Add new figures to the `CORE` list in `sw.js`.

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
- `TOPICS` — 19 English/BM word topics, each with `sent` sentence templates: 11 Year 1 (Super Minds 1 Units 1–4 + BM everyday themes) and 8 Year 2 marked `yr:2` (days, clothes, rooms, weather, feel, actions, town, jobs). The subject page groups them under 一年级 / 二年级 / 学校词表. Words without an emoji (days of the week) show their Chinese via `pic(w)`.
- Custom word lists: `syncCustom()` (called in `render()`) turns `S.custom` into topics with id `my-<id>` and `only:<lang>`, appended to `TOPICS`. `BASE` = built-in topics only (album, duel, growth totals use it). Custom words may have no emoji: draw pictures with `pic(w)`, which falls back to the Chinese meaning. Word key uses `w.k||w.en`.
- Backup: `exportData()` downloads `momo-backup-YYYY-MM-DD.json` (`{app:'momo-learn',data:ALL}`); `importData()` replaces `ALL` after a confirm.
- `MODES` — word game modes: learn, listen, read, spell, dict (听写), sent, match, bubble (+ internal review/boss/math/sci). A question may carry its own `q.lang` (used by 错题本 and 小测 which mix English and BM).
- `MG` — 16 maths games: 10 Year 1 (incl. clock, story problems) and 6 Year 2 marked `yr:2` (place3 1000 以内的数, addsub3 直式加减, mul 乘法, div 除法, frac 分数, measure 长度与重量; helpers `nearOpts`, `blocks`, `colCalc`, `fracSvg`, `rulerSvg`), grouped under 一年级/二年级 by `mathCards()`; the weekly quiz uses Year 1 maths only. `SG` — 12 science games: 8 Year 1 (incl. soil) and 4 Year 2 marked `yr:2` (人类的成长 grow, 动物的成长 agrow, 植物的成长 pgrow, 光与影子 light; built with the `qPick`/`qNext` helpers), shown under separate 一年级/二年级 headings by `sciCards()`; the weekly quiz uses Year 1 science only, `CG` — 7 华文 games: 3 Year 1 on `HZ` (41 characters) and 4 Year 2 (`yr:2`: kanzi2, tingzi2, pinyin2 on `HZ2` (34 characters), and ciyu 词语 on `CI2`, a de-duplicated list of two-character words). `GKIND(g)`/`GAME(g)` look a game up across all three; `isMG(mode)` is true for math/sci/cn. Each has `gen(level)` returning `{title, say, html(hint), opts[{v,l}], ans, explain, sayAns}`; they all run on the shared engine (`startMath`, `vMath`, `answer`).
  Levels (`LVN`): 1 容易, 2 中等, 3 困难. 困难 = 10 questions, no 💡 button; a game with its own `l3` label has real level-3 content in `gen(3)`, the others get a mix of level 1 and 2 via `genL()`.
- `SHOP`, `BGS` — Momo pet items; `STATIONS`, `REGIONS` — adventure map (20 stations incl. 4 bosses); `MISSIONS` — daily real-life tasks; duel = `D`, `startDuel`, `vDuel`. `startMist`/`vMist` (错题本), `startTest`/`vTest` (每周小测), `vPrint` (printable sticker chart, `@media print`), `maybeLetter`/`showLetter` (Momo's weekly letter), `startSay` (speech-recognition check in learn mode).
- Home (`vHome`) is a big subject picker (`SUBJS`: en, ms, math, sci, cn → `data-act="pick"`) plus a small "更多好玩的" feature grid; `vSubject` shows the chosen subject's topics/games (`curSubj()`), and topic pages go back to it with `data-act="subjpage"`.
- Parent dashboard 家长后台 (`vAdmin`, opened via `openAdmin()` from settings; always PIN-protected, asks to set a PIN first): per-kid totals, subject accuracy, strengths/weaknesses (`adminStats`, items with ≥6 answers), interests from `sessions` (subject share, favourite modes, time of day), 6-week trend, hardest words; `adminText` copies a summary. Sessions keep the last 300 entries with `sec` duration; duels are recorded too.
- Views are template-string functions (`vHome`, `vSubject`, `vAdmin`, `vTopic`, `vGame`, `vGrowth`, `vPet`, `vMap`, `vAlbum`, `vMissions`, `vDuel`, `vSettings`…) chosen in `render()`.
- All clicks go through one delegated handler: `data-act` + `data-v` → `switch(a)` at the bottom.
- Speech: Web Speech API via `speak(text, lang, queue)`; Malay falls back to Indonesian if no ms voice.

## Conventions
- Keep the app a single self-contained file (the generated `fig/*.html` pages are the only extra pages); no external requests besides Google Fonts.
- Every new game must record progress (`recordWord` / `recordMath`) and work with the combo, stars, cards and time-limit hooks (`overLimit()` at game start).
- Give every question a hint (`💡`) and a short child-friendly explanation after answering.
- Test with Playwright (headless Chromium): play each mode to the end and check `pageerror` is empty. Headless Chromium has a native `SpeechRecognition` that never answers: mock both `SpeechRecognition` and `webkitSpeechRecognition` to test 说说看.

## Deploy
Commit to `main`; GitHub Pages serves the repo root.

## Ideas not done yet
- Align BM vocabulary exactly to the SJKC Year 1 Bahasa Melayu textbook units (needs the textbook's word lists).
- Align the 华文 character list to the SJKC Year 1 华文 textbook.
- Check the Year 2 units (English/BM topics, 华文 characters, maths, science) against the actual SJKC Year 2 textbooks.
