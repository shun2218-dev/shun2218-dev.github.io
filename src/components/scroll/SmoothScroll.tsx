"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

// Lenis による慣性スクロール。ScrollTrigger と同じ ticker で動かし、位置のずれを防ぐ
// prefers-reduced-motion のときは Lenis が慣性を切り、ネイティブのスクロールになる
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // 同じページ内のアンカーへは Lenis でなめらかに移動する
    // capture で先に preventDefault し、next/link の瞬間移動を止める（Link の onClick 自体は呼ばれる）
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest("a[href]")
          : null;
      if (!(link instanceof HTMLAnchorElement)) return;

      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      )
        return;
      const target = document.getElementById(
        decodeURIComponent(url.hash.slice(1)),
      );
      if (!target) return;

      event.preventDefault();
      const header = document.querySelector("header");
      lenis.scrollTo(target, { offset: -(header?.offsetHeight ?? 0) });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, { capture: true });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return null;
}
