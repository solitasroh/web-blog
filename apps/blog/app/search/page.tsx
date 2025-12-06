import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const posts = getAllPosts();

  const filtered = q
    ? posts.filter((post) => post.title.toLowerCase().includes(q.toLowerCase()))
    : posts;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        검색
      </h1>
      <form className="mb-6">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q || ""}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>
      {filtered.length > 0 ? (
        <div>
          <ul className="space-y-4">
            {filtered.map((post) => (
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
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {post.date}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : q ? (
        <p className="text-gray-600 dark:text-gray-400">
          검색 결과가 없습니다.
        </p>
      ) : null}
    </main>
  );
}
