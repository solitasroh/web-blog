import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import { WebsiteJsonLd } from "./components/JsonLd";
import { siteConfig } from "@/lib/siteConfig";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.author.twitter,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <WebsiteJsonLd />
      </head>
      <body
        className={`${pretendard.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* Skip to content - 접근성 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
        >
          본문으로 건너뛰기
        </a>

        <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm border-b border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link
                href="/"
                className="text-xl font-bold text-foreground hover:text-accent transition-colors"
              >
                Solitas
              </Link>

              {/* Navigation */}
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
                © {new Date().getFullYear()} Solitas. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com/solitas"
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

        {/* Analytics & Performance Monitoring */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
