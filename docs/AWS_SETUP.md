# AWS DynamoDB 댓글 시스템 설정 가이드

이 문서는 블로그 댓글 시스템을 위한 AWS DynamoDB 설정 방법을 설명합니다.

## 1. DynamoDB 테이블 생성

### AWS Console에서 생성

1. AWS Console > DynamoDB > 테이블 생성
2. 테이블 설정:
   - **테이블 이름**: `blog-comments`
   - **파티션 키**: `postSlug` (문자열)
   - **정렬 키**: `id` (문자열)
3. 설정:
   - 기본 설정 사용 (온디맨드 용량 모드 권장)

### AWS CLI로 생성

```bash
aws dynamodb create-table \
  --table-name blog-comments \
  --attribute-definitions \
    AttributeName=postSlug,AttributeType=S \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=postSlug,KeyType=HASH \
    AttributeName=id,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-2
```

## 2. IAM 사용자 생성

1. AWS Console > IAM > 사용자 > 사용자 생성
2. 사용자 이름: `blog-dynamodb-user`
3. 권한 정책 연결 (인라인 정책):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-2:YOUR_ACCOUNT_ID:table/blog-comments"
    }
  ]
}
```

4. 액세스 키 생성:
   - 보안 자격 증명 탭 > 액세스 키 생성
   - Access Key ID와 Secret Access Key 저장

## 3. 환경 변수 설정

`.env.local` 파일 생성:

```env
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
DYNAMODB_COMMENTS_TABLE=blog-comments
```

## 4. 테이블 스키마

### Comment 객체 구조

| 필드 | 타입 | 설명 |
|------|------|------|
| `postSlug` | String (PK) | 포스트 slug |
| `id` | String (SK) | 댓글 고유 ID |
| `author` | String | 작성자 이름 |
| `content` | String | 댓글 내용 |
| `createdAt` | String (ISO8601) | 생성 시간 |
| `updatedAt` | String (ISO8601) | 수정 시간 |
| `parentId` | String (Optional) | 부모 댓글 ID (대댓글용) |

## 5. API 엔드포인트

### GET /api/comments
포스트의 댓글 목록 조회

```
GET /api/comments?postSlug=my-post-slug
```

### POST /api/comments
새 댓글 생성

```json
{
  "postSlug": "my-post-slug",
  "author": "홍길동",
  "content": "좋은 글이네요!",
  "parentId": "optional-parent-id"
}
```

### PUT /api/comments
댓글 수정

```json
{
  "postSlug": "my-post-slug",
  "commentId": "comment-id",
  "content": "수정된 내용"
}
```

### DELETE /api/comments
댓글 삭제

```
DELETE /api/comments?postSlug=my-post-slug&commentId=comment-id
```

## 6. 비용 예측

DynamoDB 온디맨드 모드 기준:
- 쓰기: $1.25 / 백만 요청
- 읽기: $0.25 / 백만 요청
- 저장: $0.25 / GB / 월

소규모 블로그의 경우 월 $1 미만 예상

## 7. 보안 고려사항

- [ ] IAM 정책에 최소 권한 원칙 적용
- [ ] 환경 변수를 절대 git에 커밋하지 않기
- [ ] Vercel 환경 변수에 안전하게 저장
- [ ] 필요시 Rate Limiting 추가 구현
- [ ] 스팸 방지를 위한 CAPTCHA 고려
