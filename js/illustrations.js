/* ============================================================
   ILLUSTRATIONS: placeholder visuals, one scene per experiment.
   Each returns { main, float } SVG strings in a 400×300 space.
   main = the product surface, float = chips that parallax above it.
   Replace with real screenshots later by adding coverImage to data.
   ============================================================ */
const f1 = n => Math.round(n * 10) / 10;
function hashStr(s){ let h = 2166136261; for (let i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed){ let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const X = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const R_ = (x,y,w,h,c="pn",r=10,extra="") => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ${extra}/>`;
const L_ = (x,y,w,o=1,h=6,c="ln") => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h/2}" opacity="${o}"/>`;
const T_ = (x,y,s,c="tx",size=11,w=500,a="start") => `<text class="${c}" x="${x}" y="${y}" font-size="${size}" font-weight="${w}" text-anchor="${a}">${X(s)}</text>`;
const D_ = (x,y,r,c="ac") => `<circle class="${c}" cx="${x}" cy="${y}" r="${r}"/>`;
const chipW = (s, size=11) => Math.round(s.length * size * .6 + 26);
const CH = (x,y,s,c="chipd",icon="") => { const w = chipW(s) + (icon ? 14 : 0); x = Math.max(8, Math.min(x, 392 - w)); return `<g>${R_(x,y,w,26,c,13)}${icon ? icon(x+13,y+13) : ""}${T_(x + (icon ? 26 : 12), y + 17, s, c+"-t", 11, 550)}</g>`; };
const tick = (x,y,c="#fff") => `<path d="M${x-3.2} ${y} l2.2 2.3 l4.3 -4.6" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
const OK = (x,y,r=7) => D_(x,y,r,"ac") + tick(x,y);
const spark = (x,y) => `<path d="M${x} ${y-5} l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4z" fill="currentColor" class="chipa-t"/>`;
const sparkW = (x,y) => `<path d="M${x} ${y-5} l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4z" fill="#fff"/>`;
const sparkD = (x,y) => `<path d="M${x} ${y-5} l1.4 3.6 l3.6 1.4 l-3.6 1.4 l-1.4 3.6 l-1.4 -3.6 l-3.6 -1.4 l3.6 -1.4z" class="chipd-t"/>`;
const winDots = (x,y) => D_(x,y,3,"ln") + D_(x+10,y,3,"ln") + D_(x+20,y,3,"ln");

const ILLUSTRATIONS = {
  components(R){
    let m = R_(62,48,276,200) + winDots(78,66) + T_(116,70,"Design system",  "tx",12,600) + L_(270,64,50,.6);
    const kinds = ["btn","input","toggle","avatar","check","tabs"];
    kinds.forEach((k,i) => {
      const x = 78 + (i%3)*84, y = 88 + Math.floor(i/3)*76;
      m += R_(x,y,76,66,"tile",10);
      if (k==="btn") m += R_(x+12,y+24,52,18,"ac",9) + L_(x+22,y+31,32,.9,4,"lnw");
      if (k==="input") m += R_(x+10,y+22,56,22,"pn",6) + L_(x+18,y+31,26,.8,4);
      if (k==="toggle") m += R_(x+22,y+24,32,18,"ac",9) + D_(x+45,y+33,6.5,"txw");
      if (k==="avatar") m += D_(x+22,y+33,10,"ac2") + L_(x+38,y+27,28,.9,5) + L_(x+38,y+37,20,.6,5);
      if (k==="check") m += R_(x+12,y+24,16,16,"ac",5) + tick(x+20,y+32) + L_(x+34,y+29,30,.8,5);
      if (k==="tabs") m += L_(x+10,y+24,18,1,5,"ac") + L_(x+32,y+24,16,.6,5) + L_(x+52,y+24,14,.6,5) + L_(x+10,y+38,56,.4,4);
    });
    const f = `<g>${R_(24,24,104,26,"chipl",13)}${T_(38,41,"Large model","chipl-t",11,500)}<line class="strike" x1="36" y1="37.5" x2="116" y2="37.5"/></g>` + CH(214,254,"Small model + checks","chipa",(x,y)=>tick(x,y));
    return { main:m, float:f };
  },
  icons(R){
    let m = R_(62,48,276,200) + winDots(78,66) + T_(116,70,"Icon set","tx",12,600);
    const bad = new Set([3,8,12]); const sym = {3:"->",8:"[*]",12:"<>"};
    for (let i=0;i<15;i++){
      const c = i%5, r = Math.floor(i/5), x = 84 + c*50, y = 90 + r*50;
      if (bad.has(i)){ m += R_(x,y,38,38,"act",10) + `<rect class="dash" x="${x}" y="${y}" width="38" height="38" rx="10"/>` + T_(x+19,y+24,sym[i],"txa",12,600,"middle"); continue; }
      m += R_(x,y,38,38,"tile",10);
      const cx = x+19, cy = y+19, k = i % 5;
      if (k===0) m += `<circle class="inks" cx="${cx}" cy="${cy}" r="7"/>`;
      if (k===1) m += `<path class="inks" d="M${cx-7} ${cy+5} l7 -11 l7 11z"/>`;
      if (k===2) m += `<path class="inks" d="M${cx} ${cy-7} v14 M${cx-7} ${cy} h14"/>`;
      if (k===3) m += `<rect class="inks" x="${cx-7}" y="${cy-6}" width="14" height="12" rx="3"/>`;
      if (k===4) m += `<path class="inks" d="M${cx-7} ${cy+4} q7 -14 14 0"/>`;
    }
    const f = CH(222,24,"Instruction repeated","chipd") + CH(40,254,"Icon replaced with text","chipa");
    return { main:m, float:f };
  },
  synthesis(R){
    let m = "";
    const hot = new Set([1,5,6]);
    for (let i=0;i<9;i++){
      const c=i%3, r=Math.floor(i/3), x=34+c*82, y=40+r*74;
      m += R_(x,y,72,62,"pn",10) + D_(x+14,y+15,6,hot.has(i)?"ac":"ln") + T_(x+26,y+19,"P"+(i+1),"tx2",10,600) + L_(x+10,y+32,52,.9,5) + L_(x+10,y+42,40,.6,5);
      if (hot.has(i)) m += `<rect class="hl" x="${x-3}" y="${y-3}" width="78" height="68" rx="12"/>`;
    }
    const f = `<g>${R_(284,96,104,120,"pn",12)}${T_(298,118,"AI synthesis","tx",10.5,600)}${L_(298,130,76,.9,5)}${L_(298,141,60,.6,5)}${L_(298,152,70,.6,5)}${L_(298,163,48,.6,5)}${R_(298,178,76,22,"act",8)}${T_(336,193,"4 themes","txa",10,600,"middle")}</g>` + CH(236,250,"3 findings missed","chipa");
    return { main:m, float:f };
  },
  componentDoc(R){
    let m = R_(34,56,146,188) + T_(50,80,"Button / Primary","tx",11,600) + R_(56,130,102,34,"ac",17) + T_(107,151,"Continue","txw",12,600,"middle") + L_(50,214,70,.5,5) + L_(50,226,50,.4,5);
    m += R_(196,36,174,228) + T_(212,60,"Variants","tx2",10,600);
    ["Default","Hover","Disabled"].forEach((v,i)=>{ m += R_(212+i*52,68,46,20,i===0?"ac":"tile",10) + T_(235+i*52,82,v,i===0?"txw":"tx2",8.5,600,"middle"); });
    m += T_(212,112,"Anatomy","tx2",10,600);
    [0,1,2].forEach(i=>{ m += D_(218,128+i*18,6,"ac2") + T_(218,131+i*18,String(i+1),"txw",8,700,"middle") + L_(230,125+i*18,[90,70,80][i],.7,5); });
    m += T_(212,194,"Tokens","tx2",10,600);
    ["ac","ac2","tx","ln","tile"].forEach((c,i)=>{ m += D_(222+i*26,214,9,c) ; });
    m += L_(212,236,120,.5,5);
    const f = CH(40,20,"Generated from the component","chipd",(x,y)=>sparkD(x,y));
    return { main:m, float:f };
  },
  chain(R){
    let m = "";
    ["Query","Estimate","Tests"].forEach((t,i)=>{
      const x = 30 + i*122;
      m += R_(x,40,100,58) + R_(x+12,52,22,22,"act",7) + D_(x+23,63,4,"ac") + T_(x+42,63,t,"tx",11,600) + L_(x+42,72,40,.6,4) + L_(x+12,84,76,.4,4);
      if (i<2) m += `<path class="acs" d="M${x+100} 69 h22"/>` + D_(x+122,69,3,"ac");
    });
    m += R_(44,120,312,140,"pnd",14) + D_(62,138,3.5,"lnw") + D_(74,138,3.5,"lnw") + D_(86,138,3.5,"lnw");
    const lines = ["> where is auth handled?","  src/auth/session.js : 42","> estimate TICKET-218","  ~3 points, 2 files","> generate tests","  12 tests created"];
    lines.forEach((l,i)=>{ m += `<text class="txm" x="62" y="${166+i*15}" font-size="10.5">${X(l)}</text>`; });
    const f = CH(250,104,"~99% reliable","chipa",(x,y)=>tick(x,y));
    return { main:m, float:f };
  },
  converge(R){
    let m = R_(30,44,160,160) + T_(46,68,"Paper first","tx",11,600);
    for (let i=0;i<5;i++){ let d=`M46 ${92+i*20}`; for(let x=46;x<=170;x+=12){ d+=` L${x} ${f1(92+i*20+ (R()-.5)*5)}`; } m += `<path class="inks" d="${d}" opacity="${i===0?1:.6}"/>`; }
    m += R_(210,44,160,160) + T_(226,68,"Claude only","tx",11,600) + R_(226,82,128,36,"act",8) + L_(226,128,128,.8,6) + L_(226,140,96,.5,6) + R_(226,158,60,30,"tile",8) + R_(294,158,60,30,"tile",8);
    m += R_(30,218,340,56) + T_(46,240,"Paper first","tx2",10,500) + L_(122,234,120,1,8,"ln") + T_(46,261,"Claude only","tx2",10,500) + R_(122,253,196,8,"ac",4);
    const f = CH(152,20,"Judged blind","chipd");
    return { main:m, float:f };
  },
  fourLessons(R){
    let m = "";
    const heads = ["Categories","Variance","Attribution","The catch"];
    heads.forEach((h,i)=>{
      const x = 20 + i*92;
      m += R_(x,36,84,24,"chipl",12) + T_(x+42,52,h,"chipl-t",9.5,600,"middle");
      const n = [3,2,3,2][i];
      for (let j=0;j<n;j++){ const y = 72 + j*58, hot = i===3 && j===0; m += R_(x+4,y,76,48,hot?"ac":"pn",8, `transform="rotate(${f1((R()-.5)*5)} ${x+42} ${y+24})"`) + L_(x+14,y+16,50,.9,5,hot?"lnw":"ln") + L_(x+14,y+28,36,.7,5,hot?"lnw":"ln"); }
    });
    const f = CH(250,248,"Caught unprompted","chipd",(x,y)=>sparkD(x,y));
    return { main:m, float:f };
  },
  nlTask(R){
    let m = R_(40,40,320,220) + R_(58,58,284,44,"tile",22) + T_(76,85,"Log 2 hours on the onboarding review","tx2",11.5,500) + D_(322,80,14,"ac") + `<path d="M316 80 h11 m-4 -4 l4 4 l-4 4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
    m += T_(58,128,"Worklog","tx",11,600);
    [["Onboarding review","2h",true],["Design QA","1.5h",false],["Sprint planning","1h",false]].forEach(([t,h,n],i)=>{
      const y = 142 + i*36;
      m += R_(58,y,284,28,n?"act":"tile",8) + L_(72,y+11,110,n?1:.7,6,n?"ac":"ln") + T_(296,y+18,h,"tx",10.5,600,"end");
      if (n) m += OK(324,y+14,7);
    });
    const f = CH(26,18,"Plain language in","chipa",(x,y)=>sparkW(x,y)) + CH(258,262,"Entry logged","chipd");
    return { main:m, float:f };
  },
  distill(R){
    let m = R_(42,40,316,222) + R_(58,56,284,36,"tile",18) + `<circle class="inks" cx="78" cy="74" r="6"/><path class="inks" d="M82.5 78.5 l4 4"/>` + T_(94,78,"pricing concerns","tx",11.5,500);
    [0,1,2].forEach(i=>{
      const y = 106 + i*50;
      m += R_(58,y,284,42,i===0?"act":"pn",10);
      for (let b=0;b<14;b++){ const h = 4 + R()*18; m += `<rect class="${i===0?"ac":"ln"}" x="${70+b*5}" y="${f1(y+21-h/2)}" width="3" height="${f1(h)}" rx="1.5"/>`; }
      m += L_(150,y+12,[130,110,120][i],.9,5) + L_(150,y+24,[90,100,70][i],.55,5) + T_(330,y+17,["12:04","31:40","07:15"][i],"tx3",9.5,500,"end");
    });
    const f = `<g>${R_(236,18,146,30,"chipd",15)}${T_(250,37,"Indexing transcripts","chipd-t",10.5,550)}</g>${R_(250,52,118,4,"ln",2)}${R_(250,52,70,4,"ac",2)}`;
    return { main:m, float:f };
  },
  sparr(R){
    let m = R_(52,34,296,232) + D_(78,60,12,"ac2") + T_(78,64,"S","txw",11,700,"middle") + T_(98,58,"Stakeholder","tx",11.5,600) + T_(98,72,"Simulated from meeting history","tx3",9.5,500);
    const b = [[0,70,150],[1,178,110],[0,70,130],[1,196,92]];
    b.forEach(([me,x,w],i)=>{ const y = 94 + i*40; m += R_(x,y,w,30,me?"ac":"tile",15) + L_(x+14,y+12,w-40,me?.9:.8,6,me?"lnw":"ln"); });
    const f = `<g>${R_(238,214,148,62,"pn",14)}${T_(252,236,"Realism","tx2",10,600)}${T_(372,236,"40–60%","tx",11,650,"end")}${R_(252,248,120,8,"tile",4)}${R_(300,248,24,8,"ac",4)}</g>`;
    return { main:m, float:f };
  },
  wireframes(R){
    let m = "";
    for (let i=0;i<10;i++){
      const c=i%5, r=Math.floor(i/5), x=26+c*72, y=34+r*112;
      m += R_(x,y,62,96,"pn",8) + L_(x+8,y+10,30,.9,5) + R_(x+8,y+22,46,28,"tile",4) + L_(x+8,y+58,46,.6,4) + L_(x+8,y+67,32,.5,4) + R_(x+8,y+78,26,10,"act",5);
      if (i===6) m += D_(x+56,y+6,8,"chipd") + `<path d="M${x+53} ${y+3} l6 6 m0 -6 l-6 6" class="" stroke="var(--bg)" stroke-width="1.8" stroke-linecap="round"/>`;
      else m += OK(x+56,y+6,8);
    }
    const f = CH(126,262,"9 of 10 on-system","chipd");
    return { main:m, float:f };
  },
  oneDay(R){
    let m = "";
    [[64,74],[156,48],[248,74]].forEach(([x,y],i)=>{
      m += R_(x,y,88,176,"pn",16) + R_(x+30,y+8,28,5,"ln",2.5);
      m += R_(x+8,y+22,72,[48,40,56][i],i===1?"ac":"act",8) + L_(x+10,y+[82,74,90][i],56,.9,5) + L_(x+10,y+[94,86,102][i],44,.6,5);
      m += R_(x+8,y+[110,100,118][i],34,34,"tile",8) + R_(x+46,y+[110,100,118][i],34,34,"tile",8);
    });
    const f = CH(30,20,"Day 1: three screens","chipa",(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M${x} ${y-3} v3 l2 1.5" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    return { main:m, float:f };
  },
  tests(R){
    let m = R_(56,32,288,236) + T_(74,58,"End-to-end suite","tx",12,600) + T_(326,58,"passing","tx3",10,500,"end");
    for (let i=0;i<6;i++){
      const y = 74 + i*30, warn = i===4;
      m += (warn ? D_(84,y+10,8,"chipd") + T_(84,y+14,"!","chipd-t",11,700,"middle") : OK(84,y+10,8)) + L_(100,y+7,[150,120,170,110,140,130][i],warn?1:.8,6,warn?"ac":"ln");
      if (warn) m += T_(326,y+14,"new thread","tx3",9.5,500,"end");
    }
    const f = CH(232,258,"1 day, not 3","chipa",(x,y)=>tick(x,y));
    return { main:m, float:f };
  },
  setup(R){
    let m = R_(24,54,156,92) + T_(40,76,"One-line ask","tx",11,600) + L_(40,92,110,.7,6) + L_(40,104,60,.5,6);
    m += R_(24,160,156,86,"tile",12) + T_(40,182,"Output","tx2",10,600) + L_(40,196,90,.45,5) + L_(40,207,60,.35,5);
    m += `<path class="acs" d="M188 150 h18" /><path class="acs" d="M200 144 l6 6 l-6 6"/>`;
    m += R_(214,30,164,240) + T_(230,52,"With 30 min of context","tx",11,600);
    ["Goal","Audience","Constraints","Examples"].forEach((h,i)=>{ const y = 68 + i*46; m += T_(230,y+10,h,"txa",9.5,650) + L_(230,y+18,[120,100,128,90][i],.8,5) + L_(230,y+28,[90,110,70,100][i],.55,5); });
    const f = CH(26,20,"Same model, same transcripts","chipd");
    return { main:m, float:f };
  },
  metrics(R){
    let m = R_(34,40,332,220) + T_(52,64,"This quarter","tx",11.5,600);
    for (let i=0;i<4;i++) m += `<line x1="52" x2="348" y1="${90+i*40}" y2="${90+i*40}" stroke="var(--ln)" stroke-width="1"/>`;
    m += `<path d="M52 210 C120 200 170 160 220 130 S300 90 348 80" fill="none" stroke="var(--a1)" stroke-width="3" stroke-linecap="round"/>`;
    m += `<path d="M52 196 C130 194 220 198 348 194" fill="none" stroke="var(--ink-3)" stroke-width="2.4" stroke-dasharray="5 5" stroke-linecap="round"/>`;
    m += D_(348,80,5,"ac") + D_(348,194,4.5,"tx3");
    m += D_(62,238,4,"ac") + T_(72,241,"Tokens used","tx2",10,500) + D_(160,238,4,"tx3") + T_(170,241,"Real outcomes","tx2",10,500);
    const f = CH(222,18,"Activity is not impact","chipd");
    return { main:m, float:f };
  },
  explanation(R){
    let m = R_(70,40,260,96,"pn",18) + L_(92,62,190,.9,6) + L_(92,76,160,.7,6) + L_(92,90,200,.7,6) + `<line class="strike" x1="88" y1="93" x2="296" y2="93"/>` + L_(92,106,120,.5,6) + `<path d="M120 136 l-10 16 l26 -16z" class="pn"/>`;
    for (let i=0;i<44;i++){ const h = 6 + Math.abs(Math.sin(i*.55))*40*R() + R()*12; m += `<rect class="${i>16&&i<28?"ac":"ln"}" x="${f1(46+i*7.2)}" y="${f1(206-h/2)}" width="4" height="${f1(h)}" rx="2"/>`; }
    const f = CH(136,258,"Explain it out loud","chipa");
    return { main:m, float:f };
  },
  rewrite(R){
    let m = R_(50,40,300,220) + T_(70,66,"DES-142","tx3",10,600) + R_(254,52,80,22,"ac",11) + T_(294,67,"Ready for dev","txw",9,650,"middle");
    m += L_(70,82,180,.9,8) + L_(70,98,120,.55,6);
    m += T_(70,136,"Design link","tx2",10,600) + R_(70,146,260,30,"tile",8) + L_(84,158,150,.5,6) + `<line class="strike" x1="80" y1="161" x2="244" y2="161"/>`;
    m += R_(70,184,260,30,"act",8) + L_(84,196,170,1,6,"ac") + T_(318,203,"updated","txa",9.5,600,"end");
    m += D_(82,236,8,"ac2") + T_(96,240,"Updated by automation","tx3",9.5,500);
    const f = CH(160,264,"Who approved the change?","chipd");
    return { main:m, float:f };
  },
  dashboard(R){
    let m = R_(46,36,308,228) + T_(64,62,"# design-activity","tx",11.5,600) + T_(338,62,"Daily digest","tx3",9.5,500,"end");
    [["Files updated",0.8],["Components changed",0.55],["Pull requests",0.7],["Comments",0.35]].forEach(([t,v],i)=>{
      const y = 84 + i*40;
      m += T_(64,y+12,t,"tx2",10,500) + R_(64,y+20,260,8,"tile",4) + R_(64,y+20,f1(260*v),8,"ac",4);
    });
    const f = `<g>${D_(344,44,24,"chipd")}${T_(344,52,"?","chipd-t",22,600,"middle")}</g>` + CH(24,258,"Useful, or just visible?","chipa");
    return { main:m, float:f };
  },
  memory(R){
    let m = R_(66,30,268,240) + T_(86,58,"Project file","tx",13,650) + T_(314,58,"auto-updated","tx3",9.5,500,"end");
    [["Context",3],["Decisions",3],["Handoff brief",2]].forEach(([h,n],i)=>{
      const y = 76 + i*62;
      m += T_(86,y+10,h,"txa",10,650);
      for (let j=0;j<n;j++) m += L_(86,y+20+j*11,[210,180,196][j],.75-j*.12,5);
    });
    const cur = (x,y,c,label) => `<path d="M${x} ${y} l0 16 l4.5 -4.5 l7 0z" class="${c}"/>` + R_(x+10,y+14,chipW(label,10)-4,20,c,10) + T_(x+19,y+28,label,"txw",9.5,600);
    const f = cur(248,120,"ac","Editor A") + cur(206,136,"ac2","Editor B") + CH(30,262,"Breaks with two editors","chipd");
    return { main:m, float:f };
  },
  prbot(R){
    let m = R_(38,34,324,232) + T_(56,60,"Pull request #481","tx",11.5,600) + R_(262,46,82,22,"act",11) + T_(303,61,"backend","txa",9.5,650,"middle");
    m += D_(66,94,12,"ac") + `<rect x="60" y="89" width="12" height="9" rx="2.5" fill="#fff"/><circle cx="63.5" cy="93.5" r="1.3" class="ac"/><circle cx="68.5" cy="93.5" r="1.3" class="ac"/>` + T_(86,92,"Setup bot","tx",11,600) + T_(86,106,"To see these changes locally, run:","tx2",10,500);
    m += R_(56,122,288,110,"pnd",10);
    ["$ git pull origin feature/api","$ docker compose up -d db","$ npm run migrate","$ npm run dev"].forEach((l,i)=>{ m += `<text class="txm" x="72" y="${148+i*22}" font-size="10.5">${X(l)}</text>`; });
    const f = CH(236,248,"Comment posted","chipa",(x,y)=>tick(x,y));
    return { main:m, float:f };
  },
  cantAccess(R){
    let m = R_(24,46,178,208) + T_(40,70,"AI description","tx",11,600);
    for (let i=0;i<9;i++) m += L_(40,86+i*16,[140,120,146,110,136,126,140,100,120][i],.7,6);
    m += R_(214,70,164,112,"act",16) + T_(230,108,"\u201cNormal now,","tx",14,550) + T_(230,130,"I'm used to it.\u201d","tx",14,550) + T_(230,160,"Heard in conversation","tx3",9.5,500);
    for (let i=0;i<26;i++){ const h = 4 + Math.abs(Math.sin(i*.7))*20*(0.5+R()); m += `<rect class="ac" x="${f1(222+i*5.8)}" y="${f1(218-h/2)}" width="3.2" height="${f1(h)}" rx="1.6" opacity="${.35+R()*.65}"/>`; }
    const f = CH(236,258,"Listening, not describing","chipd");
    return { main:m, float:f };
  },
  inbox(R){
    let m = "";
    ["Email","Slack","Teams"].forEach((t,i)=>{ const y = 64 + i*62; m += R_(24,y,92,34,"pn",17) + D_(44,y+17,7,i===0?"ac":"ac2") + T_(58,y+21,t,"tx",11,600) + `<path class="acs" d="M116 ${y+17} C160 ${y+17} 160 150 196 150" opacity=".7"/>`; });
    m += R_(196,44,180,212) + T_(214,70,"Action digest","tx",12,600);
    for (let i=0;i<5;i++){ const y = 88 + i*32, done = i<2; m += (done ? R_(214,y,14,14,"ac",4) + tick(221,y+7) : `<rect x="214" y="${y}" width="14" height="14" rx="4" fill="none" stroke="var(--ln)" stroke-width="1.5"/>`) + L_(236,y+4,[110,90,120,80,100][i],done?.45:.85,6); }
    const f = CH(24,258,"Every 2 hours","chipd",(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="none" class="" stroke="var(--bg)" stroke-width="1.6"/><path d="M${x} ${y-3} v3 l2 1.5" stroke="var(--bg)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    return { main:m, float:f };
  },
  critic(R){
    let m = R_(44,32,312,236) + R_(60,48,280,24,"tile",6) + L_(72,57,60,.8,6) + R_(60,84,280,78,"act",10) + L_(76,104,150,.9,8) + L_(76,120,110,.6,6) + R_(76,136,64,16,"ac",8);
    m += L_(60,178,200,.7,6) + L_(60,192,160,.5,6) + R_(60,212,86,36,"tile",8) + R_(154,212,86,36,"tile",8) + R_(248,212,92,36,"tile",8);
    const pin = (x,y,n) => D_(x,y,10,"chipd") + T_(x,y+4,String(n),"chipd-t",10,700,"middle");
    const f = pin(146,142,1) + CH(160,130,"Low contrast","chipa") + pin(254,210,2) + CH(268,198,"Small target","chipl") + pin(62,178,3);
    return { main:m, float:f };
  },
  ditto(R){
    let m = R_(84,26,232,248) + D_(106,50,10,"ac") + T_(106,54,"D","txw",11,700,"middle") + T_(124,54,"Ditto","tx",12.5,650) + R_(100,72,200,28,"tile",14) + L_(116,83,90,.6,6);
    const gs = ["g-tool-0","g-tool-1","g-tool-2","g-insight-0","g-insight-1","g-evaluation-0","g-evaluation-1","g-insight-2","g-evaluation-2"];
    for (let i=0;i<9;i++){ const c=i%3, r=Math.floor(i/3), x=100+c*68, y=112+r*52; m += R_(x,y,60,44,"tile",8) + `<circle cx="${x+20+R()*20}" cy="${y+22}" r="${22+R()*10}" fill="url(#${gs[i]})"/>`; }
    const f = CH(24,20,"Coming to Figma Community","chipd");
    return { main:m, float:f };
  }
};

/* Aurora field + scene. wide=true adds side bleed for 2:1 frames. */
let coverUid = 0;
function coverSVG(e, { wide = false, variant = 0 } = {}){
  const R = rng(hashStr(e.slug) + variant * 131);
  const pad = wide ? 100 : 0, vx = -pad, vw = 400 + pad * 2;
  const k = e.type;
  let blobs = "";
  const spots = wide ? [[40,40],[340,60],[200,280],[-60,220],[470,240]] : [[60,40],[340,70],[200,280]];
  spots.forEach(([x,y],i) => { blobs += `<circle cx="${f1(x + (R()-.5)*80)}" cy="${f1(y + (R()-.5)*60)}" r="${f1(150 + R()*80)}" fill="url(#g-${k}-${i%3})"/>`; });
  const scene = (ILLUSTRATIONS[e.visual] || ILLUSTRATIONS.components)(R);
  coverUid++;
  return `<svg viewBox="${vx} 0 ${vw} 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <rect x="${vx}" y="0" width="${vw}" height="300" style="fill:var(--cv)"/>
    <g class="l1">${blobs}</g>
    <g class="l2" filter="url(#sh)">${scene.main}</g>
    <g class="l3" filter="url(#sh)">${scene.float}</g>
  </svg>`;
}
