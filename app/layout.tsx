import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "レク本",
  description: "スタッフがレク中に手軽に確認できるレク本アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-amber-50">
        <header className="bg-green-700 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
            <Leaf size={24} />
            <a href="/" className="text-xl font-bold tracking-wide hover:opacity-80">
              レク本
            </a>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-sm text-gray-400 py-6">
          スタッフ向けレク本
        </footer>
      </body>
    </html>
  );
}
