"use client";

import Link from "next/link";
import { type PointerEvent, useRef } from "react";
import { Screenshot } from "@/components/works/Screenshot";
import type { Work } from "@/lib/works";

type Props = {
  work: Pick<Work, "slug" | "no" | "title" | "summary" | "tags">;
};

const TILT = "(hover: hover) and (prefers-reduced-motion: no-preference)";

export function WorkCard({ work }: Props) {
  const media = useRef<HTMLDivElement>(null);
  const titleId = `work-${work.slug}`;

  // ポインターの位置に合わせてスクリーンショットを傾ける
  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const el = media.current;
    if (
      !el ||
      event.pointerType !== "mouse" ||
      !window.matchMedia(TILT).matches
    )
      return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const clamp = (v: number) => Math.max(-0.5, Math.min(0.5, v));
    el.style.transform = `perspective(1200px) rotateX(${clamp(y) * -6}deg) rotateY(${clamp(x) * 8}deg)`;
  };

  const onPointerLeave = () => {
    if (media.current) media.current.style.transform = "";
  };

  return (
    <Link
      href={`/works/${work.slug}`}
      aria-labelledby={titleId}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group flex flex-col gap-4.5 md:grid md:grid-cols-12 md:items-center md:gap-6 md:border-t md:border-border-strong md:py-12"
    >
      <span
        aria-hidden="true"
        className="hidden font-mono text-[13px] text-accent md:block"
      >
        {work.no}
      </span>

      <div className="flex flex-col gap-4.5 md:col-span-5 md:gap-4">
        <div className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="font-mono text-[11px] text-accent md:hidden"
          >
            {work.no}
          </span>
          <h3
            id={titleId}
            className="font-display text-heading-sm font-light tracking-heading md:text-heading-lg"
          >
            {work.title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-text-body md:text-[15px]">
          {work.summary}
        </p>
        <ul className="hidden flex-wrap gap-2 md:flex">
          {work.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border-tag px-2.5 py-1.5 font-mono text-[11px] text-text-lead"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile では画像を先頭に置く */}
      <div
        ref={media}
        className="-order-1 transition-transform duration-700 ease-out motion-reduce:transition-none md:order-none md:col-span-5 md:col-start-8"
      >
        <div className="overflow-hidden border border-white/8">
          <Screenshot
            slug={work.slug}
            kind="card"
            // 隣の作品名と概要で内容が分かるため読み上げない
            alt=""
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      </div>
    </Link>
  );
}
