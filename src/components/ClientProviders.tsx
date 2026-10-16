"use client";

import dynamic from "next/dynamic";
import Nav from "./Nav";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });

/**
 * Client-side providers that wrap every page:
 * - CustomCursor (ssr:false, pointer devices only)
 * - SmoothScroll (Lenis, ssr:false)
 * - Nav (needs usePathname — client)
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <Nav />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
