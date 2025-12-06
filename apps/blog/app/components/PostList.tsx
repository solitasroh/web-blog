"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  readingTime: number;
}

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400">게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <ScrollReveal key={post.slug}>
            <article className="group relative">
              <Link href={`/posts/${post.slug}`} className="block">
                <div className="p-6 rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date}>{formattedDate}</time>
                    <span className="text-gray-300 dark:text-gray-600">·</span>
                    <span>{post.readingTime}분 읽기</span>
                  </div>
                </div>
              </Link>
            </article>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
