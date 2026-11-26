// node tools/build-single.mjs — writes dist/momo-single.html: the whole app in one file, with the stylesheets and
// scripts inlined in load order. Use it for the claude.ai artifact version (initCloud() syncs there); GitHub Pages
// serves the split files directly. The fig/, world/ and malware/ pages are not inlined (they stay separate pages).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { appFiles, ROOT } from "./files.mjs";
const { html, css, js } = appFiles();
let out = html;
for (const f of css) out = out.replace(`<link rel="stylesheet" href="${f}">`, () => `<style>\n${readFileSync(ROOT + f, "utf8")}</style>`);
const scripts = js.map((f) => `/* ---- ${f} ---- */\n` + readFileSync(ROOT + f, "utf8")).join("\n");
out = out.replace(/<!-- the app:[^\n]*\n(<script src="[^"]+"><\/script>\n?)+/, () => `<script>\n${scripts.replace(/<\/(script)/gi, "<\\/$1")}</script>\n`);
mkdirSync(ROOT + "dist", { recursive: true });
writeFileSync(ROOT + "dist/momo-single.html", out);
console.log("wrote dist/momo-single.html", Math.round(out.length / 1024) + " KB");
