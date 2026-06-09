"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";

type AvatarParticlesProps = {
  density?: number;
  particleSize?: number;
  hoverIntensity?: number;
  hoverActive?: boolean;
};

export default function AvatarParticles({
  density = 4,
  particleSize = 0.82,
  hoverIntensity = 0.028,
  hoverActive = false,
}: AvatarParticlesProps) {
  const { scene } = useGLTF("/assets/avatar.glb");
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, raycaster, pointer } = useThree();
  
  // Mouse position in 3D space
  const mouse3D = useRef(new THREE.Vector3(0, 0, 0));
  const interactionPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const intersectionPoint = useRef(new THREE.Vector3());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: particleSize * (typeof window !== "undefined" ? window.devicePixelRatio : 2) },
      uColorCore: { value: new THREE.Color("#F8FBFF") },
      uColorAccent: { value: new THREE.Color("#7FD4FF") },
      uColorEdge: { value: new THREE.Color("#1342FF") },
    }),
    [particleSize]
  );

  const { geometry, origins, phases, jitters } = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });
    
    if (meshes.length === 0) {
      return {
        geometry: new THREE.BufferGeometry(),
        origins: new Float32Array(0),
        phases: new Float32Array(0),
        jitters: new Float32Array(0),
      };
    }

    const mesh = meshes[0];
    const srcGeom = mesh.geometry as THREE.BufferGeometry;
    const posAttr = srcGeom.getAttribute("position") as THREE.BufferAttribute;
    const bounds = new THREE.Box3().setFromBufferAttribute(posAttr);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const lift = size.y * 0.12;
    const count = posAttr.count;
    const step = density;
    const particleCount = Math.floor(count / step);
    
    const positions = new Float32Array(particleCount * 3);
    const origins = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const jitters = new Float32Array(particleCount * 3);
    const heights = new Float32Array(particleCount);

    let j = 0;
    for (let i = 0; i < count; i += step) {
      const sourceY = posAttr.getY(i);
      const x = posAttr.getX(i) - center.x;
      const y = sourceY - center.y + lift;
      const z = posAttr.getZ(i) - center.z;
      
      positions[j * 3 + 0] = x;
      positions[j * 3 + 1] = y;
      positions[j * 3 + 2] = z;
      
      origins[j * 3 + 0] = x;
      origins[j * 3 + 1] = y;
      origins[j * 3 + 2] = z;
      
      phases[j] = Math.random() * Math.PI * 2;
      jitters[j * 3 + 0] = (Math.random() - 0.5) * 0.5;
      jitters[j * 3 + 1] = (Math.random() - 0.5) * 0.5;
      jitters[j * 3 + 2] = (Math.random() - 0.5) * 0.5;
      heights[j] = THREE.MathUtils.clamp((sourceY - bounds.min.y) / Math.max(size.y, 0.0001), 0, 1);
      j++;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    g.setAttribute("aHeight", new THREE.BufferAttribute(heights, 1));
    
    return { geometry: g, origins, phases, jitters };
  }, [scene, density]);

  // Velocities state (CPU physics)
  const velocitiesRef = useRef(new Float32Array(origins.length));

  useEffect(() => {
    velocitiesRef.current = new Float32Array(origins.length);
  }, [origins]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Update uniforms
    uniforms.uTime.value = state.clock.getElapsedTime();
    
    // Update mouse 3D position
    if (hoverActive) {
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(interactionPlane.current, intersectionPoint.current);
      mouse3D.current.lerp(intersectionPoint.current, 0.1);
    }

    // CPU Physics Update
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;
    const count = positions.length / 3;
    
    // Physics constants
    const damping = 0.92;      // Increased friction (0.90 -> 0.92) for slower movement
    const stiffness = 0.01;    // Reduced return strength (0.02 -> 0.01)
    const repulsionRadius = 2.5;
    const repulsionStrength = hoverIntensity * 0.02; // Reduced force multiplier (0.05 -> 0.02)
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Current Pos
      const px = positions[ix];
      const py = positions[iy];
      const pz = positions[iz];

      // Origin Pos (static, no auto-breathing)
      // We remove the time-based sine wave to stop automatic movement
      const ox = origins[ix];
      const oy = origins[iy];
      const oz = origins[iz];

      // Vector to Mouse
      const dx = px - mouse3D.current.x;
      const dy = py - mouse3D.current.y;
      const dz = pz - mouse3D.current.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      // Forces
      let fx = 0, fy = 0, fz = 0;

      // Repulsion (only if close)
      if (hoverActive && distSq < repulsionRadius * repulsionRadius) {
        const dist = Math.sqrt(distSq);
        const force = (1.0 - dist / repulsionRadius) * repulsionStrength;
        fx += (dx / dist + jitters[ix]) * force;
        fy += (dy / dist + jitters[iy]) * force;
        fz += (dz / dist + jitters[iz]) * force;
      }

      // Spring Return Force
      fx += (ox - px) * stiffness;
      fy += (oy - py) * stiffness;
      fz += (oz - pz) * stiffness;

      // Update Velocity
      velocities[ix] = (velocities[ix] + fx) * damping;
      velocities[iy] = (velocities[iy] + fy) * damping;
      velocities[iz] = (velocities[iz] + fz) * damping;

      // Update Position
      positions[ix] += velocities[ix];
      positions[iy] += velocities[iy];
      positions[iz] += velocities[iz];
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const vertexShader = `
    uniform float uSize;
    attribute float aPhase;
    attribute float aHeight;
    varying float vPhase;
    varying float vHeight;
    varying float vDepth;
    
    void main() {
      vPhase = aPhase;
      vHeight = aHeight;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vDepth = -mvPosition.z;
      gl_PointSize = uSize * (1.0 + aHeight * 0.35) / max(vDepth, 0.0001);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorAccent;
    uniform vec3 uColorEdge;
    varying float vPhase;
    varying float vHeight;
    varying float vDepth;
    
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      
      float ring = smoothstep(0.5, 0.18, d);
      float core = smoothstep(0.22, 0.0, d);
      float scan = 0.88 + 0.12 * sin(vHeight * 18.0 + vPhase * 3.0 + uTime * 1.35);
      float depthFade = smoothstep(3.2, 0.75, vDepth);
      float torsoFocus = smoothstep(0.2, 0.55, vHeight) * (1.0 - smoothstep(0.78, 1.0, vHeight));
      float faceFocus = smoothstep(0.62, 0.95, vHeight);
      float accentMix = 0.35 + 0.45 * faceFocus + 0.2 * abs(sin(vPhase * 1.7));
      vec3 color = mix(uColorAccent, uColorCore, accentMix);
      color = mix(color, uColorEdge, 0.25 + torsoFocus * 0.2);
      float alpha = (ring * 0.62 + core * 0.95) * scan * depthFade * (0.82 + faceFocus * 0.38);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <points ref={pointsRef} geometry={geometry} position={[-0.02, 0.06, 0]}>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </points>
  );
}

// Preload the GLB
useGLTF.preload("/assets/avatar.glb");
