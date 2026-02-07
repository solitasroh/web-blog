# 블로그 이미지 배포 문제 진단 보고서

## 날짜
2026-02-07 21:18 KST

## 문제 증상
- 블로그 포스트 페이지에서 이미지가 표시되지 않음
- 브라우저에서 이미지 로드 실패

## 원인 분석

### 1단계: Root Directory 문제
**문제**: Vercel이 repository root에서 빌드하여 `apps/blog/public/` 폴더를 인식하지 못함

**조치**:
- Vercel API를 통해 Root Directory를 `apps/blog`로 설정
- `vercel.json`을 `apps/blog/` 안으로 이동

### 2단계: 배포 검증
**검증 결과**: ✅ **모든 이미지가 정상 배포됨**

```bash
# 직접 이미지 URL 접근 테스트
$ curl -s -o /dev/null -w "%{http_code}" https://blog.solitas.link/images/coding-standards/timeline.png
200

# 모든 8개 이미지 확인
timeline.png: 200
barr-pie.png: 200
radar-comparison.png: 200
cost-comparison.png: 200
arm-heatmap.png: 200
tool-support.png: 200
learning-curve.png: 200
misra-adoption.png: 200

# 이미지 파일 타입 확인
$ curl -s https://blog.solitas.link/images/coding-standards/timeline.png | file -
/dev/stdin: PNG image data, 1741 x 1088, 8-bit/color RGBA, non-interlaced

# HTML에 포함된 이미지 개수 확인
$ curl -s https://blog.solitas.link/posts/embedded-c-coding-standards | grep -c '<img.*coding-standards.*png'
8
```

### 3단계: Next.js 이미지 최적화
Next.js가 이미지를 자동으로 최적화하여 `/_next/image` 경로로 변환:

```html
<img 
  src="/_next/image?url=%2Fimages%2Fcoding-standards%2Ftimeline.png&w=1920&q=75"
  srcSet="/_next/image?url=%2Fimages%2Fcoding-standards%2Ftimeline.png&w=828&q=75 1x, 
          /_next/image?url=%2Fimages%2Fcoding-standards%2Ftimeline.png&w=1920&q=75 2x"
/>
```

최적화된 이미지도 정상 서빙 확인:
```bash
$ curl -s -o /dev/null -w "%{http_code}" \
  "https://blog.solitas.link/_next/image?url=%2Fimages%2Fcoding-standards%2Ftimeline.png&w=1920&q=75"
200
```

## 결론

### 현재 상태: ✅ 정상 배포 완료

모든 이미지가 정상적으로 배포되어 있으며, HTTP 200 응답을 반환하고 있습니다.

### 이전 문제의 원인
1. **Root Directory 미설정**: Vercel이 `apps/blog/public/` 폴더를 찾지 못함
2. **브라우저 캐시**: 이전 404 응답이 캐시되어 최신 배포 반영 지연

### 해결 조치
1. ✅ Vercel Root Directory를 `apps/blog`로 설정 (API 사용)
2. ✅ `vercel.json`을 `apps/blog/` 안으로 이동
3. ✅ 재배포 완료 (commit 57d3c27)

### 검증 완료
- 직접 이미지 URL 접근: 8/8 성공
- Next.js 최적화 이미지: 정상 작동
- HTML 렌더링: 8개 이미지 모두 포함

## 향후 권장 사항

### 1. 배포 후 검증 프로세스
```bash
# 이미지 배포 검증 스크립트
for img in timeline barr-pie radar-comparison cost-comparison \
           arm-heatmap tool-support learning-curve misra-adoption; do
  curl -s -o /dev/null -w "$img.png: %{http_code}\n" \
    https://blog.solitas.link/images/coding-standards/${img}.png
done
```

### 2. 브라우저 캐시 우회
- 강제 새로고침: `Ctrl+Shift+F5` (Chrome/Firefox)
- 시크릿 모드로 확인

### 3. Vercel 프로젝트 구조 유지
```
web-blog/
├── apps/
│   └── blog/              # Root Directory (Vercel 설정)
│       ├── vercel.json    # ✅ 이 위치에 있어야 함
│       ├── public/
│       │   └── images/
│       │       └── coding-standards/  # 8개 PNG
│       └── ...
└── ...
```

## 타임라인

- **21:06**: Root Directory를 `apps/blog`로 설정 (API)
- **21:13**: Vercel CLI 인증 및 재배포 시작
- **21:15**: 배포 완료 (44초 소요)
- **21:17**: `vercel.json` 위치 이동 (commit 57d3c27)
- **21:18**: 배포 검증 - 모든 이미지 정상 확인

## 최종 URL

- **메인 블로그**: https://blog.solitas.link
- **포스트**: https://blog.solitas.link/posts/embedded-c-coding-standards
- **이미지 예시**: https://blog.solitas.link/images/coding-standards/timeline.png

---

**결론**: 배포 문제 완전 해결. 모든 이미지가 정상적으로 서빙되고 있습니다. ✅
