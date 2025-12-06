"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string;
  replies?: Comment[];
}

interface CommentsProps {
  postSlug: string;
}

export default function Comments({ postSlug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 댓글 불러오기
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(buildCommentTree(data.comments || []));
      setError(null);
    } catch {
      setError("댓글을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [postSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // 댓글을 트리 구조로 변환
  function buildCommentTree(flatComments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    flatComments.forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id)!;
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        } else {
          rootComments.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-6">
        댓글 {comments.length > 0 && `(${countAllComments(comments)})`}
      </h2>

      {/* 댓글 작성 폼 */}
      <CommentForm postSlug={postSlug} onSuccess={fetchComments} />

      {/* 댓글 목록 */}
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postSlug={postSlug}
              onUpdate={fetchComments}
            />
          ))
        )}
      </div>
    </section>
  );
}

// 전체 댓글 수 계산 (대댓글 포함)
function countAllComments(comments: Comment[]): number {
  return comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? countAllComments(comment.replies) : 0);
  }, 0);
}

// 댓글 작성 폼
function CommentForm({
  postSlug,
  parentId,
  onSuccess,
  onCancel,
}: {
  postSlug: string;
  parentId?: string;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [author, setAuthor] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim() || !password) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          author: author.trim(),
          content: content.trim(),
          password,
          parentId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create comment");
      }

      setAuthor("");
      setPassword("");
      setContent("");
      onSuccess();
      onCancel?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="이름"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          className="flex-1 sm:flex-none sm:w-36 px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 (4-20자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={4}
          maxLength={20}
          className="flex-1 sm:flex-none sm:w-40 px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="댓글을 작성하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors resize-none"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !author.trim() || !content.trim() || password.length < 4}
          className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "작성 중..." : parentId ? "답글 작성" : "댓글 작성"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-muted text-sm font-medium rounded-md hover:text-foreground transition-colors"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}

// 비밀번호 입력 모달
function PasswordModal({
  title,
  onConfirm,
  onCancel,
  isLoading,
  error,
}: {
  title: string;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 4) {
      onConfirm(password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
        <h3 className="text-lg font-medium text-foreground mb-4">
          {title}
        </h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={password.length < 4 || isLoading}
              className="flex-1 px-4 py-2 bg-accent text-white text-sm font-medium rounded-md hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "확인 중..." : "확인"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-muted text-sm font-medium rounded-md hover:text-foreground transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 댓글 아이템
function CommentItem({
  comment,
  postSlug,
  onUpdate,
  depth = 0,
}: {
  comment: Comment;
  postSlug: string;
  onUpdate: () => void;
  depth?: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editPassword, setEditPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const formattedDate = new Date(comment.createdAt).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEditClick = () => {
    setShowEditPasswordModal(true);
    setActionError(null);
  };

  const handleEditPasswordConfirm = (password: string) => {
    setEditPassword(password);
    setShowEditPasswordModal(false);
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    if (!editContent.trim() || !editPassword) return;

    try {
      setIsProcessing(true);
      setActionError(null);

      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          commentId: comment.id,
          content: editContent.trim(),
          password: editPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update comment");
      }

      setIsEditing(false);
      setEditPassword("");
      onUpdate();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "댓글 수정에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setActionError(null);
  };

  const handleDeleteConfirm = async (password: string) => {
    try {
      setIsProcessing(true);
      setActionError(null);

      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          commentId: comment.id,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete comment");
      }

      setShowDeleteModal(false);
      onUpdate();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={depth > 0 ? "ml-6 pl-4 border-l-2 border-border" : ""}>
      <div className="py-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-foreground text-sm">
            {comment.author}
          </span>
          <span className="text-xs text-muted">
            {formattedDate}
          </span>
          {comment.updatedAt && (
            <span className="text-xs text-muted">
              (수정됨)
            </span>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              maxLength={2000}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-card text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            />
            {actionError && <p className="text-sm text-red-500">{actionError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleEditSave}
                disabled={isProcessing}
                className="px-3 py-1 text-sm bg-accent text-white rounded-md hover:bg-accent-light disabled:opacity-50 transition-colors"
              >
                {isProcessing ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                  setEditPassword("");
                  setActionError(null);
                }}
                className="px-3 py-1 text-sm text-muted hover:text-foreground transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">
            {comment.content}
          </p>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-2 text-xs">
            {depth < 2 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-muted hover:text-accent transition-colors"
              >
                답글
              </button>
            )}
            <button
              onClick={handleEditClick}
              className="text-muted hover:text-accent transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-muted hover:text-red-500 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* Password Modal for Edit */}
      {showEditPasswordModal && (
        <PasswordModal
          title="댓글 수정"
          onConfirm={handleEditPasswordConfirm}
          onCancel={() => setShowEditPasswordModal(false)}
        />
      )}

      {/* Password Modal for Delete */}
      {showDeleteModal && (
        <PasswordModal
          title="댓글 삭제"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteModal(false);
            setActionError(null);
          }}
          isLoading={isProcessing}
          error={actionError}
        />
      )}

      {/* Reply Form */}
      {isReplying && (
        <div className="mt-3 ml-6 pl-4 border-l-2 border-border">
          <CommentForm
            postSlug={postSlug}
            parentId={comment.id}
            onSuccess={onUpdate}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postSlug={postSlug}
              onUpdate={onUpdate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
