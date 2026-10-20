// 作品のスクリーンショット。static export では next/image の最適化が使えないため、
// scripts/optimize-screenshots.mjs が幅ごとの WebP を public/works/<slug>/ に書き出し、<img srcset> で出し分ける
// （このファイルは Node から直接 import されるため、@/ の別名を使わない）

export type ShotKind = "card" | "main" | "sub-1" | "sub-2";

type Spec = {
  /** 元画像の縦横比（幅 / 高さ） */
  width: number;
  height: number;
  /** 書き出す幅。表示幅の 2 倍程度を上限にする */
  widths: number[];
  sizes: string;
};

export const SHOTS: Record<ShotKind, Spec> = {
  // 一覧のカード。PC では 12 列中 5 列（最大 545px 前後）、スマホでは画面幅
  card: {
    width: 16,
    height: 10,
    widths: [640, 1090],
    sizes: "(min-width: 48rem) 40vw, 100vw",
  },
  // 作品詳細のメイン。最大幅 1184px
  main: {
    width: 16,
    height: 9,
    widths: [800, 1600, 2368],
    sizes: "(min-width: 80rem) 1184px, 100vw",
  },
  // 作品詳細の補足。2 枚を横に並べる
  "sub-1": {
    width: 4,
    height: 3,
    widths: [600, 1160],
    sizes: "(min-width: 48rem) 34vw, 50vw",
  },
  "sub-2": {
    width: 4,
    height: 3,
    widths: [600, 1160],
    sizes: "(min-width: 48rem) 34vw, 50vw",
  },
};

export const shotSrc = (slug: string, kind: ShotKind, width: number) =>
  `/works/${slug}/${kind}-${width}.webp`;
