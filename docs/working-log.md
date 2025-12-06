# 작업 로그

## 프로젝트 정보
- **프로젝트명**: Next.js 개발 블로그
- **시작일**: 2025-12-05
- **기술 스택**: Next.js 16, React 19, TypeScript, Tailwind CSS v4, MDX, pnpm 모노레포

---

## Phase 1: Next.js 기초 (프로젝트 안정화)

### 1-1. `lib/posts.ts` 에러 처리 ✅
**완료일**: 2025-12-05

**작업 내용**:
- `getPostSlugs()`: 디렉토리 존재 확인 추가
- `getPostMetadata()`: 파일 존재 확인 → null 반환
- `getAllPosts()`: null 필터링 + 타입 가드 적용
- frontmatter 기본값 처리 (`title`, `date`, `tags`)

**학습 포인트**: TypeScript 방어적 프로그래밍, try-catch, 타입 가드

---

### 1-2. 레이아웃 메타데이터 수정 ✅
**완료일**: 2025-12-05

**작업 내용**:
- `title.default`: "Solitas's Blog"
- `title.template`: "%s | Solitas's Blog"
- `description`: 블로그 설명 추가
- `<html lang="ko">` 변경

**학습 포인트**: Next.js Metadata API

---

### 1-3. Tailwind `prose` 스타일 적용 ✅
**완료일**: 2025-12-05

**작업 내용**:
- `@tailwindcss/typography` 플러그인 설치
- `globals.css`에 `@plugin "@tailwindcss/typography"` 추가
- MDX 본문에 `prose dark:prose-invert max-w-none` 적용
- VS Code 설정 (`.vscode/settings.json`) 추가

**학습 포인트**: Tailwind CSS Typography 플러그인, prose 클래스

---

### 1-4. `next/image` 최적화 적용 ✅
**완료일**: 2025-12-05

**작업 내용**:
- 블로그 로고 생성 (`public/tech_blog_logo.svg`)
- 홈페이지 헤더에 `next/image` 적용
- `mdx-components.tsx`에서 `img` → `Image` 자동 변환
- MDX 포스트에 테스트 이미지 추가

**학습 포인트**: next/image, 이미지 최적화, lazy loading, priority

---

### 1-5. `next/font` 적용 ✅
**완료일**: 2025-12-05

**작업 내용**:
- Geist (영문), Geist Mono (코드) 유지
- Pretendard Variable 폰트 추가 (로컬 폰트)
- `globals.css`에서 `--font-pretendard` 우선 적용

**학습 포인트**: next/font/google, next/font/local, Variable Font, FOUT 방지

---

## Phase 1 완료 요약

| 작업 | 상태 | 주요 파일 |
|------|------|----------|
| 1-1 에러 처리 | ✅ | `lib/posts.ts` |
| 1-2 메타데이터 | ✅ | `app/layout.tsx` |
| 1-3 Typography | ✅ | `globals.css`, `posts/[slug]/page.tsx` |
| 1-4 이미지 최적화 | ✅ | `mdx-components.tsx`, `app/page.tsx` |
| 1-5 폰트 최적화 | ✅ | `app/layout.tsx`, `globals.css` |

---

## Phase 2: 라우팅과 렌더링 심화

### 2-1. 태그별 필터 페이지 `/tags/[tag]` ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/tags/[tag]/page.tsx` 생성
- `lib/posts.ts`에 `getAllTags()`, `getPostsByTag()` 함수 추가
- `generateStaticParams`로 정적 경로 생성
- `generateMetadata`로 SEO 메타데이터 설정

**학습 포인트**: 동적 라우팅, `generateStaticParams`, Next.js 15 `params` Promise 처리

---

### 2-2. 로딩 UI (`loading.tsx`) ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/loading.tsx` (전역)
- `app/posts/loading.tsx` (포스트 목록)
- `app/posts/[slug]/loading.tsx` (포스트 상세)

**학습 포인트**: React Suspense, 스트리밍 렌더링, 로딩 경계(fallback UI)

---

### 2-3. 에러 페이지 (`error.tsx`, `not-found.tsx`) ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/not-found.tsx` - 전역 404 페이지
- `app/error.tsx` - 전역 에러 페이지 (`"use client"` 필수)
- `posts/[slug]/page.tsx`에 `notFound()` 함수 적용

**학습 포인트**: Error Boundary, `notFound()` 함수, `reset()` 에러 복구

---

### 2-4. 정적 생성 vs 동적 렌더링 이해 ✅
**완료일**: 2025-12-06

**학습 내용**:
- **SSG (Static Site Generation)**: 빌드 시 HTML 생성, 가장 빠름
- **SSR (Server-Side Rendering)**: 요청 시 HTML 생성, 항상 최신 데이터
- **ISR (Incremental Static Regeneration)**: SSG + 주기적 재검증
- 현재 블로그는 SSG 방식, Vercel 자동 배포 권장

**학습 포인트**: 렌더링 전략 선택 기준, `revalidate` 옵션, CI/CD 자동화

---

## Phase 2 완료 요약

| 작업 | 상태 | 주요 파일 |
|------|------|----------|
| 2-1 태그 페이지 | ✅ | `app/tags/[tag]/page.tsx`, `lib/posts.ts` |
| 2-2 로딩 UI | ✅ | `app/loading.tsx`, `app/posts/loading.tsx` |
| 2-3 에러 페이지 | ✅ | `app/error.tsx`, `app/not-found.tsx` |
| 2-4 렌더링 이해 | ✅ | 개념 학습 |

---

## 다음 단계: Phase 3 - 데이터와 상호작용

### 3-1. API Route 추가 (`/api/posts`) (⭐⭐)
- Route Handlers
- HTTP 메서드

### 3-2. 클라이언트 데이터 페칭 (⭐⭐)
- fetch API
- SWR vs React Query

### 3-3. Server Actions 폼 처리 (⭐⭐⭐)
- 서버 액션
- 폼 유효성 검사

### 3-4. 검색 기능 (searchParams 활용) (⭐⭐⭐)
- URL 상태 관리
- useSearchParams

---

## 기타 작업

### Git 설정 변경
- remote URL: HTTPS → SSH 변경
- `git@github.com:solitasroh/web-blog.git`

---

## 참고 문서
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 규약
- [CURRICULUM.md](./CURRICULUM.md) - 학습 커리큘럼
