import {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { dynamoDb, COMMENTS_TABLE } from "./dynamodb";

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string; // 대댓글용
}

export interface CreateCommentInput {
  postSlug: string;
  author: string;
  content: string;
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
export async function createComment(input: CreateCommentInput): Promise<Comment> {
  const now = new Date().toISOString();
  const comment: Comment = {
    id: generateCommentId(),
    postSlug: input.postSlug,
    author: input.author,
    content: input.content,
    createdAt: now,
    parentId: input.parentId,
  };

  await dynamoDb.send(
    new PutCommand({
      TableName: COMMENTS_TABLE,
      Item: comment,
    })
  );

  return comment;
}

/**
 * 포스트의 모든 댓글 조회
 */
export async function getCommentsByPost(postSlug: string): Promise<Comment[]> {
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

  return (result.Items as Comment[]) || [];
}

/**
 * 댓글 삭제
 */
export async function deleteComment(postSlug: string, commentId: string): Promise<void> {
  await dynamoDb.send(
    new DeleteCommand({
      TableName: COMMENTS_TABLE,
      Key: {
        postSlug,
        id: commentId,
      },
    })
  );
}

/**
 * 댓글 수정
 */
export async function updateComment(
  postSlug: string,
  commentId: string,
  content: string
): Promise<Comment | null> {
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

  return result.Attributes as Comment | null;
}

/**
 * 댓글을 트리 구조로 변환 (대댓글 포함)
 */
export function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment & { replies?: Comment[] }>();
  const rootComments: (Comment & { replies?: Comment[] })[] = [];

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
