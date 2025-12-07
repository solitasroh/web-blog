"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  slug: string;
  className?: string;
}

export default function ViewCounter({ slug, className = "" }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // 조회수 가져오기
    const fetchViews = async () => {
      try {
        const res = await fetch(`/api/views/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error("Failed to fetch views:", error);
      }
    };

    // 조회수 증가 (세션당 1회만)
    const incrementViews = async () => {
      const viewedPosts = JSON.parse(
        sessionStorage.getItem("viewedPosts") || "[]"
      );

      if (!viewedPosts.includes(slug)) {
        try {
          const res = await fetch(`/api/views/${slug}`, {
            method: "POST",
          });
          if (res.ok) {
            const data = await res.json();
            setViews(data.views);
            sessionStorage.setItem(
              "viewedPosts",
              JSON.stringify([...viewedPosts, slug])
            );
          }
        } catch (error) {
          console.error("Failed to increment views:", error);
        }
      } else {
        fetchViews();
      }
    };

    incrementViews();
  }, [slug]);

  if (views === null) {
    return (
      <span className={className}>
        <span className="inline-block w-8 h-4 bg-muted/30 rounded animate-pulse" />
      </span>
    );
  }

  return (
    <span className={className}>
      {views.toLocaleString()}회 읽음
    </span>
  );
}
