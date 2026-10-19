"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  /** 秒。並んだ要素をずらして出すときに使う */
  delay?: number;
};

// 画面に入ったときにフェードしながらせり上がる
export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current, {
        autoAlpha: 0,
        y: 48,
        duration: 1.2,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
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
