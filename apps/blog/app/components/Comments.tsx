"use client";

import { useEffect, useRef } from "react";

// Giscus 설정을 위한 환경 변수
// .env.local에 다음 값들을 설정하세요:
// NEXT_PUBLIC_GISCUS_REPO=username/repo
// NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxx
// NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
// NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxx

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  // Giscus 설정이 없으면 렌더링하지 않음
  const isConfigured = repo && repoId && category && categoryId;

  useEffect(() => {
    if (!isConfigured || !ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");

    // 다크 모드 감지
    const isDark = document.documentElement.classList.contains("dark");
    script.setAttribute("data-theme", isDark ? "dark" : "light");

    ref.current.appendChild(script);
  }, [isConfigured, repo, repoId, category, categoryId]);

  // 테마 변경 시 Giscus 테마도 업데이트
  useEffect(() => {
    if (!isConfigured) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          const iframe = document.querySelector<HTMLIFrameElement>(
            "iframe.giscus-frame"
          );
          if (iframe) {
            iframe.contentWindow?.postMessage(
              {
                giscus: {
                  setConfig: {
                    theme: isDark ? "dark" : "light",
                  },
                },
              },
              "https://giscus.app"
            );
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [isConfigured]);

  if (!isConfigured) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        댓글
      </h2>
      <div ref={ref} className="giscus" />
    </section>
  );
}
