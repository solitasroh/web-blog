---
title: "임베디드 C 코딩 표준, 제대로 알고 쓰자"
date: "2026-02-07"
tags: ["Embedded", "C", "Coding Standards", "clang-tidy", "MISRA", "BARR-C"]
excerpt: "clang-tidy 도입을 검토하면서 임베디드 C 코딩 표준 4가지를 비교 분석했다. BARR-C, MISRA-C, CERT C, Linux Kernel Style까지, 각 표준의 특징과 선택 기준을 정리했다."
---

# 왜 코딩 표준을 찾게 되었나

임베디드 프로젝트에 **clang-tidy**를 도입하기로 결정했다. 하지만 막상 설정 파일을 만들려니 막막했다. 어떤 규칙을 활성화해야 할까? 임베디드 시스템에 맞는 체크 항목은 뭘까?

검색해보니 "MISRA-C를 따르세요", "BARR-C가 실용적입니다", "CERT C로 보안을 챙기세요" 같은 답변들이 나왔다. 그래서 제대로 조사해보기로 했다.

이 글은 **clang-tidy 설정을 위해 조사한 4가지 주요 코딩 표준**을 정리한 내용이다.

---

## C 언어, 왜 표준이 필요한가?

C 언어는 임베디드 시스템의 표준 언어다. 하지만 다음과 같은 위험 요소가 있다:

### 1. Type-safe하지 않음

```c
// 이런 코드도 컴파일러가 막지 못한다
int* p = (int*)0x12345678;  // 임의의 주소
*p = 42;  // 하드웨어 레지스터? 일반 메모리? 누가 알겠나
```

### 2. Undefined Behavior (UB)

```c
// signed 정수 오버플로 - UB!
int32_t a = INT32_MAX;
int32_t b = a + 1;  // 무슨 일이 일어날까? 아무도 모른다

// 배열 범위 초과 - UB!
int arr[10];
arr[100] = 0;  // 컴파일은 되지만...
```

### 3. Implementation-defined

```c
// 우측 시프트 동작이 컴파일러마다 다르다
int32_t x = -1;
int32_t y = x >> 1;  // 논리 시프트? 산술 시프트?
```

임베디드 시스템에서 이런 문제는 **재현하기 어려운 버그**로 이어진다. 한 달에 한 번씩 랜덤하게 멈추는 시스템, 특정 온도에서만 오작동하는 장비... 악몽 같은 일들이다.

그래서 **코딩 표준**이 필요하다. 컴파일러가 잡지 못하는 문제를 사전에 방지하는 것이다.

---

## 4가지 주요 코딩 표준

조사 결과, 임베디드 C 코딩 표준은 크게 4가지로 정리됐다:

| 표준 | 개발 기관 | 규칙 수 | 주요 목적 | 대상 산업 |
|------|-----------|---------|-----------|-----------|
| **BARR-C:2018** | Barr Group | ~60개 | 스타일 + 버그 방지 | 범용 임베디드 |
| **MISRA-C:2012** | MISRA | 159개 | 안전성 + 이식성 | 자동차, 항공, 의료 |
| **CERT C** | SEI CMU | 99+185개 | 보안 취약점 방지 | 보안 중시 시스템 |
| **Linux Kernel** | Linus Torvalds | 스타일 가이드 | 일관성 + 가독성 | Linux 커널 |

각 표준을 하나씩 살펴보자.

---

## 1. BARR-C:2018 - 실용주의자의 선택

> **PDF 다운로드**: [Barr Group 공식 사이트](https://barrgroup.com/sites/default/files/barr_c_coding_standard_2018.pdf)

**특징**:
- MISRA-C:2012와 완전 호환 (충돌 제거)
- 스타일 가이드 중심 (MISRA가 안 다루는 부분)
- 실용적이고 명확한 규칙

### 대표 규칙 예시

#### 규칙 1: 모든 제어문에 중괄호 필수

```c
// ❌ 나쁜 예
if (error)
    return -1;

// ✅ 좋은 예
if (error) {
    return -1;
}
```

이유: Apple의 "goto fail" 버그를 기억하는가? 중괄호 하나 때문에 SSL 보안이 무너졌다.

#### 규칙 2: 고정 폭 정수 사용

```c
// ❌ 나쁜 예 - 플랫폼마다 크기가 다름
int counter;
unsigned long address;

// ✅ 좋은 예
int32_t counter;
uint32_t address;
```

32비트 ARM과 16비트 MSP430에서 `int`의 크기가 다르다. 이식성을 위해 `<stdint.h>`를 쓰자.

#### 규칙 3: goto 금지 (예외: 오류 처리 클린업)

```c
// ✅ 허용되는 예외 - 오류 처리 정리
int init_system(void) {
    if (!init_uart()) goto error;
    if (!init_i2c()) goto cleanup_uart;
    if (!init_spi()) goto cleanup_i2c;
    
    return 0;

cleanup_i2c:
    deinit_i2c();
cleanup_uart:
    deinit_uart();
error:
    return -1;
}
```

### 함수 크기 제한

**권장**: 50줄 이내, **최대**: 100줄

이유: 한 화면에 함수 전체가 보여야 이해하기 쉽다.

---

## 2. MISRA-C:2012 - 안전 중시의 엄격함

> **공식 사이트**: [MISRA](https://misra.org.uk/) (유료 문서)

자동차 산업에서 시작했지만, 현재 항공, 의료, 철도 등 **안전 중시 산업의 사실상 표준**이다. ISO 26262 (자동차 기능 안전)에서 권장한다.

**특징**:
- **159개 규칙** (143 기본 + 16 확장)
- 3단계 준수 레벨 (Mandatory > Required > Advisory)
- 정적 분석 도구 필수

### 규칙 분류

| 카테고리 | 예시 |
|----------|------|
| Mandatory | 반드시 준수 (예외 없음) |
| Required | 필요 (문서화된 편차 허용) |
| Advisory | 권고 (편차 기록 권장) |

### 대표 규칙 예시

#### 규칙 2.7: 사용되지 않는 매개변수 처리

```c
// ✅ MISRA 준수
void callback(int event_id) {
    (void)event_id;  // 명시적으로 미사용 표시
    // event_id를 사용하지 않음
}
```

#### 규칙 14.4: 부동소수점 루프 카운터 금지

```c
// ❌ MISRA 위반
for (float f = 0.0f; f < 1.0f; f += 0.1f) {
    // 0.1을 정확히 표현 못함 → 무한 루프 가능!
}

// ✅ MISRA 준수
for (int i = 0; i < 10; i++) {
    float f = i * 0.1f;
}
```

#### 규칙 21.3: 동적 메모리 할당 금지

```c
// ❌ MISRA 위반 (안전 중시 시스템)
void* ptr = malloc(100);

// ✅ 대안: 정적 할당
uint8_t buffer[100];
```

이유: 동적 메모리 할당은 **메모리 누수, 단편화, 비결정적 동작**을 유발할 수 있다.

### MISRA의 장단점

**장점**:
- 인증 프로젝트에서 요구
- 포괄적인 안전 규칙
- 도구 지원 우수 (PC-lint, Helix QAC 등)

**단점**:
- **엄격함** (생산성 저하 가능)
- 학습 곡선 가파름
- 유료 문서

---

## 3. CERT C - 보안 취약점 사냥꾼

> **공식 사이트**: [SEI CERT C](https://wiki.sei.cmu.edu/confluence/display/c)

Carnegie Mellon 대학의 소프트웨어 공학 연구소(SEI)에서 개발했다. **보안 취약점 방지**에 초점을 맞춘다.

**특징**:
- **99개 규칙 + 185개 권고**
- CWE (Common Weakness Enumeration)와 연계
- 무료 공개

### 대표 규칙 예시

#### INT32-C: signed 정수 오버플로는 UB

```c
// ❌ CERT 위반 - 오버플로 검사 없음
int32_t result = a + b;

// ✅ CERT 준수 - 오버플로 검사
if (((b > 0) && (a > (INT32_MAX - b))) ||
    ((b < 0) && (a < (INT32_MIN - b)))) {
    // 오버플로 발생
    handle_error();
} else {
    int32_t result = a + b;
}
```

#### MEM30-C: 해제된 메모리 접근 금지 (Use After Free)

```c
// ❌ CERT 위반
free(ptr);
*ptr = 0;  // 위험!

// ✅ CERT 준수
free(ptr);
ptr = NULL;  // 재접근 방지
```

#### ARR30-C: 배열 범위 검사

```c
// ❌ CERT 위반
void process(int index) {
    int arr[10];
    arr[index] = 0;  // index가 범위 내인지 확인 안 함!
}

// ✅ CERT 준수
void process(int index) {
    int arr[10];
    if (index >= 0 && index < 10) {
        arr[index] = 0;
    }
}
```

### CERT C의 장단점

**장점**:
- 보안 취약점 체계적 정리
- 무료, 온라인 접근 가능
- CWE와 연계되어 CVE 분석에 유용

**단점**:
- 임베디드 특화 규칙은 적음
- MISRA만큼 포괄적이지 않음

---

## 4. Linux Kernel Coding Style - 실용주의의 극치

> **공식 문서**: [Linux Kernel Coding Style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html)

Linus Torvalds가 만든 스타일 가이드. 수백만 줄의 코드를 수천 명의 개발자가 유지보수하는 프로젝트에서 검증됐다.

**특징**:
- **간결함**과 **가독성** 최우선
- 탭 = 8칸 (타협 불가)
- 라인 길이 80자

### 대표 규칙

#### 탭 = 8칸

```c
// ✅ Linux Kernel 스타일
void foo(void)
{
        if (condition) {
                do_something();
        }
}
```

이유: 들여쓰기 3단계 이상이면 **함수를 쪼개라**는 신호다.

#### K&R 중괄호 스타일

```c
// ✅ 제어문 - K&R
if (condition) {
    action();
} else {
    other_action();
}

// ✅ 함수 - 새 줄
int function(int x)
{
    return x * 2;
}
```

#### 함수는 짧게

**권장**: 1-2 화면 (24-48줄)
**지역 변수**: 최대 5-10개

이유: 복잡한 함수는 버그의 온상이다.

### Linux Kernel의 장단점

**장점**:
- 실용적이고 명확
- 큰 프로젝트에서 검증됨
- 무료

**단점**:
- 안전/보안 규칙은 부족
- 커널 개발 외에는 강제력 없음

---

## 어떤 표준을 선택해야 할까?

### 프로젝트 유형별 추천

| 프로젝트 유형 | 추천 표준 | 이유 |
|---------------|-----------|------|
| 자동차/항공/의료 | **MISRA-C + BARR-C** | 인증 필수, 기능 안전 |
| 일반 임베디드 | **BARR-C** | 실용적, 버그 방지 |
| IoT 보안 | **CERT C + BARR-C** | 보안 취약점 방지 |
| Linux 드라이버 | **Linux Kernel Style** | 커널 통합 필수 |
| 레거시 유지보수 | **BARR-C** | 점진적 적용 가능 |

### 의사결정 플로우

```
인증 필요? (ISO 26262, DO-178C 등)
  └─ Yes → MISRA-C + BARR-C
  └─ No  → 보안 중요?
            └─ Yes → CERT C + BARR-C
            └─ No  → 일반 임베디드?
                      └─ Yes → BARR-C
                      └─ No  → Linux 커널 개발?
                                └─ Yes → Linux Kernel Style
                                └─ No  → BARR-C (기본 선택)
```

---

## clang-tidy와 함께 쓰기

내가 clang-tidy를 도입하려는 이유는 **자동화된 코드 검사** 때문이다. 코드 리뷰에서 스타일 지적하느라 시간 낭비하기 싫었다.

### clang-tidy 설정 예시

조사 결과를 바탕으로 만든 `.clang-tidy` 설정:

```yaml
# .clang-tidy
Checks: >
  -*,
  bugprone-*,
  cert-*,
  misc-*,
  readability-*,
  -readability-magic-numbers

CheckOptions:
  # BARR-C 영향: 함수 크기 제한
  - key: readability-function-size.StatementThreshold
    value: 50
  - key: readability-function-size.LineThreshold
    value: 100
  
  # BARR-C 영향: 명명 규칙
  - key: readability-identifier-naming.FunctionCase
    value: lower_case
  - key: readability-identifier-naming.VariableCase
    value: lower_case
  - key: readability-identifier-naming.GlobalConstantCase
    value: UPPER_CASE
```

**활성화한 체크**:
- `bugprone-*`: 잠재적 버그 탐지
- `cert-*`: CERT C 규칙
- `readability-*`: 가독성 규칙

**비활성화한 체크**:
- `readability-magic-numbers`: 임베디드에서는 하드웨어 주소 등 매직 넘버가 많아서

---

## 점진적 적용 전략

코딩 표준을 갑자기 전부 적용하면 **저항**이 크다. 팀원들이 "일은 안 하고 린트 오류나 고치네"라고 불평할 것이다.

내가 계획한 단계:

### 1단계: 컴파일러 경고 최대화 (1주)

```bash
gcc -Wall -Wextra -Werror ...
```

### 2단계: BARR-C 스타일 규칙 (2주)

- 중괄호, 들여쓰기, 명명 규칙
- 자동 포맷팅 도구 (`clang-format`) 사용

### 3단계: clang-tidy 도입 (1개월)

- 낮은 심각도 규칙부터
- 신규 코드에만 먼저 적용

### 4단계: MISRA/CERT 규칙 추가 (점진적)

- 프로젝트 성격에 따라 선택
- 위반 건수 모니터링

### 5단계: CI/CD 통합

- PR마다 자동 검사
- 린트 오류는 머지 블록

---

## 정적 분석 도구 비교

| 도구 | 지원 표준 | 특징 | 가격 |
|------|-----------|------|------|
| **PC-lint** | MISRA, CERT, BARR | 업계 표준, 광범위 지원 | 유료 (~$500) |
| **Helix QAC** | MISRA, CERT, BARR | 자동차 산업 표준, 인증 지원 | 유료 (비쌈) |
| **Polyspace** | MISRA, CERT | MathWorks, 형식 검증 | 유료 (매우 비쌈) |
| **cppcheck** | 일부 MISRA | 오픈소스, 무료 | 무료 |
| **clang-tidy** | CERT, 일부 MISRA | 오픈소스, LLVM 기반 | 무료 |

나는 **clang-tidy**를 선택했다. 무료이고, CI/CD 통합이 쉽고, LLVM 커뮤니티가 활발하기 때문이다.

---

## 배운 점

### 1. 완벽한 표준은 없다

각 표준마다 목적이 다르다. 프로젝트 특성에 맞게 골라 써야 한다.

### 2. 표준은 도구다, 목적이 아니다

표준을 맹목적으로 따르다가 **생산성이 떨어지면** 본말이 전도된 것이다. 팀 상황에 맞게 **선택적으로** 적용해야 한다.

### 3. 자동화가 핵심이다

사람이 수동으로 코드 리뷰하며 스타일 지적하는 건 비효율적이다. **clang-tidy 같은 도구**로 자동화하고, 리뷰는 **로직과 설계**에 집중해야 한다.

---

## 다음 편 예고

이 시리즈는 계속된다:

- **2편**: BARR-C:2018 심화 - 실전 적용 가이드
- **3편**: MISRA-C가 까다로운 이유 - 안전 중시 규칙 분석
- **4편**: clang-tidy 설정 파헤치기 - .clang-tidy 완벽 가이드

---

## 참고 자료

### 공식 문서
- [Barr Group BARR-C:2018 PDF](https://barrgroup.com/sites/default/files/barr_c_coding_standard_2018.pdf)
- [MISRA 공식 사이트](https://misra.org.uk/)
- [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c)
- [Linux Kernel Coding Style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html)

### 도구
- [clang-tidy 공식 문서](https://clang.llvm.org/extra/clang-tidy/)
- [PC-lint](https://pclintplus.com/)
- [cppcheck](http://cppcheck.net/)

### 도서
- "Embedded C Coding Standard" - Michael Barr
- "The CERT C Coding Standard" - Robert C. Seacord

---

**시리즈**: [1편] 임베디드 C 코딩 표준 비교 | [2편] BARR-C 실전 | [3편] MISRA-C 심화 | [4편] clang-tidy 설정
