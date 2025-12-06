"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// TOC 상태를 관리하는 외부 store
interface TocState {
  headings: TocItem[];
  activeId: string;
}

let tocState: TocState = { headings: [], activeId: "" };
let tocListeners: Array<() => void> = [];

function subscribeToc(callback: () => void) {
  tocListeners.push(callback);
  return () => {
    tocListeners = tocListeners.filter((l) => l !== callback);
  };
}

function getTocSnapshot(): TocState {
  return tocState;
}

function getServerTocSnapshot(): TocState {
  return { headings: [], activeId: "" };
}

function setTocState(newState: Partial<TocState>) {
  tocState = { ...tocState, ...newState };
  tocListeners.forEach((l) => l());
}

function initializeHeadings() {
  if (typeof document === "undefined") return;

  const article = document.querySelector("article");
  if (!article) return;

  const elements = article.querySelectorAll("h2, h3");
  const items: TocItem[] = Array.from(elements)
    .filter((el) => el.id)
    .map((el) => ({
      id: el.id,
      text: el.textContent?.replace(/^#\s*/, "") || "",
      level: Number(el.tagName[1]),
    }));

  // 초기 활성 항목 설정
  let initialActiveId = "";
  if (window.location.hash) {
    initialActiveId = window.location.hash.slice(1);
  } else if (items.length > 0) {
    initialActiveId = items[0].id;
  }

  setTocState({ headings: items, activeId: initialActiveId });
}

function setActiveId(id: string) {
  if (tocState.activeId !== id) {
    setTocState({ activeId: id });
  }
}

export default function TableOfContents() {
  const { headings, activeId } = useSyncExternalStore(
    subscribeToc,
    getTocSnapshot,
    getServerTocSnapshot
  );

  // 마운트 시 headings 초기화
  useEffect(() => {
    initializeHeadings();
  }, []);

  // IntersectionObserver로 스크롤 시 활성 항목 업데이트
  useEffect(() => {
    if (headings.length === 0) return;

    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries.reduce((prev, curr) => {
            return prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr;
          });
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: [0, 1],
      }
    );

    elements.forEach((el) => {
      if (el.id) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // 클릭 시 스크롤 처리
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      window.history.pushState(null, "", `#${id}`);
    }
  }, []);

  if (headings.length === 0) {
    return <p className="text-sm text-muted">목차가 없습니다.</p>;
  }

  return (
    <nav className="toc" aria-label="목차">
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className="relative">
            {activeId === heading.id && (
              <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent rounded-full" />
            )}
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={`block py-1 transition-all duration-200 ${
                heading.level === 2 ? "pl-3" : "pl-6"
              } ${
                activeId === heading.id
                  ? "text-accent font-medium"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
