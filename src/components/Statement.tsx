"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  { text: "I turn ideas",    color: "var(--ink)" },
  { text: "into visual",     color: "var(--ink)" },
  { text: "experiences.",    color: "var(--vermilion)" },
];

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef  = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label fades in first
      gsap.from(labelRef.current, {
        opacity: 0,
        y: 8,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Each line reveals from below
      linesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { yPercent: 105, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
            delay: i * 0.11,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Variable-font width morphs on scroll (kinetic typography)
      const firstLine = linesRef.current[0];
      if (firstLine) {
        gsap.to(firstLine, {
          fontVariationSettings: '"wdth" 145, "opsz" 72',
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 30%",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="statement"
      ref={sectionRef}
      aria-label="Designer statement"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(6rem, 12vh, 10rem) clamp(1.5rem, 5vw, 5rem)",
        overflow: "hidden",
        position: "relative",
        background: "var(--paper)",
      }}
    >
      {/* Decorative vertical line — editorial detail */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          right: "clamp(1.5rem, 5vw, 5rem)",
          width: "1px",
          height: "30%",
          background: "var(--ink)",
          opacity: 0.12,
        }}
      />

      {/* Section label */}
      <div
        ref={labelRef}
        className="t-label"
        style={{ opacity: 0.35, marginBottom: "clamp(2rem, 5vh, 4rem)" }}
        aria-hidden="true"
      >
        01 — Statement
      </div>

      {/* Kinetic headline */}
      <div aria-hidden="true">
        {LINES.map((line, i) => (
          <div
            key={i}
            style={{ overflow: "hidden", lineHeight: "0.95" }}
          >
            <span
              ref={(el) => { linesRef.current[i] = el; }}
              style={{
                display: "block",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(3rem, 10vw, 12rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
                color: line.color,
                fontVariationSettings: '"wdth" 110, "opsz" 72',
                willChange: "transform, opacity, font-variation-settings",
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>

      {/* Screen-reader version */}
      <p className="sr-only">
        I turn ideas into visual experiences.
      </p>
    </section>
  );
}
