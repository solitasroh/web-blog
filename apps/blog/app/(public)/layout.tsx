import Link from "next/link";
import ThemeToggle from "../components/ThemeToggle";
import { WebsiteJsonLd } from "../components/JsonLd";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <WebsiteJsonLd />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold text-foreground hover:text-accent transition-colors"
            >
              Dev.Sol
            </Link>

            <nav className="flex items-center gap-8">
              <Link
                href="/tags"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                태그
              </Link>
              <Link
                href="/archive"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                아카이브
              </Link>
              <Link
                href="/search"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                검색
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} Dev.Sol. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/solitasroh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-accent transition-colors"
              >
                GitHub
              </a>
              <a
                href="/feed.xml"
                className="text-sm text-muted hover:text-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                RSS
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
