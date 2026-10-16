import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "../../content/site";
import ClientProviders from "@/components/ClientProviders";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#EFEBE3",
};

// ── Typography ───────────────────────────────────────────
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "wdth"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_TITLE = `${SITE.name} — ${SITE.role}`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE.description,
  metadataBase: new URL(SITE.siteUrl),
  openGraph: {
    title: SITE_TITLE,
    description: SITE.description,
    url: SITE.siteUrl,
    siteName: SITE.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {/*
          ClientProviders mounts:
            - CustomCursor  (ssr:false — only on pointer devices)
            - Nav           (usePathname — adapts per route)
            - SmoothScroll  (Lenis — ssr:false)
          All three now appear on EVERY page including /work/[slug]
        */}
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
