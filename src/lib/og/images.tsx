import { ImageResponse } from "next/og";
import { loadOgFonts, og } from "@/lib/og/fonts";
import { Monogram } from "@/lib/og/Monogram";
import { OgEyebrow, OgFrame } from "@/lib/og/OgFrame";
import { site } from "@/lib/site";
import type { Work } from "@/lib/works";

// 画像はルートハンドラ（/og/*.png, /icons/*.png）でビルド時に生成する。
// メタデータのファイル規約（opengraph-image.tsx など）は拡張子のないファイルを出力し、
// GitHub Pages が image/png として配信しないため使わない

export const ogImage = {
  ...og.size,
  type: "image/png",
};

export async function renderHomeImage() {
  return new ImageResponse(
    <OgFrame>
      <OgEyebrow>{site.hero.eyebrow}</OgEyebrow>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 28,
          fontSize: 176,
          fontWeight: 300,
          lineHeight: 0.92,
          letterSpacing: "-0.03em",
        }}
      >
        <span>shun</span>
        <span>2218</span>
      </div>
    </OgFrame>,
    { ...og.size, fonts: await loadOgFonts() },
  );
}

export async function renderWorkImage(work: Work) {
  return new ImageResponse(
    <OgFrame>
      <OgEyebrow>{`Works — ${work.no}`}</OgEyebrow>
      <div
        style={{
          marginTop: 32,
          fontSize: 120,
          fontWeight: 300,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {work.title}
      </div>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40 }}
      >
        {work.tags.map((tag) => (
          <div
            key={tag}
            style={{
              fontFamily: "Mono",
              fontSize: 20,
              padding: "8px 16px",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 9999,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </OgFrame>,
    { ...og.size, fonts: await loadOgFonts() },
  );
}

export async function renderIcon(size: number) {
  return new ImageResponse(<Monogram size={size} />, {
    width: size,
    height: size,
    fonts: await loadOgFonts(),
  });
}
