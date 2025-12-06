import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex items-center gap-4 mb-8">
        <Image
          src="/tech_blog_logo.svg"
          alt="Tech Blog Logo"
          width={48}
          height={48}
          priority
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            개발 블로그
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Next.js · pnpm · 모노레포 · 임베디드 삽질 기록 저장소
          </p>
        </div>
      </header>
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          최근 글
        </h2>
        {posts.length === 0 && <p>게시물이 없습니다.</p>}
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
              <div>{post.date}</div>
              {post.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex gap-2 py-2">
        <h3>
          <Link
            href="/subscribe"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            구독하기
          </Link>
        </h3>
      </section>
    </main>
  );
}
