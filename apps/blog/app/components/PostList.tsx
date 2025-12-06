"use client";

import Link from "next/link";

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
        <p className="text-muted">게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <article key={post.slug} className="group">
          <Link
            href={`/posts/${post.slug}`}
            className="flex items-baseline justify-between py-3 border-b border-border hover:border-accent transition-colors"
          >
            <div className="flex-1 min-w-0 mr-4">
              <h3 className="text-foreground group-hover:text-accent transition-colors font-medium truncate">
                {post.title}
              </h3>
              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <time
              dateTime={post.date}
              className="text-sm text-muted shrink-0"
            >
              {new Date(post.date).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
              })}
            </time>
          </Link>
        </article>
      ))}
    </div>
  );
}
