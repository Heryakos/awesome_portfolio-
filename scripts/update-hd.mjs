import sharp from 'sharp';
import fs from 'fs';

async function update() {
  // 1. Update logo collection cover with HD master from Upwork
  fs.copyFileSync('public/upwork-image-raw.jpg', 'public/work/my-perfect-logo-collection/cover.jpg');
  console.log('✅ Copied HD logo collection to public/work/my-perfect-logo-collection/cover.jpg');

  // 2. Update yeab-photo.jpg with raw 400x400 original from LinkedIn
  fs.copyFileSync('public/yeab-photo-raw.jpg', 'public/yeab-photo.jpg');
  console.log('✅ Copied HD original photo to public/yeab-photo.jpg');

  // 3. Create a circular transparent PNG version
  const mask = Buffer.from('<svg width="400" height="400"><circle cx="200" cy="200" r="198" fill="#fff"/></svg>');
  await sharp('public/yeab-photo-raw.jpg')
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile('public/yeab-photo.png');
  console.log('✅ Created HD circular public/yeab-photo.png');
}

update().catch(console.error);
