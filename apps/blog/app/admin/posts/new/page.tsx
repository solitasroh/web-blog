"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEFAULT_TEMPLATE = `---
title: "새 포스트 제목"
date: "${new Date().toISOString().split("T")[0]}"
tags: []
excerpt: ""
---

# 제목

여기에 내용을 작성하세요.

## 소제목

본문 내용...
`;

export default function NewPostPage() {
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState(DEFAULT_TEMPLATE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      setAuthenticated(true);
    } catch {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 제목에서 slug 자동 생성
  const handleTitleChange = (newContent: string) => {
    setContent(newContent);

    // frontmatter에서 title 추출
    const titleMatch = newContent.match(/title:\s*["']?([^"'\n]+)["']?/);
    if (titleMatch && !slug) {
      const title = titleMatch[1];
      // 한글 제거, 공백을 하이픈으로, 소문자 변환
      const generatedSlug = title
        .toLowerCase()
        .replace(/[가-힣]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (generatedSlug) {
        setSlug(generatedSlug);
      }
    }
  };

  const handleSave = async () => {
    if (!slug.trim()) {
      setError("slug를 입력해주세요.");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, content }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "저장에 실패했습니다.");
      }
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted">로딩 중...</div>
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
            <h1 className="text-lg font-semibold text-foreground">
              새 포스트 작성
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-light transition-colors disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full">
        {/* Slug Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-muted">/posts/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
              placeholder="my-post-slug"
            />
            <span className="text-muted">.mdx</span>
          </div>
          <p className="text-xs text-muted mt-1">
            영문 소문자, 숫자, 하이픈만 사용 가능
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Editor */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            MDX 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full h-[calc(100vh-320px)] min-h-[400px] px-4 py-3 rounded-xl border border-border bg-card text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
            placeholder="MDX 내용을 입력하세요..."
            spellCheck={false}
          />
        </div>

        {/* Help */}
        <div className="mt-6 p-4 rounded-xl border border-border bg-card/50">
          <h3 className="text-sm font-medium text-foreground mb-2">
            작성 가이드
          </h3>
          <ul className="text-xs text-muted space-y-1">
            <li>
              • <code className="bg-muted/20 px-1 rounded">---</code> 사이에
              frontmatter(메타데이터)를 작성합니다.
            </li>
            <li>
              • <code className="bg-muted/20 px-1 rounded">title</code>,{" "}
              <code className="bg-muted/20 px-1 rounded">date</code>,{" "}
              <code className="bg-muted/20 px-1 rounded">tags</code>는 필수
              필드입니다.
            </li>
            <li>
              • 코드 블록은{" "}
              <code className="bg-muted/20 px-1 rounded">```언어</code>로
              작성합니다.
            </li>
            <li>• Markdown 문법과 React 컴포넌트를 함께 사용할 수 있습니다.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
