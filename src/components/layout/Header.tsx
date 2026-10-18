"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/72 backdrop-blur-sm">
      <div className="flex items-center justify-between px-page py-3 md:py-7">
        <Link
          href="/"
          className="font-display text-lg font-medium tracking-logo md:text-xl"
          onClick={() => setOpen(false)}
        >
          {site.name}
          <span className="text-accent">.</span>
        </Link>

        <button
          type="button"
          className="flex size-11 cursor-pointer flex-col items-end justify-center gap-1.5 md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? site.labels.closeMenu : site.labels.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-px w-[22px] bg-foreground" />
          <span className="block h-px w-3.5 bg-foreground" />
        </button>

        <nav
          id={menuId}
          aria-label={site.labels.mainNav}
          className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col border-b border-border bg-background px-page pb-6 md:static md:flex md:flex-row md:items-center md:gap-10 md:border-0 md:bg-transparent md:p-0`}
        >
          <ul className="flex flex-col font-mono text-xs tracking-nav uppercase md:flex-row md:items-center md:gap-10">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center"
                  onClick={() => setOpen(false)}
                >
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
  );
}
