"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import AvatarParticles from "./AvatarParticles";
import { setAvatarCursorHover } from "@/lib/cursor-avatar";

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

export default function AvatarParticlesCanvas() {
  const [canRenderWebgl, setCanRenderWebgl] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;

    if (prefersReducedMotion || isSmallScreen || saveData) {
      setCanRenderWebgl(false);
      return;
    }

    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2", { antialias: false }) ||
      canvas.getContext("webgl", { antialias: false }) ||
      canvas.getContext("experimental-webgl", { antialias: false });

    setCanRenderWebgl(Boolean(context));
  }, []);

  useEffect(() => {
    setAvatarCursorHover(hoverActive);
  }, [hoverActive]);

  useEffect(() => {
    return () => setAvatarCursorHover(false);
  }, []);

  if (!canRenderWebgl) {
    return (
      <div
        className="relative z-20 w-full h-full min-h-[250px] xs:min-h-[300px] sm:min-h-[350px] md:min-h-0 bg-[#424242]"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="w-full h-full absolute inset-0 z-20"
      onPointerEnter={() => setHoverActive(true)}
      onPointerLeave={() => setHoverActive(false)}
    >
      <Canvas
        camera={{ position: [-0.28, -0.48, -0.82], fov: 58 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        }}
      >
        <Suspense fallback={null}>
          <AvatarParticles hoverActive={hoverActive} />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={0.7}
            target={[0, 0.14, 0]}
            minPolarAngle={2.18}
            maxPolarAngle={2.18}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
