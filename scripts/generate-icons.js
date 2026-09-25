// Gera todos os ícones de favicon/PWA a partir de public/badge.png.
// Uso: node scripts/generate-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'public/badge.png');
const ICONS_DIR = path.join(ROOT, 'public/imgs/icons');
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function squarePng(size, background = TRANSPARENT) {
  return sharp(SOURCE)
    .resize(size, size, { fit: 'contain', background })
    .png()
    .toBuffer();
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = [];
  const payloads = [];

  for (const { size, buffer } of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buffer.length;
    entries.push(entry);
    payloads.push(buffer);
  }

  return Buffer.concat([header, ...entries, ...payloads]);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Fonte não encontrada: ${SOURCE}`);
    process.exit(1);
  }

  const pngTargets = [
    { file: path.join(ICONS_DIR, 'favicon-96x96.png'), size: 96 },
    { file: path.join(ICONS_DIR, 'web-app-manifest-192x192.png'), size: 192 },
    { file: path.join(ICONS_DIR, 'web-app-manifest-512x512.png'), size: 512 },
  ];

  for (const { file, size } of pngTargets) {
    fs.writeFileSync(file, await squarePng(size));
    console.log('gerado', path.relative(ROOT, file));
  }

  // Apple touch icon: sem transparência (iOS preenche com preto se tiver alpha)
  const appleBuffer = await sharp(SOURCE)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  const appleFile = path.join(ICONS_DIR, 'apple-touch-icon.png');
  fs.writeFileSync(appleFile, appleBuffer);
  console.log('gerado', path.relative(ROOT, appleFile));

  // favicon.ico multi-resolução (16/32/48)
  const icoSizes = [16, 32, 48];
  const icoImages = [];
  for (const size of icoSizes) {
    icoImages.push({ size, buffer: await squarePng(size) });
  }
  const ico = buildIco(icoImages);
  fs.writeFileSync(path.join(ICONS_DIR, 'favicon.ico'), ico);
  fs.writeFileSync(path.join(ROOT, 'src/app/favicon.ico'), ico);
  console.log('gerado public/imgs/icons/favicon.ico e src/app/favicon.ico');

  // favicon.svg: embrulha o PNG em base64 (não é vetor real, mas funciona como favicon)
  const svgBuffer = await squarePng(256);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><image width="256" height="256" href="data:image/png;base64,${svgBuffer.toString('base64')}"/></svg>\n`;
  fs.writeFileSync(path.join(ICONS_DIR, 'favicon.svg'), svg);
  console.log('gerado', path.relative(ROOT, path.join(ICONS_DIR, 'favicon.svg')), '(PNG embutido, não é vetor real)');

  console.log('\nConcluído. Nenhum caminho de arquivo mudou, então layout.tsx e manifest.ts continuam funcionando sem alteração.');
}

main();
