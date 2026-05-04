import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content');

export interface RekuMeta {
  slug: string;
  title: string;
  thumbnail: string;
  photo: string;
  time: string;
  target: string;
  category: string;
  difficulty: string;
}

export interface RekuDetail extends RekuMeta {
  contentHtml: string;
}

const REQUIRED_FIELDS = ['title', 'slug', 'thumbnail', 'photo', 'time', 'target', 'category', 'difficulty'] as const;

function validateFrontmatter(slug: string, data: Record<string, unknown>): void {
  const missing = REQUIRED_FIELDS.filter((f) => !data[f]);
  if (missing.length > 0) {
    throw new Error(`[reku] ${slug}.md: 必須フィールドが不足しています: ${missing.join(', ')}`);
  }
}

export function getAllReku(): RekuMeta[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith('.md'));
  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(contentDir, filename), 'utf-8');
    const { data } = matter(raw);
    validateFrontmatter(slug, data as Record<string, unknown>);
    return {
      slug,
      title: data.title as string,
      thumbnail: data.thumbnail as string,
      photo: data.photo as string,
      time: data.time as string,
      target: data.target as string,
      category: data.category as string,
      difficulty: data.difficulty as string,
    };
  });
}

export async function getRekuBySlug(slug: string): Promise<RekuDetail> {
  const filePath = path.join(contentDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  validateFrontmatter(slug, data as Record<string, unknown>);

  const processed = await remark().use(remarkGfm).use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title as string,
    thumbnail: data.thumbnail as string,
    photo: data.photo as string,
    time: data.time as string,
    target: data.target as string,
    category: data.category as string,
    difficulty: data.difficulty as string,
    contentHtml,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}
