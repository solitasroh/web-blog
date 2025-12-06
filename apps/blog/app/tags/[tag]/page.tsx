import { getAllTags, getPostsByTag } from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import { BreadcrumbJsonLd } from "@/app/components/JsonLd";
import Link from "next/link";
import type { Metadata } from "next";

type Params = Promise<{ tag: string }>;

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const tag = (await params).tag;
  const posts = getPostsByTag(tag);

  return {
    title: `${tag} 태그`,
    description: `${tag} 태그가 붙은 ${posts.length}개의 포스트`,
    openGraph: {
      title: `${tag} 태그 | ${siteConfig.name}`,
      description: `${tag} 태그가 붙은 ${posts.length}개의 포스트`,
      type: "website",
      url: `${siteConfig.url}/tags/${tag}`,
    },
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  const allTags = getAllTags();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "홈", href: "/" },
          { name: "태그", href: "/tags" },
          { name: tag },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <nav className="mb-6">
            <Link
              href="/tags"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
              모든 태그
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              #
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                {tag}
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {posts.length}개의 포스트
              </p>
            </div>
          </div>
        </header>

        {/* Posts */}
        {posts.length === 0 ? (
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
            <p className="text-gray-600 dark:text-gray-400">
              해당 태그의 포스트가 없습니다
            </p>
          </div>
        ) : (
          <section className="space-y-6">
            {posts.map((post) => {
              const formattedDate = new Date(post.date).toLocaleDateString(
                "ko-KR",
                {
                  year: "numeric",
                  month: "long",
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
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            t === tag
                              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {formattedDate}
                    </time>
                  </Link>
                </article>
              );
            })}
          </section>
        )}

        {/* Other Tags */}
        <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            다른 태그 둘러보기
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags
              .filter((t) => t !== tag)
              .map((t) => (
                <Link
                  key={t}
                  href={`/tags/${t}`}
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
