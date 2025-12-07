import { getAllPosts } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://solitas.blog";
const BLOG_TITLE = "Dev.Sol's Blog";
const BLOG_DESCRIPTION = "개발 관련 글들을 공유하는 블로그입니다.";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();

  const rssItems = posts
    .map((post) => {
      const postUrl = `${BASE_URL}/posts/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      const description = post.excerpt || `${post.title} - ${post.tags.join(", ")}`;

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
      ${post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("\n      ")}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_TITLE)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
