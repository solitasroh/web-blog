import TableOfContents from "@/app/components/TableOfContents";
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/app/components/JsonLd";
import {
  getPostMetadata,
  getPostSlugs,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Next.js 15: params는 Promise 타입
type Params = Promise<{ slug: string }>;

// 정적 페이지 생성을 위한 slug 목록
export function generateStaticParams() {
  const slugs = getPostSlugs();

  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata | null> {
  const slug = (await params).slug;
  const meta = getPostMetadata(slug);
  if (meta == null) {
    return null;
  }

  const description =
    meta.tags.length > 0
      ? `${meta.title} - ${meta.tags.join(", ")}`
      : meta.title;

  const postUrl = `${siteConfig.url}/posts/${slug}`;

  return {
    title: meta.title,
    description,
    openGraph: {
      title: meta.title,
      description,
      type: "article",
      url: postUrl,
      publishedTime: meta.date,
      authors: [siteConfig.author.name],
      tags: meta.tags,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description,
      creator: siteConfig.author.twitter,
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const metadata = getPostMetadata(slug);
  if (metadata == null) {
    notFound();
  }
  const MDXContext = (await import(`../../../content/posts/${slug}.mdx`))
    .default;

  const formattedDate = new Date(metadata.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const relatedPosts = getRelatedPosts(slug, 3);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <>
      <BlogPostJsonLd post={metadata} />
      <BreadcrumbJsonLd
        items={[
          { name: "홈", href: "/" },
          { name: "포스트", href: "/" },
          { name: metadata.title },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link
                href="/"
                className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                홈
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px] sm:max-w-none">
              {metadata.title}
            </li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* Main Content */}
          <article className="animate-fade-in-up">
            <header className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-800">
              {/* Tags */}
              {metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {metadata.tags.map((tag) => (
                    <Link
                      href={`/tags/${tag}`}
                      key={tag}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4">
                {metadata.title}
              </h1>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    S
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {siteConfig.author.name}
                  </span>
                </div>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <time dateTime={metadata.date}>{formattedDate}</time>
              </div>
            </header>

            {/* Article Content */}
            <section className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl">
              <MDXContext />
            </section>

            {/* Post Navigation */}
            <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/posts/${prev.slug}`}
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      이전 글
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {prev.title}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/posts/${next.slug}`}
                    className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all text-right"
                  >
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      다음 글
                    </div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {next.title}
                    </div>
                  </Link>
                )}
              </div>
            </nav>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  관련 글
                </h2>
                <div className="grid gap-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-1"
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
              </section>
            )}

            {/* Back to home */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                모든 글 보기
              </Link>
            </div>
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
