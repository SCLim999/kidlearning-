// Shared page writer for the anatomy figures shown in the app's 「怎么玩？」 panels.
// Run a figure with `node fig/src/<name>.mjs`; it writes `fig/<name>.html` (one file, both themes).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..");
const strip = (file) => readFileSync(join(HERE, "kit", file), "utf8").replace(/^import .*$/gm, "").replace(/^export /gm, "");

/** Kit source for the page's live code; `lathe` adds the round-part helpers (lathe, frameAlong…). */
export const kitScript = ({ lathe = false } = {}) => strip("iso-kit.mjs") + (lathe ? strip("lathe.mjs") : "");

// Light by default (the app's look); dark follows the device, like the app does.
// color-scheme must match the app's, or the browser paints the iframe with an opaque backdrop.
const THEME = `{const mq=matchMedia("(prefers-color-scheme: dark)"),set=d=>{document.body.dataset.theme=d?"dark":"light";document.documentElement.style.colorScheme=d?"dark":"light"};
set(mq.matches);mq.addEventListener("change",e=>set(e.matches));}
`;
// Tells the app how tall the card is, so the iframe fits it without scrollbars.
const FIT = `
{const say=()=>parent!==window&&parent.postMessage({momoFig:location.pathname.split("/").pop(),h:Math.ceil(document.querySelector(".iso-figure").getBoundingClientRect().bottom+window.scrollY)+8},"*");
new ResizeObserver(say).observe(document.querySelector(".iso-figure"));addEventListener("load",say);}
`;
const EMBED_CSS = `
html,body{background:transparent!important;overflow:hidden}
.iso-page{width:100%!important;max-width:680px;margin:0 auto!important;padding:2px}
body{font-family:"Baloo 2","PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,sans-serif}
.iso-stage{touch-action:none;cursor:grab;outline:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none}
.iso-stage:active{cursor:grabbing}
.iso-plate-corner[data-corner="readout"]{font-weight:700;color:var(--anatomy-strong)}
`;

/** Writes fig/<name>.html. `plate` is plateHtml(...) markup; `live` is the page's own script. */
export function writeFig(name, { title, plate, live, lathe = false }) {
  const html = k
    .pageHtml({ title, theme: "light", body: plate, script: THEME + kitScript({ lathe }) + live + FIT })
    .replace('<html lang="en">', '<html lang="zh">')
    .replace("</style>", EMBED_CSS + "</style>");
  writeFileSync(join(OUT, name + ".html"), html);
  console.log("wrote fig/" + name + ".html", Math.round(html.length / 1024) + " KB");
}
