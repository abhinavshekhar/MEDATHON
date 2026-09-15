"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars } from "@react-three/drei";
import type { Group, Mesh, Points } from "three";

function DnaHelix() {
  const group = useRef<Group>(null);

  const spheres = useMemo(() => {
    const items: { pos: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < 36; i++) {
      const t = i * 0.32;
      const y = i * 0.16 - 2.8;
      items.push({
        pos: [Math.cos(t) * 1.3, y, Math.sin(t) * 1.3],
        color: "#05968c",
      });
      items.push({
        pos: [Math.cos(t + Math.PI) * 1.3, y, Math.sin(t + Math.PI) * 1.3],
        color: "#7d3bed",
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.25;
  });

  return (
    <group ref={group}>
      {spheres.map((s, i) => (
        <Sphere key={i} position={s.pos} args={[0.07, 12, 12]}>
          <meshStandardMaterial
            color={s.color}
            emissive={s.color}
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.25}
          />
        </Sphere>
      ))}
    </group>
  );
}

function CoreOrb() {
  const mesh = useRef<Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.z = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.05, 1]} />
        <MeshDistortMaterial
          color="#05968c"
          distort={0.4}
          speed={2.2}
          roughness={0.15}
          metalness={0.85}
          emissive="#0369a1"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing() {
  const ring = useRef<Mesh>(null);

  useFrame((state) => {
    if (ring.current) ring.current.rotation.z = state.clock.elapsedTime * 0.35;
  });

  return (
    <mesh ref={ring} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[2.1, 0.03, 16, 100]} />
      <meshStandardMaterial color="#14b8a6" emissive="#05968c" emissiveIntensity={0.5} transparent opacity={0.7} />
    </mesh>
  );
}

function ParticleField() {
  const points = useRef<Points>(null);
  const count = 180;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 14;
    return arr;
  }, []);

  useFrame((state) => {
    if (points.current) points.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#2dd4bf" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 5]} intensity={1.1} />
      <pointLight position={[-5, 3, 4]} color="#7d3bed" intensity={2.2} />
      <pointLight position={[5, -2, 3]} color="#05968c" intensity={1.8} />
      <CoreOrb />
      <DnaHelix />
      <OrbitRing />
      <ParticleField />
      <Stars radius={40} depth={30} count={1200} factor={3} saturation={0.4} fade speed={0.4} />
    </>
  );
}

export function MedicalHeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 6.5], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <SceneContent />
    </Canvas>
  );
}
