# CLAUDE.md

이 문서는 이 리포지토리에서 작업할 때 너(Claude)가 참고해야 할 가이드다.  
프로젝트 구조, 기술 스택, 코딩 컨벤션, 수정 시 주의사항을 정리한다.

---

## 1. 프로젝트 개요

- 목적: **Next.js 기반 개발 블로그 + 향후 확장 가능한 모노레포 베이스**
- 특징:
  - `pnpm` + `pnpm-workspace.yaml` 을 사용하는 **모노레포**
  - 메인 앱은 `apps/blog` 아래에 있는 **Next.js App Router 기반 블로그**
  - 블로그 글은 `content/posts/*.mdx` 로 관리 (**MDX 기반**)
  - 향후 `packages/*` 에 공용 UI/설정 패키지를 추가할 계획

---

## 2. 주요 기술 스택

- **패키지 매니저**

  - pnpm (워크스페이스 사용)

- **프론트엔드**

  - Next.js (App Router, TypeScript)
  - React
  - MDX (`@next/mdx`, `@mdx-js/*`)
  - Tailwind CSS (기본 스타일링)

- **콘텐츠**
  - MDX 파일 + Frontmatter (`gray-matter`)

---

## 3. 디렉터리 구조(요약)

루트(모노레포 루트) 기준:

- `pnpm-workspace.yaml`

  - 워크스페이스 경로 정의
  - 보통:
    - `apps/*`
    - `packages/*`

- `package.json`

  - 루트 공용 스크립트
  - 예시:
    - `"dev": "pnpm --filter blog dev"`
    - `"build": "pnpm --filter blog build"`
    - `"lint": "pnpm --filter blog lint"`

- `apps/blog`

  - 블로그 Next.js 앱 루트
  - 주요 파일/폴더:
    - `next.config.mjs`
      - `@next/mdx` 기반 설정
      - `pageExtensions` 에 `mdx` 포함
    - `mdx-components.tsx`
      - App Router용 MDX 컴포넌트 매핑 함수
    - `app/`
      - `layout.tsx` : 루트 레이아웃
      - `page.tsx` : `/` (글 목록)
      - `posts/[slug]/page.tsx` : `/posts/[slug]` (글 상세)
    - `content/posts/`
      - `*.mdx` : 실제 블로그 포스트
      - 각 파일은 Frontmatter + MDX 본문
    - `lib/posts.ts`
      - 파일 시스템에서 포스트 목록/메타데이터를 읽는 유틸

- (향후) `packages/*`
  - 공용 UI 라이브러리, 공용 설정(tsconfig/eslint) 등을 위한 공간

---

## 4. 실행/빌드 관련 명령어

항상 **루트에서** 명령을 실행한다고 가정한다.

- 의존성 설치

  - `pnpm install`

- 개발 서버 (블로그 앱만)

  - `pnpm dev`
  - 내부적으로 `pnpm --filter blog dev`

- 빌드

  - `pnpm build`  
    → `apps/blog` 의 Next 빌드 실행

- 린트
  - `pnpm lint`  
    → 블로그 앱의 ESLint 실행 (존재할 경우)

---

## 5. 블로그 콘텐츠 구조 (MDX)

### 5.1. 포스트 파일 위치

- 경로: `apps/blog/content/posts/*.mdx`
- 파일명 = slug
  - 예: `first-post.mdx` → `/posts/first-post`

### 5.2. 포스트 파일 형식

- 각 파일은 **Frontmatter + MDX** 형식:

```mdx
---
title: "글 제목"
date: "2025-12-05"
tags: ["nextjs", "blog"]
---

# 본문 제목

여기에 MDX 본문을 작성한다.

- 목록
- 코드 블록
- **React 컴포넌트 사용도 가능**
```

- Frontmatter 필드:
  - `title: string`
  - `date: string` (ISO 또는 YYYY-MM-DD 문자열)
  - `tags: string[]` (선택)

### 5.3. 포스트 메타데이터 처리

- `apps/blog/lib/posts.ts` 에서 책임지는 일:

  - `getPostSlugs()`
    - `content/posts` 디렉터리에서 `.mdx` 파일 리스트를 읽어 slug 배열로 반환
  - `getPostMetadata(slug: string)`
    - 해당 `.mdx` 파일의 Frontmatter 만 파싱
    - 본문 HTML 변환은 여기서 하지 않음
  - `getAllPosts()`
    - 전체 포스트 메타데이터 수집 및 날짜 기준 정렬

- 실제 본문 렌더링은 **MDX 파일을 import해서 React 컴포넌트로 렌더**하는 쪽에서 처리함.

---

## 6. 라우팅 구조

### 6.1. `/` (홈, 글 목록)

- 파일: `apps/blog/app/page.tsx`
- 역할:
  - 서버 컴포넌트
  - `getAllPosts()`로 모든 포스트 메타데이터를 가져와 목록 렌더링
  - 각 글은 `/posts/[slug]` 링크로 연결

### 6.2. `/posts/[slug]` (글 상세)

- 파일: `apps/blog/app/posts/[slug]/page.tsx`
- 특징 (중요):

1. **Next.js 15 기준 `params` 가 Promise** 라는 점을 반영해야 함

   - 시그니처 예시:

     ```ts
     type Params = Promise<{ slug: string }>;

     export default async function PostPage({ params }: { params: Params }) {
       const { slug } = await params;
       // ...
     }
     ```

   - `generateMetadata` 도 동일하게 `await params` 후 사용

2. 정적 경로 생성

   ```ts
   export function generateStaticParams() {
     const slugs = getPostSlugs();
     return slugs.map((slug) => ({
       slug: slug.replace(/\.mdx$/, ""),
     }));
   }
   ```

3. MDX import 및 렌더

   ```ts
   const postModule = await import(`../../../content/posts/${slug}.mdx`);
   const MDXContent = postModule.default;

   return (
     <section className="prose prose-slate max-w-none dark:prose-invert">
       <MDXContent />
     </section>
   );
   ```

---

## 7. `mdx-components.tsx` 역할

- 파일: `apps/blog/mdx-components.tsx`
- 기본 형태:

```ts
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // 필요 시 여기에 커스텀 컴포넌트 매핑 추가
    // 예: code, pre, h1 등을 커스텀 UI로 연결
  };
}
```

- App Router + `@next/mdx` 사용 시 필수
- 나중에 `code` 블록, `a` 태그, `h1~h6` 등을 공통 UI로 치환할 때 이 파일을 확장하면 된다.

---

## 8. 코딩 컨벤션 / 요청사항

### 8.1. 언어 및 스타일

- 기본 언어: **TypeScript** 유지
- 가능하면 `any` 지양, 타입 명시
- 불필요하게 JS로 다운그레이드하지 말 것

### 8.2. Next.js / React 관련

- App Router 전제:
  - `app/` 기반 구조 사용
  - `pages/` 기반 코드는 추가하지 말 것
- 서버/클라이언트 컴포넌트 구분:

  - 디폴트는 **서버 컴포넌트**
  - 반드시 클라이언트 기능이 필요할 때만 상단에 `"use client";` 추가
  - MDX 파일에는 기본적으로 `"use client";` 를 사용하지 않는 방향을 선호  
    (정말 클라이언트 기능이 필요할 때만 고민해서 추가)

- Next 15 `params`/`searchParams`:
  - 서버 컴포넌트에서 `params`, `searchParams` 는 Promise 로 취급
  - 항상 `const { slug } = await params;` 형태로 사용

### 8.3. 스타일링

- Tailwind CSS 사용
  - 클래스 네이밍은 의미 위주 (`flex`, `gap-4`, `text-slate-600` 등)
  - 가능한 한 inline style 대신 Tailwind 클래스 사용
- Markdown/MDX 본문:
  - `prose` / `prose-slate` / `dark:prose-invert` 등을 사용해 Typography 정리

---

## 9. Claude에게 원하는 작업 방식

1. **컨텍스트 우선 파악**

   - 파일 수정 요청이 들어오면:
     - 현재 디렉터리 구조와 관련 파일(`app/*`, `lib/posts.ts`, `content/posts/*`)을 먼저 이해한 뒤 제안할 것
   - 이미 존재하는 코드 스타일/패턴을 존중하고, 가능한 한 그 스타일을 유지

2. **실제 동작 여부 고려**

   - Next.js App Router / MDX / pnpm 워크스페이스와의 호환성을 항상 고려
   - `params` Promise 처리, MDX import 방식, `mdx-components.tsx` 사용 여부 등 깨지지 않도록 주의

3. **단계적 변경 제안**

   - 큰 리팩터링이 필요할 때는:
     - "현재 상태" → "목표 상태" → "단계별 변경" 을 문서화해서 설명
   - 한 번에 너무 많은 파일을 뒤엎기보다는, 논리적 단계를 나누어 제안

4. **설명은 한국어로, 코드/컴멘트는 상황에 맞게**
   - 해설/가이드는 한국어
   - 코드 주석은 한국어/영어 중 상황에 맞게 자연스럽게 사용

5. **학습 중심의 커리큘럼 제공**

   - 이 프로젝트는 **Next.js와 풀스택 개발 학습**을 목적으로 함
   - 작업 제안 시 다음을 포함할 것:
     - **학습 포인트**: 해당 작업에서 배울 수 있는 핵심 개념
     - **난이도 표시**: ⭐(입문) ~ ⭐⭐⭐⭐(고급)
     - **선행 지식**: 필요한 경우 먼저 알아야 할 내용 명시
   - 단계별 진행:
     - Phase 1 → 2 → 3 순서로 점진적 난이도 상승
     - 각 단계 완료 후 다음 단계로 자연스럽게 연결
   - 코드 작성 시:
     - "왜 이렇게 하는지" 설명 포함
     - 관련 공식 문서나 참고 자료 링크 제공
     - 대안적 접근법이 있다면 함께 언급

---

## 10. 앞으로 확장 가능성 (참고용)

- `packages/ui`
  - 공통 UI 컴포넌트 (Button, Layout, Card 등)
  - 블로그 및 향후 다른 앱에서 재사용
- `packages/config`
  - 공통 `tsconfig`, `eslint` 설정
- 추가 앱
  - `apps/admin`, `apps/docs` 등
  - 같은 MDX/Next 기반으로 확장 가능

이 문서를 기반으로,  
코드를 수정하거나 기능을 추가할 때 **현재 설계 방향(Next App Router + MDX + pnpm 모노레포)** 을 유지하면서 제안하고 변경해주면 된다.
