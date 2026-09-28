import { getDraftPosts } from "@/lib/posts";
import { shouldExposeDrafts } from "@/lib/env";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "초안 포스트",
  description: "작성 중인 초안 포스트 목록 (Preview 전용)",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DraftsPage() {
  // Production 환경에서는 404
  if (!shouldExposeDrafts()) {
    notFound();
  }

  const drafts = getDraftPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-sm font-medium rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Preview 전용 페이지</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          초안 포스트
        </h1>
        <p className="text-lg text-muted">
          작성 중인 초안 포스트 목록입니다. 이 페이지는 Preview 및 Development 환경에서만 표시됩니다.
        </p>
      </header>

      {drafts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted text-lg">작성 중인 초안이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {drafts.map((draft) => {
            const formattedDate = new Date(draft.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <article
                key={draft.slug}
                className="group p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-md transition-all"
              >
                <Link href={`/posts/${draft.slug}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
                      Draft
                    </span>
                    <time className="text-sm text-muted" dateTime={draft.date}>
                      {formattedDate}
                    </time>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors mb-3">
                    {draft.title}
                  </h2>

                  {draft.excerpt && (
                    <p className="text-muted mb-4 line-clamp-2">
                      {draft.excerpt}
                    </p>
                  )}

                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {draft.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 mt-4 text-sm text-muted">
                    <span>{draft.readingTime}분 읽기</span>
                    <span className="text-border">|</span>
                    <span>{draft.wordCount.toLocaleString()}자</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-12 pt-8 border-t border-border">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
