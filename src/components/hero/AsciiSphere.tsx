"use client";

import { useEffect, useRef, useState } from "react";
import { REDUCED_MOTION, useMediaQuery } from "@/hooks/useMediaQuery";
import { createAsciiSphere, type FrameParams, TONES } from "@/lib/ascii-sphere";

const COLS = 96;
const ROWS = 48;
const FPS = 24;
/** 登場で文字の乱れが解けるまでの秒数 */
const INTRO_SECONDS = 2.2;
/** 濃さの段階ごとの不透明度 */
const TONE_ALPHA = [0.32, 0.55, 0.78, 1];
// JetBrains Mono の 1 文字の幅（em）
const ADVANCE = 0.6;

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

// 球体を等幅の文字で描く。<pre> ではなく canvas にするのは、
// 毎フレーム書き換える大きなテキストが LCP の対象にならないようにするため
export function AsciiSphere() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const still = useMediaQuery(REDUCED_MOTION);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    const frame = createAsciiSphere({ cols: COLS, rows: ROWS });
    const style = getComputedStyle(el);
    const pointer = { x: 0, y: 0 };
    const light = { x: 0, y: 0 };
    let width = 0;
    let rowHeight = 0;
    let visible = true;
    let started = 0;
    let last = 0;
    let raf = 0;
    let disposed = false;

    const resize = () => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = rect.width;
      rowHeight = rect.height / ROWS;
      el.width = Math.round(rect.width * dpr);
      el.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${width / COLS / ADVANCE}px ${style.fontFamily}`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = style.color;
    };

    const draw = (params: FrameParams, fade: number) => {
      const { glyphs, tones } = frame(params);
      ctx.clearRect(0, 0, width, rowHeight * ROWS);
      // 濃さの段階ごとに 1 行ずつまとめて描き、fillText の回数を抑える
      for (let tone = 0; tone < TONES; tone++) {
        ctx.globalAlpha = TONE_ALPHA[tone] * fade;
        for (let r = 0; r < ROWS; r++) {
          let line = "";
          let any = false;
          for (let c = 0; c < COLS; c++) {
            const i = r * COLS + c;
            if (tones[i] === tone && glyphs[i] !== " ") {
              line += glyphs[i];
              any = true;
            } else {
              line += " ";
            }
          }
          if (any) ctx.fillText(line, 0, (r + 0.5) * rowHeight);
        }
      }
    };

    const drawStill = () => draw({ time: 0, light, intro: 1, scale: 1 }, 1);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || now - last < 1000 / FPS) return;
      last = now;
      started ||= now;

      // マウスの位置へ光をゆっくり寄せる
      light.x += (pointer.x - light.x) * 0.08;
      light.y += (pointer.y - light.y) * 0.08;

      // Hero をスクロールで抜けるにつれて小さく、薄くする
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      const time = (now - started) / 1000;
      draw(
        {
          time,
          light,
          intro: easeInOut(Math.min(time / INTRO_SECONDS, 1)),
          scale: 1 - progress * 0.3,
        },
        1 - progress * 0.6,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    // 画面外にあるあいだは描画を止める
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    const resizer = new ResizeObserver(() => {
      resize();
      if (still) drawStill();
    });

    // フォントが読み込まれる前に描くと文字の幅がずれるため、待ってから始める
    document.fonts
      .load(`16px ${style.fontFamily}`)
      .catch(() => {})
      .then(() => {
        if (disposed) return;
        resize();
        resizer.observe(el);
        if (still) {
          drawStill();
        } else {
          observer.observe(el);
          window.addEventListener("pointermove", onPointerMove, {
            passive: true,
          });
          raf = requestAnimationFrame(tick);
        }
        setReady(true);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [still]);

  return (
    <canvas
      ref={canvas}
      // 読み上げからは、Hero の親要素の aria-hidden で外している
      data-testid="ascii-sphere"
      className={`size-full font-mono text-accent transition-opacity duration-500 ease-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
