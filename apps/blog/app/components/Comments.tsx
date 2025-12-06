"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

interface CommentsProps {
  postSlug: string;
}

// 테마 상태를 외부 store로 관리
let themeListeners: Array<() => void> = [];

function subscribeToTheme(callback: () => void) {
  themeListeners.push(callback);
  return () => {
    themeListeners = themeListeners.filter((l) => l !== callback);
  };
}

function getThemeSnapshot(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
}

// 클라이언트 마운트 상태 확인용
function subscribeToMount() {
  return () => {};
}

function getMountSnapshot() {
  return true;
}

function getServerMountSnapshot() {
  return false;
}

// MutationObserver 설정 (모듈 레벨에서 한 번만)
if (typeof window !== "undefined") {
  const observer = new MutationObserver(() => {
    themeListeners.forEach((l) => l());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

export default function Comments({ postSlug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const mounted = useSyncExternalStore(subscribeToMount, getMountSnapshot, getServerMountSnapshot);

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
  }, [postSlug, mounted, theme]);

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
