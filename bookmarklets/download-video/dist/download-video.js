"use strict";(()=>{var g="__video_grabber_panel__",x=/\.m3u8(\?|$)/i,y=/\.(mp4|webm|mov|m4v|ogv|ogg)(\?|$)/i,C=`
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
`;function E(e){return e?e.startsWith("blob:")?"blob":x.test(e)?"hls":y.test(e)?"file":null:null}function w(e){try{return new URL(e,location.href).hostname}catch{return""}}function m(e){return e.split("/").pop()?.split("?")[0]||"video"}function f(e){return`Scanned at ${e.toLocaleTimeString()}`}function v(){let e=new Map,o=(n,t)=>{let c=E(n);c&&n&&!e.has(n)&&e.set(n,{url:n,type:c,label:t})};return document.querySelectorAll("video").forEach((n,t)=>{let c=`video #${t+1}`;o(n.currentSrc,c),o(n.src,c),n.querySelectorAll("source").forEach(a=>o(a.src,c))}),performance.getEntriesByType("resource").forEach(n=>{o(n.name,"network activity")}),Array.from(e.values())}function k(e,o){let n=document.createElement("button");return n.type="button",n.className="btn",n.textContent="Copy URL",n.onclick=()=>{let t=()=>{n.textContent="Copied!",setTimeout(()=>n.textContent="Copy URL",1500)};navigator.clipboard?.writeText?navigator.clipboard.writeText(e).then(t).catch(()=>o.select()):o.select()},n}function T(e){let o=document.createElement("button");o.type="button",o.className="btn",o.textContent="Download";let n=()=>{let t=document.createElement("a");t.href=e.url,t.download=m(e.url),t.target="_blank",t.rel="noopener",document.body.appendChild(t),t.click(),t.remove()};return o.onclick=async()=>{o.disabled=!0,o.textContent="Downloading\u2026";try{let t=await fetch(e.url);if(!t.ok)throw new Error(String(t.status));let c=await t.blob(),a=URL.createObjectURL(c),r=document.createElement("a");r.href=a,r.download=m(e.url),document.body.appendChild(r),r.click(),r.remove(),setTimeout(()=>URL.revokeObjectURL(a),3e4),o.textContent="Done",o.disabled=!1}catch{o.textContent="Blocked \u2014 click to open directly",o.disabled=!1,o.onclick=n}},o}function L(e){let o=document.createElement("div");o.className="row";let n=document.createElement("div");n.className="row-label";let t=w(e.url),c=e.type==="hls"?"playlist (m3u8)":e.type==="blob"?"in-page stream":"file";if(n.textContent=t?`${e.label} \u2014 ${c} \u2014 ${t}`:`${e.label} \u2014 ${c}`,o.appendChild(n),e.type==="blob"){let r=document.createElement("div");r.className="row-note",r.textContent="No direct file URL \u2014 check for a matching playlist above, or the Network tab for .m3u8.",o.appendChild(r)}let a=document.createElement("input");return a.className="url-input",a.value=e.url,a.readOnly=!0,a.setAttribute("aria-label",`${e.label} URL`),a.onclick=()=>a.select(),o.appendChild(a),o.appendChild(e.type==="file"?T(e):k(e.url,a)),o}var N=[{type:"file",heading:"Files"},{type:"hls",heading:"Playlists"},{type:"blob",heading:"Streams"}];function h(e,o,n){if(o.textContent=n.length?`Videos found (${n.length})`:"No videos found",e.replaceChildren(),!n.length){let t=document.createElement("div");t.className="empty",t.textContent="Checked video elements and recent network activity \u2014 nothing matched. Try Rescan after playback starts.",e.appendChild(t);return}N.forEach(({type:t,heading:c})=>{let a=n.filter(i=>i.type===t);if(!a.length)return;let r=document.createElement("div");r.className="section-label",r.textContent=c,e.appendChild(r),a.forEach(i=>e.appendChild(L(i)))})}function S(){document.getElementById(g)?.remove();let e=document.createElement("div");e.id=g;let o=e.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=C,o.appendChild(n);let t=document.createElement("div");t.className="panel",t.setAttribute("role","dialog"),t.setAttribute("aria-labelledby","vg-title"),t.tabIndex=-1,o.appendChild(t);let c=document.activeElement instanceof HTMLElement?document.activeElement:null,a=()=>{e.remove(),c?.focus()};t.addEventListener("keydown",u=>{u.key==="Escape"&&(u.stopPropagation(),a())});let r=document.createElement("div");r.className="header";let i=document.createElement("div");i.className="title",i.id="vg-title";let s=document.createElement("div");s.className="header-actions";let p=document.createElement("div");p.className="scanned-at";let b=document.createElement("div"),l=document.createElement("button");l.type="button",l.className="icon-btn",l.setAttribute("aria-label","Rescan page for videos"),l.textContent="Rescan",l.onclick=()=>{h(b,i,v()),p.textContent=f(new Date),l.focus()};let d=document.createElement("button");d.type="button",d.className="icon-btn",d.setAttribute("aria-label","Close video panel"),d.textContent="\u2715",d.onclick=a,s.appendChild(l),s.appendChild(d),r.appendChild(i),r.appendChild(s),t.appendChild(r),t.appendChild(p),t.appendChild(b),h(b,i,v()),p.textContent=f(new Date),document.body.appendChild(e),t.focus()}S();})();
