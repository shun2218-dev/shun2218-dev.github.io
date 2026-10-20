// Noto Sans JP を、サイトで使っている文字だけのサブセットにする。
// next/font/google の Noto Sans JP は 249 個の @font-face を持つ CSS（gzip で約 67 KB）が描画をブロックし、
// モバイルの FCP を 2 秒近く遅らせるため（SHU-20）。
// content/ と src/ の文字を集めて woff2 を作り、public/fonts/generated/ に置く（git 管理外。dev / build の前に毎回作る）。
// 読み込みは globals.css の @font-face と、layout.tsx の 300 だけの preload で行う
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const root = process.cwd();
const sources = ["content", "src"];
const outDir = path.join(root, "public/fonts/generated");
const fontDir = path.join(root, "node_modules/@expo-google-fonts/noto-sans-jp");
const weights = {
  300: "300Light/NotoSansJP_300Light.ttf",
  400: "400Regular/NotoSansJP_400Regular.ttf",
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (file !== outDir) yield* walk(file);
    } else if (
      /\.(md|ts|tsx)$/.test(entry.name) &&
      !/\.test\./.test(entry.name)
    ) {
      yield file;
    }
  }
}

// 画面に出ないコメントの文字まで入れるとファイルが大きくなるため取り除く（文字列中の // は残す）
const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");

// ASCII の表示可能な文字はすべて入れ、それ以外はソースに現れたものだけを入れる
const chars = new Set();
for (let code = 0x20; code <= 0x7e; code++)
  chars.add(String.fromCharCode(code));
for (const dir of sources) {
  for await (const file of walk(path.join(root, dir))) {
    const source = await readFile(file, "utf8");
    for (const char of file.endsWith(".md") ? source : stripComments(source)) {
      if (char.codePointAt(0) > 0x7e) chars.add(char);
    }
  }
}
const text = [...chars].join("");

await mkdir(outDir, { recursive: true });
for (const [weight, file] of Object.entries(weights)) {
  const font = await readFile(path.join(fontDir, file));
  const subset = await subsetFont(font, text, { targetFormat: "woff2" });
  await writeFile(path.join(outDir, `noto-sans-jp-${weight}.woff2`), subset);
  console.log(
    `noto-sans-jp-${weight}.woff2: ${chars.size} 文字, ${(subset.length / 1024).toFixed(1)} KB`,
  );
}
