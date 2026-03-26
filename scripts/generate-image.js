const fs = require("fs");
const path = require("path");
const https = require("https");

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

async function generateImage(prompt, filename) {
  console.log(`Génération : ${filename}...`);

  const outputDir = path.join(__dirname, "../public/assets/generated");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, filename);
  const body = JSON.stringify({ inputs: prompt });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "router.huggingface.co",
        path: `/hf-inference/models/${MODEL}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          let err = "";
          res.on("data", (chunk) => (err += chunk));
          res.on("end", () =>
            reject(new Error(`HTTP ${res.statusCode}: ${err}`))
          );
          return;
        }

        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`✅ Sauvegardée : public/assets/generated/${filename}`);
          resolve(filePath);
        });
        file.on("error", reject);
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

const prompts = [
  {
    prompt:
      "Hyperrealistic studio product photography of a high-performance trail running shoe, aggressive outsole with deep lugs, floating mid-air against pure black background, dramatic side-lit with single sharp orange rim light, trail dirt particles in motion blur, 4K sharp focus, cinematic depth of field, no text",
    filename: "ad-trail-shoe.jpg",
  },
  {
    prompt:
      "Cinematic close-up of elite marathon runner legs mid-stride on wet track at dawn, carbon-plated racing shoes in sharp focus, motion blur on background stadium lights creating orange streaks, dark moody atmosphere, deep black shadows, ultra-realistic, high-end sports brand visual",
    filename: "ad-marathon.jpg",
  },
  {
    prompt:
      "Premium smartwatch with GPS running display floating against pure matte black background, screen showing real-time pace and heart rate with orange glowing UI, dramatic product lighting, fine water droplets on strap, ultra sharp macro lens, dark luxury aesthetic, no text",
    filename: "ad-gps-watch.jpg",
  },
];

async function main() {
  if (!HF_TOKEN) {
    console.error("❌ HF_TOKEN manquant. Lance avec : HF_TOKEN=hf_xxx node scripts/generate-image.js");
    process.exit(1);
  }
  for (const item of prompts) {
    await generateImage(item.prompt, item.filename);
  }
  console.log("\n🎨 Toutes les images générées dans public/assets/generated/");
}

main().catch(console.error);
