export const siteConfig = {
  name: "Dev.Sol's Blog",
  description: "개발 관련 글들을 공유하는 블로그입니다.",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://blog.solitas.link",
  author: {
    name: "Dev.Sol",
    email: "solitasroh@gmail.com",
    twitter: "@devsoli",
  },
  locale: "ko_KR",
  language: "ko",
  themeColor: "#3b82f6",
} as const;

export type SiteConfig = typeof siteConfig;
