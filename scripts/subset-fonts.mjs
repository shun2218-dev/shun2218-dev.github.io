// Noto Sans JP を、サイトで使っている文字だけのサブセットにする。
// next/font/google の Noto Sans JP は 249 個の @font-face を持つ CSS（gzip で約 67 KB）が描画をブロックし、
// モバイルの FCP を 2 秒近く遅らせるため（SHU-20）。
// 作った woff2 は public/fonts/generated/ に置き（git 管理外。dev / build の前に毎回作る）、
// globals.css の @font-face と layout.tsx の preload で読み込む
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";
import { parse } from "yaml";

const root = process.cwd();
const outDir = path.join(root, "public/fonts/generated");
const fontDir = path.join(root, "node_modules/@expo-google-fonts/noto-sans-jp");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(file);
    else if (/\.(md|ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name))
      yield file;
  }
}

// 画面に出ないコメントの文字まで入れるとファイルが大きくなるため取り除く（文字列中の // は残す）
const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1")
    .replace(/^\s*#.*$/gm, "");

// ASCII の表示可能な文字はすべて入れ、それ以外は渡したテキストに現れたものだけを入れる
function charset(texts) {
  const chars = new Set();
  for (let code = 0x20; code <= 0x7e; code++)
    chars.add(String.fromCharCode(code));
  for (const text of texts) {
    for (const char of text) if (char.codePointAt(0) > 0x7e) chars.add(char);
  }
  return [...chars].join("");
}

// 300（本文）は content/ と src/ のすべての文字
const allTexts = [];
for (const dir of ["content", "src"]) {
  for await (const file of walk(path.join(root, dir))) {
    allTexts.push(stripComments(await readFile(file, "utf8")));
  }
}

// 400 は作品詳細の機能名（features[].title）にしか使わないため、その文字だけにして軽くする
const featureTitles = [];
for await (const file of walk(path.join(root, "content/works"))) {
  const frontmatter = (await readFile(file, "utf8")).split(/^---$/m)[1] ?? "";
  for (const feature of parse(frontmatter)?.features ?? []) {
    featureTitles.push(feature.title);
  }
}

const targets = [
  {
    weight: 300,
    file: "300Light/NotoSansJP_300Light.ttf",
    text: charset(allTexts),
  },
  {
    weight: 400,
    file: "400Regular/NotoSansJP_400Regular.ttf",
    text: charset(featureTitles),
  },
];

await mkdir(outDir, { recursive: true });
for (const { weight, file, text } of targets) {
  const font = await readFile(path.join(fontDir, file));
  const subset = await subsetFont(font, text, { targetFormat: "woff2" });
  await writeFile(path.join(outDir, `noto-sans-jp-${weight}.woff2`), subset);
  console.log(
    `noto-sans-jp-${weight}.woff2: ${[...text].length} 文字, ${(subset.length / 1024).toFixed(1)} KB`,
  );
}
