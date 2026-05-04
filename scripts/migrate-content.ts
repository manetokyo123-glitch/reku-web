// 元ファイルを変更せず、frontmatterを付与してcontent/へ出力し画像をpublic/images/へコピーする
// 実行: npx ts-node --project tsconfig.json scripts/migrate-content.ts

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_BASE = path.resolve(__dirname, '../../レク作成/古民家');
const CONTENT_DIR = path.resolve(__dirname, '../content');
const IMAGES_DIR = path.resolve(__dirname, '../public/images');

interface RekuEntry {
  slug: string;
  title: string;
  time: string;
  target: string;
  category: string;
  difficulty: string;
  mdPath: string;
  illustGlob: string;
  photoGlob: string;
}

const REKU_MAP: RekuEntry[] = [
  {
    slug: 'anpan',
    title: 'あんぱん',
    time: '10分くらい',
    target: '小学1〜6年生',
    category: 'リーダー対みんな',
    difficulty: 'やさしい',
    mdPath: 'あんぱん/how_to_anpan.md',
    illustGlob: 'あんぱん/Gemini_Generated_Image_*.png',
    photoGlob: 'あんぱん/IMG_*.jpg',
  },
  {
    slug: 'nantyoume',
    title: '何丁目？',
    time: '3〜5分くらい',
    target: 'だれでも',
    category: 'バスレク',
    difficulty: 'やさしい',
    mdPath: '何丁目？/howto_nantyoume.md',
    illustGlob: '何丁目？/Gemini_Generated_Image_*.png',
    photoGlob: '何丁目？/IMG_*.jpg',
  },
  {
    slug: 'jl-quiz',
    title: 'JL自己紹介クイズ',
    time: '3〜10分',
    target: 'だれでも',
    category: 'バスレク',
    difficulty: 'ふつう',
    mdPath: 'JL自己紹介クイズ/howto_JL.md',
    illustGlob: 'JL自己紹介クイズ/Gemini_Generated_Image_*.png',
    photoGlob: 'JL自己紹介クイズ/*.jpg',
  },
  {
    slug: 'hadashi-no-risu',
    title: 'はだしのリス',
    time: '3〜5分',
    target: 'だれでも',
    category: 'バスレク',
    difficulty: 'やさしい',
    mdPath: 'はだしのリス/howto_Squirrel_barefoot.md',
    illustGlob: 'はだしのリス/Gemini_Generated_Image_*.png',
    photoGlob: 'はだしのリス/IMG_*.jpg',
  },
  {
    slug: 'antagata-dokosa',
    title: 'あんたがたどこさ（個人）',
    time: '5分くらい',
    target: '小学生くらい',
    category: 'リーダー対みんな',
    difficulty: 'ふつう',
    mdPath: 'あんたがたどこさ（個人）/howto_whereareyou.md',
    illustGlob: 'あんたがたどこさ（個人）/Gemini_Generated_Image_*.png',
    photoGlob: 'あんたがたどこさ（個人）/IMG_*.jpg',
  },
  {
    slug: 'kikoeruhi-wa',
    title: '〇〇が聞こえる人は',
    time: '3〜5分くらい',
    target: 'だれでも',
    category: 'バスレク',
    difficulty: 'やさしい',
    mdPath: '⚪︎⚪︎が聞こえる人は/howto_canhear.md',
    illustGlob: '⚪︎⚪︎が聞こえる人は/Gemini_Generated_Image_*.png',
    photoGlob: '⚪︎⚪︎が聞こえる人は/IMG_*.jpg',
  },
  {
    slug: 'chouchin',
    title: 'ちょうちん',
    time: '5分くらい',
    target: '小学生〜',
    category: 'リーダー対みんな',
    difficulty: 'ふつう',
    mdPath: 'ちょうちん/howto_tyotin.md',
    illustGlob: 'ちょうちん/Gemini_Generated_Image_*.png',
    photoGlob: 'ちょうちん/IMG_*.jpg',
  },
  {
    slug: 'atodashi-janken',
    title: 'あとだしじゃんけん',
    time: '3〜5分くらい',
    target: '小学生〜',
    category: 'リーダー対みんな',
    difficulty: 'やさしい',
    mdPath: 'あとだしじゃんけん/howto_behindzyanken.md',
    illustGlob: 'あとだしじゃんけん/Gemini_Generated_Image_*.png',
    photoGlob: 'あとだしじゃんけん/IMG_*.jpg',
  },
];

function buildFrontmatter(entry: RekuEntry, illustDest: string, photoDest: string): string {
  return `---
title: "${entry.title}"
slug: "${entry.slug}"
thumbnail: "/images/${path.basename(illustDest)}"
photo: "/images/${path.basename(photoDest)}"
time: "${entry.time}"
target: "${entry.target}"
category: "${entry.category}"
difficulty: "${entry.difficulty}"
---

`;
}

async function main() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const entry of REKU_MAP) {
    const mdSrc = path.join(SRC_BASE, entry.mdPath);
    const illustMatches = await glob(path.join(SRC_BASE, entry.illustGlob));
    const photoMatches = await glob(path.join(SRC_BASE, entry.photoGlob));

    if (!fs.existsSync(mdSrc)) {
      console.warn(`[WARN] MD not found: ${mdSrc}`);
      continue;
    }

    const illustSrc = illustMatches[0];
    const photoSrc = photoMatches[0];

    if (!illustSrc) {
      throw new Error(`[ERROR] イラスト画像が見つかりません: ${entry.slug} (${entry.illustGlob})`);
    }
    if (!photoSrc) {
      throw new Error(`[ERROR] 実写真が見つかりません: ${entry.slug} (${entry.photoGlob})`);
    }

    const illustDest = path.join(IMAGES_DIR, `${entry.slug}-illust${path.extname(illustSrc)}`);
    const photoDest = path.join(IMAGES_DIR, `${entry.slug}-photo${path.extname(photoSrc)}`);

    // 画像コピー
    fs.copyFileSync(illustSrc, illustDest);
    console.log(`[OK] illust: ${path.basename(illustSrc)} → ${path.basename(illustDest)}`);
    fs.copyFileSync(photoSrc, photoDest);
    console.log(`[OK] photo:  ${path.basename(photoSrc)} → ${path.basename(photoDest)}`);

    // MDにfrontmatterを付与して出力
    const originalMd = fs.readFileSync(mdSrc, 'utf-8');
    // H1タイトル行（# xxx）をスキップして本文だけ取得
    const bodyWithoutH1 = originalMd.replace(/^#[^\n]*\n/, '');
    const frontmatter = buildFrontmatter(entry, illustDest, photoDest);
    const destMd = path.join(CONTENT_DIR, `${entry.slug}.md`);
    fs.writeFileSync(destMd, frontmatter + bodyWithoutH1, 'utf-8');
    console.log(`[OK] md:     ${entry.slug}.md`);
  }

  console.log('\n移行完了');
}

main().catch((e) => { console.error(e); process.exit(1); });
