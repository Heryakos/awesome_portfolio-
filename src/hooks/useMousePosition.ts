"use client";

import { useEffect, useRef } from "react";

interface MousePosition {
  x: number; // normalized -1 to +1
  y: number; // normalized -1 to +1
}

/**
 * Returns normalized mouse position (-1 to +1) updated on mousemove.
 * Returns { x: 0, y: 0 } on touch devices.
 */
export function useMousePosition(): MousePosition {
  const posRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return posRef.current;
}
