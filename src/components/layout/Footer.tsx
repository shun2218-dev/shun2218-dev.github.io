import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col-reverse gap-3 border-t border-border px-page pt-8 pb-10 font-mono text-[11px] tracking-footer text-text-muted md:flex-row md:items-center md:justify-between md:gap-4 md:py-12 md:text-xs">
      <span>
        © {year} {site.owner}
      </span>
      <a href={site.githubUrl} className="inline-flex min-h-11 items-center">
        github.com/{site.owner} ↗
      </a>
    </footer>
  );
}
