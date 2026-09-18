"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

type HeroSceneProps = {
  /** Called once the WebGL context exists and the first frame can render. */
  onReady?: () => void;
  /** Lower geometry detail for constrained devices. */
  lowDetail?: boolean;
};

/**
 * Stylised dumbbell: matte charcoal hex plates, brushed steel bar, a
 * restrained lime collar. Rotates slowly and floats. No user interaction
 * is required; the scene is decorative and sits behind accessible HTML.
 */
function Dumbbell({ lowDetail }: { lowDetail: boolean }) {
  const group = useRef<Group>(null);
  const seg = lowDetail ? 24 : 48;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y += delta * 0.28;
    g.rotation.x = -0.35 + Math.sin(t * 0.45) * 0.12;
    g.rotation.z = 0.28 + Math.sin(t * 0.3) * 0.05;
    g.position.y = Math.sin(t * 0.8) * 0.07;
  });

  const plate = { color: "#2b2e33", metalness: 0.55, roughness: 0.42 };
  const bar = { color: "#a7adb7", metalness: 0.95, roughness: 0.22 };
  const collar = { color: "#c8ef3a", metalness: 0.2, roughness: 0.5, emissive: "#8fb60c", emissiveIntensity: 0.25 };

  return (
    <group ref={group} rotation={[-0.35, 0.6, 0.28]}>
      {/* bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 3.1, seg]} />
        <meshStandardMaterial {...bar} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 1.05, 0, 0]}>
          {/* lime collar */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.17, 0.17, 0.14, seg]} />
            <meshStandardMaterial {...collar} />
          </mesh>
          {/* inner hex plate */}
          <mesh position={[side * 0.28, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.6, 0.6, 0.34, 6]} />
            <meshStandardMaterial {...plate} flatShading />
          </mesh>
          {/* outer hex plate */}
          <mesh position={[side * 0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.48, 0.48, 0.26, 6]} />
            <meshStandardMaterial {...plate} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function HeroScene({ onReady, lowDetail = false }: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  // Pause rendering when the accent scrolls out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause rendering when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const active = inView && pageVisible;

  return (
    <div ref={wrapper} className="h-full w-full">
      <Canvas
        dpr={lowDetail ? 1 : [1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 32 }}
        gl={{ antialias: !lowDetail, alpha: true, powerPreference: "low-power" }}
        frameloop={active ? "always" : "never"}
        onCreated={() => onReady?.()}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#dbe4f0" />
        <pointLight position={[-2.5, -1.5, 2.5]} intensity={5} color="#c8ef3a" distance={8} />
        <Dumbbell lowDetail={lowDetail} />
      </Canvas>
    </div>
  );
}
