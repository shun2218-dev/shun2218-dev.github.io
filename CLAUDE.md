# CLAUDE.md

shun2218-dev のポートフォリオサイト（GitHub Pages のユーザーサイト）。

## リポジトリ

- GitHub: https://github.com/shun2218-dev/shun2218-dev.github.io （public）
- ローカル: `~/ghq/github.com/shun2218-dev/shun2218-dev.github.io`
- 要件: `docs/requirements.md`
- pstack（michael-denyer/pstack-claude）をプロジェクトスコープで導入済み（`.claude/settings.json`）

## 進め方

要件定義 → Claude Design でデザイン → レビュー承認 → 実装。
**実装はまだ始めない（デザイン承認待ち）。**

## タスク管理（Linear）

- チーム: Shun2218-dev（key: `SHU`）、プロジェクト: Portfolio Site
- 起票・参照は GraphQL API（`https://api.linear.app/graphql`）経由
- API キーはリポジトリ直下の `.env` の `LINEAR_API_KEY`（gitignore 済み。値は表示しない）

## Git / PR

- ブランチ名に Issue ID を含める（例: `shu-7-setup`）
- PR 本文に `Fixes SHU-xx` を書き、マージ時に自動クローズ（Linear の GitHub 連携は有効）
- コミット・PR は日本語タイトル可。Conventional Commits 風の prefix（`docs:`, `chore:`, `feat:` など）

## デザイン（SHU-6、レビュー待ち）

- Claude Design: https://claude.ai/artifact/KvvGATFSecqJ1JaE7YrRYE
- 画面: Top / Desktop、Work Detail / Desktop（pdf-merge-app 例）、Top / Mobile
- 色: 背景 `#0A0A0A`、文字 `#E8E6E1`、本文グレー `#A3A09A` / `#B8B5AE`、補助 `#8A8780`、アクセント（ゴールド）`#C9A96E`、罫線 `rgba(255,255,255,0.06〜0.1)`
- フォント: 英字見出し Syne、和文 Noto Sans JP 300、ラベル・番号 JetBrains Mono
- 薄い縦グリッド線（6 分割）、セクション番号 01/02/03、広い余白
- 仮置き: キャッチコピー・About 文・スクリーンショット
- 承認後、リンクとトークンを `docs/design.md` にまとめた PR で SHU-6 をクローズする

## 確定事項

- 表示名はハンドル名（shun2218）。日本語のみ（将来英語対応の可能性あり）
- Contact セクションなし。GitHub リンクをヘッダー・フッターに置く
- 掲載作品: pdf-merge-app / hibari / ichirizuka
  - ichirizuka: サイトリンクなし（スクショのみ）
  - hibari: リポジトリリンク＋構成説明
- 技術: Next.js（App Router, static export）+ TypeScript、React Three Fiber、GSAP + Lenis、Tailwind CSS、Biome、Vitest、Playwright、pnpm、GitHub Actions で Pages デプロイ
- `package.json` の name は `shun2218-dev.github.io`（Linear のプロジェクト名は「Portfolio Site」のまま）
- Hero の 3D はノイズで揺らぐ球体＋パーティクル

## 未決事項

- 独自ドメイン: `shun2218.dev` を推奨済み（ユーザーが購入予定）。取得後に CNAME と DNS 設定を用意する
