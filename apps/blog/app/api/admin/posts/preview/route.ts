import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const AUTH_COOKIE_NAME = "admin_session";
const MAX_CONTENT_LENGTH = 500_000;

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(AUTH_COOKIE_NAME)?.value);
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { content?: unknown };

    if (typeof body.content !== "string") {
      return NextResponse.json(
        { error: "MDX 내용이 필요합니다." },
        { status: 400 }
      );
    }

    if (body.content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: "미리보기 내용은 500KB 이하여야 합니다." },
        { status: 413 }
      );
    }

    const source = await serialize(body.content, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: "github-dark" }],
        ],
      },
    });

    return NextResponse.json(
      { source },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "MDX를 렌더링할 수 없습니다.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
