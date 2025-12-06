import { NextRequest, NextResponse } from "next/server";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
} from "@/lib/comments";

/**
 * GET /api/comments?postSlug=xxx
 * 포스트의 댓글 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");

    if (!postSlug) {
      return NextResponse.json(
        { error: "postSlug is required" },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPost(postSlug);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Failed to get comments:", error);
    return NextResponse.json(
      { error: "Failed to get comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * 새 댓글 생성
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, author, content, password, parentId } = body;

    // Validation
    if (!postSlug || !author || !content || !password) {
      return NextResponse.json(
        { error: "postSlug, author, content, and password are required" },
        { status: 400 }
      );
    }

    if (author.length > 50) {
      return NextResponse.json(
        { error: "Author name is too long (max 50 characters)" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Content is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    if (password.length < 4 || password.length > 20) {
      return NextResponse.json(
        { error: "Password must be 4-20 characters" },
        { status: 400 }
      );
    }

    const comment = await createComment({
      postSlug,
      author: author.trim(),
      content: content.trim(),
      password,
      parentId,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/comments
 * 댓글 수정
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, commentId, content, password } = body;

    if (!postSlug || !commentId || !content || !password) {
      return NextResponse.json(
        { error: "postSlug, commentId, content, and password are required" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Content is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const result = await updateComment(postSlug, commentId, content.trim(), password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "비밀번호가 일치하지 않습니다." ? 403 : 404 }
      );
    }

    return NextResponse.json({ comment: result.comment });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comments
 * 댓글 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, commentId, password } = body;

    if (!postSlug || !commentId || !password) {
      return NextResponse.json(
        { error: "postSlug, commentId, and password are required" },
        { status: 400 }
      );
    }

    const result = await deleteComment(postSlug, commentId, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
