# download-video

Bookmarklet that scans the current page for video sources — direct files
(`.mp4`, `.webm`, etc.) and HLS playlists (`.m3u8`) — and shows a small panel
to download or copy each one.

## Build

```
pnpm --filter download-video build
```

Outputs to `dist/` (checked in, so it can be linked to directly — regenerate
and commit after any change to `src/`):

- `download-video.js` — minified script, for review/diffing
- `download-video.bookmarklet.txt` — the `javascript:...` URL to paste into a bookmark

## Install

1. Right-click your bookmarks bar → Add page (or Add bookmark) → paste the
   contents of [`dist/download-video.bookmarklet.txt`][bookmarklet] as the URL.

Or build it yourself first (`pnpm --filter download-video build`) and use
your local copy instead.

[bookmarklet]: https://raw.githubusercontent.com/lstellway/public/main/bookmarklets/download-video/dist/download-video.bookmarklet.txt

## Preview in a sandbox

```
pnpm --filter download-video sandbox
```

Serves `sandbox/index.html` — a mock page with fake video sources and
deliberately messy CSS (to stress-test that the panel's Shadow DOM stays
isolated from host-page styles) — at `http://localhost:8000`, rebuilding
`src/index.ts` on save with live reload. This runs the real, unminified
source directly, so you see panel changes as you make them instead of
rebuilding and re-pasting a bookmarklet each time.

- Reloading the page re-runs the script, same as a fresh bookmarklet click.
- The "Run bookmarklet" button re-injects it without a reload.
- The "Add a lazy-loaded video" button plus the panel's own Rescan button
  test picking up content that appears after the first scan.

## Notes

- HLS detection relies on the browser's own resource-timing buffer, which
  only holds a few hundred of the most recent network requests. On pages
  with heavy network activity, an early `.m3u8` request may already be
  evicted by the time you click the bookmarklet — check DevTools → Network
  as a fallback.
- Playlist URLs are surfaced for you to copy, not reassembled into a single
  file. Stitching an HLS stream together requires fetching and combining many
  segments, which may hit CORS restrictions or encrypted segments depending
  on the site — a dedicated tool (e.g. `ffmpeg`, `yt-dlp`) handles that far
  more robustly than reimplementing it here.
