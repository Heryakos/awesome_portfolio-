"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Work from "@/components/Work";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {/* Loader — shown until animation completes */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      <main id="main-content">
        {/* 01 — Hero */}
        <Hero />

        {/* 02 — Statement */}
        <Statement />

        {/* 03 — Work */}
        <Work />

        {/* 04 — About */}
        <About />

        {/* 05 — Capabilities */}
        <Capabilities />

        {/* 06 — Contact */}
        <Contact />
      </main>
    </>
  );
}
