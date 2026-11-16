#!/usr/bin/env node
/**
 * Resize photographs for the gallery.
 *
 *   npm run images                 # process every image placed in ./images
 *   npm run images -- --delete-originals
 *
 * For each original in images/ (jpg, jpeg, png, tif, tiff, webp) this writes
 *   images/fulls/<name>.jpg   1024 px wide (viewer)
 *   images/thumbs/<name>.jpg   512 px wide (grid)
 * It never enlarges, strips metadata (including GPS position) and keeps your
 * originals unless --delete-originals is given (the old gulp task always
 * deleted them).
 *
 * Optional: --fulls=1600 --thumbs=640 --quality=82 --dir=images
 */
import { readdir, mkdir, unlink } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v] = a.replace(/^--/, '').split('=');
  return [k, v ?? true];
}));
const dir = args.dir || 'images';
const fullW = Number(args.fulls) || 1024;
const thumbW = Number(args.thumbs) || 512;
const quality = Number(args.quality) || 82;
const exts = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);

const files = (await readdir(dir, { withFileTypes: true }))
  .filter((e) => e.isFile() && exts.has(parse(e.name).ext.toLowerCase()))
  .map((e) => e.name);

if (!files.length) {
  console.log(`No originals found in ${dir}/ — copy your photographs there first.`);
  process.exit(0);
}

await mkdir(join(dir, 'fulls'), { recursive: true });
await mkdir(join(dir, 'thumbs'), { recursive: true });

for (const file of files) {
  const src = join(dir, file);
  const name = `${parse(file).name}.jpg`;
  const base = sharp(src).rotate(); // honour camera orientation, then metadata is dropped
  for (const [sub, width] of [['fulls', fullW], ['thumbs', thumbW]]) {
    await base.clone()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toFile(join(dir, sub, name));
  }
  console.log(`✓ ${file} -> fulls/${name}, thumbs/${name}`);
  if (args['delete-originals']) await unlink(src);
}
console.log(`Done: ${files.length} photograph(s).`);
