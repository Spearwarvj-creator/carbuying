/*
 * The cards for the Deal Desk video (V2Stack No. 6): start card, seven chapter transitions, the shelf and the end card.
 * Every figure on a card is one that was checked: see VIDEO_PLAN.md, "Where each number comes from".
 * Play one card full screen:   index.html?card=t3&clean=1     (clean hides this panel; add &guides=1 to see the end-screen slots)
 */
(function () {
  "use strict";

  const stage = document.getElementById("stage");
  const layer = document.getElementById("card");
  const wipeCv = document.getElementById("wipe");
  const shell = document.getElementById("shell");
  const params = new URLSearchParams(location.search);
  if (params.get("clean")) shell.classList.add("clean");
  if (params.get("guides")) stage.classList.add("guides");

  /* ---------- the chapters (also the nine posts on the road) ---------- */
  const CHAPTERS = ["THE TRICK", "V2STACK", "A QUOTE", "THE DESK", "THE AI", "WORDS", "REDESIGN", "CHECKS", "SHELF"];

  /* ---------- helpers ---------- */
  let timers = [];
  let token = 0;
  const at = (ms, fn) => {
    const mine = token;
    timers.push(setTimeout(() => mine === token && fn(), ms));
  };
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  function typeInto(node, text, cps, done) {
    node.classList.add("caret");
    let i = 0;
    const mine = token;
    const step = () => {
      if (mine !== token) return;
      i++;
      node.textContent = text.slice(0, i);
      if (i < text.length) timers.push(setTimeout(step, 1000 / cps));
      else {
        if (done) done();
        timers.push(setTimeout(() => node.classList.remove("caret"), 500));
      }
    };
    step();
  }

  /* ---------- Vee on the stage ---------- */
  const vee = new Vee({ container: stage, fixed: false, logicalW: 1920, logicalH: 1080, scale: 6, z: 6, x: -200, y: 800 });
  vee.canvas.style.zIndex = 6;
  const fit = () => {
    const view = document.getElementById("view");
    const f = Math.min(view.clientWidth / 1920, view.clientHeight / 1080);
    document.documentElement.style.setProperty("--fit", f.toFixed(4));
    vee.resize();
  };
  window.addEventListener("resize", fit);

  /* ---------- the pixel wipe between a card and the footage ---------- */
  const wx = wipeCv.getContext("2d");
  const BLOCK = 60;
  const COLS = 1920 / BLOCK;
  const ROWS = 1080 / BLOCK;
  const thr = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) thr.push(((c + r) / (COLS + ROWS)) * 0.72 + Math.random() * 0.28);
  function drawWipe(p, cover) {
    wx.clearRect(0, 0, 1920, 1080);
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const t = thr[r * COLS + c];
        const on = cover ? p > t : p < t;
        if (!on) continue;
        wx.fillStyle = "#c44d2d";
        wx.fillRect(c * BLOCK, r * BLOCK, BLOCK, BLOCK);
        wx.fillStyle = "#e87a58";
        wx.fillRect(c * BLOCK, r * BLOCK, BLOCK, 6);
        wx.fillStyle = "#8f3219";
        wx.fillRect(c * BLOCK, r * BLOCK + BLOCK - 6, BLOCK, 6);
      }
  }
  function wipe(cover, ms) {
    const mine = token;
    const t0 = performance.now();
    const tick = (now) => {
      if (mine !== token) return;
      const p = Math.min(1, (now - t0) / ms);
      drawWipe(p, cover);
      if (p < 1) requestAnimationFrame(tick);
      else if (!cover) wx.clearRect(0, 0, 1920, 1080);
    };
    requestAnimationFrame(tick);
  }

  // &noend=1 keeps the finished card on screen instead of wiping it away (to hold a frame, or to look at it)
  const endWipe = (ms) => !params.get("noend") && wipe(true, ms);

  /* ---------- pieces ---------- */
  const logoBlock = "";
  const badge = (from, to) => `
    <div class="badge"><img src="assets/v2stack-icon.svg" alt=""><span class="nm">V2Stack</span><span class="div"></span>
    <span class="no">NO. <span class="odo"><i style="transform:translateY(0)" id="odoi"><span style="display:block;height:40px">${from}</span><span style="display:block;height:40px">${to}</span></i></span></span></div>`;
  const postX = (i) => 150 + i * (1620 / 8);
  const road = (cur) => `
    <div class="road"><div class="asphalt"></div><div class="dash"></div>
    ${CHAPTERS.map((n, i) => `<div class="post ${i < cur ? "done" : ""} ${i === cur ? "cur" : ""}" style="left:${postX(i)}px"><i></i>${String(i + 1).padStart(2, "0")}</div>`).join("")}
    </div>`;

  /* ---------- the cards ---------- */
  const CARDS = [];

  CARDS.push({
    id: "start",
    name: "Start card",
    dur: 7000,
    voice: "This is number six in V2Stack, where I build and ship one real product every week.",
    build() {
      layer.innerHTML = `
        <div class="start">
          ${logoBlock}${badge(5, 6)}
          <div class="title pix" id="s1"></div><div class="title2 pix" id="s2"></div>
          <div class="sub" id="ssub">A car deal calculator where the AI never makes the numbers.</div>
          <div class="tag" id="stag">One real product a week</div>
        </div>`;
      vee.S = 12;
      vee.moveTo(-300, 640, { snap: true });
      wipe(false, 700);
      at(150, () => vee.moveTo(1400, 590).mood("wow", 900));
      at(700, () => typeInto(document.getElementById("s1"), "DEAL", 9));
      at(1300, () => typeInto(document.getElementById("s2"), "DESK", 9));
      at(2300, () => {
        document.getElementById("odoi").style.transform = "translateY(-40px)";
        vee.mood("happy", 1400);
      });
      at(3000, () => document.getElementById("ssub").classList.add("on"));
      at(4300, () => document.getElementById("stag").classList.add("on"));
      at(4900, () => vee.mood("wink", 900));
      at(5800, () => vee.celebrate());
      at(6300, () => endWipe( 650));
    },
  });

  /* the seven transitions: [id, chapter index it leads to, kicker, title lines + size, promise, facts, voice] */
  const TR = [
    {
      id: "t1", to: 2, title: ["A REAL", "QUOTE"], size: 150, promise: "Six steps. One question at a time.",
      facts: [
        ["Where", "/deal, then I have a quote"],
        ["Watch for", '<span class="y">$603</span> a month', "and $6,089 of it is interest"],
        ["From the shelf", "Verdict: a match score you can see working"],
      ],
      voice: "First, a real quote. One question at a time.", vee: "happy",
    },
    {
      id: "t2", to: 3, title: ["THE", "DESK"], size: 170, promise: "For when the numbers keep changing.",
      facts: [
        ["Where", "/deal, then Desk"],
        ["Watch for", "$603 down to $462 a month", '<span class="y">+$2,593</span> in total'],
        ["From the shelf", "Kurae: you accept or change every suggestion"],
      ],
      voice: "Now the Desk, for when the numbers keep changing.", vee: "wow",
    },
    {
      id: "t3", to: 4, title: ["THE AI", "RULE"], size: 150, promise: "The AI explains. It never invents.",
      facts: [
        ["Where", "Ask about this deal"],
        ["Watch for", "An answer thrown away", "because it had a number of its own"],
        ["From the shelf", "Verdict: a rewrite built never to invent numbers"],
      ],
      voice: "Next, the AI, and the rule it can't break.", vee: "focus",
    },
    {
      id: "t4", to: 5, title: ["WORDS,", "AND ESPAÑOL"], size: 92, promise: "Car buying has its own language.",
      facts: [
        ["Where", "/learn, then ES"],
        ["What is there", "About 100 words, 6 lessons", "in English and Spanish"],
        ["From the shelf", "Compass: 15 countries, every answer dated"],
      ],
      voice: "Car buying has its own language. Let's learn it.", vee: "happy",
    },
    {
      id: "t5", to: 6, title: ["THE", "REDESIGN"], size: 132, promise: "I checked it against real sites.",
      facts: [
        ["Where", "docs/research in the project"],
        ["Watch for", "20 kinds of component", "237 screenshots, saved"],
        ["From the shelf", "Five products, five different looks"],
      ],
      voice: "Now the redesign, with proof.", vee: "wink",
    },
    {
      id: "t6", to: 7, title: ["HOW I", "CHECKED"], size: 150, promise: "Tests, then the live site.",
      facts: [
        ["Where", "The terminal, then carbuying.v2stack.com"],
        ["Watch for", '<span class="y">293</span> tests passing', "and the two things the live site showed"],
        ["From the shelf", "Compass shipped with 200+ automated tests"],
      ],
      voice: "How do I know it works? I tested it.", vee: "focus",
    },
    {
      id: "t7", to: 8, title: ["ON THE", "SHELF"], size: 150, promise: "Five shipped. Now there are six.",
      facts: [
        ["Where", "v2stack.com/projects"],
        ["Watch for", "No. 6 joins the row", "Tactly to Kurae, then Deal Desk"],
        ["Next", "Subscribe, and the next one is No. 7"],
      ],
      voice: "And now, number six goes on the shelf.", vee: "wow",
    },
  ];

  for (const c of TR) {
    CARDS.push({
      id: c.id,
      name: `Transition to chapter ${c.to + 1}: ${CHAPTERS[c.to]}`,
      dur: 4200,
      voice: c.voice,
      build() {
        const longest = c.title.reduce((a, b) => (b.length > a.length ? b : a), "").length;
        layer.innerHTML = `
          <div class="tr">
            ${logoBlock}${badge(6, 6)}
            <div class="kicker pix">Chapter ${String(c.to + 1).padStart(2, "0")} of 09</div>
            <div class="ttl pix" id="ttl" style="font-size:${c.size}px"><div id="l1">&nbsp;</div><div id="l2">&nbsp;</div></div>
            <div class="promise" id="prom">${c.promise}</div>
            <div class="facts">${c.facts.map((f, i) => `<div class="fact" id="f${i}"><div class="k">${f[0]}</div><div class="v">${f[1]}${f[2] ? `<small>${f[2]}</small>` : ""}</div></div>`).join("")}</div>
            ${road(c.to - 1)}
          </div>`;
        vee.S = 5;
        vee.moveTo(postX(c.to - 1), 850, { snap: true });
        wipe(false, 520);
        at(120, () => vee.mood("idle"));
        at(380, () => typeInto(document.getElementById("l1"), c.title[0], 16, () => typeInto(document.getElementById("l2"), c.title[1], 16)));
        at(1250, () => document.getElementById("prom").classList.add("on"));
        c.facts.forEach((_, i) => at(900 + i * 480, () => document.getElementById("f" + i).classList.add("on")));
        // Vee drives from one post to the next along the road
        at(1500, () => vee.moveTo(postX(c.to), 850).mood("idle"));
        at(2350, () => {
          document.querySelectorAll(".post").forEach((p, i) => {
            p.classList.toggle("done", i < c.to);
            p.classList.toggle("cur", i === c.to);
          });
          vee.mood(c.vee, 1400).hop(0.8);
          vee.sparkle(postX(c.to), 800, 8);
        });
        at(3600, () => endWipe( 560));
        void longest;
      },
    });
  }

  CARDS.push({
    id: "shelf",
    name: "The shelf: No. 6 joins the row",
    dur: 8000,
    voice: "Five products shipped, each live, each with a walkthrough here. Deal Desk is number six.",
    build() {
      const tiles = [
        ["NO. 1", "TACTLY", "July 2026"],
        ["NO. 2", "VERDICT", "August 2026"],
        ["NO. 3", "COMPASS", "August 2026"],
        ["NO. 4", "AGENT FOUNDRY", "September 2026"],
        ["NO. 5", "KURAE", "November 2026"],
        ["NO. 6", "DEAL DESK", "November 2026"],
      ];
      layer.innerHTML = `
        <div class="shelf">
          ${logoBlock}${badge(5, 6)}
          <div class="head"><div class="pix" id="h1"></div><p id="hp"></p></div>
          <div class="tiles">${tiles.map((t, i) => `<div class="tile ${i === 5 ? "new" : ""}" id="t${i}"><div class="n pix">${t[0]}</div><div class="nm">${t[1]}</div><div class="st">${t[2]}</div></div>`).join("")}</div>
        </div>`;
      vee.S = 6;
      vee.moveTo(1500, 330, { snap: true });
      wipe(false, 520);
      at(300, () => typeInto(document.getElementById("h1"), "FIVE SHIPPED.", 14));
      for (let i = 0; i < 5; i++) at(900 + i * 420, () => document.getElementById("t" + i).classList.add("on"));
      at(3300, () => {
        document.getElementById("hp").textContent = "Every one is live, and every one has a walkthrough.";
        vee.moveTo(1630, 400).mood("focus");
      });
      at(4600, () => typeInto(document.getElementById("h1"), "THIS IS NO. 6.", 14));
      at(5200, () => {
        document.getElementById("odoi").style.transform = "translateY(-40px)";
        document.getElementById("t5").classList.add("on");
        vee.celebrate();
        vee.sparkle(1650, 650, 18);
      });
      at(7400, () => endWipe( 560));
    },
  });

  CARDS.push({
    id: "end",
    name: "End card (with end-screen slots)",
    dur: 18000,
    voice: "That was number six in V2Stack, where one real product ships every week. Subscribe to follow along, and if you want one built for your business, the email is on screen.",
    build() {
      layer.innerHTML = `
        <div class="end">
          ${logoBlock}${badge(6, 6)}
          <div class="big pix" id="e1"></div>
          <div class="ask" id="eask">Want one built for your business? Send a short note.</div>
          <div class="mail" id="email">expensemanagementvj@gmail.com</div>
          <div class="site">carbuying.v2stack.com</div>
          <div class="credit">The 3D car on the Deal Desk home page is a CC0 model by Kenney (kenney.nl). Estimates from the numbers you enter. Not financial or legal advice.</div>
          <div class="slot a">Video slot<br>(No. 5 Kurae)</div>
          <div class="slot b">Video slot<br>(No. 4 AgentFoundry)</div>
          <div class="slot c">Subscribe</div>
        </div>`;
      for (const id of ["eask", "email"]) document.getElementById(id).style.opacity = 0;
      vee.S = 7;
      vee.moveTo(930, 640, { snap: true });
      vee.canvas.style.zIndex = 6;
      wipe(false, 520);
      at(300, () => typeInto(document.getElementById("e1"), "THAT WAS NO. 6", 12));
      at(2400, () => {
        const a = document.getElementById("eask");
        a.style.transition = "opacity .4s";
        a.style.opacity = 1;
      });
      at(4800, () => {
        const m = document.getElementById("email");
        m.style.transition = "opacity .4s";
        m.style.opacity = 1;
        vee.lookAt(300, 800, 3000).mood("happy", 1200).hop(0.8);
      });
      at(9000, () => vee.say("SEE YOU IN NO. 7!", { ms: 4000, side: "left" }).mood("wink", 1200));
      at(13000, () => vee.celebrate());
      at(17000, () => endWipe( 800));
    },
  });

  /* ---------- the player ---------- */
  function stop() {
    token++;
    timers.forEach(clearTimeout);
    timers = [];
    vee.say("");
    vee.exit && (vee._allowOff = false);
  }
  function play(id) {
    const card = CARDS.find((c) => c.id === id);
    if (!card) return;
    stop();
    wx.clearRect(0, 0, 1920, 1080);
    vee.mood("idle");
    card.build();
    current = id;
    setNow(card);
  }
  let current = null;
  async function playAll() {
    for (const c of CARDS) {
      play(c.id);
      await new Promise((r) => setTimeout(r, c.dur + 400));
    }
  }

  /* ---------- the panel ---------- */
  const list = document.getElementById("list");
  const total = CARDS.reduce((a, c) => a + c.dur, 0);
  document.getElementById("total").textContent = `${(total / 1000).toFixed(1)} s of cards in all`;
  CARDS.forEach((c, i) => {
    const row = el(`<div class="row"><div><b>${i + 1}. ${c.name}</b><small>${(c.dur / 1000).toFixed(1)} s. Voice: ${c.voice}</small></div><button data-id="${c.id}">Play</button></div>`);
    row.querySelector("button").addEventListener("click", () => play(c.id));
    list.appendChild(row);
  });
  document.getElementById("all").addEventListener("click", playAll);
  document.getElementById("fs").addEventListener("click", () => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen());
  function setNow(card) {
    const n = document.getElementById("now");
    if (n) n.textContent = `${card.name} (${(card.dur / 1000).toFixed(1)} s)`;
  }
  window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") current && play(current);
    if (e.key === "f" || e.key === "F") document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= CARDS.length) play(CARDS[n - 1].id);
  });

  window.kit = { CARDS, play, playAll, vee, stop };

  const ready = document.fonts ? Promise.all([document.fonts.load('700 100px Silk'), document.fonts.load('400 30px Silk'), document.fonts.load('700 40px Atk'), document.fonts.load('400 24px Atk')]) : Promise.resolve();
  ready.finally(() => {
    fit();
    const first = params.get("card");
    if (first) play(first);
  });
})();
