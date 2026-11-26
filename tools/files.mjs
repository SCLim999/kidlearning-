// The app's own files, read from the <script src>/<link href> tags in index.html (the single source of truth for load order).
import { readFileSync } from "node:fs";
export const ROOT = new URL("..", import.meta.url).pathname;
export function appFiles() {
  const html = readFileSync(ROOT + "index.html", "utf8");
  const css = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
  const js = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  return { html, css, js };
}
