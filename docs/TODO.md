# 블로그 프로덕션 개선 TODO

> 마지막 업데이트: 2025-12-06

## 진행 상황 요약

| Phase   | 설명              | 상태    | 진행률 |
| ------- | ----------------- | ------- | ------ |
| Phase A | SEO 기초          | ✅ 완료 | 100%   |
| Phase B | 콘텐츠 UX         | ✅ 완료 | 100%   |
| Phase C | 인터랙션          | ✅ 완료 | 100%   |
| Phase D | 운영 인프라       | ✅ 완료 | 100%   |
| Phase E | UI/UX 모던화      | ✅ 완료 | 100%   |
| Phase F | 뉴스레터          | 🔜 예정 | 0%     |

---

## Phase A: SEO 기초 ✅

### A-1. Sitemap 생성

- [x] `app/sitemap.ts` 생성
- [x] 동적으로 모든 포스트 URL 포함
- [x] 정적 페이지 URL 포함
- **상태**: ✅ 완료

### A-2. Robots.txt

- [x] `app/robots.ts` 생성
- [x] 크롤링 규칙 정의
- [x] Sitemap 경로 포함
- **상태**: ✅ 완료

### A-3. RSS Feed

- [x] `app/feed.xml/route.ts` 생성
- [x] 모든 포스트 메타데이터 포함
- [x] RSS 2.0 표준 준수
- **상태**: ✅ 완료

### A-4. Open Graph 완성

- [x] 기본 OG 메타데이터 설정
- [x] 포스트별 동적 메타데이터
- [x] Twitter Card 메타데이터
- **상태**: ✅ 완료

### A-5. Canonical URL

- [x] 모든 페이지에 canonical URL 추가
- [x] 중복 콘텐츠 방지
- **상태**: ✅ 완료

### A-6. Structured Data (JSON-LD)

- [x] BlogPosting 스키마 추가
- [x] WebSite 스키마 추가
- [x] BreadcrumbList 스키마 추가
- **상태**: ✅ 완료

---

## Phase B: 콘텐츠 UX ✅

### B-1. /tags 목록 페이지

- [x] 전체 태그 목록 페이지 생성
- [x] 태그별 포스트 개수 표시
- [x] 태그 클라우드 UI
- **상태**: ✅ 완료

### B-2. 읽기 시간 표시

- [x] 읽기 시간 계산 유틸리티 (`lib/posts.ts`)
- [x] 포스트 목록에 표시
- [x] 포스트 상세에 표시
- **상태**: ✅ 완료

### B-3. 포스트 Excerpt

- [x] Frontmatter에 excerpt 필드 지원
- [x] 자동 excerpt 생성 (미입력 시)
- [x] 목록 페이지에 표시
- **상태**: ✅ 완료

### B-4. 관련 포스트

- [x] 태그 기반 관련 포스트 추천 (`getRelatedPosts`)
- [x] 포스트 하단에 표시
- [x] 최대 3개 표시
- **상태**: ✅ 완료

### B-5. 이전/다음 포스트 네비게이션

- [x] 이전/다음 포스트 계산 로직 (`getAdjacentPosts`)
- [x] 포스트 하단 네비게이션 UI
- **상태**: ✅ 완료

### B-6. 포스트 아카이브

- [x] 연/월별 그룹핑 (`getPostsByYear`)
- [x] `/archive` 페이지 생성
- [x] 타임라인 UI
- **상태**: ✅ 완료

---

## Phase C: 인터랙션 ✅

### C-1. 댓글 시스템

- [x] Giscus 컴포넌트 생성 (`Comments.tsx`)
- [x] 다크모드 자동 연동
- [x] 환경변수 기반 설정 (NEXT*PUBLIC_GISCUS*\*)
- **상태**: ✅ 완료

### C-2. 소셜 공유

- [x] 공유 버튼 컴포넌트 (`ShareButtons.tsx`)
- [x] Twitter, Facebook, LinkedIn 지원
- [x] 링크 복사 기능 (클립보드)
- [x] 모바일 Native Share API 지원
- **상태**: ✅ 완료

### C-3. 접근성 개선

- [x] Skip to content 링크
- [x] ARIA 레이블 추가 (ThemeToggle, 버튼들)
- [x] 키보드 포커스 스타일 (focus:ring)
- [x] 아이콘 버튼에 title 속성 추가
- **상태**: ✅ 완료

---

## Phase D: 운영 인프라 ✅

### D-1. 테스트 코드

- [x] Jest 설정 (`jest.config.ts`, `jest.setup.ts`)
- [x] 유틸리티 함수 테스트 (`__tests__/lib/posts.test.ts`)
- [x] 컴포넌트 테스트 (`__tests__/components/ShareButtons.test.tsx`)
- **상태**: ✅ 완료

### D-2. CI/CD

- [x] GitHub Actions 워크플로우 (`.github/workflows/ci.yml`)
- [x] 빌드 & 린트 & 테스트 검증
- [x] PR 프리뷰 워크플로우 (`.github/workflows/preview.yml`)
- **상태**: ✅ 완료

### D-3. 모니터링

- [x] Vercel Analytics 연동 (`@vercel/analytics`)
- [x] Vercel Speed Insights 연동 (`@vercel/speed-insights`)
- [x] 환경변수 문서화 (`.env.example`)
- **상태**: ✅ 완료

---

## Phase E: UI/UX 모던화 ✅

### E-1. 컬러 팔레트 변경

- [x] 기업 스타일(파란/보라) → 개인 블로그 스타일(오렌지 톤) 변경
- [x] CSS 변수 시스템 구축 (`--accent`, `--muted`, `--border`, `--card`)
- [x] 다크/라이트 모드 모두 새 색상 적용
- **상태**: ✅ 완료

### E-2. 메인 페이지 리디자인

- [x] 프로필 섹션 (아바타, 소개, 소셜 링크)
- [x] 피처드 포스트 카드 (그라데이션 배경)
- [x] 3컬럼 그리드 레이아웃 (포스트 + 사이드바)
- [x] 사이드바: 태그 클라우드, About 카드
- **상태**: ✅ 완료

### E-3. MDX Frontmatter 이슈 수정

- [x] `remark-frontmatter` 플러그인 추가
- [x] `remark-mdx-frontmatter` 플러그인 추가
- [x] Turbopack 직렬화 오류 해결 (문자열 기반 참조)
- **상태**: ✅ 완료

### E-4. 목차(TOC) 기능 개선

- [x] 부드러운 스크롤 (오프셋 적용)
- [x] 활성 항목 표시선 (accent 색상)
- [x] IntersectionObserver로 활성 항목 자동 업데이트
- [x] URL 해시 업데이트
- **상태**: ✅ 완료

### E-5. 하이드레이션 오류 수정

- [x] ShareButtons.tsx의 `navigator.share` 체크 수정
- [x] useEffect로 클라이언트 사이드에서만 체크
- [x] 디자인 시스템 색상 적용
- **상태**: ✅ 완료

---

## Phase F: 뉴스레터 🔜

### F-1. 뉴스레터 구독 시스템

- [ ] 뉴스레터 구독 컴포넌트 생성
- [ ] 뉴스레터 API 라우트 생성
- [ ] DynamoDB 테이블 설정
- [ ] 메인 페이지에 뉴스레터 섹션 추가
- **상태**: 🔜 추후 구현 예정

---

## 구현된 파일 목록

### 새로 생성된 파일

| 파일                                         | 설명                    |
| -------------------------------------------- | ----------------------- |
| `app/sitemap.ts`                             | 동적 sitemap 생성       |
| `app/robots.ts`                              | robots.txt 생성         |
| `app/feed.xml/route.ts`                      | RSS 피드                |
| `app/tags/page.tsx`                          | 태그 목록 페이지        |
| `app/archive/page.tsx`                       | 아카이브 페이지         |
| `app/components/JsonLd.tsx`                  | JSON-LD 스키마 컴포넌트 |
| `app/components/Comments.tsx`                | Giscus 댓글 컴포넌트    |
| `app/components/ShareButtons.tsx`            | 소셜 공유 버튼 컴포넌트 |
| `app/components/Giscus.tsx`                  | Giscus 기본 컴포넌트    |
| `lib/siteConfig.ts`                          | 사이트 설정 중앙 관리   |
| `jest.config.ts`                             | Jest 테스트 설정        |
| `jest.setup.ts`                              | Jest 셋업 파일          |
| `__tests__/lib/posts.test.ts`                | 유틸리티 함수 테스트    |
| `__tests__/components/ShareButtons.test.tsx` | 컴포넌트 테스트         |
| `.github/workflows/ci.yml`                   | CI 워크플로우           |
| `.github/workflows/preview.yml`              | PR 프리뷰 워크플로우    |
| `.env.example`                               | 환경변수 예시 파일      |

### 수정된 파일

| 파일                             | 변경 내용                                           |
| -------------------------------- | --------------------------------------------------- |
| `app/layout.tsx`                 | SEO 메타데이터, 헤더/푸터 UI 개선, 접근성           |
| `app/page.tsx`                   | 홈페이지 UI 전면 개선                               |
| `app/posts/[slug]/page.tsx`      | 포스트 상세 UI, 관련 포스트, 네비게이션, 공유, 댓글 |
| `app/tags/[tag]/page.tsx`        | 태그 상세 페이지 UI 개선                            |
| `app/search/page.tsx`            | 검색 페이지 UI 개선                                 |
| `app/components/PostList.tsx`    | 포스트 카드 UI 개선                                 |
| `app/components/ThemeToggle.tsx` | 접근성 개선, 아이콘 SVG 변경                        |
| `lib/posts.ts`                   | 읽기 시간, excerpt, 관련 포스트, 아카이브 함수 추가 |

---

## UI/UX 디자인 원칙

### 적용된 디자인 가이드라인

1. **일관된 디자인 시스템** ✅

   - 통일된 색상 팔레트 (오렌지 계열 accent 색상)
   - CSS 변수 기반 테마 시스템 (`--accent`, `--muted`, `--border`, `--card`)
   - 일관된 간격 (Tailwind spacing scale)
   - 타이포그래피 위계 (text-4xl > text-2xl > text-xl > text-lg)

2. **마이크로 인터랙션** ✅

   - 호버 시 border 색상 변화 (accent/50)
   - 그림자 변화 (hover:shadow-lg, hover:shadow-accent/5)
   - 부드러운 transition (duration-300)
   - 그라데이션 배경 효과

3. **반응형 디자인** ✅

   - Mobile-first 접근
   - sm/lg breakpoint 활용
   - 모바일에서 사이드바 숨김
   - 3컬럼 그리드 (lg 이상)

4. **접근성** ✅

   - Skip to content 링크 추가
   - Breadcrumb navigation
   - ARIA labels
   - 키보드 포커스 스타일

5. **성능** ✅
   - 정적 생성 (SSG)
   - 이미지 최적화 (Next.js Image)
   - 폰트 최적화 (Pretendard Variable)
   - 하이드레이션 오류 방지 (클라이언트 전용 체크)

---

## 다음 단계 권장사항

### 우선순위 높음

1. **뉴스레터 시스템** - 이메일 구독 기능 구현 (추후 예정)
2. **OG 이미지 생성** - @vercel/og 활용 동적 이미지

### 우선순위 중간

1. **검색 기능 고도화** - 전문 검색, 태그/날짜 필터
2. **포스트 시리즈** - 연재물 그룹핑 기능

### 우선순위 낮음

1. **다국어 지원** - i18n 적용
2. **PWA 지원** - 오프라인 접근성

---

## 변경 로그

| 날짜       | 변경 내용                                                    |
| ---------- | ------------------------------------------------------------ |
| 2025-12-06 | 초기 TODO 문서 생성                                          |
| 2025-12-06 | Phase A (SEO 기초) 완료                                      |
| 2025-12-06 | Phase B (콘텐츠 UX) 완료                                     |
| 2025-12-06 | 전체 UI/UX 상업적 수준으로 개선                              |
| 2025-12-06 | Phase C (인터랙션) 완료 - 댓글, 공유, 접근성                 |
| 2025-12-06 | Phase D (운영 인프라) 완료 - 테스트, CI/CD, 모니터링         |
| 2025-12-06 | Phase E (UI/UX 모던화) 완료 - 컬러 팔레트, 레이아웃, TOC 개선 |
| 2025-12-06 | 댓글 시스템 DynamoDB로 전환 (Giscus → 자체 구현)             |
| 2025-12-06 | MDX frontmatter 표시 버그 수정                               |
| 2025-12-06 | ShareButtons 하이드레이션 오류 수정                          |
