import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "../lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  return (
    <main>
      <header>
        <h1> 개발 블로그 </h1>
        <p> Next.js · pnpm · 모노레포 · 임베디드 삽질 기록 저장소</p>
      </header>
      <section>
        <h2>최근 글</h2>
        {posts.length === 0 && <p>게시물이 없습니다.</p>}
        <ul>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              <div>{post.date}</div>
              {post.tags.length > 0 && (
                <div>
                  {post.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
