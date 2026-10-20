"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useState } from "react";
import { HeroFallback } from "@/components/hero/HeroFallback";

// three.js は大きいため、初期表示のテキストをブロックしないよう遅延読み込みする
const HeroScene = dynamic(() => import("@/components/hero/HeroScene"), {
  ssr: false,
});

// SwiftShader（Chrome）や llvmpipe（Mesa）など、GPU を使わずソフトウェアで描画する実装
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|softpipe|software/i;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    // ソフトウェア描画では毎フレームの描画がメインスレッドを塞ぐため 3D を出さない
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !SOFTWARE_RENDERER.test(renderer);
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
