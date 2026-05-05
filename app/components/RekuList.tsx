'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';
import type { RekuMeta } from '@/lib/reku';

export default function RekuList({ reku }: { reku: RekuMeta[] }) {
  const [category, setCategory] = useState('すべて');

  const categories = ['すべて', ...Array.from(new Set(reku.map((r) => r.category)))];

  const filtered = reku.filter(
    (r) => category === 'すべて' || r.category === category
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
                <div className="flex items-center justify-center h-full">
                  <Gamepad2 size={32} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-3">
              <h2 className="font-bold text-gray-800 text-sm leading-snug mb-1 line-clamp-2">
                {r.title}
              </h2>
              <p className="text-xs text-gray-500">
                {r.time}　{r.target}
              </p>
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
