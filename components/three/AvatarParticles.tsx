"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useEffect, useCallback } from "react";
import { setAvatarCursorHover } from "@/lib/cursor-avatar";

type AvatarParticlesProps = {
  density?: number;
  particleSize?: number;
  hoverIntensity?: number;
};

export default function AvatarParticles({
  density = 7, // Increased skip step (threshold) to reduce particle count and improve performance
  particleSize = 0.5, // Slightly larger to maintain volume with fewer particles
  hoverIntensity = 0.02,
}: AvatarParticlesProps) {
  const { scene } = useGLTF("/assets/avatar.glb");
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, raycaster, pointer } = useThree();
  
  // Mouse position in 3D space
  const mouse3D = useRef(new THREE.Vector3(0, 0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: particleSize * (typeof window !== "undefined" ? window.devicePixelRatio : 2) },
      uColorA: { value: new THREE.Color("#FFFFFF") },
      uColorB: { value: new THREE.Color("#1342FF") },
    }),
    [particleSize]
  );

  const { geometry, origins, phases } = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });
    
    if (meshes.length === 0) {
      return { geometry: new THREE.BufferGeometry(), origins: new Float32Array(0), phases: new Float32Array(0) };
    }

    const mesh = meshes[0];
    const srcGeom = mesh.geometry as THREE.BufferGeometry;
    const posAttr = srcGeom.getAttribute("position") as THREE.BufferAttribute;
    const count = posAttr.count;
    const step = density;
    const particleCount = Math.floor(count / step);
    
    const positions = new Float32Array(particleCount * 3);
    const origins = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    let j = 0;
    for (let i = 0; i < count; i += step) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      
      positions[j * 3 + 0] = x;
      positions[j * 3 + 1] = y;
      positions[j * 3 + 2] = z;
      
      origins[j * 3 + 0] = x;
      origins[j * 3 + 1] = y;
      origins[j * 3 + 2] = z;
      
      phases[j] = Math.random() * Math.PI * 2;
      j++;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    
    return { geometry: g, origins, phases };
  }, [scene, density]);

  // Velocities state (CPU physics)
  const velocitiesRef = useRef(new Float32Array(origins.length));
  
  const hitSphere = useMemo(() => {
    if (origins.length === 0) return null;
    const box = new THREE.Box3();
    const v = new THREE.Vector3();
    for (let i = 0; i < origins.length; i += 3) {
      v.set(origins[i], origins[i + 1], origins[i + 2]);
      box.expandByPoint(v);
    }
    const sp = new THREE.Sphere();
    box.getBoundingSphere(sp);
    const radius = Math.max(sp.radius * 1.25, 0.45);
    return { center: sp.center.clone(), radius };
  }, [origins]);

  useEffect(() => {
    velocitiesRef.current = new Float32Array(origins.length);
  }, [origins]);

  const onAvatarOver = useCallback(() => setAvatarCursorHover(true), []);
  const onAvatarOut = useCallback(() => setAvatarCursorHover(false), []);

  useEffect(() => {
    return () => setAvatarCursorHover(false);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    // Update uniforms
    uniforms.uTime.value = state.clock.getElapsedTime();
    
    // Update mouse 3D position
    raycaster.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersection);
    mouse3D.current.lerp(intersection, 0.32);

    // CPU Physics Update
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = velocitiesRef.current;
    const count = positions.length / 3;
    
    // Physics constants
    const damping = 0.92;      // Increased friction (0.90 -> 0.92) for slower movement
    const stiffness = 0.01;    // Reduced return strength (0.02 -> 0.01)
    const repulsionRadius = 2.5;
    const repulsionStrength = hoverIntensity * 0.02; // Reduced force multiplier (0.05 -> 0.02)
    const time = state.clock.getElapsedTime();

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
      if (distSq < repulsionRadius * repulsionRadius) {
        const dist = Math.sqrt(distSq);
        const force = (1.0 - dist / repulsionRadius) * repulsionStrength;
        // Randomize direction slightly to create "scatter" feel
        fx += (dx / dist + (Math.random() - 0.5) * 0.5) * force;
        fy += (dy / dist + (Math.random() - 0.5) * 0.5) * force;
        fz += (dz / dist + (Math.random() - 0.5) * 0.5) * force;
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
    varying float vPhase;
    
    void main() {
      vPhase = aPhase;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = uSize / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vPhase;
    
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      
      float alpha = smoothstep(0.5, 0.0, d);
      // Mix colors based on Y position and random phase
      vec3 color = mix(uColorA, uColorB, 0.5 + 0.5 * sin(vPhase));
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <group>
      {hitSphere && (
        <mesh
          position={hitSphere.center}
          onPointerOver={(e) => {
            e.stopPropagation();
            onAvatarOver();
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onAvatarOut();
          }}
        >
          <sphereGeometry args={[hitSphere.radius, 28, 28]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
    </group>
  );
}

// Preload the GLB
useGLTF.preload("/assets/avatar.glb");
