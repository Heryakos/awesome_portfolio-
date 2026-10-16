// ============================================================
// PROJECTS CONTENT — Yeabsira Addis's real portfolio work
// Extracted and verified from her Upwork and professional showcase.
// ============================================================

export interface Project {
  slug:         string;
  index:        string;
  title:        string;
  client:       string;
  discipline:   string;
  year:         string;
  idea:         string;
  direction:    string;
  deliverables: string[];
  images:       string[];
  palette:      [string, string, string]; // [bg, fg, accent]
  placeholder:  boolean;
}

export const PROJECTS: Project[] = [
  {
    slug:        "my-perfect-logo-collection",
    index:       "01",
    title:       "My Perfect Logo Collection",
    client:      "Diverse Startups & Brands",
    discipline:  "Logo Design & Brand Identity",
    year:        "2024 – 2025",
    idea:
      "A versatile showcase of unique and impactful logo designs created for software startups, fashion labels, real estate agencies, and coffee brands — built to communicate brand essence at a glance.",
    direction:
      "Engineered with clean geometric grids, custom letterforms, and vibrant color palettes in Adobe Illustrator. Each mark was developed with strict optical balance to ensure instant recognition from 16px favicons to building signage.",
    deliverables: [
      "Primary & secondary logo marks",
      "Vector source files (AI, EPS, SVG)",
      "Monochrome and color variations",
      "Favicon and app icon adaptations",
      "Brand style specification sheet",
    ],
    images:      ["/work/my-perfect-logo-collection/cover.jpg"],
    palette:     ["#0D0D0D", "#EFEBE3", "#FF4A1C"],
    placeholder: false,
  },
  {
    slug:        "shodle-brand-transformation",
    index:       "02",
    title:       "Shodle Brand Transformation",
    client:      "Shodle",
    discipline:  "Brand Identity & Logo Design",
    year:        "2025",
    idea:
      "Bringing vision to life through Shodle's brand transformation — integrating cultural symbolism, modern creativity, and strategic design elements into a unified identity.",
    direction:
      "Centered on an interlocking monogram mark that conveys connection, momentum, and structural elegance. Paired with clean grotesque sans typography and a dramatic crimson and deep charcoal palette.",
    deliverables: [
      "Custom brand monogram mark",
      "Primary & secondary logotypes",
      "Typography system and hierarchy",
      "Color specifications (Pantone, HEX, CMYK)",
      "Social media brand identity kit",
    ],
    images:      ["/work/shodle-brand-transformation/cover.jpg"],
    palette:     ["#1F0808", "#EFEBE3", "#E31E24"],
    placeholder: false,
  },
  {
    slug:        "youtube-thumbnails-showcase",
    index:       "03",
    title:       "Capturing Clicks: YouTube Showcase",
    client:      "Content Creators & Channels (Etubers & More)",
    discipline:  "Digital Visual Design & Retouching",
    year:        "2023 – 2025",
    idea:
      "High-converting YouTube thumbnails in finance, entrepreneurship, and storytelling designed to stand out in competitive feeds, spark curiosity, and maximize CTR.",
    direction:
      "Built with high-contrast color grading, expressive portrait enhancement, clear focal points, and bold editorial type hierarchy that delivers high comprehension in less than a second on mobile screens.",
    deliverables: [
      "High-CTR thumbnail compositions",
      "Photoshop portrait retouching & lighting",
      "Custom title typography styling",
      "Visual hook & curiosity architecture",
      "Fast-turnaround content templates",
    ],
    images:      ["/work/youtube-thumbnails-showcase/cover.jpg"],
    palette:     ["#0A0A10", "#EFEBE3", "#00B4D8"],
    placeholder: false,
  },
  {
    slug:        "stylish-product-packaging",
    index:       "04",
    title:       "Stylish Packaging Collection",
    client:      "Consumer Hardware & Retail Brands",
    discipline:  "Product Packaging & Display Graphics",
    year:        "2024 – 2025",
    idea:
      "Solving client challenges with elegant, structured packaging design for consumer electronics and retail products that captivates shoppers and reflects premium craftsmanship.",
    direction:
      "Developed full die-line packaging structures, integrating photorealistic 3D product renders, technical iconography, regulatory compliance layouts, and bold retail shelf presence.",
    deliverables: [
      "Full packaging dieline & layout design",
      "Product feature icon suite",
      "Typography & specification grid",
      "3D packaging renders & mockups",
      "Print-ready CMYK production files",
    ],
    images:      ["/work/stylish-product-packaging/cover.jpg"],
    palette:     ["#0C1E2C", "#EFEBE3", "#FF6B35"],
    placeholder: false,
  },
];
