"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei";
import { EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import Lighting from "./Lighting";
import Villa from "./Villa";
import Landscape from "./Landscape";
import CameraRig from "./CameraRig";
import Hotspots from "./Hotspots";
import { app } from "@/lib/store";

export default function Experience() {
  const [hq, setHq] = useState(true);

  return (
    <div className="fixed inset-0 z-0 h-[100lvh] w-full" role="img" aria-label="3D model of a modern villa with a lap pool">
      <Canvas
        shadows="soft"
        dpr={[1, hq ? 1.75 : 1.2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        camera={{ fov: 35, near: 0.5, far: 250, position: [40, 12, 44] }}
        onCreated={() => {
          // Give the first frames a moment to compile shaders.
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              app.sceneReady = true;
              window.dispatchEvent(new Event("scene:ready"));
            })
          );
        }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setHq(false)}
          onIncline={() => setHq(true)}
          onFallback={() => setHq(false)}
        />
        <AdaptiveDpr pixelated={false} />

        <Suspense fallback={null}>
          <Lighting />
          <Landscape />
          <Villa />
          <Hotspots />
          <CameraRig />
          <Preload all />
        </Suspense>

        {hq ? (
          <EffectComposer multisampling={4}>
            <N8AO aoRadius={1.6} intensity={2.2} distanceFalloff={1} halfRes color="#22302d" />
            <Vignette offset={0.3} darkness={0.35} />
          </EffectComposer>
        ) : null}
      </Canvas>
    </div>
  );
}
