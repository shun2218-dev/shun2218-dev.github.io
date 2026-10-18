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
  labels: {
    mainNav: "メイン",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
  },
} as const;
