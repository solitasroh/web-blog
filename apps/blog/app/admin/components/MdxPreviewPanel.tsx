"use client";

import {
  Component,
  type ErrorInfo,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { useMDXComponents } from "@/mdx-components";

type MdxPreviewPanelProps = {
  content: string;
};

type PreviewResponse = {
  source?: MDXRemoteSerializeResult;
  error?: string;
};

type PreviewErrorBoundaryProps = {
  children: ReactNode;
};

type PreviewErrorBoundaryState = {
  error: string | null;
};

class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  state: PreviewErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("MDX 미리보기 렌더링 오류:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <PreviewMessage
          title="미리보기를 렌더링할 수 없습니다."
          detail={this.state.error}
          tone="error"
        />
      );
    }

    return this.props.children;
  }
}

function PreviewMessage({
  title,
  detail,
  tone = "neutral",
}: {
  title: string;
  detail?: string;
  tone?: "neutral" | "error";
}) {
  return (
    <div
      className={`rounded-lg border p-4 text-sm ${
        tone === "error"
          ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
          : "border-border bg-card text-muted"
      }`}
      role={tone === "error" ? "alert" : "status"}
    >
      <p className="mb-0 font-medium text-current">{title}</p>
      {detail && (
        <pre className="mt-3 max-h-48 whitespace-pre-wrap border-0 bg-transparent p-0 text-xs text-current">
          {detail}
        </pre>
      )}
    </div>
  );
}

function readFrontmatterString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return "";
}

export default function MdxPreviewPanel({ content }: MdxPreviewPanelProps) {
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const components = useMDXComponents({});

  useEffect(() => {
    if (!content.trim()) {
      setSource(null);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/admin/posts/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          signal: controller.signal,
        });
        const data = (await response.json()) as PreviewResponse;

        if (!response.ok || !data.source) {
          throw new Error(data.error || "미리보기를 만들 수 없습니다.");
        }

        setSource(data.source);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setSource(null);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "미리보기를 만들 수 없습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 700);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [content]);

  if (error) {
    return (
      <PreviewMessage
        title="MDX 문법을 확인해주세요."
        detail={error}
        tone="error"
      />
    );
  }

  if (!source) {
    return (
      <PreviewMessage
        title={loading ? "미리보기를 렌더링하는 중..." : "MDX 내용을 입력하세요."}
      />
    );
  }

  const frontmatter = source.frontmatter ?? {};
  const title = readFrontmatterString(frontmatter.title);
  const date = readFrontmatterString(frontmatter.date);
  const tags = Array.isArray(frontmatter.tags)
    ? frontmatter.tags.filter((tag): tag is string => typeof tag === "string")
    : [];
  const draft = frontmatter.draft === true;

  return (
    <article aria-busy={loading}>
      <header className="mb-8 border-b border-border pb-6">
        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {title && (
          <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground">
            {title}
          </h1>
        )}
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
          {date && <time dateTime={date}>{date}</time>}
          {draft && (
            <span className="rounded border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-400">
              Draft
            </span>
          )}
          {loading && <span>업데이트 중...</span>}
        </div>
      </header>

      <section className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-card">
        <PreviewErrorBoundary key={source.compiledSource}>
          <MDXRemote {...source} components={components} />
        </PreviewErrorBoundary>
      </section>
    </article>
  );
}
