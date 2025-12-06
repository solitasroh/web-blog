# 블로그 프로덕션 개선 TODO

> 마지막 업데이트: 2025-12-06

## 진행 상황 요약

| Phase | 설명 | 상태 | 진행률 |
|-------|------|------|--------|
| Phase A | SEO 기초 | ✅ 완료 | 100% |
| Phase B | 콘텐츠 UX | ✅ 완료 | 100% |
| Phase C | 인터랙션 | ⏳ 대기 | 0% |
| Phase D | 운영 인프라 | ⏳ 대기 | 0% |

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

## Phase C: 인터랙션

### C-1. 댓글 시스템
- [ ] Giscus 연동
- [ ] 다크모드 연동
- [ ] 댓글 영역 UI
- **상태**: ⏳ 대기

### C-2. 소셜 공유
- [ ] 공유 버튼 컴포넌트
- [ ] Twitter, Facebook, LinkedIn 지원
- [ ] 링크 복사 기능
- **상태**: ⏳ 대기

### C-3. 접근성 개선
- [x] Skip to content 링크 (layout.tsx에 추가됨)
- [ ] ARIA 레이블 추가
- [ ] 키보드 네비게이션 개선
- [ ] 컬러 대비 검증
- **상태**: 🔄 부분 완료

---

## Phase D: 운영 인프라

### D-1. 테스트 코드
- [ ] Jest 설정
- [ ] 유틸리티 함수 테스트
- [ ] 컴포넌트 테스트
- **상태**: ⏳ 대기

### D-2. CI/CD
- [ ] GitHub Actions 워크플로우
- [ ] 빌드 & 린트 검증
- [ ] 자동 배포
- **상태**: ⏳ 대기

### D-3. 모니터링
- [ ] Sentry 에러 트래킹
- [ ] Vercel Analytics
- **상태**: ⏳ 대기

---

## 구현된 파일 목록

### 새로 생성된 파일
| 파일 | 설명 |
|------|------|
| `app/sitemap.ts` | 동적 sitemap 생성 |
| `app/robots.ts` | robots.txt 생성 |
| `app/feed.xml/route.ts` | RSS 피드 |
| `app/tags/page.tsx` | 태그 목록 페이지 |
| `app/archive/page.tsx` | 아카이브 페이지 |
| `app/components/JsonLd.tsx` | JSON-LD 스키마 컴포넌트 |
| `lib/siteConfig.ts` | 사이트 설정 중앙 관리 |

### 수정된 파일
| 파일 | 변경 내용 |
|------|----------|
| `app/layout.tsx` | SEO 메타데이터, 헤더/푸터 UI 개선, 접근성 |
| `app/page.tsx` | 홈페이지 UI 전면 개선 |
| `app/posts/[slug]/page.tsx` | 포스트 상세 UI 개선, 관련 포스트, 이전/다음 네비게이션 |
| `app/tags/[tag]/page.tsx` | 태그 상세 페이지 UI 개선 |
| `app/search/page.tsx` | 검색 페이지 UI 개선 |
| `app/components/PostList.tsx` | 포스트 카드 UI 개선 |
| `lib/posts.ts` | 읽기 시간, excerpt, 관련 포스트, 아카이브 함수 추가 |

---

## UI/UX 디자인 원칙

### 적용된 디자인 가이드라인

1. **일관된 디자인 시스템** ✅
   - 통일된 색상 팔레트 (blue-500 ~ purple-600 그라데이션)
   - 일관된 간격 (Tailwind spacing scale)
   - 타이포그래피 위계 (text-4xl > text-2xl > text-xl > text-lg)

2. **마이크로 인터랙션** ✅
   - 호버 시 border 색상 변화
   - 그림자 변화 (hover:shadow-lg)
   - 부드러운 transition (duration-300)

3. **반응형 디자인** ✅
   - Mobile-first 접근
   - sm/lg breakpoint 활용
   - 모바일에서 사이드바 숨김

4. **접근성** 🔄
   - Skip to content 링크 추가
   - Breadcrumb navigation
   - ARIA labels (일부)

5. **성능** ✅
   - 정적 생성 (SSG)
   - 이미지 최적화 (Next.js Image)
   - 폰트 최적화 (Pretendard Variable)

---

## 다음 단계 권장사항

### 우선순위 높음
1. **빌드 테스트** - 현재 변경사항이 정상 빌드되는지 확인
2. **Giscus 댓글** - GitHub 기반 댓글 시스템 연동
3. **소셜 공유 버튼** - 포스트 공유 기능

### 우선순위 중간
4. **OG 이미지 생성** - @vercel/og 활용 동적 이미지
5. **Analytics 연동** - Vercel Analytics 또는 GA4

### 우선순위 낮음
6. **테스트 코드** - Jest + React Testing Library
7. **CI/CD** - GitHub Actions 워크플로우

---

## 변경 로그

| 날짜 | 변경 내용 |
|------|----------|
| 2025-12-06 | 초기 TODO 문서 생성 |
| 2025-12-06 | Phase A (SEO 기초) 완료 |
| 2025-12-06 | Phase B (콘텐츠 UX) 완료 |
| 2025-12-06 | 전체 UI/UX 상업적 수준으로 개선 |
