# 퓨리오사AI — 회사·포지션 리서치

> 작성일: 2026-09-29 · 추천 등급: 기존 상위 추천군 · id: furiosa-ai

## 한 줄 결론
RNGD 추론 NPU 스케일업으로 **SoC Firmware·PCIe Driver·PPT(동탄/서울 선택)** 가 트랙 B와 맞고, **동탄 랩** 옵션이 통근 최강 카드다. 2026-09-29 careers에서 PPT·SoC FW·PCIe·양산실장평가(동탄) **여전히 오픈**. Greenhouse 기준 하드 마감 **없음(롤링)** — 충원 시 예고 없이 내려갈 수 있어 조기 지원. 사람인/언론 평균 **~1억 근접 Band A 시그널**이나 스톡·IPO 기대와 현금을 분리. Blind 문화 고점(4.9)이나 워커홀릭 시그널.

## 회사 개요
- **제품**: Warboy(1세대) → **RNGD/Renegade**(2세대, HBM3·저전력 추론) → 차세대(Broadcom 협업 보도). 고객 언급: LG AI Research, Samsung SDS(JD) 등.
- **단계**: Series C bridge·Pre-IPO 대규모 보도(2025–2026). IPO 2027–28 검토 보도. 매출 대비 적자·RCPS 회계 이슈는 IT조선 등 — **성장 vs 재무 리스크 병존**.
- **거점**: 서울 신사(도산대로 145) HQ R&D. **화성 동탄** 랩(첨단산업1로·IX타워 계열 — bring-up·양산·Thermal). US/EU/SG 오피스.
- **채용**: https://furiosa.ai/careers (Greenhouse `furiosaai`)

## 목표 직무·공고
- **우선순위**
  1. **Systems Software Engineer, PPT** — Hwaseong(Dongtan)/Seoul 선택 — id 4005794201
  2. **Systems Software Engineer, SoC Firmware** — Seoul — 4005795201
  3. **PCIe Device Driver** — Seoul — 4005793201
  4. (위치) Productization & Validation(양산실장평가) — **Dongtan 전담** — 4005776201 — HW 실장·신호 비중↑, SW 순수 역할과 구분
- **상태 (2026-09-29)**: furiosa.ai/careers 목록에 위 포지션 **확인**.
- **마감**: 선행 API 조사(2026-09-16) `application_deadline=null` — **하드 마감 없음·롤링**. 보드 notes와 동일. 조기 지원 권고.
- **연락**: recruit@furiosa.ai

| 역할 | JD 핵심 | 후보 핏 |
|------|---------|---------|
| PPT | Embedded Linux, DVFS/thermal/clock, C/C++, 드라이버 | 임베 리눅스·장비 전력/안정성 인접 **중~강**; NPU PPT 전문은 Gap |
| SoC FW | ROM, TF-A, Secure Boot, bring-up, JTAG | MCU FW·bring-up **중~강**; 보안부트 전문 Gap |
| PCIe Driver | Linux PCIe/DMA/IOMMU | 드라이버 경험 범위 내 **부분** |
| 양산실장 | HW bring-up, yield, FA | 장비 bring-up 일부 전이; 순수 SW 목표와 거리면 후순위 |

## 위치·접근성
- **동탄 랩**: 동탄 거주 기준 **최상**. PPT는 신사/동탄 선택+Hybrid 문구(선행 JD).
- **신사 HQ**: 강남 동선, 피크 60분±.
- GTX-A: 동탄–수서 후 신사 이동 가능.

## 처우 시그널
| 출처 | 수치 | 한계 |
|------|------|------|
| 사람인 추정(선행) | **~9,791만**(2025 표기) | 추정·직무편차 |
| 아시아경제/사람인 인용 | 2024 평균 **~9,681만**, “1억 돌파” 보도 | 언론 |
| Blind 기업정보 | **~7,935만** | 구성 불명 |

- Band **A** 시그널. **본인 하드바 >7천만 현금 서면**과 평균을 동일시하지 말 것. Pre-IPO 스톡은 부가.
- 중앙일보 팩플: 대기업 대비 당장은 보상 적을 수 있다는 관계자 코멘트도 존재 — 오퍼에서만 확정.

## 문화·리스크
- Blind(2026-09-16): **4.9**/35 · 문화 4.9 · WLB **4.4** · 급여 4.7 · 추천 ~86%. 테마: 수평·애사심 vs **암묵적 워커홀릭·출퇴근 비고정·슬랙 상시**.
- JobPlanet: 4.1/7건(표본 소), WLB 3.0.
- 리스크: 재무·RCPS·적자, 영어/글로벌, 고강도, 서울 본사 비중, 스톡 기대에 현금 희석.

## 면접·이력서 포인트
1. 트랙 B: 임베 리눅스 드라이버·MCU bring-up·크로스레이어 디버깅.
2. PPT 지원 시: 전력·열·성능 **프로파일링·안정화** 경험(장비 제품)을 DVFS/thermal 학습과 연결.
3. SoC FW: 부트·초기화·JTAG 스토리. Secure Boot는 학습 계획.
4. AccuraLogic/WPF는 제품 소유·품질 감각만 짧게.
5. 영어 기술 인터뷰 대비(글로벌 협업).

**물어볼 질문**
1. PPT 역할의 실제 주근무지 비율(동탄 vs 신사)과 Hybrid 실태는?
2. RNGD 양산 이후 팀의 on-call·이슈 강도는?
3. 오퍼 현금 vs 스톡(Pre-IPO) 가이드와 베스팅은?

## 리서치 체크리스트
- [ ] https://furiosa.ai/careers 에서 PPT / SoC FW URL 클릭·지원
- [ ] 이력서 트랙 B(영문 Greenhouse 폼)
- [ ] 동탄 근무 가능 의사를 PPT 지원서에 명시
- [ ] 처우: 현금>7천만 서면
- 다음 액션: **PPT(동탄 선택) 우선 지원** + SoC Firmware 병행.

## 리서치 갱신 포인트
- Greenhouse 온라인 지원. PPT에 **Dongtan 가능** 명시.
- 양산실장평가는 HW 성격 강하면 후순위.
- 롤링이라도 헤드카운트 채워지면 비공개 클로즈 — 이번 주 지원.

## 회사 품질 점검
- Pre-IPO·Band A 시그널 ✅ / 동탄 옵션 ✅ / 제품 SoC ✅
- 재무 적자·RCPS·강도 문화 ⚠️ / 현금 vs 스톡 분리 협상

## 출처
- https://furiosa.ai/careers
- https://furiosa.ai/rngd
- https://job-boards.anz.greenhouse.io/furiosaai/jobs/4005794201
- https://job-boards.anz.greenhouse.io/furiosaai/jobs/4005795201
- https://www.asiae.co.kr/article/2026081010314268547
- 내부: `/workspace/job-furiosa-deep-2026-09-16.md`, `/workspace/job-highpay-startups-2026-09-16.md`, `/workspace/job-startups-culture-2026-09-17.md`
