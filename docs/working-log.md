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

## Phase 3: 데이터와 상호작용

### 3-1. API Route 추가 (`/api/posts`) ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/api/posts/route.ts` 생성
- GET 메서드로 전체 포스트 목록 JSON 반환
- Route Handlers 패턴 학습

**학습 포인트**: Route Handlers, HTTP 메서드별 함수 export, `Response.json()`

---

### 3-2. 클라이언트 데이터 페칭 ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/components/ClientPostList.tsx` 생성
- `useState`, `useEffect`로 API 호출 및 상태 관리
- 로딩/에러/성공 상태 처리

**학습 포인트**: `useState`, `useEffect`, fetch API, 클라이언트 컴포넌트 (`"use client"`)

---

### 3-3. Server Actions 폼 처리 ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/actions/subscribe.ts` - 서버 액션 (`"use server"`)
- `app/subscribe/page.tsx` - 구독 폼 페이지
- `useActionState` 훅으로 폼 상태 관리
- 이메일 유효성 검사

**학습 포인트**: Server Actions, `"use server"` 지시어, `useActionState(action, initialState)` 시그니처

**주의사항**: `useActionState`의 action 함수는 `(prevState, formData)` 형태여야 함

---

### 3-4. 검색 기능 (searchParams 활용) ✅
**완료일**: 2025-12-06

**작업 내용**:
- `app/search/page.tsx` 생성
- URL 쿼리 파라미터(`?q=`)로 검색어 관리
- 서버 컴포넌트에서 `searchParams` Promise 처리
- 대소문자 구분 없는 제목 검색

**학습 포인트**: `searchParams` (Next.js 15 Promise 타입), URL 상태 관리, 서버 사이드 필터링

---

## Phase 3 완료 요약

| 작업 | 상태 | 주요 파일 |
|------|------|----------|
| 3-1 API Route | ✅ | `app/api/posts/route.ts` |
| 3-2 클라이언트 페칭 | ✅ | `app/components/ClientPostList.tsx` |
| 3-3 Server Actions | ✅ | `app/actions/subscribe.ts`, `app/subscribe/page.tsx` |
| 3-4 검색 기능 | ✅ | `app/search/page.tsx` |

---

## Phase 4: UI/UX 고도화

### 4-1. 다크모드 구현 ✅
**완료일**: 2025-12-06

**작업 내용**:
- `ThemeToggle.tsx` 클라이언트 컴포넌트 생성
- `globals.css`에서 `.dark` 클래스 기반 CSS 변수 전환
- `localStorage`로 테마 설정 저장
- 시스템 설정(`prefers-color-scheme`) 연동
- Hydration mismatch 방지 (`mounted` 상태)
- 전체 페이지에 `dark:` 스타일 적용

**수정 파일**:
- `app/components/ThemeToggle.tsx` (신규)
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/posts/[slug]/page.tsx`
- `app/tags/[tag]/page.tsx`
- `app/search/page.tsx`
- `app/subscribe/page.tsx`

**학습 포인트**:
- Tailwind `@custom-variant dark` (v4 문법)
- `useState`, `useEffect` 조합
- `document.documentElement.classList.toggle()`
- `localStorage` 브라우저 API
- `window.matchMedia()` 시스템 테마 감지

---

### 4-2. 코드 하이라이팅 ✅
**완료일**: 2025-12-06

**작업 내용**:
- `rehype-pretty-code` + `shiki` 패키지 설치
- `next.config.ts`에 rehype 플러그인 설정
- 플러그인을 문자열로 지정 (Turbopack 호환)
- `github-dark` 테마 적용

**수정 파일**:
- `next.config.ts`
- `package.json`
- `globals.css` (코드 블록 스타일)

**학습 포인트**:
- Turbopack 제약: 플러그인은 함수가 아닌 **문자열**로 전달해야 직렬화 가능
- `rehype` 플러그인: MDX 처리 파이프라인에서 HTML 변환 후 동작
- Shiki: 서버 사이드 코드 하이라이팅 (번들 크기 영향 없음)

**트러블슈팅**:
- `"does not have serializable options"` 에러 → 플러그인을 문자열로 지정하여 해결

---

### 4-3. 목차(TOC) 자동 생성 ✅
**완료일**: 2025-12-06

**작업 내용**:
- `rehype-slug` 플러그인 설치 (헤딩에 id 자동 추가)
- `TableOfContents.tsx` 클라이언트 컴포넌트 생성
- 사이드바 배치 (데스크톱 lg 이상)
- `IntersectionObserver`로 스크롤 연동 하이라이트

**수정 파일**:
- `next.config.ts` (rehype-slug 추가)
- `app/components/TableOfContents.tsx` (신규)
- `app/posts/[slug]/page.tsx` (사이드바 레이아웃)

**학습 포인트**:
- `rehype-slug`: MDX 헤딩에 `id` 속성 자동 생성
- `IntersectionObserver`: 뷰포트 내 요소 감지 API
- `rootMargin`: 감지 영역 커스터마이징
- cleanup 함수: `useEffect` 반환값으로 메모리 누수 방지

---

### 4-4. 애니메이션/트랜지션 ✅
**완료일**: 2025-12-06

**작업 내용**:
- 페이지 진입 애니메이션 (`animate-fade-in-up`, `delay-*`)
- 마이크로 인터랙션 (`card-hover`, `btn-press`, `tag-hover`)
- 스크롤 기반 애니메이션 (`ScrollReveal` 컴포넌트)

**수정/생성 파일**:
- `globals.css` (애니메이션 클래스)
- `app/components/ScrollReveal.tsx` (신규)
- `app/components/PostList.tsx` (신규)
- `app/components/ThemeToggle.tsx` (btn-press 적용)
- `app/page.tsx` (PostList 컴포넌트로 교체)
- `app/posts/[slug]/page.tsx` (태그 스타일 개선)

**학습 포인트**:
- CSS `@keyframes`, `animation`, `transition`
- `IntersectionObserver`로 스크롤 감지
- 서버/클라이언트 컴포넌트 분리 (애니메이션은 클라이언트)

---

## Phase 4 완료 요약

| 작업 | 상태 | 주요 파일 |
|------|------|----------|
| 4-1 다크모드 | ✅ | `ThemeToggle.tsx`, `globals.css` |
| 4-2 코드 하이라이팅 | ✅ | `next.config.ts`, `rehype-pretty-code` |
| 4-3 목차(TOC) | ✅ | `TableOfContents.tsx`, `rehype-slug` |
| 4-4 애니메이션 | ✅ | `ScrollReveal.tsx`, `PostList.tsx`, `globals.css` |

---

---

## Phase 5: UI/UX 모던화

### 5-1. 컬러 팔레트 변경 ✅

**완료일**: 2025-12-06

**작업 내용**:

- 기업 스타일(파란/보라) → 개인 블로그 스타일(따뜻한 오렌지 톤)로 변경
- CSS 변수 기반 테마 시스템 구축
- 라이트/다크 모드 모두 새 색상 적용

**수정 파일**:

- `globals.css` (CSS 변수 정의)

**CSS 변수 시스템**:

```css
:root {
  --background: #fafaf9;
  --foreground: #1c1917;
  --accent: #ea580c;
  --accent-light: #fb923c;
  --muted: #78716c;
  --border: #e7e5e4;
  --card: #ffffff;
}
.dark {
  --background: #1c1917;
  --foreground: #fafaf9;
  --accent: #fb923c;
  --accent-light: #fdba74;
  --muted: #a8a29e;
  --border: #292524;
  --card: #292524;
}
```

**학습 포인트**: CSS Custom Properties, 테마 시스템 설계

---

### 5-2. 메인 페이지 리디자인 ✅

**완료일**: 2025-12-06

**작업 내용**:

- 프로필 섹션 (아바타, 소개, 소셜 링크)
- 피처드 포스트 카드 (그라데이션 배경 효과)
- 3컬럼 그리드 레이아웃 (포스트 2/3 + 사이드바 1/3)
- 사이드바: 태그 클라우드, About 카드

**수정 파일**:

- `app/page.tsx`
- `app/layout.tsx`

**참고 UI**: <https://hudi.blog/> 스타일 참조

**학습 포인트**: CSS Grid 레이아웃, 반응형 디자인, 그라데이션 효과

---

### 5-3. MDX Frontmatter 버그 수정 ✅

**완료일**: 2025-12-06

**문제**: 포스트 상세 페이지에서 frontmatter가 본문에 그대로 표시됨

**해결**:

- `remark-frontmatter` 플러그인 추가
- `remark-mdx-frontmatter` 플러그인 추가
- Turbopack 직렬화 오류 해결 (문자열 기반 플러그인 참조)

**수정 파일**:

- `next.config.ts`

```typescript
remarkPlugins: [
  "remark-frontmatter",
  ["remark-mdx-frontmatter", { name: "frontmatter" }],
],
```

**트러블슈팅**:

- `"does not have serializable options"` 에러 → 플러그인을 import가 아닌 문자열로 지정하여 해결

**학습 포인트**: MDX 플러그인 파이프라인, Turbopack 제약사항

---

### 5-4. 목차(TOC) 기능 개선 ✅

**완료일**: 2025-12-06

**문제**: 목차 클릭 시 이동이 안 되고, 색상이 제대로 적용 안 됨

**해결**:

- 부드러운 스크롤 구현 (오프셋 -100px 적용)
- 활성 항목 표시선 추가 (accent 색상)
- IntersectionObserver로 스크롤 시 활성 항목 자동 업데이트
- URL 해시 업데이트 (`window.history.pushState`)

**수정 파일**:

- `app/components/TableOfContents.tsx`

**핵심 코드**:

```typescript
const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -100;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    setActiveId(id);
    window.history.pushState(null, "", `#${id}`);
  }
}, []);
```

**학습 포인트**: IntersectionObserver API, 스크롤 동작 커스터마이징, URL 해시 관리

---

### 5-5. 하이드레이션 오류 수정 ✅

**완료일**: 2025-12-06

**문제**: ShareButtons 컴포넌트에서 서버/클라이언트 불일치로 하이드레이션 오류 발생

**원인**: `navigator.share` 체크가 서버에서는 undefined, 클라이언트에서는 true/false로 다름

**해결**:

- `canShare` 상태를 false로 초기화
- useEffect에서 클라이언트 사이드에서만 navigator 체크

**수정 파일**:

- `app/components/ShareButtons.tsx`

**핵심 코드**:

```typescript
const [canShare, setCanShare] = useState(false);

useEffect(() => {
  setCanShare(typeof navigator !== "undefined" && "share" in navigator);
}, []);
```

**학습 포인트**: SSR 하이드레이션, 브라우저 전용 API 처리, useEffect 활용

---

## Phase 5 완료 요약

| 작업 | 상태 | 주요 파일 |
|------|------|----------|
| 5-1 컬러 팔레트 | ✅ | `globals.css` |
| 5-2 메인 페이지 리디자인 | ✅ | `page.tsx`, `layout.tsx` |
| 5-3 MDX Frontmatter 수정 | ✅ | `next.config.ts` |
| 5-4 TOC 개선 | ✅ | `TableOfContents.tsx` |
| 5-5 하이드레이션 오류 | ✅ | `ShareButtons.tsx` |

---

## 다음 단계: Phase 6 (뉴스레터) - 추후 예정

---

## 기타 작업

### Git 설정 변경
- remote URL: HTTPS → SSH 변경
- `git@github.com:solitasroh/web-blog.git`

---

## 참고 문서
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 규약
- [CURRICULUM.md](./CURRICULUM.md) - 학습 커리큘럼
