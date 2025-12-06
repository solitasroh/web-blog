"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CommentsProps {
  postSlug: string;
}

export default function Comments({ postSlug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // 테마 감지
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    // 초기 테마 설정
    updateTheme();
    setMounted(true);

    // MutationObserver로 테마 변경 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Giscus 스크립트 로드 (최초 1회만)
  useEffect(() => {
    if (!ref.current || !mounted) return;

    // 이미 로드된 경우 스킵
    if (ref.current.querySelector("iframe.giscus-frame")) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "solitasroh/web-blog");
    script.setAttribute("data-repo-id", "R_kgDOQi9O6g");
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", "DIC_kwDOQi9O6s4CzeFM");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
    script.setAttribute("data-lang", "ko");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, [postSlug, mounted]);

  // 테마 변경 시 Giscus 테마만 업데이트 (iframe 유지)
  useEffect(() => {
    if (!mounted) return;

    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              theme: theme === "dark" ? "dark" : "light",
            },
          },
        },
        "https://giscus.app"
      );
    }
  }, [theme, mounted]);

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">
        댓글
      </h2>
      <div ref={ref} className="giscus" />
    </section>
  );
}
