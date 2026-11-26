// node tools/check.mjs — run before committing. Checks that:
//  · every app script parses on its own (a broken split or a stray brace shows up here),
//  · every .js under js/ and data/ is loaded by index.html, and every loaded file exists,
//  · sw.js caches every css/js file the page loads (so the app still works offline).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { appFiles, ROOT } from "./files.mjs";
const { css, js } = appFiles();
const walk = (d) => readdirSync(ROOT + d).flatMap((f) => (statSync(ROOT + d + "/" + f).isDirectory() ? walk(d + "/" + f) : [d + "/" + f]));
const onDisk = [...walk("js"), ...walk("data")].filter((f) => f.endsWith(".js"));
const sw = readFileSync(ROOT + "sw.js", "utf8");
let bad = 0;
const fail = (m) => { bad++; console.log("✗ " + m); };
for (const f of [...css, ...js]) if (!existsSync(ROOT + f)) fail("index.html loads a missing file: " + f);
for (const f of onDisk) if (!js.includes(f)) fail("not loaded by index.html: " + f);
for (const f of js) { try { new Function(readFileSync(ROOT + f, "utf8")); } catch (e) { fail(f + ": " + e.message); } }
for (const f of [...css, ...js]) if (!sw.includes("'./" + f + "'")) fail("sw.js does not cache " + f);
console.log(bad ? bad + " problem(s)" : "✓ " + js.length + " scripts, " + css.length + " stylesheets: all parse, all loaded, all cached");
process.exit(bad ? 1 : 0);
