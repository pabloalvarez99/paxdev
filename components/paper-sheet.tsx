"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One sheet of handmade paper under one raking light.
 *
 * Not a demo of a library. A subdivided plane, a shallow warp, a hand-written shader for
 * fibre, laid lines and a deckle edge, and a soft band of window light that crosses the
 * sheet over about two minutes. No controls, no bloom, no particles, nothing clickable.
 *
 * It removes itself four ways: reduced motion (three is never imported), no WebGL, hidden
 * tab, scrolled out of view. In the first two the figure collapses to nothing and the page
 * is type alone.
 */

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;

  varying vec2 vUv;
  varying vec3 vNrm;

  // A sheet that has taken up damp: two long ridges and one short one, all shallow.
  float warp(vec2 p, float t) {
    float h = 0.0;
    h += 0.075 * sin(p.x * 2.3 + t * 0.10) * cos(p.y * 1.7 - t * 0.06);
    h += 0.030 * sin(p.x * 5.1 - p.y * 2.9 + t * 0.045);
    h += 0.014 * sin(p.y * 7.3 + t * 0.08);
    return h;
  }

  void main() {
    vUv = uv;

    vec2 p = vec2(position.x * uAspect, position.y);
    float h = warp(p, uTime);

    float e = 0.04;
    float hx = warp(p + vec2(e, 0.0), uTime);
    float hy = warp(p + vec2(0.0, e), uTime);
    vNrm = normalize(vec3(-(hx - h) / e, -(hy - h) / e, 1.0));

    // The mesh is tilted, so the rise is not only a shading trick: the torn edge moves.
    vec3 displaced = vec3(position.xy, position.z + h);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uSize;
  uniform vec3 uShade;
  uniform vec3 uSheet;
  uniform vec3 uLit;
  uniform vec3 uCast;

  varying vec2 vUv;
  varying vec3 vNrm;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  /**
   * Signed distance to the torn edge of the sheet, positive inside. A deckle is a soft,
   * slightly wandering edge where the pulp thinned out against the mould — not a tear.
   */
  float deckle(vec2 uv) {
    vec2 p = uv - 0.5;
    float alongY = (vnoise(vec2(uv.y * 14.0, 3.7)) - 0.5) * 0.011;
    float alongX = (vnoise(vec2(uv.x * 12.0, 9.1)) - 0.5) * 0.007;
    float fineY = (vnoise(vec2(uv.y * 55.0, 1.3)) - 0.5) * 0.0035;
    float fineX = (vnoise(vec2(uv.x * 48.0, 5.5)) - 0.5) * 0.0025;
    return min(
      0.425 + alongY + fineY - abs(p.x),
      0.420 + alongX + fineX - abs(p.y)
    );
  }

  void main() {
    float inside = deckle(vUv);
    float sheetMask = smoothstep(0.0, 0.006, inside);

    // The sheet lies on the page, so it casts. The offset is away from the light.
    float under = deckle(vUv - vec2(0.010, -0.013));
    float castShadow = smoothstep(-0.026, 0.014, under) * (1.0 - sheetMask);

    // One light, almost in the plane of the sheet. That is what a window does to paper.
    vec3 lightDirection = normalize(vec3(-0.86, 0.40, 0.32));
    float lambert = clamp(dot(normalize(vNrm), lightDirection), 0.0, 1.0);
    float form = smoothstep(0.02, 0.55, lambert);

    // Not a glowing band: the edge of a window shadow, crossing over about two minutes.
    vec2 axis = normalize(vec2(0.80, 0.58));
    float across = dot(vUv - 0.5, axis);
    float edgeOfLight = sin(uTime * 0.052) * 0.46;
    // Wide, because a window edge on paper is a gradation, not a wedge drawn on top of it.
    float exposure = smoothstep(-0.150, 0.150, across - edgeOfLight);
    float light = mix(0.46, 1.0, exposure);

    float tone = clamp(light * (0.56 + 0.66 * form), 0.0, 1.0);
    vec3 colour = tone < 0.5
      ? mix(uShade, uSheet, tone * 2.0)
      : mix(uSheet, uLit, (tone - 0.5) * 2.0);

    // Cotton tooth, sized in pixels so it stays tooth and never becomes a pattern.
    vec2 grainUv = vUv * uSize * 0.6;
    float fibre = vnoise(grainUv) * 0.55 + vnoise(grainUv * 2.3) * 0.30
      + vnoise(grainUv * 5.7) * 0.15;
    // Raking light is what makes tooth visible at all, so the lit side is grainier.
    colour += (fibre - 0.5) * 0.040 * (0.55 + 0.75 * exposure);

    // The laid lines a mould leaves: a fixed count, so no screen can beat against them.
    colour -= (sin(vUv.y * 92.0) * 0.5 + 0.5) * 0.005;
    // The rim of a deckle is thinner, so it takes a little less light.
    colour = mix(colour * 0.94, colour, smoothstep(0.0, 0.02, inside));

    float alpha = max(sheetMask, castShadow * 0.42);
    vec3 out_ = mix(uCast, colour, sheetMask);
    gl_FragColor = vec4(out_ * alpha, alpha);
  }
`;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** A plate, not a banner: the sheet keeps a paper ratio instead of stretching to the measure. */
function stageHeightFor(width: number): number {
  return Math.round(width * 0.7);
}

export function PaperSheet() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [allowMotion, setAllowMotion] = useState(false);
  const [live, setLive] = useState(false);

  // Watched, not read once: turning the system setting on takes the canvas down without a reload.
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const sync = () => setAllowMotion(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!allowMotion || !host) {
      return;
    }

    let disposed = false;
    let teardown: (() => void) | null = null;

    async function mount() {
      let three: typeof import("three");
      try {
        three = await import("three");
      } catch {
        return; // The chunk did not arrive. The page is type, which was always the fallback.
      }
      if (disposed || !host) {
        return;
      }

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new three.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return; // No WebGL context. Same fallback.
      }

      let width = host.clientWidth || 640;
      let height = stageHeightFor(width);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      // The third argument must stay true: with it false three sets only the width/height
      // attributes, which the pixel ratio has already multiplied, and a canvas with no CSS size
      // lays out at its attribute size. On a 2x screen that is a 768px canvas in a 384px box
      // with overflow hidden -- a quarter of the sheet. Playwright defaults to a scale factor
      // of 1, so no screenshot test can see this; e2e/craft.spec.ts forces 2.
      renderer.setSize(width, height, true);
      renderer.setClearAlpha(0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const scene = new three.Scene();
      const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 3;

      const geometry = new three.PlaneGeometry(2, 2, 96, 64);
      const material = new three.ShaderMaterial({
        depthWrite: false,
        fragmentShader: FRAGMENT_SHADER,
        premultipliedAlpha: true,
        transparent: true,
        uniforms: {
          uAspect: { value: 1 },
          // Plain vectors, not Color: the shader writes literal sRGB and nothing re-encodes it.
          uCast: { value: new three.Vector3(0.878, 0.855, 0.804) },
          uLit: { value: new three.Vector3(0.992, 0.988, 0.969) },
          uSheet: { value: new three.Vector3(0.937, 0.918, 0.871) },
          uShade: { value: new three.Vector3(0.867, 0.839, 0.776) },
          uSize: { value: new three.Vector2(640, 300) },
          uTime: { value: 0 },
        },
        vertexShader: VERTEX_SHADER,
      });

      const mesh = new three.Mesh(geometry, material);
      // A shallow tilt, so the light has a surface to rake across and the warp shows at the edge.
      mesh.rotation.x = -0.26;
      scene.add(mesh);

      function layout() {
        if (!host) return;
        width = host.clientWidth || width;
        height = stageHeightFor(width);
        const aspect = width / height;

        renderer.setSize(width, height, true);
        camera.left = -aspect;
        camera.right = aspect;
        camera.updateProjectionMatrix();
        // The quad fills the frame; the sheet inside it is cut by the deckle in the shader.
        mesh.scale.set(aspect, 1.08, 1);
        material.uniforms.uAspect.value = aspect;
        material.uniforms.uSize.value.set(width, height);
        host.style.height = `${height}px`;
      }

      layout();
      setLive(true);

      let frame = 0;
      let elapsed = 0;
      let last = 0;
      let onScreen = true;
      let running = false;

      function draw(now: number) {
        frame = requestAnimationFrame(draw);
        const delta = now - last;
        if (delta < 33) {
          return; // Thirty frames a second is more than a two-minute cycle needs.
        }
        last = now;
        elapsed += delta / 1000;
        material.uniforms.uTime.value = elapsed;
        renderer.render(scene, camera);
      }

      function setRunning(next: boolean) {
        if (next === running) return;
        running = next;
        if (running) {
          last = performance.now();
          frame = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(frame);
        }
      }

      function sync() {
        setRunning(onScreen && !document.hidden);
      }

      const observer = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          sync();
        },
        { threshold: 0 },
      );
      observer.observe(host);

      const resize = new ResizeObserver(() => layout());
      resize.observe(host);

      document.addEventListener("visibilitychange", sync);
      sync();

      teardown = () => {
        setRunning(false);
        observer.disconnect();
        resize.disconnect();
        document.removeEventListener("visibilitychange", sync);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
        host.style.height = "";
      };
    }

    void mount();

    return () => {
      disposed = true;
      setLive(false);
      teardown?.();
    };
  }, [allowMotion]);

  return (
    <figure className={live ? "sheet is-live" : "sheet"}>
      <div aria-hidden="true" className="sheet-stage" ref={hostRef} />
      {live ? (
        <figcaption>
          One sheet, one raking light. It stops when the tab is hidden, and never loads at all
          if you asked for less motion.
        </figcaption>
      ) : null}
    </figure>
  );
}
