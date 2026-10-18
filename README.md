# shun2218-dev.github.io

shun2218-dev のポートフォリオサイト。

Next.js（App Router, static export）+ TypeScript で作り、GitHub Pages で配信する。

## 必要なもの

- Node.js 24 以上
- pnpm（バージョンは `package.json` の `packageManager` に合わせる）

## コマンド

| コマンド | 内容 |
|---|---|
| `pnpm install` | 依存をインストールする |
| `pnpm dev` | 開発サーバーを起動する（http://localhost:3000） |
| `pnpm build` | 静的サイトを `out/` に書き出す |
| `pnpm lint` | Biome でフォーマットと lint を確認する |
| `pnpm format` | Biome で自動修正する |
| `pnpm typecheck` | ルートの型を生成して型チェックする |
| `pnpm test` | Vitest でユニットテストを実行する |

## デプロイ

`main` に push（PR をマージ）すると、GitHub Actions がビルドして GitHub Pages に公開する。手動で実行するときは Actions の「Deploy」から `Run workflow` を押す。

公開 URL: https://shun2218-dev.github.io/

## ドキュメント

- 要件: `docs/requirements.md`
- デザイン: `docs/design.md`
