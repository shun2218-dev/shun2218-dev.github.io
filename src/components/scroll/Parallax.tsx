"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  /** 画面を通り過ぎるあいだに下へずらす量（×100px）。大きいほど遅れて奥にあるように見える */
  speed: number;
};

// スクロールに対して遅れて動かし、奥行きを出す
export function Parallax({ children, className, speed }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(ref.current, {
        y: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          // 初期表示で見えている要素も、スクロール 0 のときにずれていないよう clamp する
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
