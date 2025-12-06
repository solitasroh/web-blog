import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/posts";
import Link from "next/link";

type Params = Promise<{ tag: string }>;

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const tag = (await params).tag;
  return {
    title: `태그: ${tag}`,
    description: `${tag} 태그가 붙은 포스트 목록입니다.`,
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  if (posts.length === 0) {
    return <div>해당 태그를 가진 포스트가 없습니다</div>;
  }

  return (
    <div>
      <h1>태그: {tag}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
