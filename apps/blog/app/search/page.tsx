import { getAllPosts, getAllTags } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "검색",
  description: "블로그에서 원하는 글을 검색하세요.",
};

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const posts = getAllPosts();
  const tags = getAllTags();

  // 검색어가 있을 경우 제목, 태그, excerpt에서 검색
  const filtered = q
    ? posts.filter((post) => {
        const query = q.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query))
        );
      })
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          검색
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          제목, 태그, 내용으로 검색할 수 있습니다
        </p>
      </header>

      {/* Search Form */}
      <form className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="검색어를 입력하세요..."
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md"
            autoFocus
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {/* Results or Suggestions */}
      {q ? (
        // Search Results
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              &quot;{q}&quot; 검색 결과
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length}개의 글
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((post) => {
                const formattedDate = new Date(post.date).toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                );

                return (
                  <article
                    key={post.slug}
                    className="group p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300"
                  >
                    <Link href={`/posts/${post.slug}`} className="block">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                              q &&
                              tag.toLowerCase().includes(q.toLowerCase())
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <time dateTime={post.date}>{formattedDate}</time>
                        <span className="text-gray-300 dark:text-gray-600">
                          ·
                        </span>
                        <span>{post.readingTime}분 읽기</span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                검색 결과가 없습니다
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                다른 키워드로 검색해보세요
              </p>
            </div>
          )}
        </div>
      ) : (
        // Popular Tags
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            인기 태그로 검색하기
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Recent Posts */}
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              최근 글
            </h2>
            <div className="grid gap-4 max-w-2xl mx-auto">
              {posts.slice(0, 5).map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {post.date}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
