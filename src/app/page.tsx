import { About } from "@/components/about/About";
import { Hero } from "@/components/hero/Hero";

// Skills / Works は SHU-14 以降で実装する
export default function Home() {
  return (
    <main>
      <Hero />
      <About />
    </main>
  );
}
