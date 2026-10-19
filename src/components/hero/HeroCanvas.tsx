"use client";

import dynamic from "next/dynamic";

// three.js は大きいため、初期表示のテキストをブロックしないよう遅延読み込みする
const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
});

export function HeroCanvas() {
  return <HeroScene />;
}
