# Momo 游戏界面改版 — 第一阶段

Branch `feature/game-ui-redesign`. Direction: *Momo Adventure World + modern educational game UI*. This round redesigns the **in-game screens and the results screen**. The 学习世界 island maps (reference: the panda island path with stars under each stop) are phase 2.

## 1. Current UI audit

Screens audited: learn, listen, read, spell, dict, sent, bubble, match, maths (add, clock, mul), wrong and right states, and the results screen. Each was checked at 390×844, 820×1180 and 1280×800.

| Area | Now | Problem |
|---|---|---|
| Top bar (`gameBar`, engine.js) | ✕, one 16 px dot per question, scene pill, 🔥 combo, ⭐ score, fullscreen | The dots carry no number, so a child can't see "3 of 8". There is no real progress bar. Match draws its own different bar (`vMatch`). |
| Instructions | Small grey `<p class="zh">` between the picture and the answers ("听到的是哪一个？") | Low contrast and easy to miss. Momo is not part of it. |
| Controls | 🔊 / 💡 / ↺ in a row of small buttons, in a different place in every mode (listen: big top button; read: none; spell: above the slots; maths: under the picture) | The layout is inconsistent. |
| Correct feedback | `feedbackBox()` (words) and an inline copy in `vMath()` (maths): panda + text + 下一题 in one flex row | On phones the text column shrinks to one character wide (see `before-phone-listen-right`). The code is duplicated in two places. |
| Wrong feedback | `tutorBox()`: a 🐼 emoji in a dashed box, styled differently from correct feedback. The wrong option only turns red after 400 ms. | There are two visual languages, and the emoji is not the real Momo. |
| Momo | `panda(size,'happy'|'oops')` + `pandaDressed` (accessories) | Only two expressions. Not used while a question is open. |
| Results (`vEnd`, saycheck.js) | Title, "答对 5/8", ⭐ +n 🎋 +n, then four buttons | No wrong count, accuracy or list of what to review, and no single suggested next step. |
| Responsive | `max-width:700px` wraps the bar; `560px` shrinks fonts | The feedback row breaks (above). No horizontal overflow found. |
| Keyboard | Every control is a `<button>`; the next button autofocuses | No quick keys for choosing an answer. |

## 2. Proposed shared game layout

```
┌ gbar ──────────────────────────────────────────┐
│ ✕   第 3 / 8 题  ▰▰▱▱▱▱▱▱ (coloured segments)   🔥2  ⭐+2  ⛶ │
└────────────────────────────────────────────────┘
┌ coach (Momo guidance) ─────────────────────────┐
│ (Momo face, mood)  “听到的是哪一个？”   🔊  💡  ↺ │
└────────────────────────────────────────────────┘
┌ qcard (question) ──────────────────────────────┐
│               picture / sum / clock            │
└────────────────────────────────────────────────┘
  answer area (opts grid / tiles / pond / cards)
┌ fb (feedback) ─────────────────────────────────┐
│ ok: green   try: warm yellow + hint   🔊 / 下一题 │
└────────────────────────────────────────────────┘
```

- **Momo moods** come from the one existing `panda()`. It now takes `happy`, `oops`, `think`, `teach`, `cheer`, `party` and `rest`, which change only the eyes, mouth and small marks, so there are no new panda assets.
  - `think`: while a question is open.
  - `teach`: while a hint is showing.
  - `cheer`: after a wrong pick.
  - `happy` or `party`: after a correct answer (`party` for a combo of 3 or more).
  - `rest`: on the rest screen.
- **Feedback states**: `fb ok` (correct), `fb try` (wrong, with Momo 小老师's graded hint and its 🔊/language buttons), hint (coach turns to `teach`), and round done (results screen). The wording is always encouraging, for example 「差一点点！看看提示 💡」.
- **Results screen**: tiles for 答对 / 再练练 / 正确率 / 星星, the questions to review (from this round's `G.qs`), and one suggested next activity. The suggestion is 错题本 when there were misses, 换个玩法 after a perfect round, and 再玩一次 otherwise. It uses only the data already in memory and adds nothing to storage.
- **Keyboard**: keys 1–9 pick an answer and Enter goes to the next question.

## 3. Files to modify

- `js/core/helpers.js`: `panda()` moods.
- `js/games/engine.js`: `gameBar`, new `coach()` and `fbOk()`, `feedbackBox`, `vGame` for each mode.
- `js/games/questions.js`: `vMath` uses `coach`, `qcard` and `fbOk`.
- `js/games/extras.js`: `vMatch` uses the shared bar.
- `js/learning/tutor.js`: `tutorBox` becomes the `fb try` state; the reteach overlay uses the real Momo.
- `js/games/saycheck.js`: `vEnd` results screen, plus the review list passed in `go({name:'end'})` (view only).
- `js/core/timelimit.js`: the rest screen uses Momo `rest`.
- `js/core/actions.js`: keys 1–9.
- `css/app.css`: new `gbar`/`gprog`/`coach`/`qcard`/`fb`/`res` rules using the existing tokens, with phone, tablet and reduced-motion variants.
- `sw.js`: `CACHE` bump.

Not touched: learning algorithms (`recordWord`, `recordMath`, `genSet`, levels), the storage schema, skins (`skins.css` keeps working because the new parts use the same tokens, `--bw`, `--rb` and `--shb`), story/worlds/duel screens (phase 2), and the PWA file list.

## 4. Risks

| Risk | Mitigation |
|---|---|
| Tests or code look for old classes (`.feedback`, `.tutor`, `.dots`, `.opt`) | The old classes are kept next to the new ones: `fb ok feedback`, `fb try tutor`. Story still uses `.dots`. |
| Skins (crayon, pixel, glass…) restyle buttons and panels by class | The new boxes use the same tokens and border/shadow variables; the skin screenshots get checked. |
| Taller layout on small phones pushes the answers below the fold | The coach is one compact row (48 px Momo). The `qcard` picture shrinks on phones; tested at 360×640. |
| Combo/burst animations target `.feedback .momo` | The class is kept. |
| Rendering cost | Templates only. No new libraries, timers or network. |
