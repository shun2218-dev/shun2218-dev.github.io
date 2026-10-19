import { About } from "@/components/about/About";
import { Hero } from "@/components/hero/Hero";
import { Skills } from "@/components/skills/Skills";
import { Works } from "@/components/works/Works";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Works />
    </main>
  );
}
