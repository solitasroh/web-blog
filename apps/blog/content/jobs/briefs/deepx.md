# 딥엑스 — 회사·포지션 리서치

> 작성일: 2026-09-29 · 추천 등급: 기존 상위 추천군 · id: deepx

## 한 줄 결론
판교 엣지 NPU 팹리스로 **Firmware / SoC Platform / System SW** 공개 채용이 활발해 **트랙 B(MCU·BSP·임베)** 최우선 Apply 대상이다. JD에 **“연봉 수준의 스톡옵션”**이 명시되어 있으므로 오퍼 시 **현금 고정급+확정 성과를 먼저** 숫자로 받을 것(스톡≠현금 하드바 대체 불가). Blind 공개 시그널은 문화·WLB에서 혼재(종합 3.6대, WLB 낮음) — 면접 검증 필수.

## 회사 개요
- **사업/제품**: 온디바이스·엣지 AI NPU SoC(DX 시리즈 등) + DXNN SDK(펌웨어·드라이버·컴파일러 DX-COM·런타임 DX-RT). Physical AI/엣지 추론 포지션.
- **규모·단계**: Series D·pre-IPO 표기(JD·보도). 프리머니 ~2.85조·1차 3,000억+ 등 보도([딜사이트](https://dealsite.co.kr/articles/165199) 선행 조사 인용). 비상장 스케일업.
- **위치**: 경기 성남시 판교역로241번길 20 미래에셋벤처타워 5층.
- **채용 허브**: https://deepx.career.greetinghr.com/ko/career

## 목표 직무·공고
- **타깃**: [SW] Firmware Engineer, System SW Engineer, SoC Platform SW(HW/SW 접점), (보조) PCIe / Linux ISP / Android BSP — .NET/WPF 없음.
- **현재 공개 (2026-09-29)**: Greeting 커리어에 Firmware·System SW·NPU Runtime·Compiler·PCIe·Android BSP 등 **다수 오픈**.
  - Firmware: https://deepx.career.greetinghr.com/en/o/149064 (경력 3년+)
  - System SW: https://deepx.career.greetinghr.com/en/o/114813
  - SoC Platform SW: 직행 등 미러(상시 표기 이력)
- **마감**: 상시·모집완료 시 조기마감. 하드 데드라인 미확인.
- **JD 매핑 (Firmware o/149064 기준)**

| JD 요구 | 후보 | 핏 |
|--------|------|-----|
| C/C++ 임베디드 FW, ARM Cortex-M/A | Kinetis·STM32·i.MX 계열 FW | 강 |
| BSP, bootloader, 시스템 초기화 | 임베디드 리눅스·보드 소프트웨어 | 강 |
| RTOS / Linux FW | 임베디드 리눅스(i.MX) 경험 | 중~강 |
| 전력·메모리 최적화, NPU 인터페이스 | 장비 제품 최적화 경험; NPU 도메인 신규 | 부분 |
| JTAG/GDB 디버깅 | 임베디드 HW-SW 경계 디버깅 | 중~강 |
| PCIe/DDR/MIPI/USB 등 (우대) | 제품 통신·주변장치 — 상세는 이력서에 있는 것만 | 부분 |

## 위치·접근성
- **판교** — 동탄 기준 통근권 **양호**(자차/광역버스/GTX-A 수서·동탄↔삼성 축과 환승 조합 가능). 보드: 판교 ✅.
- GTX-A: 동탄↔수서 실효권 활용 가능(판교 직접역은 별도 — 동선은 면접 전 실제 피크 타임 측정 권장).

## 처우 시그널
- 잡코리아 공개 평균 **~5,415만** — 시니어·현금 근거로 쓰기 **부적절/낮음**. Band **B** 회사평균 시그널.
- JD Benefits: **모든 정규직 입사자에게 연봉 수준의 스톡옵션 부여**(o/149064). → **스톡 액면·베스팅·희석을 현금 대체로 계산하지 말 것.**
- 사람인 등 다른 집계는 편차 큼 — **미확인 시니어 밴드**.
- **하드바**: 세전 현금(+확정 성과) >7천만 **서면**. 스톡·미확정 성과는 별도 라인.

## 문화·리스크
- Blind(선행 2026-09-17 확인): 종합 **3.6**/72 · 문화 **3.8** · WLB **2.7** · 추천 ~36% — 실력·복지 vs 정치·학벌·강도 비판 혼재. ([job-startups-culture](/workspace/job-startups-culture-2026-09-17.md))
- 리스크: 양산·고객 납기, 영어 JD/글로벌 협업, **현금 vs 스톡 협상**, WLB.
- 근무시간 JD: 월~금 09–18 표기.

## 면접·이력서 포인트
1. **트랙 B 전면**: Accura MCU FW 제품 라인(Kinetis 다수 변형) bring-up·양산 안정화.
2. i.MX 임베디드 리눅스 드라이버·앱 — BSP/System SW 스토리.
3. boot·초기화·호스트 통신(장비 프로토콜)을 NPU FW 인터페이스 학습 의지와 연결.
4. AccuraLogic/WPF는 **한 줄만**(제품 소유권·품질 감각) — 주력 포지션이 FW면 과대포장 금지.
5. 디버깅: JTAG·로직·크로스레이어 RCA 사례 1개 준비.
6. 처우 단계에서 스톡 부여 문구를 인용하며 **현금 고정 숫자** 요청.

**물어볼 질문**
1. Firmware vs SoC Platform vs System SW 팀 경계와 온보딩 포지션은?
2. 오퍼 구성에서 **현금 연봉·확정 성과 vs 스톡** 비율의 일반적 범위는? (시니어)
3. 주당 실근무·온콜·양산 이슈 대응 강도(Blind WLB 시그널 검증)?

## 리서치 체크리스트
- [ ] https://deepx.career.greetinghr.com/ko/career 에서 Firmware / System SW / SoC Platform URL 확정
- [ ] 이력서 **트랙 B** (영문 혼용 JD 대비 기술 영어 bullet)
- [ ] 처우: 1차 오퍼 시 현금부터 — 스톡은 부가
- 다음 액션: Firmware Engineer(o/149064) 서류 제출 + System SW 병행 검토.

## 리서치 갱신 포인트
- 1순위 Firmware Engineer(o/149064), 2순위 System SW / SoC Platform.
- Windows NPU Driver·신입 표기 공고는 제외.
- 영문 JD 비중 큼 → 이력서 영문 bullet + 기술 영어 인터뷰 대비.
- 전형: 서류–(전화)–기술–컬처–CEO–레퍼런스/처우. CEO 면접 전 현금 밴드 내부 하한 확정.

## 제품·시장 맥락
- 엣지/Physical AI NPU — 데이터센터 NPU(리벨리온·퓨리오사)와 세그먼트  Differ. 차량·카메라·로봇 고객 스토리 가능.
- Series D·pre-IPO → 스톡 스토리 강함. **현금 하드바와 충돌 지점**.

## 회사 품질 점검
- 비상장 스케일업(상장 전) — “중견 이상·상장 상향” 원칙과 **긴장**. 펀딩·양산 가시성으로 보완 판단.
- 역할: 제품 SoC FW/BSP ✅
- 통근 판교 ✅
- 현금>7천만: **미검증·스톡 주의** → 미달 시 철회

## 출처
- https://deepx.career.greetinghr.com/ko/career
- https://deepx.career.greetinghr.com/en/o/149064
- https://deepx.career.greetinghr.com/en/o/114813
- https://www.jobkorea.co.kr/Recruit/Salary/27735671
- https://dealsite.co.kr/articles/165199
- 내부: `/workspace/job-highpay-startups-2026-09-16.md`, `/workspace/job-startups-culture-2026-09-17.md`, `/workspace/job-salary-band-shortlist-2026-09-17.md`
