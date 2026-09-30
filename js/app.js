/* ============================================================
   APP
   ============================================================ */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
const fineMQ = matchMedia("(hover: hover) and (pointer: fine)");
const bySlug = Object.fromEntries(EXPERIMENTS.map(e => [e.slug, e]));
const byN = Object.fromEntries(EXPERIMENTS.map(e => [e.n, e]));
const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };
const ICON = {
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`,
  x: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3L3.5 11l6.3-2.2z"/></svg>`,
  bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M7 12h10M10 17h4"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>`,
  next: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></svg>`,
  play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>`
};
const words = n => ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","twenty-one","twenty-two","twenty-three","twenty-four","twenty-five"][n] || String(n);
function toast(msg){ const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2000); }

/* ---------- state + filtering ---------- */
const state = { q: "", type: "all", themes: new Set(), withResults: false, sort: "featured" };
const HAY = Object.fromEntries(EXPERIMENTS.map(e => [e.slug, [e.title, e.summary, e.approach, TYPES[e.type].label, e.status, ...e.tools, ...e.themes.map(t => THEMES[t]), ...e.learned].join(" ").toLowerCase()]));
function matches(e, skip){
  if (skip !== "type" && state.type !== "all" && e.type !== state.type) return false;
  if (skip !== "themes" && state.themes.size && !e.themes.some(t => state.themes.has(t))) return false;
  if (skip !== "results" && state.withResults && !e.stats) return false;
  if (state.q){ const hay = HAY[e.slug]; if (!state.q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t))) return false; }
  return true;
}
const TYPE_ORDER = { tool: 0, insight: 1, evaluation: 2 };
const SORTS = {
  featured: (a, b) => (!!b.feature - !!a.feature) || a.n - b.n,
  az: (a, b) => a.title.localeCompare(b.title),
  type: (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type] || a.title.localeCompare(b.title)
};
const results = () => EXPERIMENTS.filter(e => matches(e)).sort(SORTS[state.sort]);

/* ---------- components ---------- */
function Card(e){
  return `<article class="card k-${e.type}">
    <a href="#/e/${e.slug}" data-slug="${e.slug}">
      <div class="cover" data-cover="${e.slug}">${coverSVG(e)}</div>
      <div class="card-body">
        <div class="card-meta"><span class="type"><i></i>${TYPES[e.type].label}</span>${e.status ? `<span class="stat-tag">${esc(e.status)}</span>` : ""}</div>
        <h3><span>${esc(e.title)}</span></h3>
        <p>${esc(e.summary)}</p>
        <div class="themes">${e.themes.map(t => THEMES[t]).join(", ")}</div>
      </div>
    </a>
  </article>`;
}
const QUESTIONS = EXPERIMENTS.filter(e => e.question);

function Home(){
  const n = EXPERIMENTS.length, cnt = k => EXPERIMENTS.filter(e => e.type === k).length;
  const q0 = QUESTIONS[0];
  return `<section class="hero" aria-labelledby="hero-h">
    <div class="glow" id="glow" aria-hidden="true"></div>
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <span class="lab-pill"><i></i>Koru AI Lab</span>
        <h1 id="hero-h">Where AI earns its place in design.</h1>
        <p class="hero-lede">A living collection of Koru's experiments with AI: the tools we've built, the things we've measured, and what we've learned about where human judgement still leads.</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="#/" data-jump>Explore the experiments</a>
          <button class="btn" type="button" data-surprise>Surprise me</button>
        </div>
        <div class="hero-facts"><span><b>${cnt("tool")}</b> tools built</span><span><b>${cnt("insight")}</b> insights</span><span><b>${cnt("evaluation")}</b> evaluations</span></div>
      </div>
      <div class="console k-${q0.type}" id="console" aria-roledescription="carousel" aria-label="Questions the lab has explored">
        <div class="ask"><span class="ask-ic">${ICON.spark}</span><div class="ask-q" id="askQ" aria-live="polite"></div></div>
        <a class="answer" id="answer" href="#/e/${q0.slug}"></a>
        <div class="console-foot">
          <div class="dots" id="dots">${QUESTIONS.map((e,i) => `<button type="button" aria-label="Question ${i+1} of ${QUESTIONS.length}" aria-current="${i===0}" data-q="${i}"></button>`).join("")}</div>
          <div class="ctl"><button type="button" id="qPrev" aria-label="Previous question">${ICON.prev}</button><button type="button" id="qPause" aria-label="Pause">${ICON.pause}</button><button type="button" id="qNext" aria-label="Next question">${ICON.next}</button></div>
        </div>
      </div>
    </div>
  </section>
  <section class="dir wrap" id="dir" aria-labelledby="dir-h">
    <div class="sec-head">
      <div><h2 id="dir-h">All experiments</h2><p>${words(n).charAt(0).toUpperCase() + words(n).slice(1)} experiments across research, design systems, engineering and everyday workflow.</p></div>
    </div>
    <div class="mobile-search"><div class="search" id="msearch">${ICON.search}<label class="sr-only" for="mq">Search experiments</label><input id="mq" type="search" placeholder="Search experiments" autocomplete="off"><button class="x" type="button" data-clearq aria-label="Clear search">${ICON.x}</button></div></div>
    <div class="layout">
      <aside class="side" id="side" aria-label="Filters">
        <div class="side-head"><b>Filters</b><button class="btn btn-sm icon-btn" type="button" data-closefilters aria-label="Close filters">${ICON.x}</button></div>
        <div class="search" id="dsearch">${ICON.search}<label class="sr-only" for="q">Search experiments</label><input id="q" type="search" placeholder="Search experiments" autocomplete="off"><button class="x" type="button" data-clearq aria-label="Clear search">${ICON.x}</button></div>
        <div class="fgroup"><h3>Type</h3><div id="fType"></div></div>
        <div class="fgroup"><h3>Theme</h3><div id="fThemes"></div></div>
        <div class="fgroup"><h3>Evidence</h3><div id="fRes"></div></div>
        <div class="side-foot"><button class="btn" type="button" data-clear="all">Clear all</button><button class="btn btn-primary" type="button" data-closefilters id="showBtn">Show results</button></div>
      </aside>
      <div>
        <div class="toolbar">
          <p class="count" id="count" aria-live="polite"></p>
          <div class="tb-right">
            <button class="btn btn-sm filter-btn" type="button" id="filterBtn" aria-controls="side" aria-expanded="false">${ICON.filter}<span>Filters</span></button>
            <div class="select"><label class="sr-only" for="sort">Sort by</label><select id="sort"><option value="featured">Featured first</option><option value="az">A to Z</option><option value="type">By type</option></select></div>
          </div>
        </div>
        <div class="actives" id="actives"></div>
        <div class="grid" id="grid"></div>
      </div>
    </div>
  </section>`;
}

function Opt(attr, val, label, count, pressed, radio, cls = ""){
  return `<button type="button" class="opt ${radio ? "radio" : ""} ${cls}" ${attr}="${val}" aria-pressed="${pressed}" ${count === 0 && !pressed ? "disabled" : ""}><span class="box"></span>${cls ? `<span class="sw"></span>` : ""}${label}<span class="ct">${count}</span></button>`;
}
function renderFilters(){
  const tc = k => EXPERIMENTS.filter(e => matches(e, "type") && (k === "all" || e.type === k)).length;
  $("#fType").innerHTML = Opt("data-type", "all", "All", tc("all"), state.type === "all", true)
    + Object.entries(TYPES).map(([k, t]) => Opt("data-type", k, t.plural, tc(k), state.type === k, true, "k-" + k)).join("");
  $("#fThemes").innerHTML = Object.entries(THEMES).map(([k, l]) => Opt("data-theme", k, l, EXPERIMENTS.filter(e => matches(e, "themes") && e.themes.includes(k)).length, state.themes.has(k), false)).join("");
  $("#fRes").innerHTML = Opt("data-results", "1", "Has measured results", EXPERIMENTS.filter(e => matches(e, "results") && e.stats).length, state.withResults, false);
}
function activeCount(){ return (state.q ? 1 : 0) + (state.type !== "all" ? 1 : 0) + state.themes.size + (state.withResults ? 1 : 0); }
function renderResults(){
  const list = results(), n = EXPERIMENTS.length;
  $("#count").innerHTML = list.length === n ? `<b>${n}</b> experiments` : `<b>${list.length}</b> of ${n} experiments`;
  const a = [];
  if (state.q) a.push(`<button class="pill-x" data-clear="q">\u201c${esc(state.q)}\u201d <span aria-hidden="true">\u00d7</span><span class="sr-only">Remove search</span></button>`);
  if (state.type !== "all") a.push(`<button class="pill-x" data-clear="type">${TYPES[state.type].plural} <span aria-hidden="true">\u00d7</span><span class="sr-only">Remove filter</span></button>`);
  state.themes.forEach(t => a.push(`<button class="pill-x" data-untheme="${t}">${THEMES[t]} <span aria-hidden="true">\u00d7</span><span class="sr-only">Remove filter</span></button>`));
  if (state.withResults) a.push(`<button class="pill-x" data-clear="results">Has measured results <span aria-hidden="true">\u00d7</span><span class="sr-only">Remove filter</span></button>`);
  if (a.length > 1) a.push(`<button class="clear-all" data-clear="all">Clear all</button>`);
  $("#actives").innerHTML = a.join("");
  const fc = activeCount();
  $("#filterBtn span").textContent = fc ? `Filters (${fc})` : "Filters";
  $("#showBtn").textContent = `Show ${list.length} result${list.length === 1 ? "" : "s"}`;
  $("#grid").innerHTML = list.length ? list.map(Card).join("") :
    `<div class="empty"><h3>No experiments match</h3><p>${state.q ? `Nothing matches \u201c${esc(state.q)}\u201d${fc > 1 ? " with these filters" : ""}.` : "No experiment fits this combination of filters."} Try a broader search or clear a filter.</p>
    <div class="sugg">${["Claude","Figma","research","design system","testing"].map(s => `<button class="tag" data-suggest="${s}">${s}</button>`).join("")}<button class="btn btn-sm btn-primary" data-clear="all">Clear all filters</button></div></div>`;
  renderFilters();
}

/* ---------- hero console ---------- */
const hero = { i: 0, timer: 0, typing: 0, paused: false };
function showQuestion(i){
  hero.i = (i + QUESTIONS.length) % QUESTIONS.length;
  const e = QUESTIONS[hero.i], con = $("#console"); if (!con) return;
  con.className = "console k-" + e.type;
  $$("#dots button").forEach((b, j) => b.setAttribute("aria-current", j === hero.i));
  const ans = $("#answer");
  ans.href = "#/e/" + e.slug; ans.dataset.slug = e.slug;
  ans.innerHTML = `<div class="cover fade" data-cover="${e.slug}">${coverSVG(e)}</div><div class="answer-meta"><div><small>${TYPES[e.type].label}</small><b>${esc(e.title)}</b></div><span class="answer-go">${ICON.arrow}</span></div>`;
  ans.setAttribute("aria-label", `${e.question} Open ${e.title}`);
  const q = $("#askQ"); clearInterval(hero.typing);
  if (reduceMQ.matches){ q.textContent = e.question; }
  else { let k = 0; q.innerHTML = `<span></span><i class="caret"></i>`; const sp = q.firstChild; hero.typing = setInterval(() => { sp.textContent = e.question.slice(0, ++k); if (k >= e.question.length) clearInterval(hero.typing); }, 24); }
  schedule();
}
function schedule(){ clearTimeout(hero.timer); if (!hero.paused && !reduceMQ.matches) hero.timer = setTimeout(() => showQuestion(hero.i + 1), 5600); }
function bindHero(){
  const con = $("#console");
  con.addEventListener("mouseenter", () => clearTimeout(hero.timer));
  con.addEventListener("mouseleave", schedule);
  con.addEventListener("focusin", () => clearTimeout(hero.timer));
  $("#qPrev").onclick = () => showQuestion(hero.i - 1);
  $("#qNext").onclick = () => showQuestion(hero.i + 1);
  $("#qPause").onclick = () => { hero.paused = !hero.paused; $("#qPause").innerHTML = hero.paused ? ICON.play : ICON.pause; $("#qPause").setAttribute("aria-label", hero.paused ? "Play" : "Pause"); schedule(); };
  $("#dots").onclick = ev => { const b = ev.target.closest("[data-q]"); if (b) showQuestion(+b.dataset.q); };
  if (reduceMQ.matches){ hero.paused = true; $("#qPause").hidden = true; }
  showQuestion(0);
  // cursor glow
  const glow = $("#glow"), heroEl = $(".hero");
  let tx = heroEl.clientWidth * .72, ty = 420, cx = tx, cy = ty, raf = 0;
  const loop = () => { cx += (tx - cx) * .08; cy += (ty - cy) * .08; glow.style.transform = `translate(${cx - 450}px, ${cy - 450}px)`; raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .5 ? requestAnimationFrame(loop) : 0; };
  glow.style.transform = `translate(${cx - 450}px, ${cy - 450}px)`;
  if (fineMQ.matches && !reduceMQ.matches) heroEl.addEventListener("pointermove", ev => { const r = heroEl.getBoundingClientRect(); tx = ev.clientX - r.left; ty = Math.max(340, ev.clientY - r.top); if (!raf) raf = requestAnimationFrame(loop); });
}

/* ---------- detail ---------- */
function relatedFor(e){
  const picked = (e.related || []).map(n => byN[n]).filter(Boolean);
  const extra = EXPERIMENTS.filter(x => x !== e && !picked.includes(x)).map(x => ({ x, s: x.themes.filter(t => e.themes.includes(t)).length })).filter(o => o.s).sort((a, b) => b.s - a.s).map(o => o.x);
  return [...picked, ...extra].slice(0, 3);
}
function Detail(e){
  const list = [...EXPERIMENTS].sort(SORTS.featured), next = list[(list.indexOf(e) + 1) % list.length];
  const secs = [...(e.stats ? [["results","Key results"]] : []),["hypothesis","Hypothesis"],["approach","Approach"],["experience","The experience"],["learned","What we learned"],["next-steps","What's next"]];
  return `<article class="k-${e.type}" aria-labelledby="d-title">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">AI Lab</a><span aria-hidden="true">/</span><a href="#/" data-typelink="${e.type}">${TYPES[e.type].plural}</a></nav>
      <header class="d-head">
        <div class="card-meta"><span class="type"><i></i>${TYPES[e.type].label}</span>${e.status ? `<span class="stat-tag">${esc(e.status)}</span>` : ""}</div>
        <h1 id="d-title">${esc(e.title)}</h1>
        <p class="d-lede">${esc(e.summary)}</p>
      </header>
      <div class="d-cover"><div class="cover" id="detailCover" data-cover="${e.slug}">${coverSVG(e, { wide: true })}</div></div>
      <div class="d-body">
        <div>
          ${e.stats ? `<section class="d-sec" id="results"><h2>Key results</h2><div class="stats">${e.stats.map(([b, s]) => `<div class="stat"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("")}</div></section>` : ""}
          <section class="d-sec" id="hypothesis"><h2>Hypothesis</h2><p class="hypo"><span>We wanted to explore whether</span> ${esc(e.hypothesis)}.</p></section>
          <section class="d-sec" id="approach"><h2>Approach</h2><p>${esc(e.approach)}</p></section>
          <section class="d-sec" id="experience"><h2>The experience</h2>
            <div class="frame"><div class="frame-bar"><i></i><i></i><i></i><span>lab.koruux.com/${e.slug}</span></div><div class="cover">${coverSVG(e, { wide: true, variant: 1 })}</div>
            <div class="frame-cap"><span>Illustrative preview. Screens and walkthrough coming soon.</span><a class="btn btn-sm" href="https://www.koruux.com/contact/" target="_blank" rel="noopener">Request a walkthrough</a></div></div>
          </section>
          <section class="d-sec" id="learned"><h2>What we learned</h2><ul class="learn">${e.learned.map(l => `<li><i>${ICON.bulb}</i><span>${esc(l)}</span></li>`).join("")}</ul></section>
          <section class="d-sec" id="next-steps"><h2>What's next</h2><p>${esc(e.next)}</p></section>
        </div>
        <aside class="aside">
          <div class="glance"><h3>At a glance</h3><dl>
            <div><dt>Type</dt><dd>${TYPES[e.type].label}: ${TYPES[e.type].desc.toLowerCase()}</dd></div>
            ${e.status ? `<div><dt>Status</dt><dd>${esc(e.status)}</dd></div>` : ""}
            <div><dt>Themes</dt><dd class="tags">${e.themes.map(t => `<button class="tag" data-themelink="${t}">${THEMES[t]}</button>`).join("")}</dd></div>
            ${e.tools.length ? `<div><dt>Tools</dt><dd class="tags">${e.tools.map(t => `<button class="tag" data-searchlink="${esc(t)}">${esc(t)}</button>`).join("")}</dd></div>` : ""}
          </dl><a class="btn btn-primary" href="https://www.koruux.com/contact/" target="_blank" rel="noopener">Discuss this with Koru</a></div>
          <nav class="toc" aria-label="On this page">${secs.map(([id, t]) => `<a href="#${id}" data-toc="${id}">${t}</a>`).join("")}</nav>
        </aside>
      </div>
    </div>
    <section class="related wrap" aria-labelledby="rel-h"><div class="sec-head"><h2 id="rel-h">Related experiments</h2></div><div class="grid">${relatedFor(e).map(Card).join("")}</div></section>
    <div class="wrap"><a class="next k-${next.type}" href="#/e/${next.slug}"><div><small>Next experiment</small><b>${esc(next.title)}</b></div><div class="cover" data-cover="${next.slug}">${coverSVG(next)}</div></a></div>
  </article>`;
}

/* ---------- events ---------- */
function setQ(v){ state.q = v.trim(); ["#q", "#mq"].forEach(s => { const el = $(s); if (el && el.value !== v) el.value = v; }); ["#dsearch", "#msearch"].forEach(s => $(s)?.classList.toggle("has", !!v)); }
document.addEventListener("input", ev => { if (ev.target.id === "q" || ev.target.id === "mq"){ setQ(ev.target.value); clearTimeout(renderResults.t); renderResults.t = setTimeout(renderResults, 80); } });
document.addEventListener("change", ev => { if (ev.target.id === "sort"){ state.sort = ev.target.value; renderResults(); } });
function openFilters(open){ $("#side").classList.toggle("open", open); $("#scrim").classList.toggle("open", open); $("#filterBtn")?.setAttribute("aria-expanded", open); if (open) $("#side button")?.focus(); }
document.addEventListener("click", ev => {
  const t = ev.target.closest("button, a"); if (!t) { if (ev.target.id === "scrim") openFilters(false); return; }
  const d = t.dataset;
  if (d.type){ state.type = d.type; renderResults(); }
  else if (d.theme){ state.themes.has(d.theme) ? state.themes.delete(d.theme) : state.themes.add(d.theme); renderResults(); }
  else if (d.results){ state.withResults = !state.withResults; renderResults(); }
  else if (d.untheme){ state.themes.delete(d.untheme); renderResults(); }
  else if (d.clear){ if (d.clear === "q" || d.clear === "all") setQ(""); if (d.clear === "type" || d.clear === "all") state.type = "all"; if (d.clear === "results" || d.clear === "all") state.withResults = false; if (d.clear === "all") state.themes.clear(); renderResults(); }
  else if (d.clearq !== undefined){ setQ(""); renderResults(); }
  else if (d.suggest){ state.type = "all"; state.themes.clear(); state.withResults = false; setQ(d.suggest); renderResults(); }
  else if (t.id === "filterBtn") openFilters(true);
  else if (d.closefilters !== undefined) openFilters(false);
  else if (d.surprise !== undefined){ ev.preventDefault(); surprise(); }
  else if (d.jump !== undefined){ ev.preventDefault(); $("#dir").scrollIntoView({ behavior: reduceMQ.matches ? "auto" : "smooth" }); }
  else if (d.typelink){ ev.preventDefault(); fromDetail(() => { state.type = d.typelink; }); }
  else if (d.themelink){ ev.preventDefault(); fromDetail(() => { state.themes.add(d.themelink); }); }
  else if (d.searchlink){ ev.preventDefault(); fromDetail(() => setQ(d.searchlink)); }
  else if (d.close !== undefined) closeSheet();
});
let afterHome = null;
function fromDetail(fn){ state.type = "all"; state.themes.clear(); state.withResults = false; setQ(""); fn(); afterHome = () => { setQ(state.q); renderResults(); $("#dir").scrollIntoView(); }; location.hash = "#/"; }
document.addEventListener("keydown", ev => {
  if (ev.key === "/" && route().view === "home" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){ ev.preventDefault(); const q = innerWidth > 980 ? $("#q") : $("#mq"); q.focus(); q.scrollIntoView({ block: "center" }); }
  if (ev.key === "Escape"){ openFilters(false); closeSheet(); }
});
/* hover parallax on covers */
document.addEventListener("pointermove", ev => {
  if (!fineMQ.matches || reduceMQ.matches) return;
  const c = ev.target.closest && ev.target.closest(".card .cover, .answer .cover, .next .cover");
  if (hovered && hovered !== c){ hovered.style.removeProperty("--px"); hovered.style.removeProperty("--py"); hovered = null; }
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty("--px", ((ev.clientX - r.left) / r.width * 2 - 1).toFixed(3));
  c.style.setProperty("--py", ((ev.clientY - r.top) / r.height * 2 - 1).toFixed(3));
  hovered = c;
}, { passive: true });
let hovered = null;
function surprise(){ const cur = route().slug, pool = EXPERIMENTS.filter(e => e.slug !== cur), e = pool[Math.floor(Math.random() * pool.length)]; toast(`Opening ${e.short || e.title}`); location.hash = "#/e/" + e.slug; }

/* ---------- router + shared-element transition ---------- */
function route(){ const m = (location.hash.slice(1) || "/").match(/^\/e\/([\w-]+)/); return m && bySlug[m[1]] ? { view: "detail", slug: m[1] } : { view: "home" }; }
let current = null, homeMounted = false, homeScroll = 0, tocObs = null;
function mountHome(){
  $("#home").innerHTML = Home(); homeMounted = true;
  if (!reduceMQ.matches){ document.body.classList.add("intro"); setTimeout(() => document.body.classList.remove("intro"), 1600); }
  renderResults(); bindHero();
}
function render(r){
  if (tocObs){ tocObs.disconnect(); tocObs = null; }
  if (r.view === "detail"){
    if (!current || current.view === "home") homeScroll = scrollY;
    clearTimeout(hero.timer);
    const e = bySlug[r.slug];
    $("#detail").innerHTML = Detail(e); $("#detail").hidden = false; $("#home").hidden = true;
    document.title = `${e.title} | Koru AI Lab`;
    scrollTo(0, 0);
    const p = $("#progress"); p.hidden = false; p.className = "progress k-" + e.type;
    const links = $$("[data-toc]");
    tocObs = new IntersectionObserver(en => en.forEach(x => { if (x.isIntersecting) links.forEach(l => l.classList.toggle("on", l.dataset.toc === x.target.id)); }), { rootMargin: "-35% 0px -55% 0px" });
    $$(".d-sec").forEach(s => tocObs.observe(s));
  } else {
    if (!homeMounted) mountHome();
    $("#detail").hidden = true; $("#detail").innerHTML = ""; $("#home").hidden = false; $("#progress").hidden = true;
    document.title = "Koru AI Lab | Experiments in designing with AI";
    if (current && current.view === "detail") scrollTo(0, homeScroll);
    schedule();
    if (afterHome){ const f = afterHome; afterHome = null; requestAnimationFrame(f); }
  }
}
function visibleCover(slug){ return $$(`[data-cover="${slug}"]`).find(el => { if (el.closest("[hidden]")) return false; const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }) || null; }
function go(){
  const r = route(), prev = current;
  if (!document.startViewTransition || reduceMQ.matches || !prev){ render(r); current = r; return; }
  const slug = r.view === "detail" ? r.slug : prev.slug;
  const oldEl = r.view === "home" ? $("#detailCover") : visibleCover(slug);
  if (oldEl) oldEl.style.viewTransitionName = "hero-cover";
  const vt = document.startViewTransition(() => {
    if (oldEl) oldEl.style.viewTransitionName = "";
    render(r); current = r;
    if (!oldEl) return;
    const nu = r.view === "detail" ? $("#detailCover") : visibleCover(slug);
    if (nu) nu.style.viewTransitionName = "hero-cover";
  });
  vt.finished.finally(() => $$("[data-cover]").forEach(el => el.style.viewTransitionName = ""));
}
addEventListener("hashchange", go);

/* ---------- chrome ---------- */
let sRaf = 0;
addEventListener("scroll", () => { if (sRaf) return; sRaf = requestAnimationFrame(() => { sRaf = 0; $("#nav").classList.toggle("scrolled", scrollY > 8); if (current?.view === "detail"){ const max = document.documentElement.scrollHeight - innerHeight; $("#progress").style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max) : 0); } }); }, { passive: true });
const root = document.documentElement, saved = store.get("lab-theme"); if (saved) root.dataset.theme = saved;
$("#themeBtn").addEventListener("click", () => { const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; root.dataset.theme = dark ? "light" : "dark"; store.set("lab-theme", root.dataset.theme); });
const sheet = $("#sheet"), menuBtn = $("#menuBtn");
function closeSheet(){ sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true"); menuBtn.setAttribute("aria-expanded", "false"); }
menuBtn.addEventListener("click", () => { sheet.classList.add("open"); sheet.setAttribute("aria-hidden", "false"); menuBtn.setAttribute("aria-expanded", "true"); $("#closeSheet").focus(); });
$("#closeSheet").addEventListener("click", () => { closeSheet(); menuBtn.focus(); });
go();
