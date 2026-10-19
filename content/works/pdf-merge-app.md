---
title: pdf-merge-app
order: 1
summary: ブラウザの中（Web Worker）で完結する PDF 結合ツール。ファイルを端末の外へ送らない。
tags: [Next.js 16, React 19, pdf-lib, Web Worker]
site: https://pdf-merge.app
repository: https://github.com/shun2218-dev/pdf-merge-app
lead: 複数の PDF をブラウザの中（Web Worker）で結合するツール。ファイルを端末の外へ送らずに、追加と並び替えからプレビュー、ダウンロードまでを行う。
type: Web アプリケーション
role: 設計・実装・運用
stack: [Next.js, TypeScript, pdf-lib, Web Worker, Tailwind CSS, Vitest, Storybook, Playwright, Lighthouse CI, Vercel]
overview:
  - 複数の PDF をドラッグ＆ドロップで追加し、並び替えて 1 つに結合する Web アプリケーション。Next.js と pdf-lib で作り、pdf-merge.app で公開している。
  - もともとはサーバー（Vercel Functions）で結合していたが、リクエスト本文の 4.5MB 上限で数ファイルしか結合できないことと、契約書や請求書のような機密文書を送らせてしまうことを理由に、結合をブラウザの中へ移した。
features:
  - title: ドラッグ＆ドロップで追加・並び替え
    body: PDF をドロップして追加し、一覧の行をドラッグして結合する順番を入れ替える。
  - title: ブラウザ内でのプレビュー
    body: 結合した PDF をブラウザの中で生成し、その場でプレビュー表示する。
  - title: 読めないファイルを飛ばして結合
    body: パスワード付きや壊れた PDF は結合から外し、名前と理由を示して残りのファイルで結合する。
  - title: ファイル名を指定してダウンロード
    body: 入力したファイル名で保存でき、空欄ならダウンロードした日時から名前を付ける。
highlights:
  - 結合は Web Worker で行い、ファイルの中身はコピーせずに Worker へ渡す。pdf-lib（gzip で約 175 KB）は Worker を作ったときに初めて読み込むため、最初の表示を重くしない。PDF かどうかは拡張子ではなく先頭のバイトで判定する。
  - PR ごとに lint・型チェック・ユニットテスト・Storybook のインタラクションテスト・E2E・Lighthouse CI を実行する。E2E では結合中に PDF を含むリクエストが 1 件も出ないことまで検査し、設計判断は 30 件を超える ADR として残している。
---
