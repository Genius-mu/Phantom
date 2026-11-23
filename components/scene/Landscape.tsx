"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type V3 = [number, number, number];

const TREES: { p: V3; s: number }[] = [
  { p: [-15, 0, -7], s: 1.3 },
  { p: [-13, 0, 4], s: 1 },
  { p: [15, 0, -8], s: 1.4 },
  { p: [16, 0, 3], s: 1.1 },
  { p: [-5, 0, -11], s: 1.2 },
  { p: [6, 0, -12], s: 1.5 },
  { p: [12, 0, -13], s: 1 },
  { p: [-17, 0, -14], s: 1.2 },
  { p: [-12, 0, 12], s: 0.9 },
  { p: [18, 0, 12], s: 1.2 },
  { p: [-22, 0, 2], s: 1.4 },
  { p: [24, 0, -4], s: 1.3 },
];

function Tree({ p, s, i, mats }: { p: V3; s: number; i: number; mats: Record<string, THREE.Material> }) {
  const crown = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!crown.current) return;
    const t = state.clock.elapsedTime + i * 1.7;
    crown.current.rotation.z = Math.sin(t * 0.6) * 0.025;
    crown.current.rotation.x = Math.cos(t * 0.45) * 0.02;
  });
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 1.3, 0]} material={mats.trunk} castShadow>
        <cylinderGeometry args={[0.1, 0.17, 2.6, 8]} />
      </mesh>
      <group ref={crown} position={[0, 2.6, 0]}>
        <mesh position={[0, 0.9, 0]} material={i % 2 ? mats.leafA : mats.leafB} castShadow receiveShadow>
          <icosahedronGeometry args={[1.5, 1]} />
        </mesh>
        <mesh position={[0.7, 0.4, 0.4]} material={mats.leafB} castShadow receiveShadow>
          <icosahedronGeometry args={[0.95, 1]} />
        </mesh>
        <mesh position={[-0.6, 0.5, -0.3]} material={mats.leafA} castShadow receiveShadow>
          <icosahedronGeometry args={[1.05, 1]} />
        </mesh>
      </group>
    </group>
  );
}

export default function Landscape() {
  const mats = useMemo(
    () => ({
      lawn: new THREE.MeshStandardMaterial({ color: "#cfd8c4", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#8d7c69", roughness: 0.9 }),
      leafA: new THREE.MeshStandardMaterial({ color: "#9cb08f", roughness: 0.9, flatShading: true }),
      leafB: new THREE.MeshStandardMaterial({ color: "#88a07f", roughness: 0.9, flatShading: true }),
      hedge: new THREE.MeshStandardMaterial({ color: "#8aa184", roughness: 0.95 }),
      path: new THREE.MeshStandardMaterial({ color: "#dedad0", roughness: 0.9 }),
    }),
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={mats.lawn} receiveShadow>
        <planeGeometry args={[400, 400]} />
      </mesh>

      {/* hedges framing the plot */}
      <mesh position={[0, 1.0, -8.6]} material={mats.hedge} castShadow receiveShadow>
        <boxGeometry args={[24, 1.2, 0.9]} />
      </mesh>
      <mesh position={[12.6, 0.6, -1]} material={mats.hedge} castShadow receiveShadow>
        <boxGeometry args={[0.9, 1.2, 15]} />
      </mesh>

      {/* stepping-stone approach */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-8 + Math.sin(i) * 0.3, 0.03, 10.8 + i * 1.3]} material={mats.path} receiveShadow>
          <boxGeometry args={[2.4, 0.06, 0.9]} />
        </mesh>
      ))}

      {TREES.map((t, i) => (
        <Tree key={i} p={t.p} s={t.s} i={i} mats={mats} />
      ))}
    </group>
  );
}
