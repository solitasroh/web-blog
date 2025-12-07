import { NextRequest, NextResponse } from "next/server";

// 메모리 기반 조회수 저장소 (서버 재시작 시 초기화됨)
// 프로덕션에서는 DB(Redis, Upstash, Planetscale 등)로 교체 권장
const viewCounts = new Map<string, number>();

type Params = Promise<{ slug: string }>;

// 조회수 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = await params;
  const views = viewCounts.get(slug) || 0;

  return NextResponse.json({ slug, views });
}

// 조회수 증가
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = await params;
  const currentViews = viewCounts.get(slug) || 0;
  const newViews = currentViews + 1;
  viewCounts.set(slug, newViews);

  return NextResponse.json({ slug, views: newViews });
}
