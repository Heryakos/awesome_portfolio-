# Step 0: Reference Research — Yeab Addis Portfolio

## Sites Studied

### 1. Lusion (https://lusion.co/)
- **First impression**: Cinematic WebGL loading that resolves into an immersive 3D environment. The loader itself feels designed.
- **Cursor**: Physics-based — objects react with weight and momentum. Not a trail, not a dot: a presence.
- **3D**: Glossy, refractive materials. Objects respond to cursor without being gimmicky. Depth of field used strategically.
- **Typography**: Minimal UI overlay, high contrast against dark environments.
- **Pacing**: The opening beats are slow and deliberate. You're invited, not rushed.
- **Color**: Near-black with selective light. Accent colors are materials, not applied.
- **ADOPT**: Cinematic loader → 3D Y. Refractive/glossy material on the Y. Cursor that shifts by context.

### 2. Mona Sans / GitHub Variable Font (https://github.com/mona-sans)
- **Variable font**: Width and weight axes animated smoothly. Scale jumps are dramatic and intentional.
- **Motion**: Typography reacts to scroll position and cursor. Text as kinetic object, not static label.
- **Layout**: Headlines break the grid. Text overlaps and crops.
- **ADOPT**: Bricolage Grotesque variable axes on hero/work titles. Scroll-linked font-variation-settings animation.

### 3. Overrrides (https://overrrides.com/)
- **Navigation**: Unconventional — not a horizontal bar, not a hamburger. Spatial.
- **Composition**: Brutalist confidence. Elements don't apologize for occupying space.
- **Type scale**: Enormous → tiny. Contrast is the design.
- **Color**: Stark, restrained. No decorative gradients.
- **ADOPT**: Asymmetric layout, non-standard navigation, text bleeding off viewport edges.
- **AVOID**: Their coldness — Yeab's site stays warm (paper tone).

### 4. Awwwards Site of the Day (https://www.awwwards.com/)
- **Common patterns in winning portfolios**:
  - Strong art direction premise ("the living Y") that makes the site uniquely itself
  - Shared-element transitions between list and detail
  - Micro-interactions on every hover
  - Mobile is a separately designed experience, not a shrunk desktop
- **ADOPT**: Shared-element transition from Work poster to case study. Every hover with purpose.

---

## Extracted Principles for Yeab Addis Portfolio

### Pacing
- Open slow and cinematic (loader → hero). Don't rush to content.
- Accelerate through the Work section (horizontal scroll, energy).
- Rest in About. Quiet confidence.
- Close with a strong, simple Contact scene.

### Type Scale
- Display: 10vw–20vw for hero/section titles. Crop aggressively.
- Editorial: 1.5rem–3rem for body statements.
- Label: 0.65rem–0.75rem mono for metadata. All caps, tracked.
- NEVER use the same size twice in a row.

### Motion Easing
- Entrance: `power3.out` (fast attack, smooth settle)
- Scroll: `none` (linear scroll-linked). No spring on scroll.
- Hover: `power2.inOut` (symmetric, quick)
- Page transitions: `expo.inOut` (long, cinematic)

### Spatial Layout
- One dominant element per viewport.
- Grid-breaking: rotate elements -3° to +3°, let text exit the frame.
- Generous negative space before the next beat.
- Overlapping layers with z-index intention, not accident.

### Color Rules
- Background: #EFEBE3 (warm paper) — never pure white.
- Text: #111 (ink) — never pure black.
- Accent: #FF4A1C (vermilion) — used max 2–3 times on a page. Never decoration, always signal.
- Secondary tints: desaturated warm grays for generated artwork only.
- NO: purple/blue gradients, glassmorphism, neon glow, drop shadows on text.

---

## What to Avoid
- Cards in a row (any)
- Standard navbar with logo left / links right
- Glassmorphism (frosted glass panels)
- Neon or blue-purple gradients
- Spinning cubes or particle fields
- Cursor trails
- Stock photos or clip art
- Testimonials (unverifiable)
- Any invented client names, awards, or years of experience

---

*Research conducted: 2026-10-15. Screenshots saved in `/brain/a9a3f327-1a42-4908-94a2-0d1c906afefc/`.*
