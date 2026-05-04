'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { RekuMeta } from '@/lib/reku';

const DIFFICULTY_COLOR: Record<string, string> = {
  やさしい: 'bg-green-100 text-green-800',
  ふつう: 'bg-yellow-100 text-yellow-800',
  むずかしい: 'bg-red-100 text-red-800',
};

export default function RekuList({ reku }: { reku: RekuMeta[] }) {
  const [category, setCategory] = useState('すべて');
  const [difficulty, setDifficulty] = useState('すべて');

  const categories = ['すべて', ...Array.from(new Set(reku.map((r) => r.category)))];
  const difficulties = ['すべて', ...Array.from(new Set(reku.map((r) => r.difficulty)))];

  const filtered = reku.filter(
    (r) =>
      (category === 'すべて' || r.category === category) &&
      (difficulty === 'すべて' || r.difficulty === difficulty)
  );

  return (
    <>
      {/* フィルター */}
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium w-16">分類</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                category === c
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 font-medium w-16">難易度</span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                difficulty === d
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">{filtered.length}件</p>

      {/* カードグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((r) => (
          <Link
            key={r.slug}
            href={`/reku/${r.slug}`}
            className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden group"
          >
            <div className="relative aspect-square bg-gray-100">
              {r.thumbnail ? (
                <Image
                  src={r.thumbnail}
                  alt={r.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 text-4xl">🎮</div>
              )}
            </div>
            <div className="p-3">
              <h2 className="font-bold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">
                {r.title}
              </h2>
              <p className="text-xs text-gray-500 mb-2">
                {r.time}　{r.target}
              </p>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                  DIFFICULTY_COLOR[r.difficulty] ?? 'bg-gray-100 text-gray-600'
                }`}
              >
                {r.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 py-12">該当するレクがありません</p>
      )}
    </>
  );
}
