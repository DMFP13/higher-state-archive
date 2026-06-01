import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceDir = '/Users/mac1/Downloads/higher_state_archive_assets';
const outputRoot = path.resolve('public/archive-assets');
const cleanDir = path.join(outputRoot, 'clean');
const distortedDir = path.join(outputRoot, 'distorted');

const files = (await readdir(sourceDir))
  .filter((file) => file.endsWith('.png'))
  .sort((a, b) => Number(a.match(/\((\d+)\)/)?.[1] || 0) - Number(b.match(/\((\d+)\)/)?.[1] || 0));

await mkdir(cleanDir, { recursive: true });
await mkdir(distortedDir, { recursive: true });

function seeded(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function scanlineSvg(width, height, index) {
  const gap = 6 + (index % 5) * 2;
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="none"/>
      <g opacity="0.34">
        ${Array.from({ length: Math.ceil(height / gap) }, (_, row) => {
          const y = row * gap;
          return `<rect x="0" y="${y}" width="${width}" height="1" fill="#001013"/>`;
        }).join('')}
      </g>
      <g opacity="0.18">
        ${Array.from({ length: 9 }, (_, row) => {
          const y = Math.round((row / 9) * height + Math.sin(index + row) * 24);
          return `<rect x="${Math.sin(index * row + 1) * 22}" y="${y}" width="${width}" height="${2 + ((index + row) % 6)}" fill="#d9ffff"/>`;
        }).join('')}
      </g>
    </svg>
  `);
}

function noiseBuffer(width, height, index) {
  const random = seeded(9001 + index * 777);
  const buffer = Buffer.alloc(width * height * 4);
  for (let offset = 0; offset < buffer.length; offset += 4) {
    const value = Math.round(70 + random() * 185);
    buffer[offset] = value;
    buffer[offset + 1] = value;
    buffer[offset + 2] = value;
    buffer[offset + 3] = Math.round(16 + random() * 34);
  }
  return buffer;
}

function vignetteSvg(width, height) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="44%" r="68%">
          <stop offset="0%" stop-color="rgba(255,255,255,0)"/>
          <stop offset="58%" stop-color="rgba(0,0,0,0.08)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.72)"/>
        </radialGradient>
        <linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(0,238,255,0.18)"/>
          <stop offset="54%" stop-color="rgba(255,255,255,0)"/>
          <stop offset="100%" stop-color="rgba(255,42,20,0.16)"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#c)"/>
      <rect width="${width}" height="${height}" fill="url(#v)"/>
    </svg>
  `);
}

const manifest = [];

for (const [index, file] of files.entries()) {
  const inputPath = path.join(sourceDir, file);
  const metadata = await sharp(inputPath).metadata();
  const width = Math.max(1200, metadata.width || 1200);
  const height = Math.round(width * (metadata.height || width) / (metadata.width || width));
  const name = `archive-${String(index + 1).padStart(2, '0')}`;

  const clean = sharp(inputPath)
    .resize({ width, withoutEnlargement: false, kernel: sharp.kernel.lanczos3 })
    .modulate({ saturation: 0.92, brightness: 1.02 })
    .linear(1.08, -4)
    .sharpen({ sigma: 0.7, m1: 0.55, m2: 1.25 })
    .webp({ quality: 86, effort: 5 });

  const cleanBuffer = await clean.toBuffer();
  await writeFile(path.join(cleanDir, `${name}.webp`), cleanBuffer);

  const base = sharp(cleanBuffer).ensureAlpha();
  const redShift = await sharp(cleanBuffer)
    .resize(width, height)
    .modulate({ saturation: 0.7, brightness: 1.04 })
    .tint({ r: 255, g: 72, b: 48 })
    .blur(1.1)
    .webp()
    .toBuffer();
  const cyanShift = await sharp(cleanBuffer)
    .resize(width, height)
    .modulate({ saturation: 0.7, brightness: 1.04 })
    .tint({ r: 64, g: 232, b: 255 })
    .blur(1.3)
    .webp()
    .toBuffer();
  const noise = noiseBuffer(width, height, index);

  const distortedBuffer = await base
    .blur(1.4 + (index % 4) * 0.45)
    .modulate({ saturation: 0.58 + (index % 3) * 0.08, brightness: 0.83 })
    .linear(1.24, -14)
    .composite([
      { input: redShift, left: 8 + (index % 4), top: 0, blend: 'screen', opacity: 0.28 },
      { input: cyanShift, left: -8 - (index % 5), top: 3, blend: 'screen', opacity: 0.24 },
      {
        input: noise,
        raw: { width, height, channels: 4 },
        left: 0,
        top: 0,
        blend: 'overlay',
        opacity: 0.32,
      },
      { input: scanlineSvg(width, height, index), left: 0, top: 0, blend: 'multiply', opacity: 0.38 },
      { input: vignetteSvg(width, height), left: 0, top: 0, blend: 'multiply', opacity: 0.8 },
    ])
    .webp({ quality: 78, effort: 5 })
    .toBuffer();

  await writeFile(path.join(distortedDir, `${name}.webp`), distortedBuffer);
  manifest.push({
    source: file,
    clean: `/archive-assets/clean/${name}.webp`,
    distorted: `/archive-assets/distorted/${name}.webp`,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    width,
    height,
  });
}

await writeFile(path.join(outputRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Processed ${manifest.length} archive images into ${outputRoot}`);
