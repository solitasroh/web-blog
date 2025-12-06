"use client";

import { PostMetadata } from "@/lib/posts";
import { useEffect, useState } from "react";

export default function ClientPostList() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok)
          throw new Error("포스트를 불러오는 중 에러가 발생했습니다.");
        return res.json();
      })
      .then((data: PostMetadata[]) => {
        setPosts(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <p className="p-4">포스트를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-32">
        <p className="p-4 text-red-500">에러가 발생했습니다: {error.message}</p>
      </div>
    );
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>{post.title}</li>
      ))}
    </ul>
  );
}
