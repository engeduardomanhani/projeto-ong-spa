import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join, parse } from 'node:path';

const pasta = 'public/imagens';
const larguras = [480, 960, 1440];

for (const arquivo of readdirSync(pasta)) {
  const { name, ext } = parse(arquivo);
  if (!/^\.jpe?g$/i.test(ext)) continue;

  const origem = join(pasta, arquivo);
  const { width, height } = await sharp(origem).metadata();

  // Larguras menores que o original, mais a largura original (sem ampliar)
  const alvos = [...new Set([...larguras.filter((l) => l < width), width])];

  for (const largura of alvos) {
    await sharp(origem)
      .resize({ width: largura })
      .webp({ quality: 80 })
      .toFile(join(pasta, `${name}-${largura}.webp`));
  }
  console.log(`${arquivo}: ${width}x${height} -> ${alvos.join(', ')}`);
}
