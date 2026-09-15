"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Points } from "three";

function FloatingParticles() {
  const ref = useRef<Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = Math.random() * 20 - 5;
      arr[i * 3 + 1] = Math.random() * 12 - 2;
      arr[i * 3 + 2] = Math.random() * -8 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#05968c" transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <FloatingParticles />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 via-transparent to-violet-50/20" />
    </div>
  );
}
