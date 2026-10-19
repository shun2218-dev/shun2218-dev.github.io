---
title: hibari
order: 2
summary: Go 製のリアルタイムチャット。WebSocket と Redis Pub/Sub で複数インスタンス間を中継する。
tags: [Go, WebSocket, Redis, Next.js]
repository: https://github.com/shun2218-dev/hibari
lead: Go と Next.js で作ったリアルタイムチャット。ワークスペースとチャンネルの構成を持ち、WebSocket で配信しつつ、再接続したときは REST で差分を取り直して同期する。
type: リアルタイムチャット
role: 設計・実装
stack: [Go, PostgreSQL, Redis, WebSocket, sqlc, Next.js, TypeScript, Lexical, Cloudflare Realtime, Docker]
overview:
  - Slack や Discord と同じ「ワークスペース → チャンネル」の構成を持つチャットアプリ。サーバーは Go、Web クライアントは Next.js で作り、スレッド・リアクション・メンション・検索・ファイル添付から、音声とビデオのハドル（通話）までを実装している。
  - WebSocket を使ったリアルタイムの設計を、自分で実装して学ぶためのプロジェクトでもある。動けば終わりにせず、なぜその設計なのかをコードのコメントと 60 件を超える ADR に残している。
features:
  - title: リアルタイム配信
    body: 投稿・編集・入力中の表示・在席状態を WebSocket で届け、再接続したときは REST で差分を取り直す。
  - title: スレッドとリアクション
    body: メッセージへの返信をスレッドにまとめ、絵文字のリアクションを付けられる。
  - title: ファイルの添付
    body: クライアントが署名付き URL で S3 互換のストレージへ直接アップロードし、サーバーはファイルの中身を通さない。
  - title: ハドル（通話）
    body: DM とチャンネルで、音声・カメラ・画面共有を使った通話ができる。
highlights:
  - メッセージの順序は作成時刻ではなく、ルームごとに採番する seq だけで決める。配信は WebSocket だけに頼らず、再接続したら最後に受け取った位置から差分を取る。Redis Pub/Sub は落ちうる前提で設計し、複数のサーバーへ広げられる構成にした。
  - 認証とチャットは 1 つの Go バイナリに同居させつつ、パッケージを分けて chat が auth を import しない構成にした。SQL は ORM ではなく sqlc で型付きのコードを生成し、CI ではモックではなく実物の Postgres・Redis・ストレージに対してテストを走らせる。
---
