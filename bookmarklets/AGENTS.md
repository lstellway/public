# bookmarklets/

Browser bookmarklets. Each subfolder is an independent pnpm workspace package.

## Package shape

- `src/index.ts` — TypeScript entry, self-running IIFE (calls `init()` at the bottom).
- `scripts/build.mjs` — esbuild bundle + minify → `dist/`.
- `scripts/sandbox.mjs` — esbuild dev server with live reload for manual testing in a real page.
- `dist/` — checked into git; `.bookmarklet.txt` is linked raw from GitHub for install.
- `README.md` — user-facing build/install/usage notes.

## Build output

- `dist/<name>.js` — pretty-printed minified output, for diffing.
- `dist/<name>.bookmarklet.txt` — the actual `javascript:...` URL, must be a single line.

## Gotcha: Safari mangles literal characters

Safari's bookmark URL field re-encodes literal spaces (and quotes, unicode, etc.) on paste, but doesn't reliably decode them back before running the script — `return e` becomes the invalid `return%20e`. This also covers the single-line requirement: multi-line strings (e.g. CSS-in-JS template literals) keep their literal newlines through esbuild's minifier, which would otherwise break `.bookmarklet.txt`'s one-line format.

First attempt was `javascript:eval(decodeURIComponent("<encodeURIComponent(minified)>"))` — encoding the payload so it contains no raw spaces/quotes/newlines. This still broke in real Safari: the bookmark field selectively *decodes* some percent-escapes back to literal characters when saving (e.g. `%22` → `"`), but not others (`%20` stays literal), which reopened the exact string-boundary and token-separation problems the encoding was meant to prevent.

Fix for that: transport the script as `String.fromCharCode(<comma-separated char codes>)` — no string literal, no percent-encoding, nothing for Safari's field to normalize. Only digits, commas, and identifier characters remain. Requires the minified source to be pure ASCII/BMP (true by default — esbuild escapes non-ASCII to `\uXXXX` in string literals unless `charset: "utf8"` is set); `build.mjs` asserts this and throws if violated.

## Gotcha: CSP blocks eval

Wrapping the reconstructed string in `eval(...)` works in an open tab but breaks on any site whose CSP `script-src` lacks `'unsafe-eval'` (e.g. facebook.com) — the browser throws `EvalError: Refused to evaluate a string as JavaScript`. `new Function(...)` and string-form `setTimeout`/`setInterval` are gated the same way. Top-level `javascript:` URL execution itself isn't reliably CSP-exempt either, but empirically the failure is specifically the nested `eval()` call, not the bookmarklet running at all.

Fix: never call `eval`/`Function` on the reconstructed string. Instead build a `Blob` from it and load it as a real `<script src="blob:...">` — `blob:` is a common, legitimate `script-src` allowlist entry (used by things like web workers), so this isn't a CSP bypass, just a permitted path `unsafe-eval` doesn't gate. `build.mjs`'s loader:

```
(function(c){var s=document.createElement("script");s.src=URL.createObjectURL(new Blob([c],{type:"text/javascript"}));document.head.appendChild(s)})(String.fromCharCode(...))
```

(shown with spaces for readability — the real output has none, see below). This is a best-effort fix, not universal: a site with a CSP that excludes both `unsafe-eval` and `blob:` would still block it. No known bulletproof fix exists for that case short of a browser extension.

The loader itself is hand-written directly in `build.mjs` (not derived from the minified bundle) and must stay whitespace-free — every keyword/identifier boundary that would need a space (`var s`, `new Blob`) instead uses an empty comment (`var/**/s`, `new/**/Blob`) as a silent token separator. `build.mjs` asserts the full bookmarklet body has zero whitespace characters and throws if that's ever violated, so a hand-edit mistake here fails the build loudly instead of shipping silently broken. `dist/<name>.js` (unminified-whitespace, pretty) is unaffected — all of this only applies to `.bookmarklet.txt`. See `download-video/scripts/build.mjs` for the reference implementation.

## Runtime constraints

Code runs injected into arbitrary host pages, not a controlled app shell:

- Isolate DOM/CSS (Shadow DOM) to avoid colliding with host page styles/globals.
- Must be safe to re-run — remove/recreate any injected root element on each click.

## Commands

From repo root: `pnpm --filter <package> build|sandbox|typecheck`.
