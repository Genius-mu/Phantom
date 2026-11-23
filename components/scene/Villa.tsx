"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { scrollState } from "@/lib/store";

type V3 = [number, number, number];

function Box({
  size,
  position,
  material,
  rotation,
  shadow = true,
}: {
  size: V3;
  position: V3;
  material: THREE.Material;
  rotation?: V3;
  shadow?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={shadow} receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

/**
 * A procedurally modelled two-storey modern villa:
 * glass ground floor, plaster upper volume cantilevered over a lap pool,
 * timber stair tower and slatted screen. No external model files needed —
 * swap for a client GLB later via <Gltf src="/villa.glb" /> if you have one.
 */
export default function Villa() {
  const m = useMemo(() => {
    const plaster = new THREE.MeshStandardMaterial({ color: "#f3f2ee", roughness: 0.92 });
    const stone = new THREE.MeshStandardMaterial({ color: "#d9d4c8", roughness: 0.85 });
    const stoneDark = new THREE.MeshStandardMaterial({ color: "#a9a397", roughness: 0.7 });
    const timber = new THREE.MeshStandardMaterial({ color: "#a77c55", roughness: 0.65 });
    const metal = new THREE.MeshStandardMaterial({ color: "#2b3532", roughness: 0.4, metalness: 0.6 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#cfe2e4",
      roughness: 0.04,
      metalness: 0.1,
      transparent: true,
      opacity: 0.32,
      envMapIntensity: 2.2,
      clearcoat: 1,
      depthWrite: false,
    });
    const water = new THREE.MeshPhysicalMaterial({
      color: "#62b8be",
      roughness: 0.06,
      metalness: 0.05,
      transparent: true,
      opacity: 0.82,
      clearcoat: 1,
      envMapIntensity: 1.8,
    });
    const tile = new THREE.MeshStandardMaterial({ color: "#a9d9d7", roughness: 0.5 });
    const fabric = new THREE.MeshStandardMaterial({ color: "#cfc6b8", roughness: 1 });
    const glow = new THREE.MeshStandardMaterial({
      color: "#f6efe4",
      emissive: new THREE.Color("#ffcf96"),
      emissiveIntensity: 0,
      roughness: 1,
    });
    return { plaster, stone, stoneDark, timber, metal, glass, water, tile, fabric, glow };
  }, []);

  const lightA = useRef<THREE.PointLight>(null);
  const lightB = useRef<THREE.PointLight>(null);
  const poolLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const d = scrollState.dusk;
    const ease = d * d * (3 - 2 * d);
    m.glow.emissiveIntensity = ease * 1.4;
    if (lightA.current) lightA.current.intensity = ease * 28;
    if (lightB.current) lightB.current.intensity = ease * 24;
    if (poolLight.current) poolLight.current.intensity = ease * 14;
    // a faint shimmer on the water
    m.water.opacity = 0.8 + Math.sin(state.clock.elapsedTime * 1.4) * 0.03;
  });

  const mullionsX = Array.from({ length: 7 }, (_, i) => -7 + i * 2);
  const slatsX = Array.from({ length: 24 }, (_, i) => 5.6 + i * 0.18);

  return (
    <group>
      {/* ── Terrace plinth with pool cut-out ── */}
      <Box size={[24, 0.4, 12]} position={[0, 0.2, -2]} material={m.stone} />
      <Box size={[24, 0.4, 1.8]} position={[0, 0.2, 8.1]} material={m.stone} />
      <Box size={[11, 0.4, 3.2]} position={[-6.5, 0.2, 5.6]} material={m.stone} />
      <Box size={[3, 0.4, 3.2]} position={[10.5, 0.2, 5.6]} material={m.stone} />
      {/* pool basin + water */}
      <Box size={[10, 0.04, 3.2]} position={[4, 0.03, 5.6]} material={m.tile} shadow={false} />
      <mesh position={[4, 0.33, 5.6]} rotation={[-Math.PI / 2, 0, 0]} material={m.water} receiveShadow>
        <planeGeometry args={[10, 3.2]} />
      </mesh>
      <pointLight ref={poolLight} position={[4, 0.15, 5.6]} color="#7fe3e6" intensity={0} distance={8} decay={2} />
      {/* coping */}
      <Box size={[10.4, 0.06, 0.2]} position={[4, 0.43, 4.0]} material={m.stoneDark} />
      <Box size={[10.4, 0.06, 0.2]} position={[4, 0.43, 7.2]} material={m.stoneDark} />

      {/* ── Ground floor: glass pavilion ── */}
      <Box size={[12, 3.2, 0.3]} position={[-1, 2.0, -4.35]} material={m.plaster} />
      <Box size={[0.3, 3.2, 7]} position={[-6.85, 2.0, -1]} material={m.plaster} />
      <Box size={[11.4, 3.0, 0.02]} position={[-1, 2.0, -4.18]} material={m.glow} shadow={false} />
      <mesh position={[-1, 2.0, 2.45]} material={m.glass}>
        <boxGeometry args={[12, 3.2, 0.04]} />
      </mesh>
      <mesh position={[4.95, 2.0, -1]} material={m.glass}>
        <boxGeometry args={[0.04, 3.2, 7]} />
      </mesh>
      {mullionsX.map((x) => (
        <Box key={x} size={[0.06, 3.2, 0.08]} position={[x, 2.0, 2.48]} material={m.metal} />
      ))}
      <Box size={[0.08, 3.2, 0.08]} position={[4.97, 2.0, 2.48]} material={m.metal} />

      {/* interior furniture (reads through the glass) */}
      <Box size={[3.2, 0.45, 1.05]} position={[-2.2, 0.63, -2.2]} material={m.fabric} />
      <Box size={[3.2, 0.55, 0.28]} position={[-2.2, 1.0, -2.65]} material={m.fabric} />
      <Box size={[1.4, 0.3, 0.8]} position={[-2.2, 0.55, -0.7]} material={m.timber} />
      <Box size={[2.8, 0.95, 0.95]} position={[2.3, 0.88, -2.6]} material={m.stoneDark} />
      <pointLight ref={lightA} position={[-0.5, 2.9, -1]} color="#ffcf99" intensity={0} distance={14} decay={2} />

      {/* first-floor slab (incl. cantilever) */}
      <Box size={[13, 0.35, 8]} position={[-0.5, 3.775, -1]} material={m.plaster} />
      <Box size={[5.5, 0.35, 7]} position={[7.25, 3.775, -0.7]} material={m.plaster} />

      {/* ── Upper volume (cantilevered) ── */}
      <Box size={[14, 3.1, 0.3]} position={[3, 5.5, -4.05]} material={m.plaster} />
      <Box size={[0.3, 3.1, 7]} position={[9.85, 5.5, -0.7]} material={m.plaster} />
      <Box size={[0.3, 3.1, 7]} position={[-3.85, 5.5, -0.7]} material={m.plaster} />
      <Box size={[13.4, 2.9, 0.02]} position={[3, 5.5, -3.88]} material={m.glow} shadow={false} />
      <Box size={[14, 0.9, 0.3]} position={[3, 6.6, 2.65]} material={m.plaster} />
      <Box size={[14, 0.25, 0.3]} position={[3, 4.07, 2.65]} material={m.plaster} />
      <mesh position={[3, 5.17, 2.7]} material={m.glass}>
        <boxGeometry args={[13.4, 1.95, 0.04]} />
      </mesh>
      {slatsX.map((x) => (
        <Box key={x} size={[0.08, 2.1, 0.12]} position={[x, 5.15, 2.9]} material={m.timber} />
      ))}
      <pointLight ref={lightB} position={[2.5, 5.9, -1.2]} color="#ffcf99" intensity={0} distance={14} decay={2} />

      {/* roof slab + fascia */}
      <Box size={[15, 0.3, 8]} position={[3, 7.2, -0.7]} material={m.plaster} />
      <Box size={[15.02, 0.08, 8.02]} position={[3, 7.02, -0.7]} material={m.stoneDark} />

      {/* ── Timber stair tower with roof terrace ── */}
      <Box size={[3, 7.6, 3.2]} position={[-8.6, 4.2, -2.5]} material={m.timber} />
      <mesh position={[-8.6, 4.2, -0.89]} material={m.glass}>
        <boxGeometry args={[0.9, 6.2, 0.04]} />
      </mesh>
      <Box size={[3.2, 0.12, 3.4]} position={[-8.6, 8.06, -2.5]} material={m.stoneDark} />
      {/* glass balustrade */}
      <mesh position={[-8.6, 8.55, -0.85]} material={m.glass}>
        <boxGeometry args={[3.2, 0.9, 0.03]} />
      </mesh>

      {/* ── Pool deck loungers ── */}
      {[-2.6, -4.0, -5.4].map((x) => (
        <group key={x} position={[x, 0.4, 5.6]}>
          <Box size={[0.75, 0.22, 1.5]} position={[0, 0.22, 0.25]} material={m.fabric} />
          <Box size={[0.75, 0.08, 0.7]} position={[0, 0.42, -0.72]} rotation={[0.6, 0, 0]} material={m.fabric} />
          <Box size={[0.8, 0.1, 2.0]} position={[0, 0.06, 0]} material={m.timber} />
        </group>
      ))}

      {/* ── Front steps ── */}
      {[0, 1, 2].map((i) => (
        <Box key={i} size={[3.2, 0.14, 0.45]} position={[-8, 0.07 + i * 0.13, 9.6 - i * 0.45]} material={m.stone} />
      ))}
    </group>
  );
}
