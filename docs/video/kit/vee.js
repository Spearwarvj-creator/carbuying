/*
 * Vee: the pixel hover-car mascot for Deal Desk (V2Stack No. 6).
 *
 * One file, no assets, no dependencies. It draws on a canvas, so it works on any page (even one with a strict
 * Content Security Policy) and in the video cards. Two ways to use it:
 *
 *   Overlay on a live page (what you record the product with):
 *     document.head.append(Object.assign(document.createElement("script"), { src: "http://localhost:8765/vee.js" }));
 *     // then:  vee = Vee.overlay();  vee.goTo({ text: "$603" }, { point: true }); vee.say("603 A MONTH");
 *
 *   Inside a card (the stage in index.html does this): new Vee({ container: stage, logicalW: 1920, logicalH: 1080 }).
 *
 * Why a canvas and a hand-made 5x7 pixel font: the bubble text must look the same on every page and must not depend on a
 * font file that the page's security rules could block.
 */
(function (root) {
  "use strict";

  /* ------------------------------------------------------------------ palette (V2Stack terracotta + cream) */
  const PAL = {
    ink: "#1a1a1a",
    body: "#c44d2d",
    hi: "#e87a58",
    lo: "#8f3219",
    glass: "#2b211d",
    white: "#f5f3ec",
    pupil: "#1a1a1a",
    light: "#ffd65a",
    lightLo: "#c99a1e",
    blush: "#f4a08f",
    chrome: "#d6cfc3",
    chromeLo: "#8d867c",
    teal: "#5ee6d0",
    tealMid: "#2fbfae",
    tealLo: "#1b7f73",
    stamp: "#e24a2b",
  };

  /* ------------------------------------------------------------------ 5x7 bitmap font */
  const G = {};
  const def = (ch, rows) => (G[ch] = rows);
  def(" ", [".....", ".....", ".....", ".....", ".....", ".....", "....."]);
  def("A", [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"]);
  def("B", ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."]);
  def("C", [".####", "#....", "#....", "#....", "#....", "#....", ".####"]);
  def("D", ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."]);
  def("E", ["#####", "#....", "#....", "####.", "#....", "#....", "#####"]);
  def("F", ["#####", "#....", "#....", "####.", "#....", "#....", "#...."]);
  def("G", [".####", "#....", "#....", "#.###", "#...#", "#...#", ".###."]);
  def("H", ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"]);
  def("I", ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"]);
  def("J", ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."]);
  def("K", ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"]);
  def("L", ["#....", "#....", "#....", "#....", "#....", "#....", "#####"]);
  def("M", ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"]);
  def("N", ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"]);
  def("O", [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."]);
  def("P", ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."]);
  def("Q", [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"]);
  def("R", ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"]);
  def("S", [".####", "#....", "#....", ".###.", "....#", "....#", "####."]);
  def("T", ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."]);
  def("U", ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."]);
  def("V", ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."]);
  def("W", ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"]);
  def("X", ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"]);
  def("Y", ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."]);
  def("Z", ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"]);
  def("0", [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."]);
  def("1", ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."]);
  def("2", [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"]);
  def("3", ["####.", "....#", "....#", ".###.", "....#", "....#", "####."]);
  def("4", ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."]);
  def("5", ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."]);
  def("6", [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."]);
  def("7", ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."]);
  def("8", [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."]);
  def("9", [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."]);
  def(".", [".....", ".....", ".....", ".....", ".....", ".##..", ".##.."]);
  def(",", [".....", ".....", ".....", ".....", "..#..", "..#..", ".#..."]);
  def("!", ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."]);
  def("?", [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."]);
  def(":", [".....", "..#..", ".....", ".....", "..#..", ".....", "....."]);
  def("'", ["..#..", "..#..", ".....", ".....", ".....", ".....", "....."]);
  def("-", [".....", ".....", ".....", "#####", ".....", ".....", "....."]);
  def("+", [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."]);
  def("=", [".....", ".....", "#####", ".....", "#####", ".....", "....."]);
  def("$", ["..#..", ".####", "#.#..", ".###.", "..#.#", "####.", "..#.."]);
  def("%", ["##..#", "##..#", "...#.", "..#..", ".#...", "#..##", "#..##"]);
  def("/", ["....#", "....#", "...#.", "..#..", ".#...", "#....", "#...."]);
  def("(", ["...#.", "..#..", ".#...", ".#...", ".#...", "..#..", "...#."]);
  def(")", [".#...", "..#..", "...#.", "...#.", "...#.", "..#..", ".#..."]);
  def(">", ["#....", ".#...", "..#..", "...#.", "..#..", ".#...", "#...."]);
  def("<", ["...#.", "..#..", ".#...", "#....", ".#...", "..#..", "...#."]);
  def("*", [".....", "#.#.#", ".###.", "#####", ".###.", "#.#.#", "....."]);
  def("~", [".....", "....#", "...#.", "#.#..", ".#...", ".....", "....."]); // a check mark

  const GLYPH_W = 5;
  const GLYPH_H = 7;
  const ADV = 6; // glyph + one pixel of space

  function measure(str, s) {
    return str.length ? (str.length * ADV - 1) * s : 0;
  }
  function drawText(ctx, str, x, y, s, color) {
    ctx.fillStyle = color;
    let cx = x;
    for (const raw of str) {
      const g = G[raw.toUpperCase()] || G["?"];
      for (let r = 0; r < GLYPH_H; r++) for (let c = 0; c < GLYPH_W; c++) if (g[r][c] === "#") ctx.fillRect(cx + c * s, y + r * s, s, s);
      cx += ADV * s;
    }
  }
  function wrap(str, max) {
    const words = String(str).split(/\s+/);
    const lines = [];
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > max && line) {
        lines.push(line);
        line = w;
      } else line = (line + " " + w).trim();
    }
    if (line) lines.push(line);
    return lines;
  }

  /* ------------------------------------------------------------------ sprite */
  const SW = 28;
  const SH = 30;
  // Silhouette of the body, row by row: [first x, last x]. Roof at the top, bumper at the bottom.
  const SIL = {};
  SIL[3] = [9, 18];
  SIL[4] = [7, 20];
  SIL[5] = [6, 21];
  SIL[6] = [5, 22];
  for (let y = 7; y <= 14; y++) SIL[y] = [4, 23];
  for (let y = 15; y <= 21; y++) SIL[y] = [3, 24];
  SIL[22] = [5, 22];

  const MOODS = {
    idle: { eyes: "open", brow: "flat", mouth: "smile", blush: false, px: 0, py: 0 },
    happy: { eyes: "happy", brow: "none", mouth: "big", blush: true, px: 0, py: 0, ears: true },
    wow: { eyes: "wide", brow: "none", mouth: "o", blush: false, px: 0, py: 0, bright: true },
    think: { eyes: "open", brow: "tilt", mouth: "flat", blush: false, px: 1, py: -1 },
    oops: { eyes: "open", brow: "sad", mouth: "sad", blush: false, px: 0, py: 1 },
    sleepy: { eyes: "half", brow: "none", mouth: "flat", blush: false, px: 0, py: 1 },
    wink: { eyes: "wink", brow: "none", mouth: "smile", blush: true, px: 0, py: 0 },
    focus: { eyes: "open", brow: "mad", mouth: "flat", blush: false, px: 0, py: 0 },
  };

  const spriteCache = new Map();

  function buildSprite(face) {
    const key = JSON.stringify(face);
    if (spriteCache.has(key)) return spriteCache.get(key);
    const grid = new Array(SW * SH).fill(null);
    const set = (x, y, c) => {
      if (x >= 0 && x < SW && y >= 0 && y < SH) grid[y * SW + x] = c;
    };
    const get = (x, y) => (x >= 0 && x < SW && y >= 0 && y < SH ? grid[y * SW + x] : null);
    const rect = (x, y, w, h, c) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c);
    };

    // 1. solid parts (these decide the outline)
    for (const y in SIL) for (let x = SIL[y][0]; x <= SIL[y][1]; x++) set(x, +y, "B");
    const ey = face.ears ? face.earY || 0 : 0;
    rect(1, 8 + ey, 3, 3, "B");
    rect(24, 8 + ey, 3, 3, "B");
    rect(7, 23, 4, 2, "P");
    rect(17, 23, 4, 2, "P");
    // tyres, folded out to the sides while it hovers
    rect(1, 18, 2, 5, "X");
    rect(25, 18, 2, 5, "X");
    const ax = face.antenna || 0;
    rect(13 + ax, 0, 2, 2, "T");
    rect(13 + ax, 2, 2, 1, "A");
    if (ax) rect(13, 2, 2, 1, "A");

    // 2. shade the body: light from the top left
    const solid = (x, y) => get(x, y) !== null;
    const shaded = grid.slice();
    for (let y = 0; y < SH; y++)
      for (let x = 0; x < SW; x++) {
        if (grid[y * SW + x] !== "B") continue;
        if (!solid(x, y - 1)) shaded[y * SW + x] = "H";
        else if (!solid(x, y + 1) || !solid(x + 1, y)) shaded[y * SW + x] = "L";
      }
    for (let i = 0; i < grid.length; i++) grid[i] = shaded[i];

    // 3. outline: every empty pixel next to a solid one
    const outline = [];
    for (let y = 0; y < SH; y++)
      for (let x = 0; x < SW; x++)
        if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) outline.push([x, y]);
    for (const [x, y] of outline) set(x, y, "I");

    // 4. the windshield, which is the face
    rect(6, 6, 16, 8, "G");
    for (const [x, y] of [[6, 6], [21, 6], [6, 13], [21, 13]]) set(x, y, shaded[y * SW + x] || "B");
    const eye = (ex, wide) => {
      const top = wide ? 6 : 7;
      const h = wide ? 7 : 6;
      if (face.eyes === "happy" || (face.eyes === "wink" && ex === 15)) {
        const arc = [[0, 4], [1, 3], [2, 2], [3, 3], [4, 4]];
        for (const [dx, dy] of arc) {
          set(ex + dx, 7 + dy, "W");
          set(ex + dx, 8 + dy, "W");
        }
        return;
      }
      if (face.eyes === "blink") {
        rect(ex, 10, 5, 1, "W");
        return;
      }
      if (face.eyes === "half") {
        rect(ex, 10, 5, 3, "W");
        rect(ex + 1, 11, 3, 2, "U");
        return;
      }
      rect(ex, top, 5, h, "W");
      set(ex, top, "G");
      set(ex + 4, top, "G");
      set(ex, top + h - 1, "G");
      set(ex + 4, top + h - 1, "G");
      if (wide) {
        rect(ex + 2, 9, 2, 2, "U");
      } else {
        const px = ex + 1 + face.px;
        const py = 8 + face.py;
        rect(px, py, 3, 4, "U");
        set(px, py, "W"); // the little shine that makes the eye look alive
      }
    };
    eye(8, face.eyes === "wide");
    eye(15, face.eyes === "wide");

    const brow = (pts) => pts.forEach(([x, y]) => set(x, y, "C"));
    if (face.brow === "flat") {
      brow([[8, 6], [9, 6], [10, 6], [11, 6], [16, 6], [17, 6], [18, 6], [19, 6]]);
    } else if (face.brow === "sad") {
      brow([[8, 7], [9, 7], [10, 6], [11, 6], [16, 6], [17, 6], [18, 7], [19, 7]]);
    } else if (face.brow === "mad") {
      brow([[8, 6], [9, 6], [10, 7], [11, 7], [16, 7], [17, 7], [18, 6], [19, 6]]);
    } else if (face.brow === "tilt") {
      brow([[8, 6], [9, 6], [10, 6], [11, 6], [16, 7], [17, 7], [18, 7], [19, 7]]);
    }

    // 5. cheeks, hood mark, lights, mouth, bumper
    if (face.blush) for (const [x, y] of [[5, 14], [6, 14], [21, 14], [22, 14]]) set(x, y, "K");
    for (const [x, y] of [[11, 14], [16, 14], [12, 15], [15, 15], [13, 16], [14, 16]]) set(x, y, "W");
    // tyre hubs
    set(1, 20, "C");
    set(26, 20, "C");
    const lamp = (x0) => {
      const c = "Y";
      rect(x0 + 1, 15, 2, 1, c);
      rect(x0, 16, 4, 2, c);
      rect(x0 + 1, 18, 2, 1, c);
      set(x0 + 1, 16, "W");
      if (face.bright) {
        set(x0 + 2, 16, "W");
        set(x0 + 1, 17, "W");
        set(x0 + 2, 17, "W");
      }
    };
    lamp(4);
    lamp(20);
    rect(9, 17, 10, 4, "G");
    const m = (pts) => pts.forEach(([x, y]) => set(x, y, "W"));
    if (face.mouth === "smile") m([[10, 18], [17, 18], [11, 19], [12, 19], [13, 19], [14, 19], [15, 19], [16, 19]]);
    else if (face.mouth === "flat") m([[11, 19], [12, 19], [13, 19], [14, 19], [15, 19], [16, 19]]);
    else if (face.mouth === "sad") m([[10, 19], [17, 19], [11, 18], [12, 18], [13, 18], [14, 18], [15, 18], [16, 18]]);
    else if (face.mouth === "big") {
      rect(11, 18, 6, 2, "W");
      set(13, 19, "K");
      set(14, 19, "K");
    } else if (face.mouth === "o") {
      rect(12, 18, 4, 3, "W");
      rect(13, 19, 2, 1, "G");
    }
    rect(3, 21, 22, 1, "C");
    rect(5, 22, 18, 1, "Q");

    // 6. thruster flame: three frames, a little longer when the car is moving
    const f = face.flame || 0;
    const len = (face.fast ? 4 : 2) + f;
    for (const x0 of [8, 18]) {
      for (let i = 0; i < len; i++) {
        const y = 25 + i;
        if (y >= SH) break;
        const color = i === 0 ? "W" : i < len - 1 ? "T" : "N";
        const w = i < len - 1 ? 2 : 1;
        rect(x0 + (w === 1 ? ((f + i) % 2) : 0), y, w, 1, color);
      }
    }

    const map = {
      B: PAL.body, H: PAL.hi, L: PAL.lo, I: PAL.ink, G: PAL.glass, W: PAL.white, U: PAL.pupil, K: PAL.blush, C: PAL.chrome, Q: PAL.chromeLo,
      P: PAL.chromeLo, T: PAL.teal, N: PAL.tealMid, A: PAL.chromeLo, Y: PAL.light, Z: PAL.lightLo, X: "#3a3430",
    };
    // the eyebrows and the antenna ball use fixed colours
    const cv = document.createElement("canvas");
    cv.width = SW;
    cv.height = SH;
    const cx = cv.getContext("2d");
    for (let y = 0; y < SH; y++)
      for (let x = 0; x < SW; x++) {
        const k = grid[y * SW + x];
        if (!k) continue;
        cx.fillStyle = map[k] || PAL.ink;
        cx.fillRect(x, y, 1, 1);
      }
    spriteCache.set(key, cv);
    return cv;
  }

  /* ------------------------------------------------------------------ small helpers */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  /* ------------------------------------------------------------------ the engine */
  class Vee {
    constructor(opts) {
      this.o = Object.assign({ scale: 5, container: document.body, fixed: true, logicalW: 0, logicalH: 0, z: 2147483000, look: true, bob: true, x: null, y: null }, opts || {});
      const c = (this.canvas = document.createElement("canvas"));
      c.setAttribute("data-vee", "");
      c.style.cssText = `position:${this.o.fixed ? "fixed" : "absolute"};left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:${this.o.z};image-rendering:pixelated;`;
      this.o.container.appendChild(c);
      this.ctx = c.getContext("2d");
      // on a live page the car is sized to the screen (about 6 pixels per art pixel at 1920 wide); in a card the size is set by the card
      this.S = opts && opts.scale ? this.o.scale : this.o.fixed ? clamp(Math.round(window.innerWidth / 330), 3, 7) : this.o.scale;
      this.W = 0;
      this.H = 0;
      this.k = 1;
      this.x = 0;
      this.y = 0;
      this.tx = 0;
      this.ty = 0;
      this.vx = 0;
      this.vy = 0;
      this.t = 0;
      this.last = performance.now();
      this.moodName = "idle";
      this.moodUntil = 0;
      this.blinkAt = 2;
      this.blinkEnd = 0;
      this.squash = 0;
      this.squashV = 0;
      this.look = null;
      this.mouse = null;
      this.mouseAt = -99;
      this.bubble = null;
      this.parts = [];
      this.rings = [];
      this.beams = [];
      this.stamps = [];
      this.hidden = false;
      this.alpha = 1;
      this.trailAt = 0;
      this.scheduled = [];
      this.resize();
      const start = this.o.x === null ? [this.W * 0.82, this.H * 0.72] : [this.o.x, this.o.y];
      this.x = this.tx = start[0];
      this.y = this.ty = start[1];
      this._onResize = () => this.resize();
      this._onMove = (e) => {
        const r = c.getBoundingClientRect();
        this.mouse = { x: ((e.clientX - r.left) * this.W) / r.width, y: ((e.clientY - r.top) * this.H) / r.height };
        this.mouseAt = this.t;
      };
      window.addEventListener("resize", this._onResize);
      document.addEventListener("mousemove", this._onMove, { passive: true });
      this._raf = requestAnimationFrame((n) => this._frame(n));
    }

    resize() {
      const r = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.W = this.o.logicalW || r.width || window.innerWidth;
      this.H = this.o.logicalH || r.height || window.innerHeight;
      this.k = ((r.width || this.W) / this.W) * dpr;
      this.canvas.width = Math.round(this.W * this.k);
      this.canvas.height = Math.round(this.H * this.k);
    }

    destroy() {
      cancelAnimationFrame(this._raf);
      window.removeEventListener("resize", this._onResize);
      document.removeEventListener("mousemove", this._onMove);
      this.canvas.remove();
    }

    /* ---------- where things are */
    rectOf(target) {
      if (!target) return null;
      if (target.getBoundingClientRect) return this._toLogical(target.getBoundingClientRect());
      if (typeof target === "string") {
        const el = document.querySelector(target);
        return el ? this._toLogical(el.getBoundingClientRect()) : null;
      }
      if (target.text) {
        const el = findByText(target.text, target.within);
        return el ? this._toLogical(el.getBoundingClientRect()) : null;
      }
      if (target.w !== undefined) return { x: target.x, y: target.y, w: target.w, h: target.h };
      if (target.x !== undefined) return { x: target.x, y: target.y, w: 0, h: 0 };
      return null;
    }
    _toLogical(r) {
      const c = this.canvas.getBoundingClientRect();
      const sx = this.W / c.width;
      const sy = this.H / c.height;
      return { x: (r.left - c.left) * sx, y: (r.top - c.top) * sy, w: r.width * sx, h: r.height * sy };
    }

    /* ---------- movement */
    moveTo(x, y, opts) {
      const o = opts || {};
      this.tx = clamp(x, 70, this.W - 70);
      this.ty = clamp(y, 90, this.H - 100);
      if (o.snap) {
        this.x = this.tx;
        this.y = this.ty;
        this.vx = this.vy = 0;
      }
      return this;
    }

    /**
     * Fly next to something on the page. side: "left", "right", "above", "below" or "auto" (the roomiest side).
     * point: turn the headlights on it, draw a ring around it and look at it.
     */
    goTo(target, opts) {
      const o = Object.assign({ side: "auto", gap: 34, point: false, ring: 2200, say: null }, opts || {});
      const r = this.rectOf(target);
      if (!r) return this;
      const halfW = 14 * this.S;
      const halfH = 15 * this.S;
      const room = { left: r.x, right: this.W - (r.x + r.w), above: r.y, below: this.H - (r.y + r.h) };
      let side = o.side;
      if (side === "auto") side = room.above > 190 ? "above" : room.right > room.left ? "right" : "left";
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      const pos = {
        above: [cx, r.y - o.gap - halfH],
        below: [cx, r.y + r.h + o.gap + halfH],
        left: [r.x - o.gap - halfW, cy],
        right: [r.x + r.w + o.gap + halfW, cy],
      }[side];
      this.moveTo(pos[0], pos[1]);
      if (o.point) {
        this.lookAt(cx, cy, 2600);
        this.beamTo(r, 1800);
        if (o.ring) this.ring(r, o.ring);
      }
      if (o.say) this.say(o.say);
      return this;
    }

    hop(power) {
      this.squashV = -(power || 1) * 7;
      this.vy -= 420 * (power || 1);
      return this;
    }

    /* ---------- face */
    mood(name, ms) {
      if (!MOODS[name]) return this;
      this.moodName = name;
      this.moodUntil = ms ? this.t + ms / 1000 : 0;
      return this;
    }
    lookAt(x, y, ms) {
      this.look = { x, y, until: ms ? this.t + ms / 1000 : 0 };
      return this;
    }
    celebrate() {
      this.mood("happy", 1800).hop(1.2);
      this.sparkle(this.x, this.y - 40, 14);
      return this;
    }
    oops() {
      this.mood("oops", 2200);
      this.puff(this.x + 60, this.y - 60, "?", PAL.white, 3);
      return this;
    }
    think(ms) {
      this.mood("think", ms || 2400);
      this._thinkUntil = this.t + (ms || 2400) / 1000;
      return this;
    }
    wow() {
      this.mood("wow", 1500).hop(0.7);
      this.puff(this.x + 70, this.y - 70, "!", PAL.light, 4);
      return this;
    }

    /* ---------- speech */
    say(text, opts) {
      if (!text) {
        this.bubble = null;
        return this;
      }
      const o = Object.assign({ ms: 0, cps: 38, max: 22, side: "right" }, opts || {});
      const lines = wrap(String(text).toUpperCase(), o.max);
      this.bubble = { side: o.side, lines, shown: 0, total: lines.join("").length, born: this.t, cps: o.cps, until: o.ms ? this.t + o.ms / 1000 + lines.join("").length / o.cps : 0 };
      return this;
    }

    /* ---------- effects */
    sparkle(x, y, n) {
      for (let i = 0; i < (n || 10); i++) {
        const a = rnd(0, Math.PI * 2);
        const sp = rnd(80, 260);
        this.parts.push({ kind: "spark", x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: rnd(0.5, 1.1), age: 0, c: [PAL.teal, PAL.light, PAL.white][i % 3] });
      }
      return this;
    }
    puff(x, y, glyph, color, size) {
      this.parts.push({ kind: "glyph", x, y, vx: 0, vy: -40, life: 1.1, age: 0, g: glyph, c: color || PAL.white, s: size || 3 });
      return this;
    }
    ring(target, ms) {
      const r = this.rectOf(target);
      if (r) this.rings.push({ r, until: this.t + (ms || 2000) / 1000, born: this.t });
      return this;
    }
    beamTo(target, ms) {
      const r = this.rectOf(target);
      if (r) this.beams.push({ r, until: this.t + (ms || 1500) / 1000, born: this.t });
      return this;
    }
    /** A big pixel stamp, for a moment like "the guard threw that answer away". */
    stamp(text, x, y, color) {
      this.stamps.push({ text: String(text).toUpperCase(), x: x === undefined ? this.W / 2 : x, y: y === undefined ? this.H / 2 : y, born: this.t, life: 2.4, c: color || PAL.stamp });
      return this;
    }
    enter(from) {
      const f = from || "left";
      const dest = [this.tx, this.ty];
      this.hidden = false;
      this.x = f === "left" ? -120 : f === "right" ? this.W + 120 : dest[0];
      this.y = f === "top" ? -120 : f === "bottom" ? this.H + 120 : dest[1];
      this.vx = this.vy = 0;
      return this;
    }
    exit(to) {
      const t = to || "right";
      this.tx = t === "left" ? -200 : t === "right" ? this.W + 200 : this.tx;
      this.ty = t === "top" ? -200 : t === "bottom" ? this.H + 200 : this.ty;
      this._allowOff = true;
      return this;
    }
    after(ms, fn) {
      this.scheduled.push({ at: this.t + ms / 1000, fn });
      return this;
    }

    /* ---------- the loop */
    _frame(now) {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.t += dt;
      this._update(dt);
      this._draw();
      this._raf = requestAnimationFrame((n) => this._frame(n));
    }

    _update(dt) {
      for (let i = this.scheduled.length - 1; i >= 0; i--)
        if (this.t >= this.scheduled[i].at) {
          const s = this.scheduled.splice(i, 1)[0];
          s.fn(this);
        }
      // spring toward the target: soft and slightly bouncy, like it is floating
      const k = 38;
      const c = 9.5;
      this.vx += ((this.tx - this.x) * k - this.vx * c) * dt;
      this.vy += ((this.ty - this.y) * k - this.vy * c) * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.squashV += (-this.squash * 90 - this.squashV * 9) * dt;
      this.squash += this.squashV * dt;
      const speed = Math.hypot(this.vx, this.vy);
      this.fast = speed > 260;
      if (this.fast && this.t - this.trailAt > 0.045) {
        this.trailAt = this.t;
        this.parts.push({ kind: "dot", x: this.x - this.vx * 0.02, y: this.y + 13 * this.S, vx: -this.vx * 0.05, vy: rnd(10, 40), life: 0.5, age: 0, c: PAL.tealMid, s: this.S });
      }
      if (this.moodUntil && this.t > this.moodUntil) {
        this.moodName = "idle";
        this.moodUntil = 0;
      }
      if (this.look && this.look.until && this.t > this.look.until) this.look = null;
      if (this.t > this.blinkAt) {
        this.blinkEnd = this.t + 0.13;
        this.blinkAt = this.t + rnd(2.2, 5);
      }
      if (this.bubble) {
        const b = this.bubble;
        b.shown = Math.min(b.total, Math.floor((this.t - b.born) * b.cps));
        if (b.until && this.t > b.until) this.bubble = null;
      }
      for (const p of this.parts) {
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.kind === "spark") p.vy += 260 * dt;
      }
      this.parts = this.parts.filter((p) => p.age < p.life);
      this.rings = this.rings.filter((r) => this.t < r.until);
      this.beams = this.beams.filter((b) => this.t < b.until);
      this.stamps = this.stamps.filter((s) => this.t - s.born < s.life);
      if (this.moodName === "sleepy" && Math.random() < dt * 0.7) this.puff(this.x + 50, this.y - 50, "Z", PAL.white, 3);
      if (this._thinkUntil && this.t < this._thinkUntil && Math.random() < dt * 1.5) this.puff(this.x + 74, this.y - 78, ".", PAL.white, 4);
    }

    _face() {
      const m = MOODS[this.moodName] || MOODS.idle;
      const face = Object.assign({}, m);
      // the eyes follow the pointer, or whatever it was told to look at
      let tx = null;
      let ty = null;
      if (this.look) {
        tx = this.look.x;
        ty = this.look.y;
      } else if (this.o.look && this.mouse && this.t - this.mouseAt < 5) {
        tx = this.mouse.x;
        ty = this.mouse.y;
      }
      if (tx !== null && (this.moodName === "idle" || this.moodName === "focus")) {
        face.px = clamp(Math.round((tx - this.x) / 140), -1, 1);
        face.py = clamp(Math.round((ty - this.y) / 140), -1, 1);
      }
      if (this.t < this.blinkEnd && (face.eyes === "open" || face.eyes === "wide")) face.eyes = "blink";
      const step = Math.floor(this.t * 10);
      face.flame = step % 3;
      face.fast = this.fast;
      if (m.ears) face.earY = step % 2 ? 1 : 0;
      if (this.moodName === "happy") face.antenna = step % 2 ? 1 : -1;
      return face;
    }

    _draw() {
      const ctx = this.ctx;
      const S = this.S;
      ctx.setTransform(this.k, 0, 0, this.k, 0, 0);
      ctx.clearRect(0, 0, this.W, this.H);
      ctx.imageSmoothingEnabled = false;

      // beams and rings sit under the car
      for (const b of this.beams) this._drawBeam(ctx, b);
      for (const r of this.rings) this._drawRing(ctx, r);

      if (!this.hidden) {
        const bob = this.o.bob ? Math.round((Math.sin(this.t * 2.3) * S * 1.2) / (S / 2)) * (S / 2) : 0;
        const lean = clamp(this.vx * 0.012, -9, 9);
        const px = Math.round(this.x);
        const py = Math.round(this.y + bob);
        // glow under the thrusters
        const g = ctx.createRadialGradient(px, py + 17 * S, 2, px, py + 17 * S, 13 * S);
        g.addColorStop(0, "rgba(94,230,208,0.26)");
        g.addColorStop(1, "rgba(94,230,208,0)");
        ctx.fillStyle = g;
        ctx.fillRect(px - 14 * S, py + 3 * S, 28 * S, 28 * S);
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((lean * Math.PI) / 180);
        ctx.scale(1 - this.squash * 0.05, 1 + this.squash * 0.05);
        const sprite = buildSprite(this._face());
        ctx.drawImage(sprite, (-SW * S) / 2, (-SH * S) / 2 + 1.5 * S, SW * S, SH * S);
        ctx.restore();
        if (this.bubble) this._drawBubble(ctx, px, py);
      }
      for (const p of this.parts) this._drawPart(ctx, p);
      for (const s of this.stamps) this._drawStamp(ctx, s);
    }

    _drawPart(ctx, p) {
      const a = 1 - p.age / p.life;
      ctx.globalAlpha = clamp(a * 1.4, 0, 1);
      if (p.kind === "spark") {
        const s = Math.max(2, Math.round(this.S * 0.8 * a));
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.round(p.x) - s, Math.round(p.y), s * 3, s);
        ctx.fillRect(Math.round(p.x), Math.round(p.y) - s, s, s * 3);
      } else if (p.kind === "dot") {
        ctx.fillStyle = p.c;
        const s = Math.max(2, Math.round(p.s * a));
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
      } else if (p.kind === "glyph") {
        drawText(ctx, p.g, Math.round(p.x), Math.round(p.y), p.s, p.c);
      }
      ctx.globalAlpha = 1;
    }

    _drawRing(ctx, r) {
      const age = this.t - r.born;
      const left = r.until - this.t;
      ctx.globalAlpha = clamp(Math.min(age * 5, left * 3), 0, 1);
      const pad = 10 + Math.sin(this.t * 6) * 2;
      const x = Math.round(r.r.x - pad);
      const y = Math.round(r.r.y - pad);
      const w = Math.round(r.r.w + pad * 2);
      const h = Math.round(r.r.h + pad * 2);
      const t = 4;
      ctx.fillStyle = PAL.teal;
      const dash = 14;
      const off = Math.floor(this.t * 40) % (dash * 2);
      for (let i = -off; i < w; i += dash * 2) {
        const a = Math.max(0, i);
        const b = Math.min(w, i + dash);
        if (b > a) {
          ctx.fillRect(x + a, y, b - a, t);
          ctx.fillRect(x + a, y + h - t, b - a, t);
        }
      }
      for (let i = -off; i < h; i += dash * 2) {
        const a = Math.max(0, i);
        const b = Math.min(h, i + dash);
        if (b > a) {
          ctx.fillRect(x, y + a, t, b - a);
          ctx.fillRect(x + w - t, y + a, t, b - a);
        }
      }
      ctx.globalAlpha = 1;
    }

    _drawBeam(ctx, b) {
      const age = this.t - b.born;
      const left = b.until - this.t;
      const a = clamp(Math.min(age * 4, left * 3), 0, 1) * 0.16;
      const tx = b.r.x + b.r.w / 2;
      const ty = b.r.y + b.r.h / 2;
      const S = this.S;
      ctx.globalAlpha = a;
      ctx.fillStyle = PAL.light;
      for (const dx of [-10, 10]) {
        ctx.beginPath();
        ctx.moveTo(this.x + dx * S * 0.5, this.y + 2 * S);
        ctx.lineTo(tx - 26, ty - 14);
        ctx.lineTo(tx + 26, ty + 14);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    _drawBubble(ctx, cx, cy) {
      const b = this.bubble;
      const s = Math.max(2, Math.round(this.S * 0.62));
      const pad = 3 * s;
      const lineH = 10 * s;
      let w = 0;
      for (const l of b.lines) w = Math.max(w, measure(l, s));
      const bw = w + pad * 2;
      const bh = b.lines.length * lineH - 3 * s + pad * 2;
      let bx = Math.round(cx + 6 * this.S);
      let by = Math.round(cy - 15 * this.S - bh - 14);
      const flipX = b.side === "left" || bx + bw > this.W - 20;
      if (flipX) bx = Math.round(cx - 6 * this.S - bw);
      if (by < 14) by = Math.round(cy + 18 * this.S);
      const p = Math.max(2, s); // one "pixel" of the bubble border
      ctx.fillStyle = PAL.ink;
      ctx.fillRect(bx + p, by, bw - p * 2, bh);
      ctx.fillRect(bx, by + p, bw, bh - p * 2);
      ctx.fillStyle = PAL.white;
      ctx.fillRect(bx + p * 2, by + p, bw - p * 4, bh - p * 2);
      ctx.fillRect(bx + p, by + p * 2, bw - p * 2, bh - p * 4);
      // tail
      ctx.fillStyle = PAL.ink;
      const tx = flipX ? bx + bw - p * 5 : bx + p * 3;
      const tailDown = by < cy;
      const ty = tailDown ? by + bh : by - p * 3;
      ctx.fillRect(tx, ty, p * 3, p * 3);
      ctx.fillStyle = PAL.white;
      ctx.fillRect(tx + p, ty + (tailDown ? -p : p), p, p * 2);
      let remaining = b.shown;
      let ly = by + pad;
      for (const l of b.lines) {
        const part = l.slice(0, Math.max(0, remaining));
        remaining -= l.length;
        drawText(ctx, part, bx + pad, ly, s, PAL.ink);
        ly += lineH;
      }
      if (b.shown >= b.total && Math.floor(this.t * 2.5) % 2) {
        const last = b.lines[b.lines.length - 1];
        ctx.fillStyle = PAL.tealLo;
        ctx.fillRect(bx + pad + measure(last, s) + s, ly - lineH + s * 6, s * 4, s);
      }
    }

    _drawStamp(ctx, st) {
      const age = this.t - st.born;
      const pop = easeOut(clamp(age / 0.18, 0, 1));
      const fade = clamp((st.life - age) / 0.5, 0, 1);
      const base = clamp(Math.round((this.W * 0.42) / (st.text.length * ADV)), 3, 9);
      const sc = 1 + (1 - pop) * 0.6;
      const s = Math.max(2, Math.round(base * sc));
      const tw = measure(st.text, s);
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate((-9 * Math.PI) / 180);
      ctx.globalAlpha = fade * pop;
      const padX = s * 3;
      const h = 7 * s + s * 4;
      ctx.strokeStyle = st.c;
      ctx.lineWidth = Math.max(6, s);
      ctx.strokeRect(-tw / 2 - padX, -h / 2, tw + padX * 2, h);
      drawText(ctx, st.text, -tw / 2, -3.5 * s, s, st.c);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  /* ------------------------------------------------------------------ finding things on a page */
  function findByText(text, within) {
    const scope = (typeof within === "string" ? document.querySelector(within) : within) || document.body;
    const want = String(text).trim();
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    let best = null;
    let bestArea = Infinity;
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (!n.nodeValue.includes(want)) continue;
      const el = n.parentElement;
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width < 2 || r.height < 2 || cs.visibility === "hidden" || cs.display === "none") continue;
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const area = r.width * r.height;
      if (area < bestArea) {
        best = el;
        bestArea = area;
      }
    }
    return best;
  }

  /** One Vee that floats over the whole page. Safe to call twice: it returns the one that exists. */
  Vee.overlay = function (opts) {
    if (root.vee && root.vee.canvas && root.vee.canvas.isConnected) return root.vee;
    root.vee = new Vee(Object.assign({ fixed: true }, opts || {}));
    return root.vee;
  };
  Vee.PAL = PAL;
  Vee.MOODS = Object.keys(MOODS);
  Vee.drawText = drawText;
  Vee.measure = measure;
  Vee.buildSprite = buildSprite;
  Vee.findByText = findByText;
  root.Vee = Vee;
})(window);
