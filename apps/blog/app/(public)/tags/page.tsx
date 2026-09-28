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

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent transition-colors mb-6"
        >
          ← 돌아가기
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">태그</h1>
        <p className="text-muted">
          관심 있는 주제를 선택하세요
        </p>
      </header>

      {/* Tag List */}
      <section>
        <div className="space-y-1">
          {tagCounts.map(({ name, count }) => (
            <Link
              key={name}
              href={`/tags/${name}`}
              className="group flex items-baseline justify-between py-3 border-b border-border hover:border-accent transition-colors"
            >
              <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                #{name}
              </span>
              <span className="text-sm text-muted">
                {count}개의 글
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
