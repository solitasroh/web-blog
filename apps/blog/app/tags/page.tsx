import { getAllTags, getPostsByTag } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "태그",
  description: "블로그의 모든 태그를 확인하세요.",
};

export default function TagsPage() {
  const tags = getAllTags();

  // 태그별 포스트 개수 계산
  const tagCounts = tags.map((tag) => ({
    name: tag,
    count: getPostsByTag(tag).length,
  }));

  // 포스트 개수로 정렬
  tagCounts.sort((a, b) => b.count - a.count);

  // 최대 개수 (태그 크기 계산용)
  const maxCount = Math.max(...tagCounts.map((t) => t.count));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          태그
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          관심 있는 주제를 선택하여 관련 글을 찾아보세요
        </p>
      </header>

      {/* Tag Cloud */}
      <section className="mb-16">
        <div className="flex flex-wrap justify-center gap-3">
          {tagCounts.map(({ name, count }) => {
            // 태그 크기 계산 (1-5 스케일)
            const scale = Math.ceil((count / maxCount) * 4) + 1;
            const sizeClasses = {
              1: "text-sm px-3 py-1.5",
              2: "text-base px-4 py-2",
              3: "text-lg px-5 py-2.5",
              4: "text-xl px-6 py-3",
              5: "text-2xl px-7 py-3.5",
            };

            return (
              <Link
                key={name}
                href={`/tags/${name}`}
                className={`
                  ${sizeClasses[scale as keyof typeof sizeClasses]}
                  inline-flex items-center gap-2
                  rounded-full font-medium
                  bg-gray-100 dark:bg-gray-800
                  text-gray-700 dark:text-gray-300
                  hover:bg-blue-100 dark:hover:bg-blue-900/40
                  hover:text-blue-700 dark:hover:text-blue-300
                  transition-all duration-200
                  hover:scale-105
                `}
              >
                <span>{name}</span>
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Tag List */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          모든 태그
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tagCounts.map(({ name, count }) => (
            <Link
              key={name}
              href={`/tags/${name}`}
              className="group flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  #
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {name}
                </span>
              </div>
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {count}개의 글
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
