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
- `pnpm e2e`: Playwright の E2E テスト（`e2e/`）。`pnpm build` 済みの `out/` を `e2e/serve.mjs`（GitHub Pages と同じく、末尾スラッシュへの 301 と 404.html を返す）で配信し、デスクトップ幅とモバイル幅の Chromium で確かめる。初回は `pnpm exec playwright install chromium`。CI の「E2E」ジョブでも実行する。スクロールで現れる要素（Reveal）は画面に入るまで隠れているため、`e2e/helpers.ts` の `scrollTo` で画面まで送ってから操作する
- `pnpm lhci`: `out/` を Lighthouse CI で測る（予算は `lighthouserc.json`、モバイルで Performance 0.9・Accessibility 0.95 以上）。CI の「Lighthouse」ジョブでも実行する。手元で何十回も回すとローカルのポートが枯渇することがあるため、回数を絞る
- 和文フォント（Noto Sans JP）は、`pnpm dev` / `pnpm build` の前に `scripts/subset-fonts.mjs` が content/ と src/ の文字だけでサブセットを作り `public/fonts/generated/` に置く（git 管理外）。dev 中に新しい漢字を足したら `pnpm fonts` を実行し直す
- Next.js 16 は学習データと API が異なる場合がある。コードを書く前に `node_modules/next/dist/docs/` の該当ガイドを読む（`AGENTS.md`）
- 作品データは `content/works/<slug>.md` の frontmatter（項目は `src/lib/works.ts` の `Work` 型）。`order` の昇順で一覧に並び、番号は自動で振られる。詳細ページ `/works/<slug>/` もここから生成する
- 作品のスクリーンショットは `public/works/<slug>/` の WebP（`pnpm screenshots <元画像のフォルダ>` が 2x の PNG から幅ごとに書き出す。幅と比率は `src/lib/screenshots.ts`）。元画像は git に入れない。代替テキストは frontmatter の `screenshots`
  - ichirizuka は本人のランニング記録が入っているため、必ずダミーデータで撮る。`.env.local` のない複製で、`SHEET_CSV_URL` / `SHEET_DAILY_CSV_URL` / `SHEET_FIT_CSV_URL` / `SHEET_SETTINGS_CSV_URL` の 4 つすべてをダミー CSV の URL にして起動する
  - hibari は Storybook（モックデータ）の画面を撮る
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
- `main` はブランチ保護あり（管理者にも適用）: 直接 push 不可、PR 経由でのみマージ（承認 0 件で可）、CI「Lint / Typecheck / Test / Build」と「E2E」の成功とコメントの解決が必須（「Lighthouse」は目安で必須にしない）、force push・削除は禁止
- マージは squash

## デザイン（SHU-6、承認済み）

- 詳細なトークン（色・タイポグラフィ・余白）は `docs/design.md`
- Claude Design: https://claude.ai/artifact/KvvGATFSecqJ1JaE7YrRYE
- 画面: Top / Desktop、Work Detail / Desktop（pdf-merge-app 例）、Top / Mobile
- 色: 背景 `#0A0A0A`、文字 `#E8E6E1`、本文グレー `#A3A09A` / `#B8B5AE`、補助 `#8A8780`、アクセント（ゴールド）`#C9A96E`、罫線 `rgba(255,255,255,0.06〜0.1)`
- フォント: 英字見出し Cormorant Garamond 300（ロゴのみ 500）、和文 Noto Sans JP 300、ラベル・番号 JetBrains Mono
  - Syne は太く丸く見えてシックさに欠けるため不採用。見出しは細身で統一する
- 薄い縦グリッド線（6 分割）、セクション番号 01/02/03、広い余白
- 文言（キャッチコピー・About など）は `src/lib/site.ts`。キャッチコピーは「速さは AI と。確かさは、設計と仕組みで。」（SHU-33 で確定）

## 確定事項

- 表示名はハンドル名（shun2218）。日本語のみ（将来英語対応の可能性あり）
- Contact セクションなし。GitHub リンクをヘッダー・フッターに置く
- 掲載作品: pdf-merge-app / hibari / ichirizuka / pylabo
  - ichirizuka: サイトリンクなし（スクショのみ）。サイト自体はあるが Basic 認証付きのため載せない
  - hibari: リポジトリリンク＋構成説明
  - pylabo: サイトリンク（https://pylabo.vercel.app）＋リポジトリリンク
- 技術: Next.js（App Router, static export）+ TypeScript、GSAP + Lenis、Tailwind CSS、Biome、Vitest、Playwright、pnpm、GitHub Actions で Pages デプロイ
- `package.json` の name は `shun2218-dev.github.io`（Linear のプロジェクト名は「Portfolio Site」のまま）
- Hero の球体は等幅の文字（ASCII）で canvas に描く（`src/lib/ascii-sphere.ts`）。案の比較は https://claude.ai/artifact/RqiL6u3CqtPtUv6yqgyedy （SHU-94 で 3D から変更。three.js は使わない）
- 独自ドメインは使わない（2026-10-21 決定）。公開 URL は `https://shun2218-dev.github.io/` のまま
