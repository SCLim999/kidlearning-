# Momo 学英文·国文·数学·科学 — project notes for Claude Code

Kids learning web app for a Malaysian SJKC (华小) Year 1 child, built in a claude.ai chat and
hosted on GitHub Pages: https://sclim999.github.io/kidlearning-/

## Files
- `index.html` — the whole app: HTML + CSS + vanilla JS in one file. No build step, no framework.
- `manifest.webmanifest`, `icon-192.png`, `icon-512.png` — Add-to-Home-Screen support.
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
words{"lang:topic:en":{c,w,m}} (mastered at c>=3), math{}, sci{}, sessions[], pet{owned,wear,bg,fed,happy},
adv{done{}}, missions{date,done[]}, settings (lang, subj, showZh, sound, goal, limit).
Old saves are upgraded in `normalize()`; keep it backward compatible.
Voice choices are per device in `momo-voice`.
In the claude.ai artifact version, `initCloud()` also syncs `ALL` via `window.claude.use('db')`; on GitHub Pages that is skipped and data stays on the device.

## Where things live in index.html
- `TOPICS` — 11 English/BM word topics (Super Minds 1 Units 1–4 + BM everyday themes), each with `sent` sentence templates.
- `MODES` — word game modes: learn, listen, read, spell, sent, match, bubble (+ internal review/boss/math/sci).
- `MG` — 8 maths games, `SG` — 7 science games. Each has `gen(level)` returning `{title, say, html(hint), opts[{v,l}], ans, explain, sayAns}`; they all run on the shared engine (`startMath`, `vMath`, `answer`).
- `SHOP`, `BGS` — Momo pet items; `STATIONS`, `REGIONS` — adventure map (20 stations incl. 4 bosses); `MISSIONS` — daily real-life tasks; duel = `D`, `startDuel`, `vDuel`.
- Views are template-string functions (`vHome`, `vTopic`, `vGame`, `vGrowth`, `vPet`, `vMap`, `vAlbum`, `vMissions`, `vDuel`, `vSettings`…) chosen in `render()`.
- All clicks go through one delegated handler: `data-act` + `data-v` → `switch(a)` at the bottom.
- Speech: Web Speech API via `speak(text, lang, queue)`; Malay falls back to Indonesian if no ms voice.

## Conventions
- Keep it a single self-contained file; no external requests besides Google Fonts.
- Every new game must record progress (`recordWord` / `recordMath`) and work with the combo, stars, cards and time-limit hooks (`overLimit()` at game start).
- Give every question a hint (`💡`) and a short child-friendly explanation after answering.
- Test with Playwright (headless Chromium): play each mode to the end and check `pageerror` is empty.

## Deploy
Commit to `main`; GitHub Pages serves the repo root.

## Ideas not done yet
- Export / import a child's progress (GitHub Pages version has no cross-device sync).
- Align BM vocabulary exactly to the SJKC Year 1 Bahasa Melayu textbook units; Science 地球 (soil) unit.
- Year 2 content.
