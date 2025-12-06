import { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://solitas.blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  // 포스트 URL
  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 태그 URL
  const tagUrls = tags.map((tag) => ({
    url: `${BASE_URL}/tags/${tag}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // 정적 페이지
  const staticUrls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  return [...staticUrls, ...postUrls, ...tagUrls];
}
