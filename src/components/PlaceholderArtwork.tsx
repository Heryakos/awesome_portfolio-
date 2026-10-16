"use client";

import { useEffect, useRef } from "react";

interface PlaceholderArtworkProps {
  palette: [string, string, string];
  index: number;
  title: string;
  discipline: string;
}

/**
 * Procedurally-generated canvas artwork for each project panel.
 * PLACEHOLDER: replace by adding real images and setting placeholder: false in /content/projects.ts
 */
export default function PlaceholderArtwork({
  palette,
  index,
  title,
  discipline,
}: PlaceholderArtworkProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const [bg, fg, acc] = palette;

      // Background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const compositions = [compBrandSystem, compLogoMark, compColorSystem, compTypeSystem];
      compositions[index % compositions.length](ctx, w, h, bg, fg, acc, title, discipline);
    };

    draw();

    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [palette, index, title, discipline]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
      role="img"
      aria-label={`Placeholder artwork for ${title} — ${discipline}`}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// ── Composition 0: Brand System — overlapping circles + giant initial
function compBrandSystem(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  bg: string, fg: string, acc: string, title: string, _disc: string
) {
  // Large black circle, off-centre
  ctx.beginPath();
  ctx.arc(w * 0.3, h * 0.4, Math.min(w, h) * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = fg;
  ctx.fill();

  // Vermilion circle, overlapping
  ctx.beginPath();
  ctx.arc(w * 0.58, h * 0.58, Math.min(w, h) * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = acc;
  ctx.fill();

  // Vertical hairline
  ctx.strokeStyle = bg;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h * 0.04);
  ctx.lineTo(w * 0.3, h * 0.96);
  ctx.stroke();

  // Giant initial, very transparent
  ctx.save();
  ctx.font = `900 ${Math.min(w, h) * 0.65}px sans-serif`;
  ctx.fillStyle = bg;
  ctx.globalAlpha = 0.09;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((title[0] || "Y").toUpperCase(), w * 0.38, h * 0.44);
  ctx.restore();
}

// ── Composition 1: Logo Mark — nested rectangles + diagonal
function compLogoMark(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  bg: string, fg: string, acc: string, _title: string, _disc: string
) {
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = acc;
  ctx.fillRect(w * 0.06, h * 0.06, w * 0.5, h * 0.5);

  ctx.fillStyle = bg;
  ctx.fillRect(w * 0.11, h * 0.11, w * 0.4, h * 0.4);

  // Diagonal accent line
  ctx.strokeStyle = acc;
  ctx.lineWidth = Math.max(2, w * 0.005);
  ctx.beginPath();
  ctx.moveTo(w * 0.06, h * 0.56);
  ctx.lineTo(w * 0.94, h * 0.94);
  ctx.stroke();

  // Small accent square
  ctx.fillStyle = acc;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(w * 0.65, h * 0.65, w * 0.2, h * 0.2);
  ctx.globalAlpha = 1;

  // Inner square
  ctx.fillStyle = bg;
  ctx.fillRect(w * 0.71, h * 0.71, w * 0.08, h * 0.08);
}

// ── Composition 2: Color System — horizontal bands with overlay text
function compColorSystem(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  bg: string, fg: string, acc: string, _title: string, _disc: string
) {
  const bands = 6;
  const cols = [acc, fg, bg, acc, bg, fg];
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = cols[i];
    ctx.fillRect(0, (h / bands) * i, w, h / bands + 1);
  }

  // Rotated title overlay
  ctx.save();
  ctx.translate(w * 0.5, h * 0.5);
  ctx.rotate(-Math.PI / 10);
  ctx.font = `900 ${w * 0.3}px sans-serif`;
  ctx.fillStyle = bg;
  ctx.globalAlpha = 0.12;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("COLOR", 0, 0);
  ctx.restore();

  // Horizontal rule at midpoint
  ctx.strokeStyle = bg;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(w * 0.08, h * 0.5);
  ctx.lineTo(w * 0.92, h * 0.5);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// ── Composition 3: Type System — large letterform + lines
function compTypeSystem(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  bg: string, fg: string, acc: string, _title: string, _disc: string
) {
  ctx.fillStyle = fg;
  ctx.fillRect(0, 0, w, h);

  // Giant letterform ghost
  ctx.save();
  ctx.font = `900 ${w * 0.85}px sans-serif`;
  ctx.fillStyle = bg;
  ctx.globalAlpha = 0.07;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("A", -w * 0.12, -h * 0.05);
  ctx.restore();

  // Vermilion band
  ctx.fillStyle = acc;
  ctx.fillRect(0, h * 0.74, w, h * 0.055);

  // Abstract text lines
  ctx.strokeStyle = bg;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 7; i++) {
    const y = h * 0.14 + i * (h * 0.065);
    const lw = (0.5 + Math.sin(i * 1.1) * 0.3) * w * 0.72;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, y);
    ctx.lineTo(w * 0.1 + lw, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
