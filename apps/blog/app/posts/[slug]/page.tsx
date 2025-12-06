import { getPostMetadata, getPostSlugs } from "@/lib/posts";
import Link from "next/link";

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
  const MDXContext = (await import(`../../../content/posts/${slug}.mdx`))
    .default;
  if (metadata == null) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }

  return (
    <main>
      <nav>
        <Link href="/">← 개발 블로그 홈으로</Link>
      </nav>
      <article>
        <header>
          <h1>{metadata.title}</h1>
          <div>{metadata.date}</div>
          {metadata.tags.length > 0 && (
            <div>
              {metadata.tags.map((tag) => (
                <span key={tag}>
                  <Link href={`/tags/${tag}`} key={tag} className="tag-link">
                    n key={tag}#{tag}
                  </Link>
                </span>
              ))}
            </div>
          )}
        </header>
        <section className="prose dark:prose-invert max-w-none">
          <MDXContext />
        </section>
      </article>
    </main>
  );
}
