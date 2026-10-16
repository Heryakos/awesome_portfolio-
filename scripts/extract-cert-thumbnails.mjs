import sharp from "sharp";
import path from "path";
import fs from "fs";

const storageDir = "C:\\Users\\Administrator\\.gemini\\antigravity-ide\\brain\\a9a3f327-1a42-4908-94a2-0d1c906afefc\\.tempmediaStorage";
const outDir = "c:\\Users\\Administrator\\Desktop\\Personal\\Yeab Portfolio\\public\\certificates";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log("Processing certificate images...");
  
  // 1. Humanitarian Information Management from media_1792140359697.png
  // Let's inspect the dimensions of media_1792140359697.png
  const meta1 = await sharp(path.join(storageDir, "media_1792140359697.png")).metadata();
  console.log("meta1:", meta1.width, meta1.height);

  // In media_1792140359697.png (1386x911), the Humanitarian cert thumbnail is around:
  // left: 151, top: 405, width: 76, height: 62 (or similar in 1386x911)
  // Let's extract and save it
  await sharp(path.join(storageDir, "media_1792140359697.png"))
    .extract({ left: 151, top: 406, width: 76, height: 60 })
    .resize(300, 240, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "humanitarian-information-management.jpg"));

  // In media_1792140372269.png
  // Ai and Career Empowerment thumbnail is around:
  // left: 151, top: 494, width: 76, height: 60
  await sharp(path.join(storageDir, "media_1792140372269.png"))
    .extract({ left: 151, top: 494, width: 76, height: 60 })
    .resize(300, 240, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "ai-career-empowerment.jpg"));

  // Advancing Black Leadership in media_1792140372269.png
  // left: 151, top: 914 (or near bottom)
  const meta2 = await sharp(path.join(storageDir, "media_1792140372269.png")).metadata();
  console.log("meta2:", meta2.width, meta2.height);

  // Advancing Black Leadership in media_1792140387776.png is near top:
  // left: 151, top: 256, width: 76, height: 60
  await sharp(path.join(storageDir, "media_1792140387776.png"))
    .extract({ left: 151, top: 256, width: 76, height: 60 })
    .resize(300, 240, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "advancing-black-leadership.jpg"));

  // Human Resource Management in media_1792140404305.png:
  // left: 151, top: 288, width: 76, height: 60
  await sharp(path.join(storageDir, "media_1792140404305.png"))
    .extract({ left: 151, top: 288, width: 76, height: 60 })
    .resize(300, 240, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "human-resource-management.jpg"));

  // Digital Leadership in Business in media_1792140404305.png:
  // left: 151, top: 554, width: 76, height: 60
  await sharp(path.join(storageDir, "media_1792140404305.png"))
    .extract({ left: 151, top: 554, width: 76, height: 60 })
    .resize(300, 240, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "digital-leadership.jpg"));

  // Operations and Project Management in media_1792140404305.png:
  // left: 151, top: 826, width: 76, height: 60
  await sharp(path.join(storageDir, "media_1792140404305.png"))
    .extract({ left: 151, top: 826, width: 76, height: 60 })
    .resize(300, 240, { fit: "contain", background: "#fff" })
    .jpeg({ quality: 90 })
    .toFile(path.join(outDir, "operations-project-management.jpg"));

  console.log("All cert thumbnails successfully extracted!");
}

run().catch(console.error);
