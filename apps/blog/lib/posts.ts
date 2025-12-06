import fs from "fs";
import path from "path";
import matter from "gray-matter"; // This line is correct, no change needed.

export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".mdx"));
}

/**
 * slug(파일 이름) 기준으로 메타데이터만 읽기
 */
export function getPostMetadata(slug: string): PostMetadata | null {
  const realSlug = slug.replace(/\.mdx$/, ""); // <-- 여기서 slug는 string이어야 함
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title ?? realSlug,
    date: data.date ?? "",
    tags: (data.tags ?? []) as string[],
  };
}

export function getAllPosts(): PostMetadata[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostMetadata(slug))
    .filter((post): post is PostMetadata => post !== null)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const allTags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => allTags.add(tag));
  });
  return Array.from(allTags);
}

export function getPostsByTag(tag: string): PostMetadata[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
