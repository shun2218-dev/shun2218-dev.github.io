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
    // GPU がなくソフトウェアで描画する環境では、毎フレームの描画がメインスレッドを塞ぐため 3D を出さない
    const options = { failIfMajorPerformanceCaveat: true };
    return Boolean(
      canvas.getContext("webgl2", options) ??
        canvas.getContext("webgl", options),
    );
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
    // three.js の読み込みと初期化は重いため、ページの読み込みが終わってブラウザが空いてから始める
    // requestIdleCallback がない環境（Safari など）では少し待ってから始める
    let cancel = () => {};
    const start = () => {
      const run = () => setWebgl(supportsWebGL());
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(run, { timeout: 2000 });
        cancel = () => window.cancelIdleCallback(id);
      } else {
        const id = setTimeout(run, 200);
        cancel = () => clearTimeout(id);
      }
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      cancel();
    };
  }, []);

  if (webgl === undefined) return null;
  if (!webgl) return <HeroFallback />;
  return (
    <SceneBoundary>
      <HeroScene />
    </SceneBoundary>
  );
}
