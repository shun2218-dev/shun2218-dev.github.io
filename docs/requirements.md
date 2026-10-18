# 要件定義

## 目的

フロントエンドエンジニア shun2218-dev のスキルと制作物を外部に示すポートフォリオサイト。サイト自体も実装力を示す制作物として扱う。

## 公開

- URL: `https://shun2218-dev.github.io/`（独自ドメインは後日取得して切り替え）
- ホスティング: GitHub Pages（GitHub Actions でビルド・デプロイ）
- 言語: 日本語のみ（将来の英語対応を見越し、文言はコンポーネントに直書きせずデータ側にまとめる）

## デザイン

- コンセプト: 静かな黒に、ゆっくり動く幾何学
- 配色: 背景 `#0a0a0a` 前後の深い黒、文字はオフホワイトとグレー、アクセントはゴールド系 1 色
- タイポグラフィ: 英字見出しは細身のセリフ体（Cormorant Garamond）、和文は Noto Sans JP の細めのウェイト（詳細は `docs/design.md`）
- 余白を広く取り、細い罫線・グリッドで締める
- デザインは Claude Design（Design アーティファクト）で作成し、承認後に実装する

## ページ構成

### トップ（1 ページ構成）

| セクション | 内容 |
|---|---|
| Header | ハンドル名ロゴ、セクションへのアンカー、GitHub リンク |
| Hero | ハンドル名・肩書き、3D オブジェクト、スクロール誘導 |
| About | 短い自己紹介 |
| Skills | 言語・フレームワーク・ツールをカテゴリ別に表示 |
| Works | 制作物カード一覧（3 件）→ 詳細ページへ |
| Footer | GitHub リンク、コピーライト |

Contact セクションは設けない。

### 作品詳細 `/works/[slug]`

概要、背景・目的、主な機能、技術スタック、工夫した点、スクリーンショット、リンク（サイト / リポジトリ）、前後の作品への導線。

## 掲載作品

| slug | 概要 | 主な技術 | リンク |
|---|---|---|---|
| pdf-merge-app | ブラウザ内（Web Worker）で完結する PDF 結合ツール | Next.js 16, React 19, pdf-lib, Vitest, Storybook, Playwright | https://pdf-merge.app |
| hibari | Go 製リアルタイムチャット | Go, WebSocket, Redis Pub/Sub, Next.js | リポジトリのみ |
| ichirizuka | ランニング記録の個人ダッシュボード（チャートライブラリ不使用） | Next.js 16, Google Sheets (CSV) | なし（サイトは Basic 認証付きのため。スクリーンショットのみ） |
| pylabo | ブラウザだけで動く Python 学習アプリ（Pyodide 同梱、その場で実行・自動採点） | Vite, React 19, TypeScript, Pyodide (Web Worker), CodeMirror 6 | https://pylabo.vercel.app / リポジトリ |

作品データは Markdown（frontmatter 付き）で管理し、追加はファイルを置くだけで済むようにする。

## Skills

- 言語: TypeScript, JavaScript, Go, Python, HTML, CSS
- フロントエンド: React, Next.js (App Router), Vite, Tailwind CSS, shadcn/ui, Three.js / React Three Fiber
- バックエンド・インフラ: WebSocket, Redis, Docker, Vercel, GitHub Actions
- テスト・品質: Vitest, Testing Library, Storybook, Playwright, Biome, Sentry
- AI: Claude Code, Orca, Agentastic
- ツール: Git / GitHub, Linear, Figma

Slack・Teams・Notion・Backlog など、コミュニケーションや社内ドキュメント用のツールは載せない。

## 3D・アニメーション

- Hero: ノイズで表面が揺らぐ球体（シェーダー）と周囲を漂うパーティクル。マウスに緩やかに反応し、スクロールで奥へ沈む
- 慣性スクロール（Lenis）
- セクション見出し・本文のフェード＋せり上がり
- 背景・3D・テキストの速度差によるパララックス
- 作品カードのホバー時ズーム・傾き
- カスタムカーソル（ポインタデバイスのみ）

## 非機能要件

- `prefers-reduced-motion` 有効時はアニメーション・パララックス・3D の動きを止める
- モバイルではパーティクル数・ピクセル比を下げ、カスタムカーソルは無効
- WebGL 非対応環境では静的な画像・グラデーションで代替する
- Lighthouse: Performance 90 以上（モバイル）、Accessibility 95 以上
- 3D 関連は遅延読み込みし、初期表示のテキストをブロックしない
- OGP・favicon・メタ情報を設定する

## 技術スタック

- Next.js（App Router, `output: 'export'`）+ TypeScript
- React Three Fiber / drei / Three.js
- GSAP（ScrollTrigger）+ Lenis
- Tailwind CSS
- Biome（lint / format）
- Vitest + Testing Library、Playwright（スモークテスト）
- pnpm
- GitHub Actions: PR ごとに lint・型チェック・テスト・ビルド、main への push で Pages へデプロイ

## 開発の進め方

- タスク管理: Linear（チーム Shun2218-dev、プロジェクト「Portfolio Site」）。起票は API 経由
- ブランチ名に Linear の Issue ID を含め、PR 本文に `Fixes <ID>` を書いてマージ時に Issue を自動クローズする
- 順序: 要件定義 → デザイン → 実装
