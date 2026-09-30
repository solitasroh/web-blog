# Jobs Investigation Data

이 디렉터리는 개인 취업 조사 메모를 저장합니다.

## 데이터 구조

`data.json` 파일에 다음 형식으로 저장:

```json
{
  "rankingModel": {
    "organization": "회사 규모별로 묶고 같은 규모 안에서 추천 등급순으로 정렬",
    "companyScale": {
      "large": "기존 자료에 대규모 근거가 명시됨",
      "medium": "기존 자료에 중견 규모 근거가 명시됨",
      "small": "기존 자료에 중소 규모 근거가 명시됨",
      "unknown": "규모 근거 부족"
    },
    "recommendationGrade": {
      "A": "근거가 확인된 강한 추천",
      "B": "근거가 확인된 추천",
      "C": "제한적 추천",
      "unknown": "추천 근거 부족"
    }
  },
  "companies": [
    {
      "id": "unique-id",
      "name": "회사명",
      "role": "조사 대상 직무",
      "location": "근무지",
      "companyScale": "large | medium | small | unknown",
      "scaleBasis": "규모 분류의 기존 자료 근거",
      "recommendationGrade": "A | B | C | unknown",
      "gradeBasis": "추천 등급의 기존 자료 근거",
      "track": "windows | embedded",
      "updatedAt": "2026-09-27"
    }
  ]
}
```

근거가 충분하지 않은 규모와 추천도는 추정하지 않고 `unknown`으로
기록합니다.

## 데이터 업데이트 방법

1. `data.json` 파일을 직접 편집
2. Git commit & push
3. 배포 후 `/jobs` 페이지에서 확인

## 주의사항

- 이 데이터는 **절대 공개되지 않습니다** (robots.txt, sitemap, RSS 모두 제외)
- `/jobs` 페이지는 관리자 인증 필요 (`ADMIN_PASSWORD`)
- 개인 정보 포함 가능하므로 저장소가 public인 경우 주의
