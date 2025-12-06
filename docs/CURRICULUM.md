# Next.js 풀스택 학습 커리큘럼

이 문서는 블로그 프로젝트를 통해 Next.js와 풀스택 개발을 단계적으로 학습하기 위한 커리큘럼입니다.

---

## 학습 목표

- Next.js App Router 완전 이해
- React 서버/클라이언트 컴포넌트 구분
- 풀스택 웹 애플리케이션 개발 역량
- 모노레포 구조 설계 및 운영

---

## 난이도 표시

| 표시     | 난이도 | 설명                 |
| -------- | ------ | -------------------- |
| ⭐       | 입문   | 기본 문법, 설정 수준 |
| ⭐⭐     | 초급   | 핵심 개념 이해 필요  |
| ⭐⭐⭐   | 중급   | 여러 개념 조합 필요  |
| ⭐⭐⭐⭐ | 고급   | 아키텍처 설계 수준   |

---

## Phase 1: Next.js 기초 (프로젝트 안정화)

> **목표**: 현재 블로그의 기본 구조를 안정화하고 Next.js 최적화 기능 학습

| 순서 | 작업                         | 학습 포인트                             | 난이도 | 상태 |
| ---- | ---------------------------- | --------------------------------------- | ------ | ---- |
| 1-1  | `lib/posts.ts` 에러 처리     | TypeScript 방어적 프로그래밍, try-catch | ⭐     | ✅   |
| 1-2  | 레이아웃 메타데이터 수정     | Next.js Metadata API                    | ⭐     | ✅   |
| 1-3  | Tailwind `prose` 스타일 적용 | Typography 플러그인, CSS                | ⭐     | ✅   |
| 1-4  | `next/image` 최적화 적용     | 이미지 최적화, lazy loading             | ⭐     | ✅   |
| 1-5  | `next/font` 적용             | 폰트 최적화, 서브셋팅                   | ⭐     | ✅   |

### 참고 자료

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

---

## Phase 2: 라우팅과 렌더링 심화

> **목표**: Next.js App Router의 핵심 기능과 렌더링 전략 이해

| 순서 | 작업                                       | 학습 포인트                       | 난이도 | 상태 |
| ---- | ------------------------------------------ | --------------------------------- | ------ | ---- |
| 2-1  | 태그별 필터 페이지 `/tags/[tag]`           | 동적 라우팅, generateStaticParams | ⭐⭐   | ✅   |
| 2-2  | 로딩 UI (`loading.tsx`)                    | Suspense, 스트리밍                | ⭐⭐   | ✅   |
| 2-3  | 에러 페이지 (`error.tsx`, `not-found.tsx`) | Error Boundary, 에러 복구         | ⭐⭐   | ✅   |
| 2-4  | 정적 생성 vs 동적 렌더링 이해              | SSG, SSR, ISR 차이점              | ⭐⭐   | ✅   |

### 핵심 개념

- **SSG (Static Site Generation)**: 빌드 시 HTML 생성
- **SSR (Server-Side Rendering)**: 요청 시 HTML 생성
- **ISR (Incremental Static Regeneration)**: 정적 페이지 점진적 갱신

### 참고 자료

- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Loading UI and Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Rendering Strategies](https://nextjs.org/docs/app/building-your-application/rendering)

---

## Phase 3: 데이터와 상호작용

> **목표**: API 개발과 서버/클라이언트 데이터 흐름 이해

| 순서 | 작업                          | 학습 포인트                    | 난이도 | 상태 |
| ---- | ----------------------------- | ------------------------------ | ------ | ---- |
| 3-1  | API Route 추가 (`/api/posts`) | Route Handlers, HTTP 메서드    | ⭐⭐   | ✅   |
| 3-2  | 클라이언트 데이터 페칭        | fetch API, SWR vs React Query  | ⭐⭐   | ✅   |
| 3-3  | Server Actions 폼 처리        | 서버 액션, 폼 유효성 검사      | ⭐⭐⭐ | ✅   |
| 3-4  | 검색 기능 (searchParams 활용) | URL 상태 관리, useSearchParams | ⭐⭐⭐ | ✅   |

### 핵심 개념

- **Route Handlers**: `/app/api/**/route.ts`에서 API 엔드포인트 정의
- **Server Actions**: 서버에서 실행되는 함수, 폼 제출에 활용
- **searchParams**: URL 쿼리 파라미터를 통한 상태 관리

### 참고 자료

- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)

---

## Phase 4: UI/UX 고도화

> **목표**: 사용자 경험 향상과 MDX 확장 기능 구현

| 순서 | 작업                | 학습 포인트                             | 난이도 | 상태 |
| ---- | ------------------- | --------------------------------------- | ------ | ---- |
| 4-1  | 다크모드 구현       | CSS 변수, 클라이언트 상태, localStorage | ⭐⭐⭐ | ✅   |
| 4-2  | 코드 하이라이트     | rehype 플러그인, Shiki/Prism            | ⭐⭐   | ✅   |
| 4-3  | 목차(TOC) 자동 생성 | remark 플러그인, 앵커 링크              | ⭐⭐⭐ | ✅   |
| 4-4  | 애니메이션 전환     | Framer Motion 또는 CSS transitions      | ⭐⭐⭐ | ✅   |

### 핵심 개념

- **rehype**: HTML AST 변환 플러그인 (코드 하이라이트 등)
- **remark**: Markdown AST 변환 플러그인 (목차 생성 등)
- **클라이언트 상태**: `"use client"` 컴포넌트에서의 상태 관리

### 참고 자료

- [MDX Plugins](https://mdxjs.com/docs/extending-mdx/)
- [Shiki (Code Highlighter)](https://shiki.style/)

---

## Phase 5: 풀스택 확장 (데이터베이스 연동)

> **목표**: 데이터베이스 연동과 인증 시스템 구현

| 순서 | 작업                            | 학습 포인트                         | 난이도   | 상태 |
| ---- | ------------------------------- | ----------------------------------- | -------- | ---- |
| 5-1  | Prisma + SQLite/PostgreSQL 설정 | ORM, 스키마 정의, 마이그레이션      | ⭐⭐⭐   | ⬜   |
| 5-2  | 조회수 기능                     | DB CRUD, API 연동                   | ⭐⭐⭐   | ⬜   |
| 5-3  | 댓글 시스템                     | 관계형 데이터, 폼 처리, 실시간 갱신 | ⭐⭐⭐⭐ | ⬜   |
| 5-4  | 인증 (NextAuth.js/Auth.js)      | OAuth, 세션, 미들웨어               | ⭐⭐⭐⭐ | ⬜   |

### 핵심 개념

- **Prisma**: Node.js/TypeScript ORM, 타입 안전한 DB 쿼리
- **NextAuth.js**: Next.js 전용 인증 라이브러리
- **Middleware**: 요청 처리 전 실행되는 코드 (인증 체크 등)

### 참고 자료

- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)

---

## Phase 6: 모노레포 확장

> **목표**: 공용 패키지 분리와 멀티 앱 구조 설계

| 순서 | 작업                          | 학습 포인트                 | 난이도 | 상태 |
| ---- | ----------------------------- | --------------------------- | ------ | ---- |
| 6-1  | `packages/ui` 생성            | 패키지 분리, 의존성 관리    | ⭐⭐⭐ | ⬜   |
| 6-2  | 공통 컴포넌트 추출            | 재사용 가능한 컴포넌트 설계 | ⭐⭐   | ⬜   |
| 6-3  | `packages/config` 공유 설정   | tsconfig, eslint 설정 공유  | ⭐⭐⭐ | ⬜   |
| 6-4  | 추가 앱 구성 (`apps/docs` 등) | 멀티 앱 아키텍처            | ⭐⭐⭐ | ⬜   |

### 핵심 개념

- **pnpm workspace**: 모노레포 패키지 관리
- **내부 패키지**: `"@repo/ui": "workspace:*"` 형태로 참조
- **설정 공유**: 공통 tsconfig, eslint를 extends로 재사용

### 참고 자료

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)

---

## 진행 상황 추적

### 현재 단계

- **Phase**: 6 완료 (배포 및 브랜딩)
- **다음 단계**: Phase 5 (풀스택 확장) 또는 Phase 6 (모노레포 확장)

### 완료 기록

| 날짜       | Phase | 작업                      | 비고                    |
| ---------- | ----- | ------------------------- | ----------------------- |
| 2025-12-05 | 0     | 프로젝트 초기 설정        | 모노레포, MDX 기본 구조 |
| 2025-12-05 | 0     | `mdx-components.tsx` 생성 | createContext 에러 해결 |
| 2025-12-05 | 1     | Phase 1 전체 완료         | 기초 안정화             |
| 2025-12-06 | 2     | Phase 2 전체 완료         | 라우팅/렌더링           |
| 2025-12-06 | 3     | Phase 3 전체 완료         | API/데이터              |
| 2025-12-06 | 4     | Phase 4 전체 완료         | UI/UX 고도화            |
| 2025-12-06 | 5     | UI/UX 모던화              | 컬러, 레이아웃, 버그 수정|
| 2025-12-06 | 6     | 배포 및 브랜딩            | Vercel 배포, Dev.Sol    |

---

## 학습 팁

1. **한 번에 하나씩**: 각 작업을 완료한 후 다음으로 넘어갈 것
2. **왜?를 먼저**: 코드 작성 전 "왜 이렇게 하는지" 이해하기
3. **공식 문서 활용**: 각 Phase별 참고 자료 링크 확인
4. **실험하기**: 배운 내용을 변형해서 직접 테스트
5. **커밋 자주**: 작은 단위로 커밋하여 진행 기록 남기기

---

## 참고 링크

### 공식 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Learn Course](https://nextjs.org/learn)
- [React Documentation](https://react.dev/)

### 추천 학습 자료

- [Next.js App Router 가이드 (Stackademic)](https://blog.stackademic.com/comprehensive-guide-to-next-js-15-app-router-64e967d700f8)
- [Next.js Learning Path 2025 (DEV Community)](https://dev.to/code_2/nextjs-learning-path-2025-the-ultimate-roadmap-to-mastering-modern-web-development-34hl)
