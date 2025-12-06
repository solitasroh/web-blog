import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const metadata: Metadata = {
  title: {
    default: "Solitas's Blog",
    template: "%s | Solitas's Blog",
  },
  description: "개발 관련 글들을 공유하는 블로그입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pretendard.variable} antialiased`}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Solitas's Blog
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href="/tags"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                태그
              </Link>
              <Link
                href="/search"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                검색
              </Link>
              <ThemeToggle /> {/* ← 여기 */}
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
