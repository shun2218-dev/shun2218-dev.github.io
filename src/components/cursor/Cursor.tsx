"use client";

import { useEffect, useRef } from "react";

// マウスなど細かく指せるポインターで、動きを減らす設定がないときだけ使う
const QUERY =
  "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, [role='button'], label, summary";
const ACTIVE_CLASS = "custom-cursor";

// ポインターを少し遅れて追う小さな円。リンクやボタンの上では枠だけの大きな円に広がる
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    let stop: (() => void) | undefined;

    const start = () => {
      const el = ref.current;
      if (!el) return;
      const root = document.documentElement;
      const target = { x: -100, y: -100 };
      const current = { ...target };
      let frame = 0;
      let last = performance.now();

      const tick = (now: number) => {
        // フレームレートに依らず同じ速さで追う
        const ease = 1 - Math.exp(-(now - last) / 60);
        last = now;
        current.x += (target.x - current.x) * ease;
        current.y += (target.y - current.y) * ease;
        el.style.translate = `${current.x}px ${current.y}px`;
        frame = requestAnimationFrame(tick);
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        if (el.dataset.visible !== "true") {
          // 表示し直すときは、離れた位置から飛んでこないよう追従元を合わせる
          current.x = event.clientX;
          current.y = event.clientY;
        }
        target.x = event.clientX;
        target.y = event.clientY;
        el.dataset.visible = "true";
      };
      const onOver = (event: PointerEvent) => {
        const hit =
          event.target instanceof Element && event.target.closest(INTERACTIVE);
        el.dataset.hover = String(Boolean(hit));
      };
      const onLeave = () => {
        el.dataset.visible = "false";
      };

      root.classList.add(ACTIVE_CLASS);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      frame = requestAnimationFrame(tick);

      stop = () => {
        cancelAnimationFrame(frame);
        root.classList.remove(ACTIVE_CLASS);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        el.dataset.visible = "false";
        stop = undefined;
      };
    };

    const sync = () => {
      if (media.matches && !stop) start();
      else if (!media.matches) stop?.();
    };
    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-visible="false"
      data-hover="false"
      className="group pointer-events-none fixed top-0 left-0 z-50 opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100"
    >
      <div className="size-2 -translate-1/2 rounded-full border border-accent bg-accent transition-[width,height,background-color] duration-300 ease-out group-data-[hover=true]:size-12 group-data-[hover=true]:bg-transparent" />
    </div>
  );
}
