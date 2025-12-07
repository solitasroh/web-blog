import TableOfContents from "@/app/components/TableOfContents";
import { BlogPostJsonLd, BreadcrumbJsonLd } from "@/app/components/JsonLd";
import ShareButtons from "@/app/components/ShareButtons";
import Comments from "@/app/components/Comments";
import ViewCounter from "@/app/components/ViewCounter";
import {
  getPostMetadata,
  getPostSlugs,
  getRelatedPosts,
  getAdjacentPosts,
} from "@/lib/posts";
import { siteConfig } from "@/lib/siteConfig";
import Link from "next/link";
import Image from "next/image";
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
      images: [
        {
          url: "/og-image.png",
          width: 1536,
          height: 1024,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description,
      creator: siteConfig.author.twitter,
      images: ["/og-image.png"],
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-16">
          {/* Main Content */}
          <article className="min-w-0">
            {/* Header */}
            <header className="mb-10 pb-8 border-b border-border">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors mb-8"
              >
                ← 홈으로
              </Link>

              {/* Tags */}
              {metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {metadata.tags.map((tag) => (
                    <Link
                      href={`/tags/${tag}`}
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                {metadata.title}
              </h1>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-400 to-teal-500 p-0.5 overflow-hidden">
                    <Image
                      src="/tech_blog_logo_light.png"
                      alt="Dev.Sol"
                      width={40}
                      height={40}
                      className="rounded-full bg-card object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Dev.Sol</p>
                    <time dateTime={metadata.date}>{formattedDate}</time>
                  </div>
                </div>
                <span className="text-border">|</span>
                <span>{metadata.readingTime}분 읽기</span>
                <span className="text-border">|</span>
                <ViewCounter slug={slug} />
              </div>
            </header>

            {/* Article Content */}
            <section className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-card prose-pre:border prose-pre:border-border">
              <MDXContext />
            </section>

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-border">
              <ShareButtons title={metadata.title} slug={slug} />
            </div>

            {/* Post Navigation */}
            <nav className="mt-12 pt-8 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/posts/${prev.slug}`}
                    className="group p-5 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-md transition-all"
                  >
                    <div className="text-xs text-muted mb-2 uppercase tracking-wider">이전 글</div>
                    <div className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {prev.title}
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/posts/${next.slug}`}
                    className="group p-5 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-md transition-all text-right"
                  >
                    <div className="text-xs text-muted mb-2 uppercase tracking-wider">다음 글</div>
                    <div className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
                      {next.title}
                    </div>
                  </Link>
                )}
              </div>
            </nav>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">
                  관련 글
                </h2>
                <div className="grid gap-4">
                  {relatedPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group p-4 rounded-xl border border-border bg-card hover:border-accent/50 transition-all"
                    >
                      <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-muted">#{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Comments */}
            <Comments postSlug={slug} />
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-4">
                  On this page
                </h3>
                <TableOfContents />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
