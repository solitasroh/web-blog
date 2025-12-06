import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/posts";
import Link from "next/link";

type Params = Promise<{ tag: string }>;

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const tag = (await params).tag;
  return {
    title: `태그: ${tag}`,
    description: `${tag} 태그가 붙은 포스트 목록입니다.`,
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-400">
          해당 태그를 가진 포스트가 없습니다
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        태그: {tag}
      </h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <Link
              href={`/posts/${post.slug}`}
              className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
