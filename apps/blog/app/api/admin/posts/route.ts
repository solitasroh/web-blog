import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const AUTH_COOKIE_NAME = "admin_session";
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

// 인증 확인 헬퍼
async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  return !!session?.value;
}

// GET: 포스트 목록 또는 단일 포스트 조회
export async function GET(request: NextRequest) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // 단일 포스트 조회
      const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
      const content = await fs.readFile(filePath, "utf-8");
      return NextResponse.json({ slug, content });
    }

    // 포스트 목록 조회
    const files = await fs.readdir(POSTS_DIR);
    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".mdx"))
        .map(async (file) => {
          const filePath = path.join(POSTS_DIR, file);
          const content = await fs.readFile(filePath, "utf-8");
          const slug = file.replace(/\.mdx$/, "");

          // frontmatter 파싱
          const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
          let title = slug;
          let date = "";
          let tags: string[] = [];

          if (frontmatterMatch) {
            const frontmatter = frontmatterMatch[1];
            const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
            const dateMatch = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/);
            const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);

            if (titleMatch) title = titleMatch[1];
            if (dateMatch) date = dateMatch[1];
            if (tagsMatch) {
              tags = tagsMatch[1]
                .split(",")
                .map((t) => t.trim().replace(/["']/g, ""));
            }
          }

          const stat = await fs.stat(filePath);

          return {
            slug,
            title,
            date,
            tags,
            modifiedAt: stat.mtime.toISOString(),
          };
        })
    );

    // 날짜 기준 정렬 (최신순)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("포스트 조회 오류:", error);
    return NextResponse.json(
      { error: "포스트를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 새 포스트 생성
export async function POST(request: NextRequest) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { slug, content } = await request.json();

    if (!slug || !content) {
      return NextResponse.json(
        { error: "slug와 content는 필수입니다." },
        { status: 400 }
      );
    }

    // slug 유효성 검사 (영문, 숫자, 하이픈만 허용)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." },
        { status: 400 }
      );
    }

    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

    // 이미 존재하는지 확인
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: "이미 존재하는 slug입니다." },
        { status: 409 }
      );
    } catch {
      // 파일이 없으면 정상
    }

    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: "포스트가 생성되었습니다.",
      slug,
    });
  } catch (error) {
    console.error("포스트 생성 오류:", error);
    return NextResponse.json(
      { error: "포스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PUT: 포스트 수정
export async function PUT(request: NextRequest) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { slug, content } = await request.json();

    if (!slug || !content) {
      return NextResponse.json(
        { error: "slug와 content는 필수입니다." },
        { status: 400 }
      );
    }

    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

    // 존재하는지 확인
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: "존재하지 않는 포스트입니다." },
        { status: 404 }
      );
    }

    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({
      success: true,
      message: "포스트가 수정되었습니다.",
      slug,
    });
  } catch (error) {
    console.error("포스트 수정 오류:", error);
    return NextResponse.json(
      { error: "포스트 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 포스트 삭제
export async function DELETE(request: NextRequest) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "slug가 필요합니다." },
        { status: 400 }
      );
    }

    const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

    // 존재하는지 확인
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: "존재하지 않는 포스트입니다." },
        { status: 404 }
      );
    }

    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: "포스트가 삭제되었습니다.",
      slug,
    });
  } catch (error) {
    console.error("포스트 삭제 오류:", error);
    return NextResponse.json(
      { error: "포스트 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
