"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p>게시물이 없습니다.</p>;
  }

  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <ScrollReveal key={post.slug}>
          <li className="card-hover p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Link
              href={`/posts/${post.slug}`}
              className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {post.title}
            </Link>
            <div className="text-gray-500 dark:text-gray-400">{post.date}</div>
            {post.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-hover px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        </ScrollReveal>
      ))}
    </ul>
  );
}
