import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "レク解説サイト",
  description: "古民家イベント向けレクリエーション企画の解説一覧",
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
            <span className="text-2xl">🌿</span>
            <a href="/" className="text-xl font-bold tracking-wide hover:opacity-80">
              レク解説サイト
            </a>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-sm text-gray-400 py-6">
          古民家イベント スタッフ向け資料
        </footer>
      </body>
    </html>
  );
}
