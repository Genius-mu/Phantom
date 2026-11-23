"use client";

import dynamic from "next/dynamic";

// WebGL must never render on the server.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

export default function SceneLoader() {
  return <Experience />;
}
