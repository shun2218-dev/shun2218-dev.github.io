// 作品のスクリーンショット（PNG）から、表示幅ごとの WebP を public/works/<slug>/ に書き出す。
// 元画像は <元フォルダ>/<slug>/{card,main,sub-1,sub-2}.png（2x で撮ったもの）。元画像は大きいため git に入れず、
// 書き出した WebP だけをコミットする。撮り直したときだけ実行する:
//   pnpm screenshots <元フォルダ>
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { SHOTS, shotSrc } from "../src/lib/screenshots.ts";

const QUALITY = 78;

const source = process.argv[2];
if (!source) {
  console.error("使い方: pnpm screenshots <元画像のフォルダ>");
  process.exit(1);
}

const root = process.cwd();
const slugs = (await readdir(source, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

for (const slug of slugs) {
  const outDir = path.join(root, "public/works", slug);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  for (const [kind, spec] of Object.entries(SHOTS)) {
    const input = path.join(source, slug, `${kind}.png`);
    const { width, height } = await sharp(input).metadata();
    // 縦横比が合わないと、表示時の aspect-ratio と食い違ってずれる
    if (Math.abs(width / height - spec.width / spec.height) > 0.01)
      throw new Error(
        `${input}: 縦横比が ${spec.width}:${spec.height} ではありません`,
      );

    for (const w of spec.widths) {
      if (w > width)
        throw new Error(`${input}: 幅 ${width}px では ${w}px を作れません`);
      const output = path.join(root, "public", shotSrc(slug, kind, w));
      const info = await sharp(input)
        .resize({ width: w })
        .webp({ quality: QUALITY, effort: 6 })
        .toFile(output);
      console.log(
        `${path.relative(root, output)}  ${(info.size / 1024).toFixed(0)} KB`,
      );
    }
  }
}
