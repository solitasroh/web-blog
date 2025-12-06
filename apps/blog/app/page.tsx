import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Section with Profile */}
      <header className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 pb-12 border-b border-border">
        {/* Profile Image */}
        <div className="shrink-0">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-accent-light p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-4xl font-bold text-accent">
              S
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Solitas
          </h1>
          <p className="text-lg text-muted mb-4 leading-relaxed">
            소프트웨어 엔지니어로 일하고 있습니다.<br />
            Next.js, TypeScript, 임베디드 시스템에 대한 이야기를 기록합니다.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/solitas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <a
              href="/feed.xml"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="RSS Feed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-16">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">
            최신 포스트
          </h2>
          <Link href={`/posts/${featuredPost.slug}`} className="group block">
            <article className="relative overflow-hidden rounded-2xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {featuredPost.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                  {featuredPost.title}
                </h3>

                {/* Excerpt */}
                {featuredPost.excerpt && (
                  <p className="text-muted text-lg mb-6 line-clamp-2">
                    {featuredPost.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted">
                  <time dateTime={featuredPost.date}>
                    {new Date(featuredPost.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>·</span>
                  <span>{featuredPost.readingTime}분 읽기</span>
                </div>
              </div>
            </article>
          </Link>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Posts */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider">
              최근 글
            </h2>
            <Link
              href="/archive"
              className="text-sm text-accent hover:text-accent-light transition-colors"
            >
              전체 보기 →
            </Link>
          </div>

          <div className="grid gap-6">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/posts/${post.slug}`} className="group">
                <article className="p-6 rounded-xl border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-md">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted/10 text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-muted text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readingTime}분</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Tags */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
              태그
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="px-3 py-1.5 text-sm rounded-full border border-border text-muted hover:border-accent hover:text-accent transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
            {tags.length > 12 && (
              <Link
                href="/tags"
                className="inline-block mt-4 text-sm text-accent hover:text-accent-light transition-colors"
              >
                모든 태그 보기 →
              </Link>
            )}
          </div>

          {/* About Card */}
          <div className="p-6 rounded-xl border border-border bg-gradient-to-br from-card to-accent/5">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">
              About
            </h3>
            <p className="text-sm text-foreground leading-relaxed mb-4">
              임베디드 시스템과 웹 개발을 넘나드는 풀스택 엔지니어입니다.
              기술적인 도전과 문제 해결을 즐기며, 배운 것들을 기록하고 공유합니다.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              <span>Currently learning & building</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
