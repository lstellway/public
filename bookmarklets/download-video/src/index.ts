type SourceType = "hls" | "file" | "blob";

interface VideoCandidate {
  url: string;
  type: SourceType;
  label: string;
}

const PANEL_HOST_ID = "__video_grabber_panel__";
const HLS_PATTERN = /\.m3u8(\?|$)/i;
const FILE_PATTERN = /\.(mp4|webm|mov|m4v|ogv|ogg)(\?|$)/i;

const STYLES = `
:host {
  all: initial;
  display: block;
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2147483647;
  color-scheme: light dark;
  --vg-bg: #ffffff;
  --vg-fg: #111111;
  --vg-muted: #666666;
  --vg-faint: #767676;
  --vg-border: #dddddd;
  --vg-border-soft: #eeeeee;
  --vg-accent: #2563eb;
  --vg-btn-bg: #f7f7f7;
  --vg-btn-border: #999999;
}
@media (prefers-color-scheme: dark) {
  :host {
    --vg-bg: #1e1e1e;
    --vg-fg: #f2f2f2;
    --vg-muted: #a3a3a3;
    --vg-faint: #8a8a8a;
    --vg-border: #3a3a3a;
    --vg-border-soft: #2c2c2c;
    --vg-accent: #60a5fa;
    --vg-btn-bg: #2a2a2a;
    --vg-btn-border: #5a5a5a;
  }
}
.panel {
  display: block;
  background: var(--vg-bg);
  color: var(--vg-fg);
  font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  border: 1px solid var(--vg-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  padding: 12px;
  width: 340px;
  max-height: 70vh;
  overflow: auto;
  box-sizing: border-box;
}
.panel:focus {
  outline: none;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.title {
  font-weight: 600;
}
.header-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.icon-btn {
  cursor: pointer;
  border: none;
  background: transparent;
  color: var(--vg-muted);
  font: inherit;
  font-size: 12px;
  padding: 3px 7px;
  border-radius: 5px;
}
.icon-btn:hover {
  background: var(--vg-border-soft);
  color: var(--vg-fg);
}
.scanned-at {
  font-size: 11px;
  color: var(--vg-faint);
  margin: -4px 0 10px;
}
.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vg-muted);
  margin: 12px 0 6px;
}
.section-label:first-of-type {
  margin-top: 0;
}
.row {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vg-border-soft);
}
.row:last-child {
  border-bottom: none;
}
.row-label {
  color: var(--vg-muted);
  font-size: 11px;
  margin-bottom: 4px;
}
.row-note {
  font-size: 11px;
  color: var(--vg-faint);
  margin-bottom: 4px;
}
.url-input {
  display: block;
  width: 100%;
  margin-bottom: 4px;
  font: inherit;
  font-size: 11px;
  color: var(--vg-fg);
  background: var(--vg-bg);
  border: 1px solid var(--vg-border);
  border-radius: 4px;
  padding: 3px 5px;
  box-sizing: border-box;
}
.btn {
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid var(--vg-btn-border);
  border-radius: 5px;
  background: var(--vg-btn-bg);
  color: var(--vg-fg);
  font: inherit;
  font-size: 12px;
}
.btn:hover:not(:disabled) {
  border-color: var(--vg-accent);
  color: var(--vg-accent);
}
.btn:disabled {
  cursor: default;
  opacity: 0.6;
}
.empty {
  color: var(--vg-muted);
  font-size: 12px;
  line-height: 1.5;
}
`;

function classify(url: string | null | undefined): SourceType | null {
  if (!url) return null;
  if (url.startsWith("blob:")) return "blob";
  if (HLS_PATTERN.test(url)) return "hls";
  if (FILE_PATTERN.test(url)) return "file";
  return null;
}

function hostnameOf(url: string): string {
  try {
    return new URL(url, location.href).hostname;
  } catch {
    return "";
  }
}

function filenameOf(url: string): string {
  return url.split("/").pop()?.split("?")[0] || "video";
}

function formatScannedAt(date: Date): string {
  return `Scanned at ${date.toLocaleTimeString()}`;
}

function scan(): VideoCandidate[] {
  const found = new Map<string, VideoCandidate>();
  const addCandidate = (url: string | null | undefined, label: string): void => {
    const type = classify(url);
    if (type && url && !found.has(url)) found.set(url, { url, type, label });
  };

  document.querySelectorAll("video").forEach((video, i) => {
    const label = `video #${i + 1}`;
    addCandidate(video.currentSrc, label);
    addCandidate(video.src, label);
    video.querySelectorAll("source").forEach((source) => addCandidate(source.src, label));
  });

  performance.getEntriesByType("resource").forEach((entry) => {
    addCandidate(entry.name, "network activity");
  });

  return Array.from(found.values());
}

function buildCopyButton(url: string, urlText: HTMLInputElement): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "Copy URL";
  btn.onclick = () => {
    const done = () => {
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = "Copy URL"), 1500);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => urlText.select());
    } else {
      urlText.select();
    }
  };
  return btn;
}

function buildDownloadButton(item: VideoCandidate): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "Download";

  const openDirectly = () => {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = filenameOf(item.url);
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  btn.onclick = async () => {
    btn.disabled = true;
    btn.textContent = "Downloading…";
    try {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filenameOf(item.url);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);
      btn.textContent = "Done";
      btn.disabled = false;
    } catch {
      btn.textContent = "Blocked — click to open directly";
      btn.disabled = false;
      btn.onclick = openDirectly;
    }
  };

  return btn;
}

function buildRow(item: VideoCandidate): HTMLDivElement {
  const row = document.createElement("div");
  row.className = "row";

  const label = document.createElement("div");
  label.className = "row-label";
  const hostname = hostnameOf(item.url);
  const kind = item.type === "hls" ? "playlist (m3u8)" : item.type === "blob" ? "in-page stream" : "file";
  label.textContent = hostname ? `${item.label} — ${kind} — ${hostname}` : `${item.label} — ${kind}`;
  row.appendChild(label);

  if (item.type === "blob") {
    const note = document.createElement("div");
    note.className = "row-note";
    note.textContent =
      "No direct file URL — check for a matching playlist above, or the Network tab for .m3u8.";
    row.appendChild(note);
  }

  const urlText = document.createElement("input");
  urlText.className = "url-input";
  urlText.value = item.url;
  urlText.readOnly = true;
  urlText.setAttribute("aria-label", `${item.label} URL`);
  urlText.onclick = () => urlText.select();
  row.appendChild(urlText);

  row.appendChild(item.type === "file" ? buildDownloadButton(item) : buildCopyButton(item.url, urlText));

  return row;
}

const GROUPS: { type: SourceType; heading: string }[] = [
  { type: "file", heading: "Files" },
  { type: "hls", heading: "Playlists" },
  { type: "blob", heading: "Streams" },
];

function renderBody(body: HTMLElement, title: HTMLElement, items: VideoCandidate[]): void {
  title.textContent = items.length ? `Videos found (${items.length})` : "No videos found";
  body.replaceChildren();

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent =
      "Checked video elements and recent network activity — nothing matched. Try Rescan after playback starts.";
    body.appendChild(empty);
    return;
  }

  GROUPS.forEach(({ type, heading }) => {
    const groupItems = items.filter((item) => item.type === type);
    if (!groupItems.length) return;

    const sectionLabel = document.createElement("div");
    sectionLabel.className = "section-label";
    sectionLabel.textContent = heading;
    body.appendChild(sectionLabel);

    groupItems.forEach((item) => body.appendChild(buildRow(item)));
  });
}

function init(): void {
  document.getElementById(PANEL_HOST_ID)?.remove();

  const panelHost = document.createElement("div");
  panelHost.id = PANEL_HOST_ID;
  const shadowRoot = panelHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = STYLES;
  shadowRoot.appendChild(style);

  const panel = document.createElement("div");
  panel.className = "panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-labelledby", "vg-title");
  panel.tabIndex = -1;
  shadowRoot.appendChild(panel);

  const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const closePanel = (): void => {
    panelHost.remove();
    previouslyFocused?.focus();
  };

  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      closePanel();
    }
  });

  const header = document.createElement("div");
  header.className = "header";

  const title = document.createElement("div");
  title.className = "title";
  title.id = "vg-title";

  const actions = document.createElement("div");
  actions.className = "header-actions";

  const scannedAt = document.createElement("div");
  scannedAt.className = "scanned-at";

  const body = document.createElement("div");

  const rescanBtn = document.createElement("button");
  rescanBtn.type = "button";
  rescanBtn.className = "icon-btn";
  rescanBtn.setAttribute("aria-label", "Rescan page for videos");
  rescanBtn.textContent = "Rescan";
  rescanBtn.onclick = () => {
    renderBody(body, title, scan());
    scannedAt.textContent = formatScannedAt(new Date());
    rescanBtn.focus();
  };

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "icon-btn";
  closeBtn.setAttribute("aria-label", "Close video panel");
  closeBtn.textContent = "✕";
  closeBtn.onclick = closePanel;

  actions.appendChild(rescanBtn);
  actions.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(actions);
  panel.appendChild(header);
  panel.appendChild(scannedAt);
  panel.appendChild(body);

  renderBody(body, title, scan());
  scannedAt.textContent = formatScannedAt(new Date());

  document.body.appendChild(panelHost);
  panel.focus();
}

init();
