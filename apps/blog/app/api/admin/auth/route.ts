import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const AUTH_COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24시간

// 간단한 해시 함수 (실제 프로덕션에서는 더 강력한 방식 권장)
function createSessionToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return Buffer.from(`${timestamp}:${random}`).toString("base64");
}

// POST: 로그인
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "로그인 성공" });
  } catch {
    return NextResponse.json(
      { success: false, message: "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET: 세션 확인
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(AUTH_COOKIE_NAME);

    if (!session?.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// DELETE: 로그아웃
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json({ success: true, message: "로그아웃 완료" });
  } catch {
    return NextResponse.json(
      { success: false, message: "로그아웃 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
