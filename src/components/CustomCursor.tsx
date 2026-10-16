"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // ── Skip on touch-only devices ─────────────────────────
    if (window.matchMedia("(hover: none)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    // Position dot immediately on move
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // Ring lerps toward dot
    let raf: number;
    const onRaf = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      gsap.set(ring, { x: ringX, y: ringY });
      raf = requestAnimationFrame(onRaf);
    };
    raf = requestAnimationFrame(onRaf);

    window.addEventListener("mousemove", onMouseMove);

    // ── Hover state — re-scan all interactive elements ─────
    const addLink   = () => document.body.classList.add("cursor--link");
    const removeLink = () => document.body.classList.remove("cursor--link");
    const addDrag   = () => document.body.classList.add("cursor--drag");
    const removeDrag = () => document.body.classList.remove("cursor--drag");

    const attach = () => {
      document.querySelectorAll("a, button, [data-cursor='link']").forEach(el => {
        el.addEventListener("mouseenter", addLink);
        el.addEventListener("mouseleave", removeLink);
      });
      document.querySelectorAll("[data-cursor='drag']").forEach(el => {
        el.addEventListener("mouseenter", addDrag);
        el.addEventListener("mouseleave", removeDrag);
      });
    };

    // Attach after a short delay so DOM is ready
    const timer = setTimeout(attach, 200);

    // Re-attach whenever DOM changes (catches dynamically rendered content)
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      setTimeout(attach, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      observer.disconnect();
      document.body.classList.remove("cursor--link", "cursor--drag");
    };
  }, [pathname]); // Re-run on every route change

  return (
    <>
      <div className="cursor" aria-hidden="true">
        <div className="cursor__dot" ref={dotRef} />
      </div>
      <div className="cursor__ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}
