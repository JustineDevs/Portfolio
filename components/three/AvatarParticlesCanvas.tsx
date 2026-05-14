"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import AvatarParticles from "./AvatarParticles";

export default function AvatarParticlesCanvas() {
  return (
    <div className="w-full h-full absolute inset-0 z-20">
      <Canvas
        camera={{ position: [-0.45, -0.85, -0.86], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <AvatarParticles />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate
            autoRotateSpeed={1}
            // Lock vertical rotation to approx 2.3 radians (matches y=-0.85 view)
            minPolarAngle={2.3}
            maxPolarAngle={2.3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
