"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { DumbbellMark } from "./dumbbell-mark";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false, loading: () => null });

type Mode = "static" | "3d";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Decides whether to load the 3D scene. The static illustration is always
 * rendered first and stays until the scene reports it is ready, so there is
 * never an empty box. Rules:
 * - viewport under 1024px: static only (keeps ~600 KB of three.js off phones)
 * - prefers-reduced-motion: static only
 * - Save-Data or no WebGL: static only
 * - otherwise load after the browser is idle so the hero image wins LCP
 */
export function HeroAccent({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("static");
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (!wide || reducedMotion || saveData || !supportsWebGL()) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setMode("3d");
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(start, 1200);
    }
    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-0" : "opacity-100"}`}
      >
        <DumbbellMark className="h-full w-full" />
      </div>
      {mode === "3d" ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
          <HeroScene onReady={() => setSceneReady(true)} />
        </div>
      ) : null}
    </div>
  );
}
