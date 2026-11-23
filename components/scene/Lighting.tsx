"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { scrollState } from "@/lib/store";

const DAY_BG = new THREE.Color("#edf0ee");
const DUSK_BG = new THREE.Color("#ecdfd6");
const DAY_SUN = new THREE.Color("#ffffff");
const DUSK_SUN = new THREE.Color("#ffbf8c");

/**
 * Studio-built environment (no HDR download needed) + a sun that
 * warms and drops as `scrollState.dusk` goes 0 → 1.
 */
export default function Lighting() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const scene = useThree((s) => s.scene);

  useFrame(() => {
    const d = scrollState.dusk;
    if (scene.background instanceof THREE.Color) scene.background.lerpColors(DAY_BG, DUSK_BG, d);
    if (scene.fog instanceof THREE.Fog) scene.fog.color.lerpColors(DAY_BG, DUSK_BG, d);
    if (sun.current) {
      sun.current.intensity = THREE.MathUtils.lerp(2.6, 1.1, d);
      sun.current.color.lerpColors(DAY_SUN, DUSK_SUN, d);
      // Sun sweeps lower and to the side for longer evening shadows.
      sun.current.position.set(
        THREE.MathUtils.lerp(14, 24, d),
        THREE.MathUtils.lerp(22, 8, d),
        THREE.MathUtils.lerp(10, -4, d)
      );
    }
    if (hemi.current) hemi.current.intensity = THREE.MathUtils.lerp(0.7, 0.35, d);
    scene.environmentIntensity = THREE.MathUtils.lerp(0.9, 0.45, d);
  });

  return (
    <>
      <color attach="background" args={["#edf0ee"]} />
      <fog attach="fog" args={["#edf0ee", 45, 140]} />

      <hemisphereLight ref={hemi} args={["#ffffff", "#c6d0bd", 0.7]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[14, 22, 10]}
        intensity={2.6}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 12, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[-16, 5, 8]} rotation-y={Math.PI / 2} scale={[30, 8, 1]} color="#eef4f2" />
        <Lightformer form="rect" intensity={1.1} position={[16, 5, -8]} rotation-y={-Math.PI / 2} scale={[30, 8, 1]} color="#f6efe6" />
        <Lightformer form="ring" intensity={3} position={[12, 10, 14]} scale={5} color="#fff5e6" target={[0, 0, 0]} />
      </Environment>
    </>
  );
}
