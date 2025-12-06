/**
 * lib/posts.ts 유틸리티 함수 테스트
 */
import fs from "fs";
import path from "path";
import {
  getPostSlugs,
  getPostMetadata,
  getAllPosts,
  getAllTags,
  getPostsByTag,
  getRelatedPosts,
  getAdjacentPosts,
  getPostsByYear,
} from "@/lib/posts";

// Mock the fs module
jest.mock("fs");
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock test data
const mockPostContent = {
  "hello-world.mdx": `---
title: "Hello World"
date: "2025-12-01"
tags: ["nextjs", "react"]
---

# Hello World

This is a test post about Next.js and React.
`,
  "second-post.mdx": `---
title: "Second Post"
date: "2025-12-03"
tags: ["typescript", "react"]
---

# Second Post

TypeScript is great with React.
`,
  "third-post.mdx": `---
title: "Third Post"
date: "2025-12-05"
tags: ["nextjs", "typescript"]
excerpt: "Custom excerpt for third post"
---

# Third Post

Next.js with TypeScript is awesome.
`,
};

describe("lib/posts", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock existsSync to return true for posts directory
    mockFs.existsSync.mockImplementation((filePath: fs.PathLike) => {
      const pathStr = filePath.toString();
      if (pathStr.includes("content/posts")) {
        // Check if specific file exists
        const filename = path.basename(pathStr);
        if (filename.endsWith(".mdx")) {
          return filename in mockPostContent;
        }
        return true; // Directory exists
      }
      return false;
    });

    // Mock readdirSync to return mock files
    mockFs.readdirSync.mockReturnValue(
      Object.keys(mockPostContent) as unknown as fs.Dirent[]
    );

    // Mock readFileSync to return mock content
    mockFs.readFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor) => {
      const pathStr = filePath.toString();
      const filename = path.basename(pathStr);
      if (filename in mockPostContent) {
        return mockPostContent[filename as keyof typeof mockPostContent];
      }
      throw new Error(`File not found: ${pathStr}`);
    });
  });

  describe("getPostSlugs", () => {
    it("should return array of .mdx filenames", () => {
      const slugs = getPostSlugs();
      expect(slugs).toHaveLength(3);
      expect(slugs).toContain("hello-world.mdx");
      expect(slugs).toContain("second-post.mdx");
      expect(slugs).toContain("third-post.mdx");
    });

    it("should return empty array if directory does not exist", () => {
      mockFs.existsSync.mockReturnValue(false);
      const slugs = getPostSlugs();
      expect(slugs).toEqual([]);
    });
  });

  describe("getPostMetadata", () => {
    it("should parse frontmatter correctly", () => {
      const meta = getPostMetadata("hello-world");
      expect(meta).not.toBeNull();
      expect(meta?.title).toBe("Hello World");
      expect(meta?.date).toBe("2025-12-01");
      expect(meta?.tags).toEqual(["nextjs", "react"]);
      expect(meta?.slug).toBe("hello-world");
    });

    it("should calculate reading time", () => {
      const meta = getPostMetadata("hello-world");
      expect(meta?.readingTime).toBeGreaterThanOrEqual(1);
    });

    it("should auto-generate excerpt when not provided", () => {
      const meta = getPostMetadata("hello-world");
      expect(meta?.excerpt).toBeDefined();
      expect(meta?.excerpt?.length).toBeGreaterThan(0);
    });

    it("should use custom excerpt from frontmatter", () => {
      const meta = getPostMetadata("third-post");
      expect(meta?.excerpt).toBe("Custom excerpt for third post");
    });

    it("should handle .mdx extension in slug", () => {
      const meta = getPostMetadata("hello-world.mdx");
      expect(meta?.slug).toBe("hello-world");
    });

    it("should return null for non-existent post", () => {
      mockFs.existsSync.mockImplementation((filePath: fs.PathLike) => {
        const pathStr = filePath.toString();
        return !pathStr.includes("non-existent");
      });
      const meta = getPostMetadata("non-existent");
      expect(meta).toBeNull();
    });
  });

  describe("getAllPosts", () => {
    it("should return all posts sorted by date (newest first)", () => {
      const posts = getAllPosts();
      expect(posts).toHaveLength(3);
      expect(posts[0].slug).toBe("third-post"); // 2025-12-05
      expect(posts[1].slug).toBe("second-post"); // 2025-12-03
      expect(posts[2].slug).toBe("hello-world"); // 2025-12-01
    });
  });

  describe("getAllTags", () => {
    it("should return unique tags from all posts", () => {
      const tags = getAllTags();
      expect(tags).toContain("nextjs");
      expect(tags).toContain("react");
      expect(tags).toContain("typescript");
      // No duplicates
      expect(new Set(tags).size).toBe(tags.length);
    });
  });

  describe("getPostsByTag", () => {
    it("should return posts with matching tag", () => {
      const reactPosts = getPostsByTag("react");
      expect(reactPosts).toHaveLength(2);
      expect(reactPosts.map((p) => p.slug)).toContain("hello-world");
      expect(reactPosts.map((p) => p.slug)).toContain("second-post");
    });

    it("should return empty array for non-existent tag", () => {
      const posts = getPostsByTag("nonexistent");
      expect(posts).toEqual([]);
    });
  });

  describe("getRelatedPosts", () => {
    it("should return posts with shared tags", () => {
      const related = getRelatedPosts("hello-world", 3);
      // hello-world has [nextjs, react]
      // second-post has [typescript, react] - 1 shared tag
      // third-post has [nextjs, typescript] - 1 shared tag
      expect(related.length).toBeGreaterThan(0);
      expect(related.every((p) => p.slug !== "hello-world")).toBe(true);
    });

    it("should not include current post", () => {
      const related = getRelatedPosts("hello-world", 10);
      expect(related.find((p) => p.slug === "hello-world")).toBeUndefined();
    });

    it("should respect limit parameter", () => {
      const related = getRelatedPosts("hello-world", 1);
      expect(related.length).toBeLessThanOrEqual(1);
    });

    it("should return empty array for non-existent post", () => {
      mockFs.existsSync.mockImplementation((filePath: fs.PathLike) => {
        const pathStr = filePath.toString();
        if (pathStr.includes("non-existent")) return false;
        return true;
      });
      const related = getRelatedPosts("non-existent", 3);
      expect(related).toEqual([]);
    });
  });

  describe("getAdjacentPosts", () => {
    it("should return prev and next posts", () => {
      // Posts sorted by date: third (12-05), second (12-03), hello (12-01)
      const { prev, next } = getAdjacentPosts("second-post");
      expect(next?.slug).toBe("third-post"); // newer
      expect(prev?.slug).toBe("hello-world"); // older
    });

    it("should return null for prev if at oldest post", () => {
      const { prev, next } = getAdjacentPosts("hello-world");
      expect(prev).toBeNull();
      expect(next?.slug).toBe("second-post");
    });

    it("should return null for next if at newest post", () => {
      const { prev, next } = getAdjacentPosts("third-post");
      expect(prev?.slug).toBe("second-post");
      expect(next).toBeNull();
    });

    it("should return nulls for non-existent post", () => {
      const { prev, next } = getAdjacentPosts("non-existent");
      expect(prev).toBeNull();
      expect(next).toBeNull();
    });
  });

  describe("getPostsByYear", () => {
    it("should group posts by year", () => {
      const byYear = getPostsByYear();
      expect(byYear.has(2025)).toBe(true);
      expect(byYear.get(2025)?.length).toBe(3);
    });

    it("should return a Map", () => {
      const byYear = getPostsByYear();
      expect(byYear).toBeInstanceOf(Map);
    });
  });
});
