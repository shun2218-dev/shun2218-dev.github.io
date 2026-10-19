import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-[700px] flex-col justify-end overflow-hidden px-page pb-24 md:h-[820px] md:justify-center md:pb-0"
    >
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 size-[420px] -translate-x-1/2 md:top-1/2 md:right-[-40px] md:left-auto md:size-[760px] md:translate-x-0 md:-translate-y-1/2"
      >
        <HeroCanvas />
      </div>

      <div className="relative flex max-w-[760px] flex-col gap-5 md:gap-8">
        <p className="font-mono text-[11px] tracking-eyebrow text-accent uppercase md:text-xs">
          <span className="md:hidden">{site.hero.eyebrowShort}</span>
          <span className="hidden md:inline">{site.hero.eyebrow}</span>
        </p>
        <h1 className="font-display text-display-md font-light tracking-display leading-[0.92] md:text-display-xl">
          shun
          <br />
          2218
        </h1>
        <p className="max-w-[460px] text-[15px] leading-relaxed text-text-sub md:text-lg">
          {site.hero.tagline}
        </p>
      </div>

      <div className="absolute bottom-12 left-page hidden items-center gap-4 font-mono text-[11px] tracking-eyebrow text-text-muted uppercase md:flex">
        <span className="block h-14 w-px bg-linear-to-b from-accent to-transparent" />
        {site.hero.scroll}
      </div>
    </section>
  );
}
