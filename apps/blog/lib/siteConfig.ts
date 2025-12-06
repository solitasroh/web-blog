export const siteConfig = {
  name: "Solitas's Blog",
  description: "개발 관련 글들을 공유하는 블로그입니다.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://solitas.blog",
  author: {
    name: "Solitas",
    email: "solitas@example.com",
    twitter: "@solitas",
  },
  locale: "ko_KR",
  language: "ko",
  themeColor: "#3b82f6",
} as const;

export type SiteConfig = typeof siteConfig;
