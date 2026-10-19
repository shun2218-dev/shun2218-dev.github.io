import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/scroll/Reveal";
import { ScreenshotPlaceholder } from "@/components/works/ScreenshotPlaceholder";
import { site } from "@/lib/site";
import type { Work } from "@/lib/works";

type Props = {
  work: Work;
  next: Work;
};

// Mobile は 2 × 2、Desktop は 4 列。セルの間に細い縦線を引く
const metaCell = [
  "pr-4 md:pr-6",
  "border-l border-border pl-4 md:px-6",
  "border-t border-border pr-4 md:border-t-0 md:border-l md:px-6",
  "border-t border-l border-border pl-4 md:border-t-0 md:px-6",
];

const label = "font-mono text-[11px] tracking-label text-text-muted uppercase";

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-6 items-center"
    >
      {children} ↗<span className="sr-only">{site.workDetail.newTab}</span>
    </a>
  );
}

function Article({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <article className="flex flex-col gap-6">
        <h2 className="font-display text-heading-sm font-light tracking-[-0.01em] md:text-heading-md">
          {title}
        </h2>
        {children}
      </article>
    </Reveal>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return items.map((text) => (
    <p
      key={text}
      className="text-[15px] leading-body text-text-sub md:text-base"
    >
      {text}
    </p>
  ));
}

export function WorkDetail({ work, next }: Props) {
  const t = site.workDetail;
  const meta = [
    { key: "type", label: t.meta.type, value: work.type },
    { key: "role", label: t.meta.role, value: work.role },
    {
      key: "site",
      label: t.meta.site,
      value: work.site && (
        <ExternalLink href={work.site}>{new URL(work.site).host}</ExternalLink>
      ),
    },
    {
      key: "repository",
      label: t.meta.repository,
      value: work.repository && (
        <ExternalLink href={work.repository}>{t.repositoryLink}</ExternalLink>
      ),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1312px] px-page">
      <section className="flex flex-col gap-8 pt-14 pb-12 md:gap-10 md:pt-24 md:pb-18">
        <Link
          href="/#works"
          className="inline-flex min-h-11 items-center gap-2.5 self-start font-mono text-xs tracking-nav text-text-muted uppercase"
        >
          <span aria-hidden="true">←</span>
          {t.back}
        </Link>
        <div className="flex flex-wrap items-baseline gap-4 md:gap-8">
          <span className="font-mono text-xs text-accent md:text-sm">
            {work.no}
          </span>
          <h1 className="font-display text-[48px] leading-none font-light tracking-display md:text-display-lg">
            {work.title}
          </h1>
        </div>
        <p className="max-w-[760px] text-[17px] leading-[1.8] text-text-lead md:text-[22px]">
          {work.lead}
        </p>
      </section>

      <dl className="grid grid-cols-2 border-y border-border-strong md:grid-cols-4">
        {meta.map((item, index) => (
          <div
            key={item.key}
            className={`flex flex-col gap-2.5 py-5 md:py-7 ${metaCell[index]}`}
          >
            <dt className={label}>{item.label}</dt>
            <dd className="text-[15px]">
              {item.value || (
                <>
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">{t.none}</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>

      <Reveal className="py-12 md:py-18">
        <div className="overflow-hidden border border-white/8">
          <ScreenshotPlaceholder
            label="[SCREENSHOT — MAIN]"
            className="aspect-video md:text-xs"
          />
        </div>
      </Reveal>

      <section className="flex flex-col gap-14 pb-20 md:grid md:grid-cols-12 md:gap-x-6 md:pt-12 md:pb-30">
        <aside className="flex flex-col gap-5 md:sticky md:top-30 md:col-span-3 md:self-start">
          <h2 className={label}>{t.stack}</h2>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-display text-lg font-light md:flex-col md:gap-3">
            {work.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-col gap-16 md:col-span-8 md:col-start-5 md:gap-22">
          <Article title={t.overview}>
            <Paragraphs items={work.overview} />
          </Article>

          <Article title={t.features}>
            <ol className="flex flex-col">
              {work.features.map((feature, index) => (
                <li
                  key={feature.title}
                  className="grid grid-cols-[40px_1fr] gap-4 border-t border-white/8 py-5.5 md:grid-cols-[56px_1fr]"
                >
                  <span className="font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-normal md:text-[17px]">
                      {feature.title}
                    </span>
                    <span className="text-sm leading-relaxed text-text-body">
                      {feature.body}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </Article>

          <Article title={t.highlights}>
            <Paragraphs items={work.highlights} />
            <div className="grid grid-cols-2 gap-3 pt-4 md:gap-6">
              <div className="overflow-hidden border border-white/8">
                <ScreenshotPlaceholder className="aspect-4/3" />
              </div>
              <div className="overflow-hidden border border-white/8">
                <ScreenshotPlaceholder className="aspect-4/3" />
              </div>
            </div>
          </Article>
        </div>
      </section>

      <Link
        href={`/works/${next.slug}`}
        className="flex flex-wrap items-center justify-between gap-6 border-t border-border-strong pt-14 pb-20 md:pt-18 md:pb-24"
      >
        <div className="flex flex-col gap-3.5">
          <span className={label}>{t.next(next.no)}</span>
          <span className="font-display text-heading-lg font-light tracking-heading md:text-display-md">
            {next.title}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="font-display text-4xl text-accent md:text-[56px]"
        >
          →
        </span>
      </Link>
    </main>
  );
}
