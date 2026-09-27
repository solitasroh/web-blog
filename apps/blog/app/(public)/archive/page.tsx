import { getPostsByYear } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "아카이브",
  description: "연도별로 정리된 모든 블로그 글 목록입니다.",
};

export default function ArchivePage() {
  const postsByYear = getPostsByYear();
  const years = Array.from(postsByYear.keys()).sort((a, b) => b - a);
  const totalPosts = Array.from(postsByYear.values()).reduce(
    (sum, posts) => sum + posts.length,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          아카이브
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          총 {totalPosts}개의 글
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

        {years.map((year) => {
          const posts = postsByYear.get(year) || [];

          return (
            <section key={year} className="relative mb-12 last:mb-0">
              {/* Year marker */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold text-sm sm:text-xl shadow-lg">
                  {year.toString().slice(-2)}
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {year}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {posts.length}개의 글
                  </p>
                </div>
              </div>

              {/* Posts */}
              <div className="ml-12 sm:ml-24 space-y-4">
                {posts.map((post) => {
                  const date = new Date(post.date);
                  const month = date.toLocaleDateString("ko-KR", {
                    month: "short",
                  });
                  const day = date.getDate();

                  return (
                    <article
                      key={post.slug}
                      className="group relative pl-8 before:absolute before:-left-5 sm:before:-left-10 before:top-3 before:w-2 before:h-2 before:rounded-full before:bg-gray-300 dark:before:bg-gray-700 before:group-hover:bg-blue-500 before:transition-colors"
                    >
                      <Link
                        href={`/posts/${post.slug}`}
                        className="block p-4 -ml-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="hidden sm:flex flex-col items-center min-w-[50px] text-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                              {month}
                            </span>
                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {day}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 sm:hidden">
                              <span>{post.date}</span>
                              <span>·</span>
                              <span>{post.readingTime}분</span>
                            </div>
                          </div>
                          <div className="hidden sm:block text-right">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {post.readingTime}분 읽기
                            </span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Back to home */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
