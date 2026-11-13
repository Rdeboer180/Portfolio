import{s as m}from"./clinicReport-dkFJC25v.js";import{a as b,s as c}from"./ClinicReport-l8W5GcQK.js";import"./index-DicsMYy8.js";import"./Button-B23ldYrZ.js";import"./claudeConfig-CL56TlsP.js";const i=t=>t.replace(/[&<>"']/g,l=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[l]),h=t=>new Date(t).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"});function u(t){const l=t.map(a=>{if(!a.readings)return`<div class="hb empty" title="${i(a.label)}: no readings"></div>`;const o=`${a.label}: ${Math.round(a.inRangePct)}% in range, ${Math.round(a.lowPct)}% low, ${Math.round(a.highPct)}% high${a.avgMgdl!=null?`, mean ${Math.round(a.avgMgdl)}`:""}`;return`<div class="hb" title="${i(o)}" aria-label="${i(o)}"><span class="hi" style="height:${a.highPct}%"></span><span class="in" style="height:${a.inRangePct}%"></span><span class="lo" style="height:${a.lowPct}%"></span></div>`}).join(""),e=t.map((a,o)=>`<span>${o%3===0?i(a.label.slice(0,2)):""}</span>`).join("");return`<div class="hours" role="img" aria-label="Glucose by hour of day">${l}</div><div class="ticks">${e}</div>
<p class="legend"><i class="lo"></i>Low <i class="in"></i>In range <i class="hi"></i>High</p>`}function f(t){const a=b(t,{width:600,height:216,left:34,top:6}),o=a.yTicks.map(n=>`<line x1="${a.left}" x2="${a.left+a.width}" y1="${n.y}" y2="${n.y}" class="ag"/><text x="${a.left-5}" y="${n.y+3.5}" text-anchor="end">${n.label}</text>`).join(""),d=a.xTicks.map((n,r)=>`<text x="${n.x}" y="236" text-anchor="${r===0?"start":r===a.xTicks.length-1?"end":"middle"}">${n.label}</text>`).join(""),s=`Glucose percentiles by time of day, with the range ${t.lowMgdl}–${t.highMgdl} mg/dL marked`;return`<svg class="agp" viewBox="0 0 640 240" role="img" aria-label="${i(s)}">${o}${d}${a.outer.map(n=>`<path class="ao" d="${c(n,!0)}"/>`).join("")}${a.inner.map(n=>`<path class="ai2" d="${c(n,!0)}"/>`).join("")}<line class="at" x1="${a.left}" x2="${a.left+a.width}" y1="${a.lowY}" y2="${a.lowY}"/><line class="at" x1="${a.left}" x2="${a.left+a.width}" y1="${a.highY}" y2="${a.highY}"/>${a.median.map(n=>`<path class="am" d="${c(n,!1)}"/>`).join("")}</svg>
<p class="legend"><i class="km"></i>Median <i class="ki"></i>25th–75th <i class="ko"></i>5th–95th <i class="kt"></i>Range ${t.lowMgdl}–${t.highMgdl} mg/dL</p>`}function x(t){const l=`<tr><th></th>${Array.from({length:24},(a,o)=>`<th>${o%3===0?String(o).padStart(2,"0"):""}</th>`).join("")}</tr>`,e=t.map(a=>`<tr><th scope="row">${i(a.label)}</th>${a.cells.map((o,d)=>{if(!o)return`<td class="na" title="${i(`${a.label} ${d}:00 — not enough weeks`)}"></td>`;const s=o.lowPct>=10?"lo":o.highPct>o.inRangePct?"hi":"in",n=`${a.label} ${String(d).padStart(2,"0")}:00 — median ${o.medianMgdl??"—"} mg/dL, ${Math.round(o.inRangePct)}% in range, ${Math.round(o.lowPct)}% low, ${Math.round(o.highPct)}% high`;return`<td class="${s}" title="${i(n)}">${o.medianMgdl==null?"":Math.round(o.medianMgdl)}</td>`}).join("")}</tr>`).join("");return`<div class="scroll"><table class="heat">${l}${e}</table></div>
<p class="legend"><i class="lo"></i>Low share ≥10% <i class="in"></i>Mostly in range <i class="hi"></i>Mostly high <i class="na"></i>Not enough weeks</p>`}function v(t,l){const e=t.bands,a=[["vhi","Very high",">250",e.veryHigh,l?"<5%":""],["hi","High",`${t.highMgdl+1}–250`,e.high,l?"<25%":""],["in","Target range",`${t.lowMgdl}–${t.highMgdl}`,e.inRange,l?">70%":""],["lo","Low",`${t.urgentLowMgdl}–${t.lowMgdl-1}`,e.low,l?"<4%":""],["vlo","Very low",`<${t.urgentLowMgdl}`,e.veryLow,l?"<1%":""]],o=a.map(([s,,,n])=>`<span class="${s}" style="flex-grow:${Math.max(n,.6)}"></span>`).join(""),d=a.map(([s,n,r,p,g])=>`<li><i class="${s}"></i><span><b>${i(n)}</b> <small>${i(r)} mg/dL</small></span><strong>${Math.round(p*10)/10}%</strong><small class="goal">${g?`Goal ${i(g)}`:""}</small></li>`).join("");return`<div class="tircol"><div class="col" role="img" aria-label="Time in ranges">${o}</div><ul>${d}</ul></div>`}const $=t=>`<div class="scroll"><table>${t.caption?`<caption>${i(t.caption)}</caption>`:""}<thead><tr>${t.columns.map(l=>`<th scope="col">${i(l)}</th>`).join("")}</tr></thead><tbody>${t.rows.map(l=>`<tr>${l.map((e,a)=>a===0?`<th scope="row">${i(e)}</th>`:`<td>${i(e)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;function w(t){var l,e;return!!(t.agp||(l=t.hours)!=null&&l.length||(e=t.heatmap)!=null&&e.length||t.aiGenerated||(t.tables??[]).some(a=>a.columns.length>=4)||t.id==="act")}function k(t,l){var a,o,d,s,n;const e=[];t.aiGenerated&&e.push('<p class="ai">AI-generated · not clinician-reviewed</p>'),t.unavailable&&e.push(`<p class="muted">${i(t.unavailable)}</p>`),t.summary&&e.push(`<p class="lead">${i(t.summary)}</p>`),t.tir&&e.push(v(t.tir,l)),t.agp&&e.push(f(t.agp)),(a=t.hours)!=null&&a.length&&e.push(u(t.hours)),(o=t.heatmap)!=null&&o.length&&e.push(x(t.heatmap)),(d=t.facts)!=null&&d.length&&e.push(`<dl class="facts">${t.facts.map(r=>`<div><dt>${i(r.label)}</dt><dd>${i(r.value)}${r.target?`<small>Goal ${i(r.target)}</small>`:""}</dd></div>`).join("")}</dl>`);for(const r of t.tables??[])e.push($(r));return(s=t.bullets)!=null&&s.length&&e.push(`<ul class="bullets">${t.bullets.map(r=>`<li>${i(r)}</li>`).join("")}</ul>`),(n=t.notes)!=null&&n.length&&e.push(`<details class="more"><summary>Notes &amp; method</summary><ul class="notes">${t.notes.map(r=>`<li>${i(r)}</li>`).join("")}</ul></details>`),`<article class="card${w(t)?" wide":""}${t.aiGenerated?" aicard":""}" id="s-${i(t.id)}"><header><h2>${i(t.title)}</h2>${t.window?`<p>${i(t.window)}</p>`:""}</header><div class="body">${e.join("")}</div></article>`}const y=`
:root{--ink:#14202b;--ink7:#3c4a57;--ink5:#6b7885;--rule:#dfe4ea;--s0:#fff;--s1:#f3f5f8;--s2:#e8ecf1;--accent:#1f6fb2;--accent-ink:#17568c;--brand:#1f7a2e;
--info:#3e6fa8;--info-ink:#2b527d;--vlo:#a8231a;--lo:#e8483f;--in:#4caf50;--hi:#f2b01e;--vhi:#e5741b;--lo-s:#fdd0d0;--in-s:#d3edd4;--hi-s:#fbe7b5}
@media (prefers-color-scheme:dark){:root{--ink:#e9eef3;--ink7:#c0cad3;--ink5:#93a0ac;--rule:#2b3540;--s0:#141b22;--s1:#0e141a;--s2:#222c36;--accent:#6aa9e0;--accent-ink:#9cc7ef;
--info:#7fa6d6;--info-ink:#b4cff0;--lo-s:#5a2626;--in-s:#24452a;--hi-s:#4d3e14}}
*{box-sizing:border-box;margin:0;padding:0}
body{font:14px/21px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--s1)}
.topbar{background:var(--s0);border-bottom:1px solid var(--rule)}
.topbar .in-w,.patient .in-w,.tabs-w,main{max-width:1200px;margin:0 auto;padding-left:16px;padding-right:16px}
.topbar .in-w{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:52px}
.brandmark{font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--brand)}.brandmark span{color:var(--ink5);font-weight:600;letter-spacing:.02em;text-transform:none;margin-left:8px}
.btn{min-height:36px;padding:0 14px;border:1px solid var(--rule);border-radius:8px;background:var(--s0);color:var(--accent-ink);font:600 13px/1 inherit;cursor:pointer}
.patient{background:var(--s0);border-bottom:1px solid var(--rule)}
.patient .in-w{padding-top:16px;padding-bottom:14px;display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px}
.patient h1{font-size:22px;line-height:28px;font-weight:700}
.patient .sub{color:var(--ink7);font-size:13px;margin-top:2px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{display:inline-flex;flex-direction:column;padding:6px 12px;border:1px solid var(--rule);border-radius:10px;background:var(--s1);min-width:110px}
.chip small{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink5);font-weight:600}.chip b{font-size:14px;font-variant-numeric:tabular-nums}
.sample{max-width:1200px;margin:12px auto 0;padding:0 16px}.sample p{background:#fdeceA;color:#962819;border-radius:10px;padding:10px 14px;font-weight:600;font-size:13px}
@media (prefers-color-scheme:dark){.sample p{background:#4a1d18;color:#ffc9c0}}
.tabsbar{background:var(--s0);border-bottom:1px solid var(--rule);position:sticky;top:0;z-index:2}
.tabs{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}
.tabs button{flex:0 0 auto;min-height:46px;padding:0 14px;border:0;border-bottom:3px solid transparent;background:none;color:var(--ink5);font:600 14px/1 inherit;cursor:pointer;white-space:nowrap}
.tabs button[aria-selected=true]{color:var(--accent-ink);border-bottom-color:var(--accent)}
.tabs button:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
main{padding-top:16px;padding-bottom:40px}
.panel{display:none;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:row dense;gap:14px;align-items:start}.panel.on{display:grid}
@media (max-width:860px){.panel{grid-template-columns:minmax(0,1fr)}}
.card{background:var(--s0);border:1px solid var(--rule);border-radius:12px;box-shadow:0 1px 2px rgba(20,32,43,.04);min-width:0}
.card.wide{grid-column:1/-1}.aicard{border-style:dashed}
.card>header{padding:14px 16px 10px;border-bottom:1px solid var(--rule)}
.card h2{font-size:15px;line-height:20px;font-weight:700}.card>header p{color:var(--ink5);font-size:12px;line-height:17px;margin-top:2px}
.body{display:flex;flex-direction:column;gap:12px;padding:14px 16px 16px;font-size:13px;line-height:19px}
.lead{font-size:14px;line-height:21px}.muted{color:var(--ink7)}
.ai{align-self:flex-start;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;border:1px solid var(--ink5);border-radius:999px;padding:1px 8px}
.facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));column-gap:24px}
.facts div{display:flex;justify-content:space-between;gap:12px;padding:7px 0;border-bottom:1px solid var(--rule)}
.facts dt{color:var(--ink7)}.facts dd{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
.facts small{display:block;font-weight:400;color:var(--ink5);font-size:11px}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:12.5px}
caption{text-align:left;font-weight:700;color:var(--ink7);padding-bottom:6px}
th,td{padding:7px 12px 7px 0;border-bottom:1px solid var(--rule);text-align:left;vertical-align:top}
thead th{color:var(--ink5);font-weight:600;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap;background:var(--s1);padding-left:8px}
thead th:first-child{padding-left:8px}tbody th{font-weight:600;min-width:112px;padding-left:8px}
tbody tr:hover{background:var(--s1)}
.bullets,.notes{padding-left:20px}.bullets li+li,.notes li+li{margin-top:6px}.notes{color:var(--ink5);font-size:12px;margin-top:8px}
.more>summary{cursor:pointer;color:var(--accent-ink);font-size:12px;font-weight:600;min-height:28px;display:inline-flex;align-items:center}
.tircol{display:flex;gap:18px;align-items:stretch}
.tircol .col{display:flex;flex-direction:column;width:44px;min-height:220px;border-radius:6px;overflow:hidden;flex:none}
.tircol ul{list-style:none;display:flex;flex-direction:column;justify-content:space-between;flex:1;gap:6px}
.tircol li{display:grid;grid-template-columns:12px minmax(0,1fr) auto;column-gap:8px;align-items:baseline}
.tircol li strong{font-size:18px;font-variant-numeric:tabular-nums}.tircol li small{color:var(--ink5)}
.tircol li .goal{grid-column:2/4;font-size:11px}
i{display:inline-block;width:10px;height:10px;border-radius:2px;vertical-align:-1px;margin:0 4px 0 10px}.tircol i{margin:0}
.vlo{background:var(--vlo)}.lo{background:var(--lo)}.in{background:var(--in)}.hi{background:var(--hi)}.vhi{background:var(--vhi)}i.na{background:var(--s2)}
.hours{display:grid;grid-template-columns:repeat(24,1fr);gap:2px;height:140px}
.hb{display:flex;flex-direction:column;justify-content:flex-end;background:var(--s2);border-radius:3px;overflow:hidden}
.hb.empty{opacity:.5}.hb span{display:block}
.ticks{display:grid;grid-template-columns:repeat(24,1fr);font-size:10px;color:var(--ink5)}
.legend{font-size:12px;color:var(--ink7)}
.heat{border-collapse:separate;border-spacing:2px;font-size:10px;min-width:640px}
.heat th{border:0;padding:0 4px 0 0;color:var(--ink5);font-weight:600;font-size:10px;text-align:center;background:none;text-transform:none;letter-spacing:0}
.heat tbody th{text-align:left;min-width:0}.heat tr:hover{background:none}
.heat td{border:0;padding:0;height:24px;text-align:center;border-radius:3px;color:var(--ink)}
.heat td.lo{background:var(--lo-s)}.heat td.in{background:var(--in-s)}.heat td.hi{background:var(--hi-s)}.heat td.na{background:var(--s2)}
.agp{width:100%;height:auto;display:block;max-height:340px}.agp text{fill:var(--ink5);font-size:10px}.agp .ag{stroke:var(--rule);stroke-width:.6}
.agp .ao{fill:var(--info);fill-opacity:.16}.agp .ai2{fill:var(--info);fill-opacity:.42}.agp .am{fill:none;stroke:var(--info-ink);stroke-width:2;stroke-linejoin:round}
.agp .at{stroke:var(--in);stroke-width:1.25;stroke-dasharray:4 3}
i.km{background:var(--info-ink)}i.ki{background:var(--info);opacity:.6}i.ko{background:var(--info);opacity:.25}i.kt{background:var(--in)}
footer{max-width:1200px;margin:0 auto;padding:0 16px 32px;color:var(--ink5);font-size:12px;line-height:18px}
@media print{body{background:#fff}.tabsbar,.btn{display:none}.panel{display:grid!important;break-before:page}.panel:first-of-type{break-before:auto}
.panel::before{content:attr(data-label);grid-column:1/-1;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--brand)}
.card{break-inside:avoid-page;box-shadow:none}details>summary{list-style:none}}
`,M=`
const tabs=[...document.querySelectorAll('[role=tab]')];
function pick(t){tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).classList.toggle('on',on)})}
tabs.forEach((t,i)=>{t.onclick=()=>pick(t);t.onkeydown=e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){const n=tabs[(i+d+tabs.length)%tabs.length];pick(n);n.focus()}}});
document.getElementById('print').onclick=()=>print();
addEventListener('beforeprint',()=>document.querySelectorAll('details').forEach(d=>{d.dataset.was=d.open;d.open=true}));
addEventListener('afterprint',()=>document.querySelectorAll('details').forEach(d=>{d.open=d.dataset.was==='true'}));
`;function A(t){const l=m(t),e=t.thresholds,a=!!e&&e.lowMgdl===70&&e.highMgdl===180&&e.urgentLowMgdl===54,o=[["Period",`${h(t.period.startIso)} – ${h(t.period.endIso)}`],["Days with CGM",t.period.daysCovered!=null?`${t.period.daysCovered} of ${t.period.days}`:"—"],["Target range",e?`${e.lowMgdl}–${e.highMgdl} mg/dL`:"—"],["Source",t.sourceLabel],["Report",t.mode==="brief"?"Brief":"Full settings"]],d=l.map((n,r)=>`<button role="tab" id="t-${n.tab.id}" aria-controls="p-${n.tab.id}" aria-selected="${r===0}" tabindex="${r===0?0:-1}">${i(n.tab.label)}</button>`).join(""),s=l.map((n,r)=>`<section class="panel${r===0?" on":""}" role="tabpanel" id="p-${n.tab.id}" aria-labelledby="t-${n.tab.id}" data-label="${i(n.tab.label)}">${n.sections.map(p=>k(p,a)).join("")}</section>`).join("");return`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${i(t.title)}${t.patientName?` — ${i(t.patientName)}`:""}</title>
<style>${y}</style></head>
<body>
<div class="topbar"><div class="in-w"><p class="brandmark">LOOPSTACK<span>Clinician view</span></p><button class="btn" id="print" type="button">Print / Save as PDF</button></div></div>
<div class="patient"><div class="in-w"><div><h1>${i(t.patientName||"Patient")}</h1><p class="sub">${i(t.title)} · generated ${i(new Date(t.generatedIso).toLocaleString())} · ${i(t.timeZone)}</p></div>
<div class="chips">${o.map(([n,r])=>`<span class="chip"><small>${i(n)}</small><b>${i(r)}</b></span>`).join("")}</div></div></div>
${t.sample?'<div class="sample"><p>SAMPLE DATA — this report includes demonstration values and does not describe the patient.</p></div>':""}
<div class="tabsbar"><nav class="tabs tabs-w" role="tablist" aria-label="Report sections">${d}</nav></div>
<main>${s}</main>
<footer><p>${i(t.disclaimer)}</p></footer>
<script>${M}<\/script></body></html>`}function H(t){return`LoopStack-${t.mode}-dashboard-${t.generatedIso.slice(0,10)}.html`}export{H as dashboardFileName,A as renderClinicReportHtml};
