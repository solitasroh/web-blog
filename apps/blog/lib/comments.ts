import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDb, COMMENTS_TABLE } from "./dynamodb";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string; // 대댓글용
  passwordHash?: string; // 비밀번호 해시 (응답에서는 제외)
}

// API 응답용 (비밀번호 해시 제외)
export type CommentResponse = Omit<Comment, "passwordHash">;

export interface CreateCommentInput {
  postSlug: string;
  author: string;
  content: string;
  password: string; // 비밀번호 추가
  parentId?: string;
}

/**
 * 댓글 ID 생성 (timestamp + random)
 */
function generateCommentId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/**
 * 댓글 생성
 */
export async function createComment(input: CreateCommentInput): Promise<CommentResponse> {
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const comment: Comment = {
    id: generateCommentId(),
    postSlug: input.postSlug,
    author: input.author,
    content: input.content,
    createdAt: now,
    parentId: input.parentId,
    passwordHash,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: COMMENTS_TABLE,
      Item: comment,
    })
  );

  // 응답에서 passwordHash 제외
  const { passwordHash: _, ...commentResponse } = comment;
  return commentResponse;
}

/**
 * 포스트의 모든 댓글 조회 (비밀번호 해시 제외)
 */
export async function getCommentsByPost(postSlug: string): Promise<CommentResponse[]> {
  const result = await dynamoDb.send(
    new QueryCommand({
      TableName: COMMENTS_TABLE,
      KeyConditionExpression: "postSlug = :postSlug",
      ExpressionAttributeValues: {
        ":postSlug": postSlug,
      },
      ScanIndexForward: true, // 오래된 순으로 정렬
    })
  );

  // 응답에서 passwordHash 제외
  return ((result.Items as Comment[]) || []).map(({ passwordHash, ...rest }) => rest);
}

/**
 * 댓글 조회 (내부용 - 비밀번호 해시 포함)
 */
async function getComment(postSlug: string, commentId: string): Promise<Comment | null> {
  const result = await dynamoDb.send(
    new GetCommand({
      TableName: COMMENTS_TABLE,
      Key: {
        postSlug,
        id: commentId,
      },
    })
  );

  return (result.Item as Comment) || null;
}

/**
 * 비밀번호 검증
 */
export async function verifyCommentPassword(
  postSlug: string,
  commentId: string,
  password: string
): Promise<boolean> {
  const comment = await getComment(postSlug, commentId);
  if (!comment || !comment.passwordHash) {
    return false;
  }
  return bcrypt.compare(password, comment.passwordHash);
}

/**
 * 댓글 삭제 (비밀번호 검증 포함)
 */
export async function deleteComment(
  postSlug: string,
  commentId: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  // 비밀번호 검증
  const isValid = await verifyCommentPassword(postSlug, commentId, password);
  if (!isValid) {
    return { success: false, error: "비밀번호가 일치하지 않습니다." };
  }

  await dynamoDb.send(
    new DeleteCommand({
      TableName: COMMENTS_TABLE,
      Key: {
        postSlug,
        id: commentId,
      },
    })
  );

  return { success: true };
}

/**
 * 댓글 수정 (비밀번호 검증 포함)
 */
export async function updateComment(
  postSlug: string,
  commentId: string,
  content: string,
  password: string
): Promise<{ success: boolean; comment?: CommentResponse; error?: string }> {
  // 비밀번호 검증
  const isValid = await verifyCommentPassword(postSlug, commentId, password);
  if (!isValid) {
    return { success: false, error: "비밀번호가 일치하지 않습니다." };
  }

  const now = new Date().toISOString();

  const result = await dynamoDb.send(
    new UpdateCommand({
      TableName: COMMENTS_TABLE,
      Key: {
        postSlug,
        id: commentId,
      },
      UpdateExpression: "SET content = :content, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":content": content,
        ":updatedAt": now,
      },
      ReturnValues: "ALL_NEW",
    })
  );

  if (!result.Attributes) {
    return { success: false, error: "댓글을 찾을 수 없습니다." };
  }

  // 응답에서 passwordHash 제외
  const { passwordHash, ...commentResponse } = result.Attributes as Comment;
  return { success: true, comment: commentResponse };
}

/**
 * 댓글을 트리 구조로 변환 (대댓글 포함)
 */
export function buildCommentTree(comments: CommentResponse[]): (CommentResponse & { replies?: CommentResponse[] })[] {
  const commentMap = new Map<string, CommentResponse & { replies?: CommentResponse[] }>();
  const rootComments: (CommentResponse & { replies?: CommentResponse[] })[] = [];

  // 먼저 모든 댓글을 맵에 저장
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 대댓글을 부모에 연결
  comments.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(commentWithReplies);
      } else {
        // 부모가 없으면 루트로 처리
        rootComments.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  });

  return rootComments;
}
