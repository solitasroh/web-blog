import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMetadata = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  readingTime: number; // 분 단위
  wordCount: number; // 글자 수
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
 * 콘텐츠 정리 (MDX 문법 제거)
 */
function cleanMdxContent(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
    .replace(/`[^`]*`/g, "") // 인라인 코드 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크 텍스트만 남기기
    .replace(/[#*_~>/\-|]/g, "") // 마크다운 기호 제거
    .replace(/\s+/g, ""); // 공백 제거
}

/**
 * 읽기 시간 계산 (한국어 기준 분당 500자)
 */
function calculateReadingTime(content: string): number {
  const cleanContent = cleanMdxContent(content);
  const wordsPerMinute = 500; // 한국어 기준
  const minutes = Math.ceil(cleanContent.length / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * 글자 수 계산
 */
function calculateWordCount(content: string): number {
  const cleanContent = cleanMdxContent(content);
  return cleanContent.length;
}

/**
 * 본문에서 excerpt 추출 (첫 150자)
 */
function extractExcerpt(content: string, maxLength: number = 150): string {
  // Frontmatter 이후의 본문만 추출
  const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, "");

  // MDX 문법 제거하고 텍스트만 추출
  const cleanContent = contentWithoutFrontmatter
    .replace(/```[\s\S]*?```/g, "") // 코드 블록 제거
    .replace(/`[^`]*`/g, "") // 인라인 코드 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 링크 텍스트만 남기기
    .replace(/[#*_~>/\-|]/g, "") // 마크다운 기호 제거
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/\n+/g, " ") // 줄바꿈을 공백으로
    .replace(/\s+/g, " ") // 연속 공백 제거
    .trim();

  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // 단어 단위로 자르기
  const truncated = cleanContent.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

/**
 * slug(파일 이름) 기준으로 메타데이터만 읽기
 */
export function getPostMetadata(slug: string): PostMetadata | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Frontmatter에 excerpt가 있으면 사용, 없으면 본문에서 추출
  const excerpt = data.excerpt || extractExcerpt(content);
  const readingTime = calculateReadingTime(content);
  const wordCount = calculateWordCount(content);

  return {
    slug: realSlug,
    title: data.title ?? realSlug,
    date: data.date ?? "",
    tags: (data.tags ?? []) as string[],
    excerpt,
    readingTime,
    wordCount,
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

/**
 * 관련 포스트 가져오기 (태그 기반)
 */
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
): PostMetadata[] {
  const currentPost = getPostMetadata(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts();

  // 현재 포스트 제외하고, 태그 유사도로 정렬
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) =>
        currentPost.tags.includes(tag)
      );
      return { post, score: sharedTags.length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);

  return relatedPosts;
}

/**
 * 이전/다음 포스트 가져오기 (날짜 기준)
 */
export function getAdjacentPosts(currentSlug: string): {
  prev: PostMetadata | null;
  next: PostMetadata | null;
} {
  const allPosts = getAllPosts(); // 날짜 내림차순 정렬됨
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    next: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
  };
}

/**
 * 연도별 포스트 그룹핑 (아카이브용)
 */
export function getPostsByYear(): Map<number, PostMetadata[]> {
  const posts = getAllPosts();
  const grouped = new Map<number, PostMetadata[]>();

  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)!.push(post);
  });

  return grouped;
}
