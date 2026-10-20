# デザイン

## リンク

- Claude Design: https://claude.ai/artifact/KvvGATFSecqJ1JaE7YrRYE
- 画面
  - Top / Desktop（1440px）
  - Work Detail / Desktop（pdf-merge-app を例にした作品詳細）
  - Top / Mobile（390px）
- 承認: 2026-10-19

コンセプトは「静かな黒に、ゆっくり動く幾何学」。黒の地に細い書体と細い罫線を置き、アクセントはゴールド 1 色に絞る。

## 色

| トークン | 値 | 用途 |
|---|---|---|
| `background` | `#0A0A0A` | ページ背景 |
| `foreground` | `#E8E6E1` | 見出し・リード文・リンク |
| `text-lead` | `#C8C5BE` | 作品詳細のリード文、タグの文字 |
| `text-sub` | `#B8B5AE` | キャッチコピー、作品詳細の本文 |
| `text-body` | `#A3A09A` | 本文 |
| `text-muted` | `#8A8780` | ラベル、フッター、スクロール誘導 |
| `accent` | `#C9A96E` | セクション番号、肩書き、ロゴのドット、ホバー時のリンク |
| `border` | `rgba(255,255,255,0.06)` | セクション区切り、ヘッダー下線、縦の区切り |
| `border-strong` | `rgba(255,255,255,0.1)` | 一覧の行区切り、メタ情報の上下 |
| `border-tag` | `rgba(255,255,255,0.14)` | タグの枠 |
| `grid-line` | `rgba(255,255,255,0.035)` | 背景の縦グリッド線 |
| `header-bg` | `rgba(10,10,10,0.72)` + `backdrop-filter: blur(8px)` | 追従ヘッダー |

- 作品のスクリーンショットは各作品の実際の画面（2x）を、1px の罫線（`rgba(255,255,255,0.08)`）で囲んで置く。比率は一覧 16:10、作品詳細のメイン 16:9、補足 4:3
- Hero の球体は `#2A2620` → `#121110` → `#0A0A0A` の放射グラデーションに、ゴールドの細い線とパーティクルを重ねる（実装は React Three Fiber で、ノイズで揺らぐ球体＋パーティクルにする）

## タイポグラフィ

### 書体

| 役割 | 書体 | ウェイト |
|---|---|---|
| 英字見出し（Hero、セクション見出し、作品名、Skills / Stack の項目） | Cormorant Garamond | 300 |
| ロゴ（`shun2218.`） | Cormorant Garamond | 500 |
| 和文・本文 | Noto Sans JP | 300（作品詳細の機能名のみ 400） |
| ラベル・番号・ナビ・タグ | JetBrains Mono | 400 |

読み込むウェイトは上記のみ（Cormorant Garamond 300 / 500、Noto Sans JP 300 / 400、JetBrains Mono 400）。Noto Sans JP はサイトで使う文字だけに絞ったサブセットを自前で配信する（`scripts/subset-fonts.mjs`）。

### サイズ（Desktop / Mobile）

| 要素 | 書体 | Desktop | Mobile | 行間 | 字間 |
|---|---|---|---|---|---|
| Hero 見出し | Cormorant | 136px | 72px | 0.92 | -0.03em |
| 作品詳細タイトル | Cormorant | 112px | — | 1 | -0.03em |
| Next Project の作品名 | Cormorant | 72px | — | — | -0.02em |
| セクション見出し（About / Skills / Works） | Cormorant | 56px | 36px | — | -0.02em |
| 作品名（Works 一覧） | Cormorant | 44px | 28px | — | -0.02em |
| 作品詳細の小見出し（Overview など） | Cormorant | 36px | — | — | -0.01em |
| Skills の項目 | Cormorant | 22px | 18px | 1.7（Mobile） | — |
| Stack の項目 | Cormorant | 18px | — | — | — |
| ロゴ | Cormorant 500 | 20px | 18px | — | 0.02em |
| About のリード文 | Noto Sans JP | 28px | 20px | 1.7 / 1.8 | — |
| 作品詳細のリード文 | Noto Sans JP | 22px | — | 1.8 | — |
| キャッチコピー | Noto Sans JP | 18px | 15px | 1.9 | — |
| 本文 | Noto Sans JP | 16px | 14px | 2.1 | — |
| 作品の概要文 | Noto Sans JP | 15px | 14px | 1.9 | — |
| ナビ・肩書き・セクション番号 | JetBrains Mono | 12px | 11px | — | 0.12〜0.24em、大文字 |
| 小ラベル（TYPE / STACK など）・タグ | JetBrains Mono | 11px | 10〜11px | — | 0.16em |

## レイアウト・余白

| 項目 | Desktop | Mobile |
|---|---|---|
| 左右の余白 | 64px | 20px |
| セクションの上下余白 | 160px（Works の下のみ 200px） | 96px |
| セクション見出しと中身の間 | 72px | 40px |
| ヘッダーの余白 | 28px 64px | 12px 20px |
| 背景の縦グリッド線 | 6 分割 | 4 分割 |
| 作品詳細の最大幅 | 1312px（中央寄せ） | — |

- About は 6 カラムのグリッドで、見出しが 2 カラム、本文が 4 カラム
- Skills は 3 カラム × 2 行（Languages / Frontend / Backend・Infra、Quality / AI / Tools）。各カラムを細い罫線で区切る（Mobile は縦積みで、項目を「·」区切りの 1 行にする）
- Works 一覧は 12 カラムで、番号 1 / 本文 5 / スクリーンショット 5（8 カラム目から）。行の上下余白は 48px、カラム間は 24px
- 作品詳細の本文は 12 カラムで、Stack（3 カラム、追従）と本文（5 カラム目から 8 カラム）
- セクション番号 01 / 02 / 03 を見出しの上（Mobile は左）にアクセント色で置く
- タグは角丸 999px の細い枠（`6px 10px`）
- タップ領域は 44px 以上を確保する

## 文言

キャッチコピー・About などの文言は `src/lib/site.ts` にまとめている（SHU-33 で確定）。
