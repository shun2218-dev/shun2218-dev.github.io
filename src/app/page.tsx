import { About } from "@/components/about/About";
import { Hero } from "@/components/hero/Hero";
import { Skills } from "@/components/skills/Skills";

// Works は SHU-15 以降で実装する
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
    </main>
  );
}
