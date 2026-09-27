"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostPreviewLink from "./components/PostPreviewLink";

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  modifiedAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [preview, setPreview] = useState({
    draftsExposed: false,
    previewBaseUrl: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (!res.ok) {
        router.push("/admin/login");
        return false;
      }
      setAuthenticated(true);
      return true;
    } catch {
      router.push("/admin/login");
      return false;
    }
  }, [router]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        if (data.preview) {
          setPreview(data.preview);
        }
      }
    } catch (error) {
      console.error("포스트 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        await fetchPosts();
      }
    };
    init();
  }, [checkAuth, fetchPosts]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleDelete = async (slug: string) => {
    try {
      const res = await fetch(`/api/admin/posts?slug=${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        setDeleteSlug(null);
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">블로그 관리</h1>
            <Link
              href="/"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              ← 블로그로
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">포스트 관리</h2>
            <p className="text-sm text-muted mt-1">
              총 {posts.length}개의 포스트
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent-light transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            새 포스트
          </Link>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-muted mb-4">아직 포스트가 없습니다.</p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent-light transition-colors"
            >
              첫 포스트 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="p-6 rounded-xl border border-border bg-card hover:border-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="text-lg font-semibold text-foreground hover:text-accent transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    {post.draft && (
                      <span className="mt-2 inline-flex items-center rounded-md border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                        Draft
                      </span>
                    )}

                    <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="font-mono text-xs">{post.slug}.mdx</span>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-muted/10 text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <PostPreviewLink
                      slug={post.slug}
                      draft={post.draft}
                      draftsExposed={preview.draftsExposed}
                      previewBaseUrl={preview.previewBaseUrl}
                    />
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-accent/10 transition-colors"
                      title="편집"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setDeleteSlug(post.slug)}
                      className="p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="삭제"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteSlug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border shadow-xl">
            <h3 className="text-lg font-bold text-foreground mb-2">
              포스트 삭제
            </h3>
            <p className="text-muted mb-6">
              &quot;{deleteSlug}&quot; 포스트를 삭제하시겠습니까? 이 작업은
              되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteSlug(null)}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-accent/10 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(deleteSlug)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
