"use client";

import { useState, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Nav from "./Nav";
import { CmsProvider } from "./CmsContext";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const CmsEditor = dynamic(() => import("./CmsEditor"), { ssr: false });
const CmsToggle = dynamic(() => import("./CmsToggle"), { ssr: false });

/**
 * Client-side providers that wrap every page:
 * - CmsProvider  (visual editor state & localStorage persistence)
 * - CmsEditor    (ssr:false — floating design panel)
 * - CmsToggle    (ssr:false — floating action button)
 * - CustomCursor (ssr:false, pointer devices only)
 * - Nav          (usePathname — adapts per route)
 * - SmoothScroll (Lenis, ssr:false)
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <CmsProvider>
      {mounted && <CustomCursor />}
      <Nav />
      {mounted && <CmsEditor />}
      {mounted && <CmsToggle />}
      <SmoothScroll>{children}</SmoothScroll>
    </CmsProvider>
  );
}
