"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glow = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    if (!pointer.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event: PointerEvent) => { glow.current?.style.setProperty("transform", `translate3d(${event.clientX}px, ${event.clientY}px, 0)`); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <span className="cursor-glow" ref={glow} aria-hidden="true" />;
}
