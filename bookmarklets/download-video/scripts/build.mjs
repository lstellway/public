import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");

const result = await build({
  entryPoints: [path.join(root, "src/index.ts")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2022",
  write: false,
});

const minified = result.outputFiles[0].text.trim();
if ([...minified].some((ch) => ch.codePointAt(0) > 0xffff)) {
  throw new Error("minified output contains a character outside the BMP — String.fromCharCode encoding would corrupt it");
}
const charCodes = Array.from(minified, (ch) => ch.charCodeAt(0)).join(",");
// No eval()/Function() — many sites' CSP blocks 'unsafe-eval'. Instead, build the real
// script as a Blob and load it via a <script src="blob:...">, which CSPs commonly allow
// (`blob:` is a common script-src entry) since it isn't gated by unsafe-eval.
const loader = `(function(c){var/**/s=document.createElement("script");s.src=URL.createObjectURL(new/**/Blob([c],{type:"text/javascript"}));document.head.appendChild(s)})(String.fromCharCode(${charCodes}))`;
const bookmarklet = `javascript:${loader}`;

const body = bookmarklet.slice("javascript:".length);
if (/\s/.test(body)) {
  throw new Error("bookmarklet body contains whitespace — Safari's bookmark field will mangle it");
}

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "download-video.js"), `${minified}\n`);
await writeFile(path.join(outDir, "download-video.bookmarklet.txt"), `${bookmarklet}\n`);

console.log(`Built dist/download-video.js (${minified.length} bytes)`);
console.log(`Built dist/download-video.bookmarklet.txt (${bookmarklet.length} bytes)`);
