"use client";

import { useEffect, useRef } from "react";

/**
 * The hero car in 3D: the Kenney sedan (CC0), recoloured from the page's own tokens, with its edges
 * drawn as glowing lines in the chart blue and a warm headlight on the road. It is an upgrade, never a
 * requirement: the line drawing in HeroCar stays underneath until the first frame is drawn, and it
 * stays for good on phones, with data saver on, without WebGL, or if anything here fails.
 * Three.js is loaded only after the page is idle, so it never touches first paint.
 * Reduced motion draws one still frame. Drawing stops while the car is off screen or the tab is hidden.
 */
export function Car3D({ months, onReady, onFail }: { months: number; onReady: () => void; onFail: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const impulse = useRef<() => void>(() => {});
  const first = useRef(true);

  // The slider makes the car surge: every change of loan length gives the wheels a push.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    impulse.current();
  }, [months]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!window.matchMedia("(min-width: 600px)").matches || conn?.saveData) {
      onFail();
      return;
    }

    let disposed = false;
    let stop = () => {};

    async function start(host: HTMLDivElement) {
      const probe = document.createElement("canvas");
      if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) {
        onFail();
        return;
      }

      const [THREE, { GLTFLoader }, { LineSegments2 }, { LineSegmentsGeometry }, { LineMaterial }] = await Promise.all([
        import("three"),
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/lines/LineSegments2.js"),
        import("three/addons/lines/LineSegmentsGeometry.js"),
        import("three/addons/lines/LineMaterial.js"),
      ]);
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const root = document.documentElement;

      /** Any CSS colour, including light-dark() and color-mix(), as 0..255 rgb. */
      const swatch = document.createElement("canvas");
      swatch.width = swatch.height = 1;
      const sctx = swatch.getContext("2d", { willReadFrequently: true })!;
      const holder = document.createElement("span");
      holder.style.display = "none";
      host.appendChild(holder);
      const rgb = (css: string): [number, number, number] => {
        holder.style.color = css;
        const resolved = getComputedStyle(holder).color;
        sctx.clearRect(0, 0, 1, 1);
        sctx.fillStyle = resolved;
        sctx.fillRect(0, 0, 1, 1);
        const d = sctx.getImageData(0, 0, 1, 1).data;
        return [d[0], d[1], d[2]];
      };
      const hex = (c: [number, number, number]) => (c[0] << 16) | (c[1] << 8) | c[2];

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.className = "car3d-canvas";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 60);
      const car = new THREE.Group();
      scene.add(car);

      scene.add(new THREE.HemisphereLight(0xcfe6ff, 0x203038, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(-3, 5, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x6fa0ff, 1.6);
      rim.position.set(4, 2, -4);
      scene.add(rim);
      const lamp = new THREE.PointLight(0xf5c400, 1.6, 3.2, 1.8);
      lamp.position.set(0, 0.55, 1.9);
      car.add(lamp);

      const lineMats: InstanceType<typeof LineMaterial>[] = [];
      const disposables: { dispose: () => void }[] = [renderer];
      let bodyMat: import("three").MeshStandardMaterial | null = null;
      let original: HTMLCanvasElement | null = null;
      const wheels: import("three").Object3D[] = [];

      /** The palette image is recoloured: the red becomes the page's panel colour, the glass a deep blue. */
      function paintPalette() {
        if (!original || !bodyMat) return;
        const body = rgb("color-mix(in oklab, var(--panel-2) 88%, white)");
        const glass = rgb("color-mix(in oklab, var(--c-car) 38%, var(--ground))");
        const c = document.createElement("canvas");
        c.width = original.width;
        c.height = original.height;
        const ctx = c.getContext("2d")!;
        ctx.drawImage(original, 0, 0);
        const img = ctx.getImageData(0, 0, c.width, c.height);
        const d = img.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i + 1], b = d[i + 2];
          const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
          const lum = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
          if (mx - mn > 70 && r > g && r > b) {
            const f = Math.min(Math.max(lum / 0.42, 0.55), 1.5);
            d[i] = Math.min(body[0] * f, 255);
            d[i + 1] = Math.min(body[1] * f, 255);
            d[i + 2] = Math.min(body[2] * f, 255);
          } else if (b - r > 14 && lum > 0.3 && lum < 0.7) {
            const f = lum / 0.45;
            d[i] = Math.min(glass[0] * f, 255);
            d[i + 1] = Math.min(glass[1] * f, 255);
            d[i + 2] = Math.min(glass[2] * f, 255);
          }
        }
        ctx.putImageData(img, 0, 0);
        const tex = new THREE.CanvasTexture(c);
        tex.flipY = false;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        bodyMat.map?.dispose();
        bodyMat.map = tex;
        bodyMat.needsUpdate = true;
        const edge = hex(rgb("color-mix(in oklab, var(--c-car) 85%, white)"));
        lineMats.forEach((m, i) => {
          m.color.setHex(i % 2 === 0 ? edge : edge);
        });
      }

      const loader = new GLTFLoader();
      // The model names an image beside it; the palette is served from /models instead.
      loader.manager.setURLModifier((url) => (url.endsWith("colormap.png") ? "/models/sedan-palette.png" : url));
      const gltf = await loader.loadAsync("/models/sedan.glb");
      if (disposed) {
        renderer.dispose();
        return;
      }
      const model = gltf.scene;
      car.add(model);

      // Collect the model's meshes first: the edge lines added below are meshes too, and must not be walked.
      const meshes: import("three").Mesh[] = [];
      model.traverse((o) => {
        if (/^wheel/.test(o.name)) wheels.push(o);
        if ((o as import("three").Mesh).isMesh) meshes.push(o as import("three").Mesh);
      });
      meshes.forEach((mesh) => {
        const m = mesh.material as import("three").MeshStandardMaterial;
        if (!bodyMat) {
          bodyMat = m;
          const im = m.map?.image as CanvasImageSource & { width: number; height: number };
          if (im) {
            original = document.createElement("canvas");
            original.width = im.width;
            original.height = im.height;
            original.getContext("2d")!.drawImage(im, 0, 0);
          }
        }
        mesh.material = bodyMat;
        m.roughness = 0.62;
        m.metalness = 0.12;
        m.polygonOffset = true;
        m.polygonOffsetFactor = 1;
        m.polygonOffsetUnits = 1;
        // Glowing edges: a sharp 2 px line and a wider, faint one behind it.
        const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
        const lg = new LineSegmentsGeometry().fromEdgesGeometry(edges);
        edges.dispose();
        disposables.push(lg);
        for (const [w, o] of [[2.4, 0.95], [8, 0.16]] as const) {
          const lm = new LineMaterial({ color: 0x3b82f6, linewidth: w, transparent: true, opacity: o });
          if (w > 3) {
            lm.blending = THREE.AdditiveBlending;
            lm.depthWrite = false;
          }
          lineMats.push(lm);
          disposables.push(lm);
          mesh.add(new LineSegments2(lg, lm));
        }
      });
      paintPalette();

      // The headlight on the road: a soft cone lying on the ground ahead of the car, in the one warm accent.
      const bc = document.createElement("canvas");
      bc.width = 256;
      bc.height = 128;
      const bx = bc.getContext("2d")!;
      // A soft half-ellipse of light on the road, brightest at the lamps and fading with distance.
      const yel = rgb("var(--yellow)");
      bx.save();
      bx.translate(0, 64);
      bx.scale(4, 1); // 256 px across by 64 px each way, so the light is gone before it reaches the texture's edge
      const grad = bx.createRadialGradient(0, 0, 0, 0, 0, 64);
      for (const [at, alpha] of [[0, 0.9], [0.3, 0.5], [0.6, 0.2], [0.85, 0.05], [1, 0]] as const) {
        grad.addColorStop(at, `rgba(${yel[0]},${yel[1]},${yel[2]},${alpha})`);
      }
      bx.fillStyle = grad;
      bx.fillRect(0, -64, 64, 128);
      bx.restore();
      const beamTex = new THREE.CanvasTexture(bc);
      beamTex.colorSpace = THREE.SRGBColorSpace;
      const beam = new THREE.Mesh(
        new THREE.PlaneGeometry(2.6, 2.6),
        new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      beam.rotation.x = -Math.PI / 2;
      beam.rotation.z = Math.PI / 2;
      beam.position.set(0, 0.04, 1.28 + 1.3);
      car.add(beam);
      disposables.push(beam.geometry, beam.material as import("three").Material, beamTex);

      // A pool of the chart blue under the car, so it sits on the road instead of hovering.
      const gc = document.createElement("canvas");
      gc.width = gc.height = 128;
      const gx = gc.getContext("2d")!;
      const rg = gx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const cb = rgb("var(--c-car)");
      rg.addColorStop(0, `rgba(${cb[0]},${cb[1]},${cb[2]},0.6)`);
      rg.addColorStop(1, `rgba(${cb[0]},${cb[1]},${cb[2]},0)`);
      gx.fillStyle = rg;
      gx.fillRect(0, 0, 128, 128);
      const poolTex = new THREE.CanvasTexture(gc);
      const pool = new THREE.Mesh(
        new THREE.PlaneGeometry(4.2, 2.4),
        new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      pool.rotation.x = -Math.PI / 2;
      pool.position.y = 0.01;
      car.add(pool);
      disposables.push(pool.geometry, pool.material as import("three").Material, poolTex);

      // Size and camera: the car's length takes about two thirds of the box, seen a little from above and in front.
      const fit = () => {
        const w = host.clientWidth, h = host.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const length = 2.55 + 2.2; // the car plus its beam, which reaches about 2.6 units ahead, with room to spare
        const visibleW = length / 0.9;
        const d = visibleW / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect);
        camera.position.set(0.15 * d, 0.28 * d, d);
        camera.lookAt(0.35, 0.5, 0.4);
        camera.updateProjectionMatrix();
        lineMats.forEach((m) => m.resolution.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio()));
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(host);

      let px = 0;
      const onMove = (e: PointerEvent) => {
        px = (e.clientX / window.innerWidth) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let spin = 0; // extra wheel speed from the slider, in radians a second
      impulse.current = () => {
        spin = 9;
      };

      const t0 = performance.now();
      let last = t0;
      let yaw = 0;
      const draw = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!reduce) {
          const t = (now - t0) / 1000;
          const target = px * 0.28 + Math.sin(t * 0.5) * 0.05;
          yaw += (target - yaw) * Math.min(dt * 2.5, 1);
          spin *= Math.exp(-dt * 2.2);
          wheels.forEach((w) => (w.rotation.x += (1.6 + spin) * dt));
          car.position.y = Math.sin(t * 2.4) * 0.006 * (1 + spin * 0.2);
        }
        car.rotation.y = -Math.PI / 2 + 0.34 + yaw;
        renderer.render(scene, camera);
      };

      let raf = 0;
      let visible = true;
      let tabVisible = !document.hidden;
      const loop = (now: number) => {
        draw(now);
        raf = requestAnimationFrame(loop);
      };
      const sync = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (!reduce && visible && tabVisible) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      };
      const io = new IntersectionObserver((es) => {
        visible = es[0].isIntersecting;
        sync();
      });
      io.observe(host);
      const onVis = () => {
        tabVisible = !document.hidden;
        sync();
      };
      document.addEventListener("visibilitychange", onVis);

      // Match the page when the screen is switched between dark and light.
      const mo = new MutationObserver(() => {
        paintPalette();
        if (reduce) draw(performance.now());
      });
      mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

      draw(performance.now());
      sync();
      onReady();

      stop = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        mo.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        impulse.current = () => {};
        bodyMat?.map?.dispose();
        disposables.forEach((x) => x.dispose());
        renderer.domElement.remove();
        holder.remove();
      };
    }

    const run = () =>
      void start(el).catch((e) => {
        // The line drawing stays; say why in the console so a broken model or a lost context is not silent.
        console.warn("Car3D: staying with the line drawing.", e);
        onFail();
      });
    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle ? window.requestIdleCallback(run, { timeout: 500 }) : window.setTimeout(run, 100);

    return () => {
      disposed = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
      stop();
    };
    // onReady and onFail are stable by construction (state setters); the effect must run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={box} className="car3d" aria-hidden="true" />;
}
