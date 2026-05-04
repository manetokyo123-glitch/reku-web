# レク解説サイト

古民家イベント向けに作成した8つのレクリエーション企画を、スタッフが参照できるWebサイト。

**本番URL:** https://reku-web.vercel.app

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16（App Router） |
| スタイリング | Tailwind CSS + @tailwindcss/typography |
| MD処理 | gray-matter + remark-gfm + remark-html |
| デプロイ | Vercel（`main` push で自動デプロイ） |
| 言語 | TypeScript |

---

## プロジェクト構造

```
reku-web/
├── app/
│   ├── layout.tsx              # 共通レイアウト
│   ├── page.tsx                # 一覧ページ（カテゴリ・難易度フィルター）
│   ├── components/
│   │   └── RekuList.tsx        # フィルター付きカードリスト（クライアントコンポーネント）
│   └── reku/[slug]/
│       └── page.tsx            # 詳細ページ（静的生成）
├── content/                    # レクごとのMarkdownファイル（frontmatter付き）
├── public/images/              # イラスト・実施写真
├── lib/
│   └── reku.ts                 # MD読み込み・一覧取得ロジック
└── scripts/
    └── migrate-content.ts      # 元MDにfrontmatterを付与してcontent/へ移行するスクリプト
```

---

## コンテンツ一覧

| slug | タイトル | カテゴリ |
|------|---------|---------|
| anpan | あんぱん | リーダー対みんな |
| nantyoume | 何丁目？ | バスレク |
| jl-quiz | JL自己紹介クイズ | バスレク |
| hadashi-no-risu | はだしのリス | バスレク |
| antagata-dokosa | あんたがたどこさ（個人） | リーダー対みんな |
| kikoeruhi-wa | 〇〇が聞こえる人は | バスレク |
| chouchin | ちょうちん | リーダー対みんな |
| atodashi-janken | あとだしじゃんけん | リーダー対みんな |

---

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3000 で確認できます。

---

## コンテンツの追加・更新

### Markdownファイルの形式

`content/` 以下に以下の frontmatter を持つ `.md` ファイルを追加します。全フィールド必須です（欠けているとビルドエラーになります）。

```yaml
---
title: "タイトル"
slug: "slug-name"
thumbnail: "/images/slug-name-illust.png"
photo: "/images/slug-name-photo.jpg"
time: "10分くらい"
target: "小学生〜"
category: "バスレク"        # バスレク / リーダー対みんな / グループ
difficulty: "やさしい"      # やさしい / ふつう / むずかしい
---
```

### 元ファイルからの一括移行

```bash
npx ts-node --project tsconfig.json scripts/migrate-content.ts
```

元フォルダ（`古民家/*/`）のMDに frontmatter を付与して `content/` へ出力し、画像を `public/images/` へコピーします。画像が見つからない場合はスクリプトが中断されます。

---

## デプロイ

`main` ブランチへ push すると Vercel が自動でビルド・デプロイします。

```bash
git push origin main
```
