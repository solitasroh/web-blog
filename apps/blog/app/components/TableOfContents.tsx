"use client";

import { useEffect, useState, useCallback } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  // 클릭 시 스크롤 처리
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // 헤더 높이 고려
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      // URL 해시 업데이트
      window.history.pushState(null, "", `#${id}`);
    }
  }, []);

  useEffect(() => {
    // prose 영역 내의 헤딩만 선택
    const article = document.querySelector("article");
    if (!article) return;

    const elements = article.querySelectorAll("h2, h3");
    const items: TocItem[] = Array.from(elements)
      .filter((el) => el.id) // id가 있는 것만
      .map((el) => ({
        id: el.id,
        text: el.textContent?.replace(/^#\s*/, "") || "", // 앵커 링크 제거
        level: Number(el.tagName[1]),
      }));

    setHeadings(items);

    // 초기 활성 항목 설정 (URL 해시 기반)
    if (window.location.hash) {
      setActiveId(window.location.hash.slice(1));
    } else if (items.length > 0) {
      setActiveId(items[0].id);
    }

    // IntersectionObserver로 스크롤 시 활성 항목 업데이트
    const observer = new IntersectionObserver(
      (entries) => {
        // 화면에 보이는 헤딩 중 가장 위에 있는 것 찾기
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // 가장 위에 있는 항목 선택
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
  }, []);

  if (headings.length === 0) {
    return (
      <p className="text-sm text-muted">목차가 없습니다.</p>
    );
  }

  return (
    <nav className="toc" aria-label="목차">
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className="relative"
          >
            {/* 활성 표시선 */}
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
