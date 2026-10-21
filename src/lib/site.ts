// サイト全体で使う文言とリンク。将来の英語対応に備えてコンポーネントに直書きしない
export const site = {
  name: "shun2218",
  owner: "shun2218-dev",
  // OGP・サイトマップの絶対 URL に使う
  url: "https://shun2218-dev.github.io",
  description:
    "フロントエンドエンジニア shun2218 のポートフォリオ。Next.js と TypeScript で作った Web アプリケーションを紹介しています。",
  githubUrl: "https://github.com/shun2218-dev",
  nav: [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Works", href: "/#works" },
  ],
  hero: {
    eyebrow: "Frontend Engineer — Portfolio",
    eyebrowShort: "Frontend Engineer",
    tagline: "速さは AI と。確かさは、設計と仕組みで。",
    scroll: "Scroll",
  },
  about: {
    no: "01",
    title: "About",
    lead: "2022 年に新卒でエンジニアになり、現在は SES で大手エンタメ系企業のフロントエンド開発に参画しています。",
    body: "仕事のかたわら、自分で使うための道具を個人開発しています。Claude Code などの AI と並走して実装を進め、設計の判断は ADR に、品質はテストと CI に任せる。速く作ることと、長く保てることの両立を目指しています。",
  },
  skills: {
    no: "02",
    title: "Skills",
    groups: [
      {
        label: "Languages",
        items: ["TypeScript", "JavaScript", "Go", "Python", "HTML / CSS"],
      },
      {
        label: "Frontend",
        items: [
          "React",
          "Next.js",
          "Vite",
          "Tailwind CSS",
          "shadcn/ui",
          "Three.js / R3F",
        ],
      },
      {
        label: "Backend / Infra",
        items: ["WebSocket", "Redis", "Docker", "Vercel", "GitHub Actions"],
      },
      {
        label: "Quality",
        items: [
          "Vitest",
          "Testing Library",
          "Storybook",
          "Playwright",
          "Biome",
          "Sentry",
        ],
      },
      { label: "AI", items: ["Claude Code", "Orca", "Agentastic"] },
      { label: "Tools", items: ["Git / GitHub", "Linear", "Figma"] },
    ],
  },
  works: {
    no: "03",
    title: "Works",
    count: (n: number) => `${n} PROJECTS`,
  },
  workDetail: {
    back: "Back to Works",
    meta: {
      type: "Type",
      role: "Role",
      site: "Site",
      repository: "Repository",
    },
    repositoryLink: "GitHub",
    none: "なし",
    stack: "Stack",
    overview: "Overview",
    features: "Features",
    highlights: "Highlights",
    next: (no: string) => `Next Project — ${no}`,
    newTab: "（新しいタブで開く）",
  },
  labels: {
    mainNav: "メイン",
    mobileNav: "メニュー",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
  },
} as const;
