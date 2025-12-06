"use client";

import { useEffect, useRef } from "react";

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

// Giscus 설정 가이드:
// 1. https://giscus.app 에서 설정을 생성하세요
// 2. GitHub repo에서 Discussions 기능을 활성화하세요
// 3. 아래 props에 생성된 값들을 전달하세요

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
}: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

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
  }, [repo, repoId, category, categoryId]);

  // 테마 변경 시 Giscus 테마도 업데이트
  useEffect(() => {
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
  }, []);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        댓글
      </h2>
      <div ref={ref} className="giscus" />
    </section>
  );
}
