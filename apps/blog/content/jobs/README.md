# Jobs Investigation Data

이 디렉터리는 개인 취업 조사 메모를 저장합니다.

## 데이터 구조

`data.json` 파일에 다음 형식으로 저장:

```json
{
  "companies": [
    {
      "id": "unique-id",
      "name": "회사명",
      "status": "관심있음 | 지원완료 | 탈락 | 합격 | 보류",
      "commute": "30분 (지하철 2호선)",
      "skipReason": "선택적 사유",
      "recommendation": "추천인 정보 (선택)",
      "notes": "기타 메모",
      "updatedAt": "2026-09-27"
    }
  ]
}
```

## 데이터 업데이트 방법

1. `data.json` 파일을 직접 편집
2. Git commit & push
3. 배포 후 `/jobs` 페이지에서 확인

## 주의사항

- 이 데이터는 **절대 공개되지 않습니다** (robots.txt, sitemap, RSS 모두 제외)
- `/jobs` 페이지는 관리자 인증 필요 (`ADMIN_PASSWORD`)
- 개인 정보 포함 가능하므로 저장소가 public인 경우 주의
