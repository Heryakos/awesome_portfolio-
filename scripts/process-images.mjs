import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/a9a3f327-1a42-4908-94a2-0d1c906afefc';
const publicDir = 'c:/Users/Administrator/Desktop/Personal/Yeab Portfolio/public';

async function main() {
  console.log('1. Processing profile photo...');
  const linkedinScreenshot = path.join(brainDir, 'linkedin_top_1792134164737.png');
  
  if (fs.existsSync(linkedinScreenshot)) {
    const circleMask = Buffer.from(
      '<svg width="400" height="400"><circle cx="200" cy="200" r="195" fill="#fff"/></svg>'
    );

    // Save yeab-photo.png (transparent circular avatar)
    await sharp(linkedinScreenshot)
      .extract({ left: 418, top: 193, width: 148, height: 148 })
      .resize(400, 400, { kernel: 'lanczos3' })
      .composite([{ input: circleMask, blend: 'dest-in' }])
      .png()
      .toFile(path.join(publicDir, 'yeab-photo.png'));

    // Save yeab-photo.jpg
    await sharp(linkedinScreenshot)
      .extract({ left: 422, top: 197, width: 140, height: 140 })
      .resize(400, 400, { kernel: 'lanczos3' })
      .jpeg({ quality: 95 })
      .toFile(path.join(publicDir, 'yeab-photo.jpg'));

    console.log('✅ yeab-photo.png and yeab-photo.jpg saved!');
  }

  console.log('2. Processing Upwork project covers...');
  const upworkTop = path.join(brainDir, 'upwork_top_1792134216906.png');
  const upworkModal = path.join(brainDir, 'upwork_profile_page_1792134949404.png');

  if (fs.existsSync(upworkTop)) {
    // Card 1: My Perfect Logo Collection
    await sharp(upworkTop)
      .extract({ left: 915, top: 0, width: 245, height: 175 })
      .resize(1200, 800, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality: 95 })
      .toFile(path.join(publicDir, 'work/my-perfect-logo-collection/cover.jpg'));

    // Card 2: Bringing Vision to Life: Shodle's Brand Transformation
    await sharp(upworkTop)
      .extract({ left: 1175, top: 0, width: 245, height: 175 })
      .resize(1200, 800, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality: 95 })
      .toFile(path.join(publicDir, 'work/shodle-brand-transformation/cover.jpg'));

    // Card 3: Capturing Clicks: Finance & Money-Making YouTube Thumbnails Showcase
    await sharp(upworkTop)
      .extract({ left: 1435, top: 0, width: 245, height: 175 })
      .resize(1200, 800, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality: 95 })
      .toFile(path.join(publicDir, 'work/youtube-thumbnails-showcase/cover.jpg'));

    console.log('✅ Projects 1, 2, 3 covers extracted and saved!');
  }

  if (fs.existsSync(upworkModal)) {
    // Card 4: Stylish Packaging: My Elegant Product Design Collection
    await sharp(upworkModal)
      .extract({ left: 695, top: 220, width: 1025, height: 580 })
      .resize(1200, 800, { fit: 'cover', kernel: 'lanczos3' })
      .jpeg({ quality: 95 })
      .toFile(path.join(publicDir, 'work/stylish-product-packaging/cover.jpg'));

    console.log('✅ Project 4 (packaging) cover extracted and saved!');
  }
}

main().catch(console.error);
