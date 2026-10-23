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
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181922"/>
      <stop offset="100%" stop-color="#0c0d12"/>
    </linearGradient>
    <linearGradient id="vermilionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5A2C"/>
      <stop offset="100%" stop-color="#E63900"/>
    </linearGradient>
    <linearGradient id="ivoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#EAE5DA"/>
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Squircle Base -->
  <rect x="2" y="2" width="60" height="60" rx="14" ry="14" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>

  <!-- Geometric Y Monogram -->
  <g filter="url(#subtleGlow)">
    <!-- Left Arm (Vermilion Red Geometric) -->
    <path d="M 17 18 L 26 18 L 32 30 L 26 36 L 17 25 Z" fill="url(#vermilionGrad)"/>
    <path d="M 22 21 L 24.5 21 L 28.5 29 L 26 31 Z" fill="#12131A"/>

    <!-- Right Arm (Ivory White Facet) -->
    <path d="M 47 18 L 38 18 L 32 30 L 36 36 L 47 21 Z" fill="url(#ivoryGrad)"/>
    <path d="M 42 22 L 39.5 22 L 35 30 L 37 32 Z" fill="#12131A"/>

    <!-- Central Stem (Vermilion Red Solid Pillar) -->
    <path d="M 28 32 L 36 32 L 36 48 L 28 48 Z" fill="url(#vermilionGrad)"/>
    
    <!-- Accent Highlight Bevel -->
    <path d="M 32 32 L 36 32 L 36 48 L 32 48 Z" fill="rgba(0,0,0,0.22)"/>
    <path d="M 28 32 L 32 32 L 32 48 L 28 48 Z" fill="rgba(255,255,255,0.18)"/>

    <!-- Small signature vermilion dot -->
    <circle cx="47" cy="18" r="2.5" fill="#FF4A1C"/>
  </g>
</svg>`;

  fs.writeFileSync('public/icon.svg', svgFavicon);
  fs.writeFileSync('src/app/icon.svg', svgFavicon);
  console.log('Saved vector icon.svg in public/ and src/app/');

  console.log('✨ All favicon assets successfully generated!');
}

run().catch(console.error);
