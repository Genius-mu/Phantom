"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { app, pointer, scrollState } from "@/lib/store";

/**
 * Camera keyframes. `at` is the scroll-driven camera value (0..1).
 * 0.00–0.80 = hero + flythrough, 0.80 = parked aerial behind the listings,
 * 0.80–1.00 = finale (dusk).
 */
const KEYS: { at: number; pos: [number, number, number]; target: [number, number, number] }[] = [
  { at: 0.0, pos: [26, 7, 30], target: [1, 3, 0] }, // hero, three-quarter
  { at: 0.24, pos: [15, 1.6, 17], target: [4, 1.4, 4] }, // low over the pool
  { at: 0.42, pos: [2.5, 2.1, 13], target: [-1.5, 2.1, 0] }, // facing the living glass
  { at: 0.56, pos: [-19, 7, 11], target: [-4, 4.5, -1.5] }, // timber tower corner
  { at: 0.7, pos: [-8, 26, 26], target: [1, 1, 0] }, // aerial
  { at: 0.8, pos: [4, 36, 20], target: [1, 0, 0] }, // high aerial (behind listings)
  { at: 1.0, pos: [27, 4.5, 21], target: [1, 3.4, 0] }, // dusk hero
];

/** piecewise-linear remap from keyframe `at` space to curve `t` space */
function toCurveT(p: number) {
  const n = KEYS.length - 1;
  for (let i = 0; i < n; i++) {
    const a = KEYS[i].at;
    const b = KEYS[i + 1].at;
    if (p <= b) return (i + (p - a) / (b - a)) / n;
  }
  return 1;
}

export default function CameraRig() {
  const camera = useThree((s) => s.camera);

  const { posCurve, tgtCurve } = useMemo(
    () => ({
      posCurve: new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.pos)), false, "centripetal"),
      tgtCurve: new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.target)), false, "centripetal"),
    }),
    []
  );

  const s = useRef({ p: 0, mx: 0, my: 0 });
  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) }),
    []
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const k = app.reducedMotion ? 20 : 3.2;
    const st = s.current;

    st.p = THREE.MathUtils.damp(st.p, scrollState.camera, k, dt);
    st.mx = THREE.MathUtils.damp(st.mx, pointer.x, 2.5, dt);
    st.my = THREE.MathUtils.damp(st.my, pointer.y, 2.5, dt);
    scrollState.cameraSmooth = st.p;

    const t = toCurveT(THREE.MathUtils.clamp(st.p, 0, 1));
    posCurve.getPoint(t, tmp.pos);
    tgtCurve.getPoint(t, tmp.tgt);

    tmp.fwd.subVectors(tmp.tgt, tmp.pos).normalize();
    tmp.right.crossVectors(tmp.fwd, tmp.up).normalize();

    // intro: start pulled back and higher, glide in
    const intro = 1 - scrollState.intro;
    tmp.pos.addScaledVector(tmp.fwd, -intro * 22);
    tmp.pos.y += intro * 6;

    // mouse parallax: orbit slightly around the target
    const strength = app.reducedMotion ? 0 : 1;
    tmp.pos.addScaledVector(tmp.right, st.mx * 1.8 * strength);
    tmp.pos.y += st.my * 0.9 * strength;

    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.tgt);
  });

  return null;
}
