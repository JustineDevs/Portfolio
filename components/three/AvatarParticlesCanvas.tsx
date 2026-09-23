"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import AvatarParticles from "./AvatarParticles";
import { setAvatarCursorHover } from "@/lib/cursor-avatar";

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

function StaticAvatarFallback() {
  return (
    <div className="relative z-20 h-full min-h-[250px] w-full overflow-hidden bg-transparent sm:min-h-[350px]" role="img" aria-label="Interactive particle avatar loading">
    </div>
  );
}

class AvatarRenderBoundary extends Component<{ children: ReactNode; onReady?: () => void }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onReady?.();
    if (process.env.NODE_ENV === "development") {
      console.warn("Avatar WebGL render failed; using the background-only fallback.", error, info);
    }
  }

  render() {
    return this.state.hasError ? <StaticAvatarFallback /> : this.props.children;
  }
}

export default function AvatarParticlesCanvas({ onReady }: { onReady?: () => void }) {
  const [canRenderWebgl, setCanRenderWebgl] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [pixelRatio, setPixelRatio] = useState<[number, number]>([1, 1.25]);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  const markReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const browser = navigator as NavigatorWithConnection;
    const saveData = browser.connection?.saveData === true;

    // Preserve the original model and particle density, but avoid high-DPI
    // rasterization on constrained devices. This does not resize, reposition,
    // or thin the avatar geometry.
    const lowPowerDevice =
      saveData ||
      (typeof browser.deviceMemory === "number" && browser.deviceMemory <= 4) ||
      (typeof browser.hardwareConcurrency === "number" && browser.hardwareConcurrency <= 4);
    setPixelRatio(lowPowerDevice ? [0.8, 1] : [1, 1.25]);

    if (prefersReducedMotion || isSmallScreen || saveData) {
      markReady();
      return;
    }

    const checkWebgl = () => {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl2", { antialias: false }) ||
        canvas.getContext("webgl", { antialias: false }) ||
        canvas.getContext("experimental-webgl", { antialias: false });

      if (context) {
        setCanRenderWebgl(true);
      } else {
        markReady();
      }
    };

    checkWebgl();
  }, [markReady]);

  useEffect(() => {
    setAvatarCursorHover(hoverActive);
  }, [hoverActive]);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const updateActivity = () => {
      setIsActive(document.visibilityState === "visible");
    };
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting && document.visibilityState === "visible"),
      { threshold: 0.05 },
    );

    observer.observe(container);
    document.addEventListener("visibilitychange", updateActivity);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateActivity);
    };
  }, [canRenderWebgl]);

  useEffect(() => {
    return () => setAvatarCursorHover(false);
  }, []);

  if (!canRenderWebgl) {
    return <StaticAvatarFallback />;
  }

  return (
    <AvatarRenderBoundary onReady={markReady}>
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 z-20 h-full w-full"
        onPointerEnter={() => setHoverActive(true)}
        onPointerLeave={() => setHoverActive(false)}
        role="img"
        aria-label="Interactive particle avatar"
      >
        <Suspense fallback={<StaticAvatarFallback />}>
          <Canvas
            frameloop={isActive ? "always" : "never"}
            dpr={pixelRatio}
            camera={{ position: [-0.28, -0.48, -0.82], fov: 58 }}
            gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          >
            <AvatarParticles hoverActive={hoverActive} onReady={markReady} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.7}
              target={[0, 0.14, 0]}
              minPolarAngle={2.18}
              maxPolarAngle={2.18}
            />
          </Canvas>
        </Suspense>
      </div>
    </AvatarRenderBoundary>
  );
}
