# Vercel Monorepo 이미지 배포 문제 해결

## 문제 진단
- **증상**: `apps/blog/public/images/` 폴더의 이미지가 Vercel 배포에 포함되지 않음
- **원인**: Vercel이 repository root에서 빌드하면서 `apps/blog/public` 폴더를 인식하지 못함

## 근본 원인
Vercel의 monorepo 지원 방식:
- 기본적으로 repository root를 프로젝트 루트로 인식
- Next.js는 프로젝트 루트의 `public/` 폴더만 정적 파일로 배포
- `apps/blog/public/`은 빌드 출력에 포함되지 않음

## 해결 방법 (2가지 옵션)

### 옵션 1: Vercel 대시보드에서 Root Directory 설정 (권장)

1. **Vercel 대시보드 접속**
   - https://vercel.com/solitasrohs-projects/web-blog

2. **Settings → General → Root Directory**
   - `apps/blog` 입력
   - Save 클릭

3. **재배포**
   - Deployments → 최신 배포 → Redeploy

**장점:**
- 가장 깔끔하고 표준적인 방법
- Vercel이 `apps/blog`를 프로젝트 루트로 인식
- `public/` 폴더 자동 처리

**단점:**
- 대시보드 접근 필요

---

### 옵션 2: 빌드 스크립트로 이미지 복사 (대안)

Vercel 대시보드 접근이 어려운 경우:

1. **`apps/blog/package.json` 수정**

```json
{
  "scripts": {
    "dev": "next dev",
    "prebuild": "node scripts/copy-public.js",
    "build": "next build",
    "start": "next start"
  }
}
```

2. **`apps/blog/scripts/copy-public.js` 생성**

```javascript
const fs = require('fs');
const path = require('path');

// apps/blog/public → ../../public 복사
const source = path.join(__dirname, '../public');
const dest = path.join(__dirname, '../../../public');

fs.cpSync(source, dest, { recursive: true });
console.log('✓ Copied public files to root');
```

3. **Root `vercel.json` 수정**

```json
{
  "buildCommand": "cd apps/blog && npm run build",
  "framework": "nextjs"
}
```

**장점:**
- 대시보드 설정 불필요
- CI/CD에서도 자동 처리

**단점:**
- 추가 스크립트 유지보수 필요
- Root에 불필요한 파일 복사

---

## 추천 방법

**Vercel 대시보드에서 Root Directory 설정 (옵션 1)** 을 강력히 권장합니다.

이유:
- Vercel의 표준 monorepo 지원 방식
- 추가 스크립트 불필요
- 향후 다른 정적 파일도 자동 처리
- 빌드 성능 최적화

---

## 적용 후 확인

재배포 후 다음 URL들이 정상 작동하는지 확인:

```
https://web-blog-steel.vercel.app/images/coding-standards/timeline.png
https://web-blog-steel.vercel.app/images/coding-standards/barr-pie.png
https://web-blog-steel.vercel.app/images/coding-standards/radar-comparison.png
```

모두 이미지가 표시되면 성공! ✓
