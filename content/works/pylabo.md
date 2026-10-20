---
title: pylabo
order: 4
summary: ブラウザだけで動く Python 学習アプリ。Pyodide を同梱し、その場で実行・自動採点しながら学べる。
tags: [React 19, Vite, Pyodide, Web Worker]
site: https://pylabo.vercel.app
repository: https://github.com/shun2218-dev/pylabo
lead: ブラウザだけで動く Python 学習アプリ。解説を読み、その場でコードを書いて実行し、自動採点で理解を確かめながら進める。学習者の側に Python のインストールは要らない。
type: 学習アプリ
role: 設計・実装・運用
stack: [React, TypeScript, Vite, Pyodide, Web Worker, CodeMirror 6, markdown-it, SCSS, Vitest, Vercel]
overview:
  - Pyodide（WebAssembly に移植した CPython）をアプリに同梱し、ブラウザの中で Python を実行する学習アプリ。基本文法からデータ分析、FastAPI、テスト、型ヒントまで、目的別のコースに分けてレッスンを収録している。名前は Python Laboratory から取った。
  - コースは「実務で詰まる頻度 × 独学で身につきにくさ」を軸に選んでいる。テストの書き方や型の運用のように、体系立てて教わる機会が少ないわりに現場で毎日効く分野から埋めている。
features:
  - title: その場で実行
    body: 解説中のコードはすべて編集して実行でき、pandas や matplotlib のグラフもページ内に表示される。
  - title: 自動採点
    body: 演習を書いて採点すると、チェック項目ごとに合否が出る。
  - title: 本物の pytest と mypy
    body: エディタのコードをそのままファイルに書き出し、ブラウザ内で本物の pytest と mypy を走らせる。
  - title: 進捗の自動保存
    body: 進捗と書きかけのコードを localStorage に保存し、次に開いたときに続きから戻れる。
highlights:
  - Python は Web Worker で動かすため、無限ループを書いても UI は固まらず、停止ボタンで Worker を作り直して復帰できる。Pyodide 本体と wheel は sha256 で検証して自前で配信し、ホーム画面では読み込まずにコースを開いた時点で起動する。
  - 採点は「書けたか」ではなく「効いているか」を見る。テストの演習はわざと壊した実装に学習者のテストを当て、型の演習は誤った呼び出しを足して mypy にかける。CI では全演習の解答例が採点を通るかを検証している。
screenshots:
  main: コースを選ぶトップ画面
  sub:
    - pandas で集計した売上を matplotlib の棒グラフにして表示したレッスン
    - 解説を読みながら進める基本文法のレッスン
---
