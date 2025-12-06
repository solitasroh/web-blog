import TableOfContents from "@/app/components/TableOfContents";
import { getPostMetadata, getPostSlugs } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

// Next.js 15: params는 Promise 타입
type Params = Promise<{ slug: string }>;

// 정적 페이지 생성을 위한 slug 목록
export function generateStaticParams() {
  const slugs = getPostSlugs();

  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx$/, ""),
  }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const slug = (await params).slug;
  const meta = getPostMetadata(slug);
  if (meta == null) {
    return null;
  }

  return {
    title: meta.title,
    description: `${meta.title} - ${meta.tags.join(", ") ?? ""}`,
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

  return (
    <main className="max-w-3xl mx-auto p-6">
      <nav className="mb-6">
        <Link
          href="/"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          ← 개발 블로그 홈으로
        </Link>
      </nav>
      <div className="lg:flex lg:gap-8">
        <article className="animate-fade-in-up delay-100">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {metadata.title}
            </h1>
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              {metadata.date}
            </div>
            {metadata.tags.length > 0 && (
              <div className="flex gap-2">
                {metadata.tags.map((tag) => (
                  <Link
                    href={`/tags/${tag}`}
                    key={tag}
                    className="tag-hover px-2 py-1 text-sm rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>
          <section className="prose dark:prose-invert max-w-none">
            <MDXContext />
          </section>
        </article>
        <aside className="hidden lg:block lg:w-64 lg:sticky lg:top-6 lg:self-start">
          <TableOfContents />
        </aside>
      </div>
    </main>
  );
}
