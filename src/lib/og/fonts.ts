import { readFile } from "node:fs/promises";
import path from "node:path";

// OGP 画像・アイコンはビルド時に生成する。ImageResponse は woff2 を読めないため woff を使う
const file = (pkg: string, name: string) =>
  readFile(
    path.join(process.cwd(), "node_modules/@fontsource", pkg, "files", name),
  );

export async function loadOgFonts() {
  const [cormorantLight, cormorantMedium, mono] = await Promise.all([
    file("cormorant-garamond", "cormorant-garamond-latin-300-normal.woff"),
    file("cormorant-garamond", "cormorant-garamond-latin-500-normal.woff"),
    file("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"),
  ]);
  return [
    { name: "Cormorant", data: cormorantLight, weight: 300 as const },
    { name: "Cormorant", data: cormorantMedium, weight: 500 as const },
    { name: "Mono", data: mono, weight: 400 as const },
  ];
}

// docs/design.md の色。ImageResponse では CSS 変数を使えないため値で持つ
export const og = {
  background: "#0A0A0A",
  foreground: "#E8E6E1",
  muted: "#8A8780",
  accent: "#C9A96E",
  gridLine: "rgba(255,255,255,0.05)",
  size: { width: 1200, height: 630 },
};
