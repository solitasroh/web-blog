"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

export default function EditPostPage({ params }: { params: Params }) {
  const { slug } = use(params);
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
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

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/posts?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
        setOriginalContent(data.content);
      } else {
        setError("포스트를 찾을 수 없습니다.");
      }
    } catch {
      setError("포스트를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (isAuth) {
        await fetchPost();
      }
    };
    init();
  }, [checkAuth, fetchPost]);

  useEffect(() => {
    setHasChanges(content !== originalContent);
  }, [content, originalContent]);

  // 페이지 이탈 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content }),
      });

      const data = await res.json();

      if (res.ok) {
        setOriginalContent(content);
        setHasChanges(false);
        alert("저장되었습니다.");
      } else {
        setError(data.error || "저장에 실패했습니다.");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (hasChanges && !saving) {
          handleSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">로딩 중...</div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Link href="/admin" className="text-accent hover:text-accent-light">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-muted hover:text-foreground transition-colors"
            >
              ← 목록으로
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                포스트 편집
              </h1>
              <p className="text-xs text-muted font-mono">{slug}.mdx</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges && (
              <span className="text-xs text-amber-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                저장되지 않은 변경사항
              </span>
            )}
            <Link
              href={`/posts/${slug}`}
              target="_blank"
              className="px-3 py-2 rounded-lg border border-border text-foreground hover:bg-accent/10 transition-colors text-sm"
            >
              미리보기
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              MDX 내용
            </label>
            <span className="text-xs text-muted">
              Cmd/Ctrl + S로 저장
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[calc(100vh-280px)] min-h-[500px] px-4 py-3 rounded-xl border border-border bg-card text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            placeholder="MDX 내용을 입력하세요..."
            spellCheck={false}
          />
        </div>

        {/* Quick Reference */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h3 className="text-sm font-medium text-foreground mb-2">
              Frontmatter
            </h3>
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap">
{`---
title: "제목"
date: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
excerpt: "요약"
---`}
            </pre>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h3 className="text-sm font-medium text-foreground mb-2">
              제목
            </h3>
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap">
{`# H1 제목
## H2 제목
### H3 제목`}
            </pre>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h3 className="text-sm font-medium text-foreground mb-2">
              코드 블록
            </h3>
            <pre className="text-xs text-muted font-mono whitespace-pre-wrap">
{`\`\`\`typescript
const x = 1;
\`\`\``}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
