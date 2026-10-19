"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { HeroFallback } from "@/components/hero/HeroFallback";

// three.js は大きいため、初期表示のテキストをブロックしないよう遅延読み込みする
const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// コンテキストの作成やシェーダーのコンパイルに失敗したときも代わりの表示に切り替える
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <HeroFallback /> : this.props.children;
  }
}

export function HeroCanvas() {
  // 判定はブラウザでしかできないため、それまでは何も出さない
  const [webgl, setWebgl] = useState<boolean>();

  useEffect(() => {
    setWebgl(supportsWebGL());
  }, []);

  if (webgl === undefined) return null;
  if (!webgl) return <HeroFallback />;
  return (
    <SceneBoundary>
      <HeroScene />
    </SceneBoundary>
  );
}
