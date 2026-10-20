# ✦ Yeabsira Addis — Creative Portfolio & Design Studio

<div align="center">

  <br />

  <h1>🎨 YEABSIRA ADDIS</h1>
  <p><strong>Senior Graphic & Logo Designer · Brand Identity Specialist · Visual Strategist</strong></p>
  <p>Addis Ababa, Ethiopia · Global Freelance & Remote Contracts</p>

  <br />

  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
  [![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Upwork Rating](https://img.shields.io/badge/Upwork-5.0_★_Top_Rated-14a800?style=for-the-badge&logo=upwork&logoColor=white)](https://www.upwork.com/freelancers/~011d172ba3b092f906)

  <br />

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-interactive-in-browser-cms">Visual CMS Studio</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-portfolio-projects">Featured Work</a> •
    <a href="#-verified-certifications">Certifications</a> •
    <a href="#-author--contact">Contact</a>
  </p>

</div>

---

## 📖 Overview

This repository houses the modern, high-performance portfolio website of **Yeabsira Addis (Yeab Addis)** — an Ethiopian Graphic & Logo Designer holding a BA in Business & Economics from Addis Ababa University and currently an MBA Candidate.

Built to break free from cookie-cutter portfolio templates, the experience couples Swiss-inspired brutalist typography, kinetic WebGL 3D elements, physics-based inertial scrolling, and a built-in live visual CMS editor. Every piece of work, metric, review, and certification featured in this portfolio is grounded in authentic professional engagements across East Africa and international clients on Upwork.

---

## ✨ Key Features

### 1. 🪐 Kinetic 3D Interactive Typography (`ThreeY.tsx`)
- High-fidelity **Three.js** and **React Three Fiber (R3F)** 3D canvas featuring an interactive "Y" logomark.
- Real-time mouse-tracking parallax, realistic studio lighting, reactive depth of field, and postprocessing.
- Dynamically configurable shader materials including **Obsidian**, **Vermilion**, **Liquid Gold**, **Chrome**, and **Wireframe**.

### 2. ⚡ Scroll-Linked Kinetic Typography & GSAP Motion
- Fluid variable font animations using **Bricolage Grotesque** and **Instrument Serif** with dynamic optical size (`opsz`) and width (`wdth`) interpolation.
- Text reveal effects driven by **GSAP ScrollTrigger** and smooth-settling easing curves (`power3.out`).
- Staggered entrance sequences with an editorial preloader countdown.

### 3. 🎯 Deep Interactive Case Studies (`/work/[slug]`)
- Comprehensive design breakdown pages for every major project:
  - Design challenge & core idea
  - Strategic visual direction & optical balance grids
  - Comprehensive itemized deliverables breakdown
  - Side-by-side color palette swatches (HEX, RGB, Pantone)
  - High-resolution design visualizer with **4K Fullscreen Zoom Lightbox**.

### 4. 🛠️ Live In-Browser Visual Studio CMS (`/admin`)
- Built-in live content management and styling panel.
- Allows real-time editing of headlines, biography, colors, 3D shader materials, and project visibilities.
- Instant live preview with zero page refresh.
- Persistent overrides using browser `localStorage` + JSON export and import capabilities.

### 5. 📜 Interactive Verified Credentials Lightbox
- Interactive gallery showcasing **14+ verified international certifications** from prestigious organizations:
  - **UNDP** (United Nations Development Programme) — Insurance & Risk Finance
  - **Humanitarian Leadership Academy** — Humanitarian Info Management & Media
  - **The Open University (UK)** — Strategic Leadership & EDI Management
  - **Cambridge International Qualifications (CIQ) / UniAthena** — Inventory & Operations Management
  - **LinkedIn Learning & HubSpot Academy** — Digital Advertising & Content Marketing
- Complete with verified credential IDs and direct verification URLs.

### 6. ⭐ Verified Client Testimonials & Upwork Record
- 100% on-time delivery record and **5.0 ★ Upwork Client Rating**.
- Documented real client contracts across real estate, technology, YouTube channels, and publishing.
- Verified client quotes, endorsements (*Committed to Quality*, *Solution Oriented*, *Accountable for Outcomes*), and logged project deliverables.

### 7. 🧈 Inertial Smooth Scroll & Custom Cursor
- Silky smooth scrolling driven by **Lenis** with synced GSAP ticker updates.
- Physics-based lagging cursor with magnetic hover states, subtle dot-ring dynamics, and `mix-blend-mode: difference` contrast inversion.

---

## 🛠 Tech Stack

| Category | Technologies / Libraries |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React Server & Client Components) |
| **Core UI Library** | [React 19](https://react.dev/) & [TypeScript 5](https://www.typescriptlang.org/) |
| **3D & WebGL** | [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) |
| **Animation** | [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger, [@gsap/react](https://www.npmjs.com/package/@gsap/react), [Framer Motion](https://www.framer.com/motion/) |
| **Scrolling** | [Lenis](https://lenis.darkroom.engineering/) (`@studio-freight/lenis`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variables & Design Tokens |
| **Typography** | `Bricolage Grotesque`, `Instrument Serif`, `JetBrains Mono` via `next/font` |
| **Image Automation** | Node.js ESM automated image enhancer, contrast processor, and sharp-based tools |

---

## 📂 Project Structure

```bash
yeab-portfolio/
├── content/                    # 📄 Single Source of Truth for site data
│   ├── site.ts                 # Identity, contact, bio, experience, stats, certs, reviews
│   └── projects.ts             # Project case studies, briefs, deliverables, palettes
├── docs/                       # 📚 Architecture, iteration notes & references
│   ├── iteration-log.md        # Design evolution log & checklists
│   └── references.md           # Visual research & design system principles
├── public/                     # 🖼️ Static assets
│   ├── certificates/           # Verified certificate scans & badges
│   ├── fonts/                  # Custom font files
│   ├── work/                   # High-res design project showcase images
│   └── yeab-photo.jpg          # Designer portrait photograph
├── scripts/                    # ⚙️ Automation & asset processing
│   ├── enhance-all-images.mjs  # Image optimization, contrast & sharpen pipeline
│   ├── extract-cert-thumbnails.mjs # Certificate thumbnail extraction script
│   ├── process-images.mjs      # Image format converter
│   └── update-hd.mjs           # Asset replacement pipeline
├── src/
│   ├── app/                    # 🌐 Next.js App Router
│   │   ├── admin/              # In-browser CMS studio login & control hub
│   │   ├── work/[slug]/        # Dynamic case study route with 4K zoom lightbox
│   │   ├── globals.css         # Global tokens, typography scales & resets
│   │   ├── layout.tsx          # Root layout with fonts & client providers
│   │   └── page.tsx            # Main landing page composition
│   ├── components/             # 🧩 Modular React Components
│   │   ├── About.tsx           # Bio, stats, education, experience, testimonials, certs
│   │   ├── Capabilities.tsx    # Skills matrix (AI, Packaging, Logo, Vector, Motion)
│   │   ├── CertificateLightbox.tsx # Fullscreen credential modal viewer
│   │   ├── ClientProviders.tsx # Mounts smooth scroll, cursor & navbar
│   │   ├── CmsContext.tsx      # In-browser CMS state, persistence & JSON exporter
│   │   ├── CmsEditor.tsx       # Live visual editor drawer overlay
│   │   ├── CmsToggle.tsx       # Studio quick-access floating trigger
│   │   ├── Contact.tsx         # Direct contact section with clipboard copy & social links
│   │   ├── CustomCursor.tsx    # Physics-based inverted cursor
│   │   ├── DedicationModal.tsx # Special dedication interactive modal
│   │   ├── Hero.tsx            # Hero typography & 3D canvas mount
│   │   ├── Loader.tsx          # Cinematic countdown preloader
│   │   ├── Nav.tsx             # Floating backdrop-blur navigation
│   │   ├── SmoothScroll.tsx    # Lenis smooth scroll provider
│   │   ├── Statement.tsx       # Kinetic typography banner with scroll trigger
│   │   ├── ThreeY.tsx          # WebGL 3D 'Y' kinetic sculpture
│   │   └── Work.tsx            # Horizontal pinned project showcase
│   └── hooks/                  # 🪝 Reusable custom hooks
├── package.json                # Project dependencies & npm scripts
├── tsconfig.json               # TypeScript configuration
└── next.config.ts              # Next.js build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.18.0 or newer recommended; Node 20+ preferred)
- **npm**, **pnpm**, or **yarn**
- **Git**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Heryakos/awesome_portfolio-.git
   cd awesome_portfolio-
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 💻 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Runs the Next.js development server with Turbopack |
| `build` | `npm run build` | Compiles the production build |
| `start` | `npm run start` | Starts the production server |
| `lint` | `npm run lint` | Runs ESLint to verify code quality |
| `enhance-images` | `node scripts/enhance-all-images.mjs` | Automated image contrast and sharpness batch enhancer |

---

## 🎨 Featured Portfolio Projects

The portfolio showcases real, commercial design projects with end-to-end case studies:

| # | Project | Discipline | Client | Highlights |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **My Perfect Logo Collection** | Logo Design & Brand Identity | Diverse Startups & Brands | Strict optical geometry, 16px to billboard scalability, complete vector kits |
| **02** | **Shodle Brand Transformation** | Brand Identity & Logomarks | Shodle | Cultural symbolism, custom interlocking monogram, crimson/charcoal color system |
| **03** | **Capturing Clicks: YouTube Showcase** | Digital Design & Retouching | Etubers & Creators | High-CTR compositions, dynamic lighting, facial expression grading for video hooks |
| **04** | **Stylish Packaging Collection** | Product Packaging & Dielines | Consumer Hardware Brands | Production-ready CMYK dielines, 3D retail shelf mockups, technical icon sets |

---

## 🎛️ Interactive In-Browser CMS Studio

This portfolio features a built-in **Visual Design Studio** accessible at `/admin`:

1. Navigate to `/admin` in your browser.
2. Enter your authorized credentials.
3. Access real-time controls for:
   - **Text & Taglines**: Instant inline editing of all hero, bio, and section copies.
   - **Color Palettes**: Adjust paper tone, ink color, and vermilion accents on the fly.
   - **3D Material Engine**: Switch the 3D "Y" between Obsidian, Vermilion, Gold, Chrome, and Wireframe shaders, and adjust rotation velocities.
   - **Project & Certification Manager**: Toggle project visibility, add custom project cards, and manage reviews.
   - **Data Portability**: Export your customized configuration as clean JSON or import pre-saved configurations.

---

## 📜 Verified Certifications

Yeabsira holds verified international credentials spanning design, business strategy, and communication:

- 🏅 **Humanitarian Info Management, Communications & Media** — *Humanitarian Leadership Academy* (Oct 2026)
- 🏅 **Basics of Inventory Management** — *Cambridge International Qualifications (CIQ), UK · UniAthena* (Aug 2026)
- 🏅 **Financial Management Essentials** — *Cornerstone OnDemand Foundation · NonprofitReady* (Sep 2026)
- 🏅 **AI and Career Empowerment** — *University of Maryland - Robert H. Smith School of Business* (Sep 2026)
- 🏅 **LinkedIn Advertising Fundamentals** — *LinkedIn Learning* (Sep 2026 – Sep 2028)
- 🏅 **Insurance and Risk Finance** — *United Nations Development Programme (UNDP)* (Aug 2026)
- 🏅 **Digital Leadership in Business** — *Simplilearn* (Aug 2026)
- 🏅 **Content Marketing Certified** — *HubSpot Academy* (Sep 2026)
- 🏅 **Certified Graphics Designer** — *Boston Foreign Language & Computer Training Institution* (Aug 2024)

---

## 🚀 Deployment

The project is optimized for deployment on the [Vercel Platform](https://vercel.com):

1. Push your changes to the `main` branch on GitHub.
2. Import the repository into [Vercel](https://vercel.com/new).
3. Next.js App Router will automatically detect build settings (`npm run build`).
4. Set your production domain (e.g., `https://yeabaddis.com`).

---

## 👤 Author & Contact

**Yeabsira Addis (Yeab Addis)**  
*Graphic Designer · Brand Identity Specialist · MBA Candidate*  
📍 Addis Ababa, Ethiopia  

- ✉️ **Email**: [yeabsira2137@gmail.com](mailto:yeabsira2137@gmail.com)
- 📞 **Phone / WhatsApp**: [+251 98 626 7543](tel:+251986267543)
- 💼 **Upwork Profile**: [upwork.com/freelancers/~011d172ba3b092f906](https://www.upwork.com/freelancers/~011d172ba3b092f906)
- 🔗 **LinkedIn**: [linkedin.com/in/yeabaddis21](https://www.linkedin.com/in/yeabaddis21/)

---

## 📄 License

This project is created for **Yeabsira Addis**. All designs, portfolio artwork, brand marks, and photography are proprietary and copyrighted by their respective clients and creator.

Source code is available for educational and showcase purposes under the **MIT License**.

<div align="center">
  <sub>Crafted with passion, geometric precision, and modern web technologies.</sub>
</div>
