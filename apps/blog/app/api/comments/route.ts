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
    const { postSlug, author, content, parentId } = body;

    // Validation
    if (!postSlug || !author || !content) {
      return NextResponse.json(
        { error: "postSlug, author, and content are required" },
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

    const comment = await createComment({
      postSlug,
      author: author.trim(),
      content: content.trim(),
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
    const { postSlug, commentId, content } = body;

    if (!postSlug || !commentId || !content) {
      return NextResponse.json(
        { error: "postSlug, commentId, and content are required" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Content is too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const comment = await updateComment(postSlug, commentId, content.trim());

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Failed to update comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comments?postSlug=xxx&commentId=xxx
 * 댓글 삭제
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get("postSlug");
    const commentId = searchParams.get("commentId");

    if (!postSlug || !commentId) {
      return NextResponse.json(
        { error: "postSlug and commentId are required" },
        { status: 400 }
      );
    }

    await deleteComment(postSlug, commentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
