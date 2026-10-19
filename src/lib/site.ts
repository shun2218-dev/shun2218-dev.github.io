// サイト全体で使う文言とリンク。将来の英語対応に備えてコンポーネントに直書きしない
export const site = {
  name: "shun2218",
  owner: "shun2218-dev",
  description: "shun2218 のポートフォリオサイト",
  githubUrl: "https://github.com/shun2218-dev",
  nav: [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Works", href: "/#works" },
  ],
  hero: {
    eyebrow: "Frontend Engineer — Portfolio",
    eyebrowShort: "Frontend Engineer",
    // 仮置きのキャッチコピー
    tagline: "確かな設計と、手触りのいいインターフェースを。",
    scroll: "Scroll",
  },
  // 仮置きの自己紹介
  about: {
    no: "01",
    title: "About",
    lead: "フロントエンドを中心に、Next.js と TypeScript で Web アプリケーションを作っています。",
    body: "テスト、CI、パフォーマンスまで含めて、長く保守できるプロダクトづくりを大切にしています。設計の判断は ADR に残し、触って気持ちのいい UI と、それを支える堅い土台の両方を目指しています。",
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
