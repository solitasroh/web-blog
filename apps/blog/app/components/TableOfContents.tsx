"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  useEffect(() => {
    const elements = document.querySelectorAll(
      "article h2, article h3, article h4"
    );
    const items: TocItem[] = Array.from(elements).map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: Number(el.tagName[1]), // "H2" -> 2,
    }));
    setHeadings(items);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -70% 0%", // ✅ 두 번째 인자로 옵션
      }
    );

    elements.forEach((el) => observer.observe(el)); // ✅ useEffect 내부, 콜백 외부

    return () => observer.disconnect(); // ✅ useEffect cleanup
  }, []);
  if (headings.length === 0) return null;

  return (
    <nav className="toc">
      <h2 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">
        목차
      </h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block transition-colors ${
                activeId === heading.id
                  ? "text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
