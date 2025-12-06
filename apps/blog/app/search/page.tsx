import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q } = await searchParams;
  const posts = getAllPosts();

  const filtered = q
    ? posts.filter((post) => post.title.toLowerCase().includes(q.toLowerCase()))
    : posts;

  return (
    <main>
      <form>
        <input name="q" defaultValue={q || ""} />
        <button type="submit">Search</button>
      </form>
      {filtered.length > 0 ? (
        <div>
          <ul>
            {filtered.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                <div>{post.date}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : q ? (
        <p>검색 결과가 없습니다.</p>
      ) : null}
    </main>
  );
}
