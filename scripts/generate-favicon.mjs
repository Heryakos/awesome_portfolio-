import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const IMG_Y = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/0b78c571-3403-490b-a9ea-a5dfbc1a57bf/yeab_monogram_icon_1792757546632.jpg';
const IMG_YA = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/0b78c571-3403-490b-a9ea-a5dfbc1a57bf/yeab_favicon_logo_1792757512398.jpg';

// Build multi-size .ico from PNG buffer
async function createIco(sourceBuffer, sizes = [16, 32, 48, 64]) {
  const pngBuffers = [];
  for (const s of sizes) {
    const buf = await sharp(sourceBuffer)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    pngBuffers.push({ size: s, data: buf });
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(sizes.length, 4); // count

  let offset = 6 + sizes.length * 16;
  const dirEntries = [];

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 0); // width
    entry.writeUInt8(item.size >= 256 ? 0 : item.size, 1); // height
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(item.data.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += item.data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(p => p.data)]);
}

async function run() {
  console.log('Generating Yeab Addis custom favicons...');

  // Use IMG_Y (clean geometric Y with vermilion + ivory facet on obsidian squircle)
  // Extract centered 740x740 from 1024x1024 so squircle fills icon boundary with graceful margin
  const cropSize = 750;
  const left = Math.round((1024 - cropSize) / 2);
  const top = Math.round((1024 - cropSize) / 2);

  // Squircle mask with smooth curved corners
  const maskSvg = `<svg width="512" height="512" viewBox="0 0 512 512">
    <rect x="0" y="0" width="512" height="512" rx="112" ry="112" fill="#ffffff"/>
  </svg>`;

  const png512 = await sharp(IMG_Y)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(512, 512, { fit: 'cover' })
    .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
    .png({ quality: 100 })
    .toBuffer();

  // 1. Save 512x512
  fs.writeFileSync('public/icon-512.png', png512);
  fs.writeFileSync('public/icon.png', png512);
  fs.writeFileSync('src/app/icon.png', png512);

  // 2. 192x192
  const png192 = await sharp(png512).resize(192, 192).png().toBuffer();
  fs.writeFileSync('public/icon-192.png', png192);

  // 3. Apple Touch Icon 180x180
  const apple180 = await sharp(png512).resize(180, 180).png().toBuffer();
  fs.writeFileSync('public/apple-icon.png', apple180);
  fs.writeFileSync('public/apple-touch-icon.png', apple180);
  fs.writeFileSync('src/app/apple-icon.png', apple180);

  // 4. 32x32 and 16x16 PNGs
  const png32 = await sharp(png512).resize(32, 32).png().toBuffer();
  fs.writeFileSync('public/favicon-32x32.png', png32);
  const png16 = await sharp(png512).resize(16, 16).png().toBuffer();
  fs.writeFileSync('public/favicon-16x16.png', png16);

  // 5. Multi-resolution favicon.ico (16, 32, 48, 64)
  const icoBuffer = await createIco(png512, [16, 32, 48, 64]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  console.log(`Generated favicon.ico (${icoBuffer.length} bytes) in public/ and src/app/`);

  // 6. Vector SVG Favicon for modern sharp rendering
  // Designed to match Yeab's geometric monogram:
  // Dark obsidian squircle, Vermilion accent, Ivory facet
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181922"/>
      <stop offset="100%" stop-color="#0c0d12"/>
    </linearGradient>
    <linearGradient id="vermilionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5A2C"/>
      <stop offset="100%" stop-color="#D83216"/>
    </linearGradient>
    <linearGradient id="ivoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EDE8DE"/>
    </linearGradient>
    <linearGradient id="ivoryShadow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DCD6C8"/>
      <stop offset="100%" stop-color="#BCB5A4"/>
    </linearGradient>
    <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="180" y="180" width="664" height="664" rx="168" ry="168" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="8"/>

  <!-- Exact 1:1 Brand Favicon Monogram -->
  <g filter="url(#subtleGlow)">
    <!-- Part 1: Red Left Wing & Left Stem -->
    <path
      d="M 302 312 L 430 312 L 486 535 L 486 680 L 453 715 L 453 535 Z M 364 342 L 424 342 L 456 452 L 396 452 Z"
      fill="url(#vermilionGrad)"
      fill-rule="evenodd"
    />

    <!-- Part 2: Red Right Wing Loop -->
    <path
      d="M 579 312 L 721 312 L 593 502 L 526 402 Z M 599 342 L 659 342 L 600 432 L 567 402 Z"
      fill="url(#vermilionGrad)"
      fill-rule="evenodd"
    />

    <!-- Part 3: Ivory Interlocking Ribbon & Right Stem -->
    <path
      d="M 430 312 L 448 312 L 570 502 L 570 715 L 453 715 L 486 680 L 537 680 L 537 510 L 486 420 L 430 312 Z"
      fill="url(#ivoryGrad)"
    />

    <!-- Bottom Base 3D Chamfer -->
    <path
      d="M 453 715 L 570 715 L 537 680 L 486 680 Z"
      fill="url(#ivoryShadow)"
    />
  </g>
</svg>`;

  fs.writeFileSync('public/icon.svg', svgFavicon);
  fs.writeFileSync('src/app/icon.svg', svgFavicon);
  console.log('Saved vector icon.svg in public/ and src/app/');

  console.log('✨ All favicon assets successfully generated!');
}

run().catch(console.error);
