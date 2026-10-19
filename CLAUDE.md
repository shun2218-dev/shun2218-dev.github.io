# CLAUDE.md

shun2218-dev のポートフォリオサイト（GitHub Pages のユーザーサイト）。

## リポジトリ

- GitHub: https://github.com/shun2218-dev/shun2218-dev.github.io （public）
- ローカル: `~/ghq/github.com/shun2218-dev/shun2218-dev.github.io`
- 要件: `docs/requirements.md`
- pstack（michael-denyer/pstack-claude）をプロジェクトスコープで導入済み（`.claude/settings.json`）

## 進め方

要件定義 → Claude Design でデザイン → レビュー承認 → 実装。
デザインは承認済み（2026-10-19）。実装フェーズ（SHU-7 以降）。

## デプロイ

- `main` への push で `.github/workflows/deploy.yml` が `pnpm build` の `out/` を GitHub Pages に公開する（Pages のソースは GitHub Actions）
- 公開 URL: https://shun2218-dev.github.io/

## コマンド

- `pnpm dev` / `pnpm build`（`out/` に static export）/ `pnpm lint`（Biome）/ `pnpm typecheck` / `pnpm test`（Vitest）
- Next.js 16 は学習データと API が異なる場合がある。コードを書く前に `node_modules/next/dist/docs/` の該当ガイドを読む（`AGENTS.md`）
- static export のため Cache Components・Server Actions・Route Handlers・画像最適化などのサーバー機能は使わない

## タスク管理（Linear）

- チーム: Shun2218-dev（key: `SHU`）、プロジェクト: Portfolio Site
- 起票・参照・更新は Orca CLI（`orca linear ...`）経由。手順は `orca-linear` スキル（グローバル導入済み）に従い、最初に `orca skills get orca-linear` で版の合ったガイドを読む
- ワークスペース ID: `957c796e-66ea-4718-aca9-09bcc6ba17d1`、チーム key: `SHU`
- API キーや `.env` は使わない（Orca が認証を持つ）
- `orca-linear` スキルにある「`runtime_access_denied` なら権限を上げて再実行」は自動で従わず、ユーザーに確認する

## Git / PR

- ブランチ名に Issue ID を含める（例: `shu-7-setup`）
- PR 本文に `Fixes SHU-xx` を書き、マージ時に自動クローズ（Linear の GitHub 連携は有効）
- コミット・PR は日本語タイトル可。Conventional Commits 風の prefix（`docs:`, `chore:`, `feat:` など）
- `main` はブランチ保護あり（管理者にも適用）: 直接 push 不可、PR 経由でのみマージ（承認 0 件で可）、CI「Lint / Typecheck / Test / Build」の成功とコメントの解決が必須、force push・削除は禁止
- マージは squash

## デザイン（SHU-6、承認済み）

- 詳細なトークン（色・タイポグラフィ・余白）は `docs/design.md`
- Claude Design: https://claude.ai/artifact/KvvGATFSecqJ1JaE7YrRYE
- 画面: Top / Desktop、Work Detail / Desktop（pdf-merge-app 例）、Top / Mobile
- 色: 背景 `#0A0A0A`、文字 `#E8E6E1`、本文グレー `#A3A09A` / `#B8B5AE`、補助 `#8A8780`、アクセント（ゴールド）`#C9A96E`、罫線 `rgba(255,255,255,0.06〜0.1)`
- フォント: 英字見出し Cormorant Garamond 300（ロゴのみ 500）、和文 Noto Sans JP 300、ラベル・番号 JetBrains Mono
  - Syne は太く丸く見えてシックさに欠けるため不採用。見出しは細身で統一する
- 薄い縦グリッド線（6 分割）、セクション番号 01/02/03、広い余白
- 仮置き: キャッチコピー・About 文・スクリーンショット

## 確定事項

- 表示名はハンドル名（shun2218）。日本語のみ（将来英語対応の可能性あり）
- Contact セクションなし。GitHub リンクをヘッダー・フッターに置く
- 掲載作品: pdf-merge-app / hibari / ichirizuka / pylabo
  - ichirizuka: サイトリンクなし（スクショのみ）。サイト自体はあるが Basic 認証付きのため載せない
  - hibari: リポジトリリンク＋構成説明
  - pylabo: サイトリンク（https://pylabo.vercel.app）＋リポジトリリンク
- 技術: Next.js（App Router, static export）+ TypeScript、React Three Fiber、GSAP + Lenis、Tailwind CSS、Biome、Vitest、Playwright、pnpm、GitHub Actions で Pages デプロイ
- `package.json` の name は `shun2218-dev.github.io`（Linear のプロジェクト名は「Portfolio Site」のまま）
- Hero の 3D はノイズで揺らぐ球体＋パーティクル

## 未決事項

- 独自ドメイン: `shun2218.dev` を推奨済み（ユーザーが購入予定）。取得後に CNAME と DNS 設定を用意する
