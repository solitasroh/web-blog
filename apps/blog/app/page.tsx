import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import PostList from "./components/PostList";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <header className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold mb-6 shadow-lg shadow-blue-500/25">
          S
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Solitas's Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Next.js, TypeScript, 임베디드 시스템에 대한 개발 경험과 인사이트를
          공유합니다.
        </p>
      </header>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-16">
          <Link href={`/posts/${featuredPost.slug}`} className="block group">
            <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 p-8 sm:p-12 text-white shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  최신 글
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:underline decoration-2 underline-offset-4">
                  {featuredPost.title}
                </h2>

                {featuredPost.excerpt && (
                  <p className="text-white/80 text-lg mb-6 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-white/70">
                  <time dateTime={featuredPost.date}>
                    {new Date(featuredPost.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{featuredPost.readingTime}분 읽기</span>
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* Main Content */}
      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        {/* Recent Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              최근 글
            </h2>
            <Link
              href="/archive"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              전체 보기
            </Link>
          </div>
          <PostList posts={recentPosts} />
        </section>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-8">
          {/* Tags */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            {tags.length > 10 && (
              <Link
                href="/tags"
                className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                모든 태그 보기
              </Link>
            )}
          </div>

          {/* Newsletter */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              뉴스레터
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              새로운 글이 발행되면 알림을 받아보세요.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              구독하기
            </Link>
          </div>

          {/* About */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                S
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Solitas
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Software Engineer
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              풀스택 개발과 임베디드 시스템에 관심이 많은 개발자입니다.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
