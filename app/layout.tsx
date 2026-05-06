import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "상상우리 — 시니어 일자리 매칭",
  description: "시니어와 일자리를 자동으로 연결해 드립니다",
};

const navItems = [
  { href: "/register", label: "프로필 등록" },
  { href: "/recommendations", label: "맞춤 추천" },
  { href: "/admin", label: "담당자 대시보드" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${geistSans.variable}`}>
      <body className="min-h-screen bg-white text-gray-900 text-lg antialiased flex flex-col">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-700 shrink-0"
            >
              상상우리
            </Link>
            <div className="flex gap-2 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-5 py-2 rounded-lg text-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-gray-200 text-center py-4 text-base text-gray-500">
          © 2026 상상우리. 시니어 일자리 매칭 서비스.
        </footer>
      </body>
    </html>
  );
}
