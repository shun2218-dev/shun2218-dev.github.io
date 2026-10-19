"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    // Desktop 幅に広げたらメニューは不要になるので閉じる
    const desktop = window.matchMedia("(width >= 48rem)");
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    const { overflow } = document.body.style;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/72 backdrop-blur-sm">
        <div className="flex items-center justify-between px-page py-3 md:py-7">
          <Link
            href="/"
            className="font-display text-lg font-medium tracking-logo md:text-xl"
            onClick={close}
          >
            {site.name}
            <span className="text-accent">.</span>
          </Link>

          <button
            type="button"
            className="group relative flex size-11 cursor-pointer items-center justify-end md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? site.labels.closeMenu : site.labels.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            {/* 2 本線が開くと × に重なる */}
            <span className="absolute right-0 h-px w-[22px] -translate-y-[3.5px] bg-foreground transition-[translate,rotate] duration-300 ease-out group-aria-expanded:translate-y-0 group-aria-expanded:rotate-45 motion-reduce:transition-none" />
            <span className="absolute right-0 h-px w-3.5 translate-y-[3.5px] bg-foreground transition-[translate,rotate,width] duration-300 ease-out group-aria-expanded:w-[22px] group-aria-expanded:translate-y-0 group-aria-expanded:-rotate-45 motion-reduce:transition-none" />
          </button>

          <nav aria-label={site.labels.mainNav} className="hidden md:block">
            <ul className="flex items-center gap-10 font-mono text-xs tracking-nav uppercase">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex min-h-11 items-center">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.githubUrl}
                  className="flex min-h-11 items-center gap-2"
                >
                  <GitHubIcon />
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ヘッダーの backdrop-filter の中に置くと fixed が画面全体に広がらないため、header の外に置く */}
      <nav
        id={menuId}
        aria-label={site.labels.mobileNav}
        aria-hidden={!open}
        inert={!open}
        // 開いているあいだ背面を慣性スクロールさせない
        data-lenis-prevent
        className={`fixed inset-0 z-10 flex flex-col justify-between bg-background px-page pt-28 pb-10 transition-[opacity,visibility] duration-500 ease-out motion-reduce:transition-none md:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <ul className="flex flex-col">
          {site.nav.map((item, index) => (
            <li
              key={item.href}
              className={`border-t border-border-strong transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              style={{
                transitionDelay: open ? `${150 + index * 70}ms` : "0ms",
              }}
            >
              <Link
                href={item.href}
                className="flex items-baseline gap-4 py-5"
                onClick={close}
              >
                <span className="font-mono text-[11px] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-heading-lg font-light tracking-heading">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={site.githubUrl}
          className={`flex min-h-11 items-center gap-2 self-start font-mono text-xs tracking-nav text-text-muted uppercase transition-opacity duration-700 ease-out motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
          style={{
            transitionDelay: open ? `${150 + site.nav.length * 70}ms` : "0ms",
          }}
        >
          <GitHubIcon />
          GitHub ↗
        </a>
      </nav>
    </>
  );
}
