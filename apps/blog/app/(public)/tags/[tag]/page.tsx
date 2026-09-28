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

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/tags"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors mb-6"
          >
            ← 모든 태그
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            #{tag}
          </h1>
          <p className="text-muted">
            {posts.length}개의 포스트
          </p>
        </header>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted">해당 태그의 포스트가 없습니다</p>
          </div>
        ) : (
          <section className="space-y-1">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex items-baseline justify-between py-3 border-b border-border hover:border-accent transition-colors"
                >
                  <h2 className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="text-sm text-muted shrink-0 ml-4"
                  >
                    {new Date(post.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </Link>
              </article>
            ))}
          </section>
        )}

        {/* Other Tags */}
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">
            다른 태그
          </h2>
          <div className="flex flex-wrap gap-3">
            {allTags
              .filter((t) => t !== tag)
              .map((t) => (
                <Link
                  key={t}
                  href={`/tags/${t}`}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  #{t}
                </Link>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
