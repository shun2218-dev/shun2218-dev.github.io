import { Reveal } from "@/components/scroll/Reveal";
import { SectionHeading } from "@/components/section/SectionHeading";
import { WorkCard } from "@/components/works/WorkCard";
import { site } from "@/lib/site";
import { getWorks } from "@/lib/works";

export function Works() {
  // クライアントに渡すのは一覧に要る項目だけにする
  const works = getWorks().map(({ slug, no, title, summary, tags }) => ({
    slug,
    no,
    title,
    summary,
    tags,
  }));
  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="flex flex-col gap-10 border-t border-border px-page py-section md:gap-18 md:pb-50"
    >
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="works-heading"
          no={site.works.no}
          title={site.works.title}
        />
        <p className="hidden font-mono text-xs tracking-nav text-text-muted md:block">
          {site.works.count(works.length)}
        </p>
      </Reveal>
      <ul className="flex flex-col gap-14 md:gap-0">
        {works.map((work) => (
          <li key={work.slug}>
            <Reveal>
              <WorkCard work={work} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
