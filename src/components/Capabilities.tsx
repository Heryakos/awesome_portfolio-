"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE } from "../../content/site";

gsap.registerPlugin(ScrollTrigger);

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // List items stagger in
      const items = listRef.current?.querySelectorAll("li") ?? [];
      gsap.from(Array.from(items), {
        opacity: 0,
        y: 16,
        duration: 0.6,
        stagger: 0.07,
        ease: "power2.out",
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Variable font hover for each item
      Array.from(items).forEach((item) => {
        const word = item.querySelector(".cap__word") as HTMLElement;
        const num = item.querySelector(".cap__num") as HTMLElement;
        if (!word || !num) return;

        const onEnter = () => {
          gsap.to(word, {
            fontVariationSettings: '"wdth" 150, "opsz" 72',
            color: "var(--vermilion)",
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(num, { x: 10, opacity: 1, duration: 0.25, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(word, {
            fontVariationSettings: '"wdth" 100, "opsz" 40',
            color: "var(--ink)",
            duration: 0.4,
            ease: "power2.inOut",
          });
          gsap.to(num, { x: 0, opacity: 0.3, duration: 0.3, ease: "power2.inOut" });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      aria-label="Capabilities"
      style={{
        padding: "clamp(5rem, 10vh, 8rem) clamp(1.5rem, 5vw, 5rem)",
        background: "var(--paper)",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        ref={headRef}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "clamp(3rem, 6vh, 5rem)",
          borderBottom: "1px solid var(--ink-10)",
          paddingBottom: "1.5rem",
        }}
      >
        <div>
          <div className="t-label" style={{ opacity: 0.4, marginBottom: "0.5rem" }}>
            06 — Capabilities &amp; Disciplines
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.025em",
              fontVariationSettings: '"wdth" 125, "opsz" 40',
            }}
          >
            What I do
          </h2>
        </div>
        <p
          className="t-editorial"
          style={{
            fontSize: "clamp(0.85rem, 1.4vw, 1.2rem)",
            color: "var(--ink)",
            opacity: 0.5,
            maxWidth: "22ch",
            textAlign: "right",
          }}
        >
          Hover each discipline
        </p>
      </div>

      {/* Typographic list */}
      <ul
        ref={listRef}
        role="list"
        style={{ listStyle: "none", borderTop: "1px solid var(--ink-10)" }}
      >
        {SITE.capabilities.map((cap, i) => (
          <li
            key={cap}
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--ink-10)",
              padding: "clamp(1rem, 2.5vh, 1.8rem) 0",
              cursor: "default",
            }}
          >
            <span
              className="cap__word"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 3.5vw, 4rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                fontVariationSettings: '"wdth" 100, "opsz" 40',
                willChange: "font-variation-settings, color",
              }}
            >
              {cap}
            </span>
            <span
              className="cap__num t-label"
              style={{ opacity: 0.3, flexShrink: 0, marginLeft: "1.5rem" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
