import { Reveal } from "@/components/scroll/Reveal";
import { SectionHeading } from "@/components/section/SectionHeading";
import { site } from "@/lib/site";

export function Skills() {
  const { skills } = site;
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="flex flex-col gap-10 border-t border-border px-page py-section md:gap-18"
    >
      <Reveal>
        <SectionHeading
          id="skills-heading"
          no={skills.no}
          title={skills.title}
        />
      </Reveal>
      {/* Desktop は 3 カラム × 2 行、Mobile は縦積みで項目を「·」区切りの 1 行にする */}
      <div className="flex flex-col md:grid md:grid-cols-3 md:border-t md:border-border-strong">
        {skills.groups.map((group, index) => (
          <Reveal
            key={group.label}
            delay={(index % 3) * 0.1}
            className="flex flex-col gap-3.5 border-t border-border-strong py-6 md:gap-6 md:border-t-0 md:border-r md:border-b md:border-border md:px-6 md:pt-8 md:pb-10"
          >
            <h3 className="font-mono text-[11px] tracking-label text-text-muted uppercase md:text-xs">
              {group.label}
            </h3>
            <ul className="flex flex-wrap font-display text-lg leading-[1.7] font-light md:flex-col md:gap-3.5 md:text-[22px] md:leading-normal">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="after:mx-2 after:content-['·'_/_''] last:after:content-none md:after:content-none"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
