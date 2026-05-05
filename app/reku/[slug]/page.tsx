import { getAllSlugs, getRekuBySlug } from '@/lib/reku';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Users, FolderOpen } from 'lucide-react';

function toNotFoundIfMissing(err: unknown): null {
  if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') return null;
  throw err;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reku = await getRekuBySlug(slug).catch(toNotFoundIfMissing);
  if (!reku) return {};
  return { title: `${reku.title} | レク解説サイト` };
}

export default async function RekuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reku = await getRekuBySlug(slug).catch(toNotFoundIfMissing);
  if (!reku) notFound();

  return (
    <article>
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-green-700 hover:underline mb-6"
      >
        ← 一覧に戻る
      </Link>

      {/* タイトルと基本情報 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{reku.title}</h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Clock size={14} />{reku.time}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Users size={14} />{reku.target}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <FolderOpen size={14} />{reku.category}
          </span>
        </div>
      </div>

      {/* イラスト */}
      {reku.thumbnail && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md mb-8">
          <Image
            src={reku.thumbnail}
            alt={`${reku.title} のイラスト`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Markdown本文 */}
      <div
        className="prose prose-green max-w-none"
        dangerouslySetInnerHTML={{ __html: reku.contentHtml }}
      />

      {/* 戻るリンク（下） */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-green-700 hover:underline"
        >
          ← 一覧に戻る
        </Link>
      </div>
    </article>
  );
}
