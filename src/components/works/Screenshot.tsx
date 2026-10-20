import { SHOTS, type ShotKind, shotSrc } from "@/lib/screenshots";

type Props = {
  slug: string;
  kind: ShotKind;
  /** 一覧のカードのように、隣のテキストで内容が分かるときは空にする */
  alt: string;
  /** 最初の画面に入る画像（LCP になりうる）は遅延読み込みしない */
  eager?: boolean;
  className?: string;
};

export function Screenshot({ slug, kind, alt, eager, className = "" }: Props) {
  const { width, height, widths, sizes } = SHOTS[kind];
  const largest = widths[widths.length - 1];
  return (
    // static export では next/image の最適化が使えないため、事前に書き出した WebP を srcset で出し分ける
    // biome-ignore lint/performance/noImgElement: 上記の理由で <img> を直接使う
    <img
      src={shotSrc(slug, kind, largest)}
      srcSet={widths.map((w) => `${shotSrc(slug, kind, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      // 縦横比を先に決めて、読み込み時にレイアウトがずれないようにする
      width={width * 100}
      height={height * 100}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={`block h-auto w-full ${className}`}
    />
  );
}
