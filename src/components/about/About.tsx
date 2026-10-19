import { Reveal } from "@/components/scroll/Reveal";
import { SectionHeading } from "@/components/section/SectionHeading";
import { site } from "@/lib/site";

export function About() {
  const { about } = site;
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="flex flex-col gap-7 border-t border-border px-page py-section md:grid md:grid-cols-6 md:gap-x-6 md:gap-y-0"
    >
      <Reveal className="md:col-span-2">
        <SectionHeading id="about-heading" no={about.no} title={about.title} />
      </Reveal>
      <Reveal
        delay={0.15}
        className="flex max-w-[760px] flex-col gap-7 md:col-span-4"
      >
        <p className="text-xl leading-[1.8] font-light md:text-[28px] md:leading-[1.7]">
          {about.lead}
        </p>
        <p className="text-sm leading-body text-text-body md:text-base">
          {about.body}
        </p>
      </Reveal>
    </section>
  );
}
