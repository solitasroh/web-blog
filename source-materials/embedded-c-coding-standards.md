# 임베디드 C 코딩 표준 종합 가이드

> 이 문서는 임베디드 시스템 개발에서 사용되는 주요 C 코딩 표준들을 종합 정리한 것입니다.
> 작성일: 2026-01-18

---

## 목차

1. [개요](#개요)
2. [Barr Group BARR-C:2018](#barr-group-barr-c2018)
3. [MISRA-C:2012/2023](#misra-c20122023)
4. [SEI CERT C Coding Standard](#sei-cert-c-coding-standard)
5. [Linux Kernel Coding Style](#linux-kernel-coding-style)
6. [함수 크기 권장 사항 비교](#함수-크기-권장-사항-비교)
7. [공통 핵심 규칙](#공통-핵심-규칙)
8. [실무 적용 가이드](#실무-적용-가이드)

---

## 개요

### 왜 코딩 표준이 필요한가?

C 언어는 임베디드 시스템에서 가장 널리 사용되는 언어이지만, 다음과 같은 위험 요소가 있습니다:

- **Type-safe 하지 않음**: 컴파일러가 타입 오류를 충분히 검출하지 못함
- **Undefined Behavior (UB)**: ISO C 표준에서 명시하지 않은 동작이 많음
- **Implementation-defined Behavior**: 컴파일러마다 다르게 동작하는 부분 존재
- **런타임 검사 제한**: 배열 범위 검사, 널 포인터 검사 등이 기본 제공되지 않음

### 주요 코딩 표준 비교

| 표준               | 목적              | 규칙 수             | 대상 산업       |
| ---------------- | --------------- | ---------------- | ----------- |
| **BARR-C:2018**  | 스타일 가이드, 버그 최소화 | ~60개 규칙          | 범용 임베디드     |
| **MISRA-C:2012** | 안전성, 보안성, 이식성   | 143+16 (총 159개)  | 자동차, 항공, 의료 |
| **CERT C**       | 보안 취약점 방지       | 99개 규칙 + 185개 권고 | 보안 중시 시스템   |
| **Linux Kernel** | 일관성, 가독성        | 스타일 가이드          | Linux 커널 개발 |

---

## Barr Group BARR-C:2018

> **출처**: [Barr Group Embedded C Coding Standard](https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard1)
> **PDF**: [BARR-C:2018 다운로드](https://barrgroup.com/sites/default/files/barr_c_coding_standard_2018.pdf)

### 특징

- **MISRA-C:2012와 완전 호환**: 2018년 버전에서 MISRA와 충돌 제거
- **스타일 가이드 중심**: MISRA가 다루지 않는 코딩 스타일 규정
- **실용적 접근**: 버그 최소화에 초점

### 1. 일반 규칙 (General Rules)

#### 1.1 C 언어 버전 (Which C?)
- C99 또는 그 이상 사용 권장
- `<stdint.h>`, `<stdbool.h>` 사용

#### 1.2 라인 너비 (Line Widths)
- **규칙**: 한 줄은 80자를 초과하지 않아야 함
- 예외: 긴 문자열 리터럴

#### 1.3 중괄호 (Braces)

**규칙 1.3.a**: 모든 제어문 블록은 반드시 중괄호로 감싸야 함
```c
// 나쁜 예
if (condition)
    do_something();

// 좋은 예
if (condition)
{
    do_something();
}
```

**규칙 1.3.b**: 여는 중괄호는 새 줄에 단독으로 위치 (Allman 스타일)
```c
if (depth_in_ft > 10)
{
    dive_stage = DIVE_DEEP;
}
else
{
    dive_stage = DIVE_SHALLOW;
}
```

#### 1.4 괄호 (Parentheses)
- 연산자 우선순위가 명확하지 않은 경우 괄호 사용
```c
// 좋은 예
if ((a == b) && (c == d))
```

#### 1.5 공통 약어 (Common Abbreviations)

| 전체 이름         | 약어   |
| ------------- | ---- |
| argument      | arg  |
| buffer        | buf  |
| count         | cnt  |
| character     | ch   |
| configuration | cfg  |
| current       | cur  |
| error         | err  |
| index         | idx  |
| initialize    | init |
| maximum       | max  |
| minimum       | min  |
| message       | msg  |
| pointer       | ptr  |
| previous      | prev |
| register      | reg  |
| string        | str  |
| temporary     | tmp  |

#### 1.6 타입 캐스트 (Casts)
- 명시적 캐스트 필요 시에만 사용
- 캐스트 시 주석으로 이유 설명

#### 1.7 피해야 할 키워드 (Keywords to Avoid)
- `goto`: 절대 사용 금지 (예외: 오류 처리 클린업)
- `continue`: 가능한 피할 것
- `break` (switch 외): 가능한 피할 것

#### 1.8 자주 사용할 키워드 (Keywords to Frequent)
- `static`: 모듈 내부 함수/변수에 반드시 사용
- `const`: 변경되지 않는 데이터에 사용
- `volatile`: 하드웨어 레지스터, ISR 공유 변수에 사용

---

### 2. 모듈 규칙 (Module Rules)

#### 2.1 명명 규칙 (Naming Conventions)

**파일 명명**:
- 소문자와 밑줄 사용: `module_name.c`, `module_name.h`
- 길이 제한: 31자 이내 (이식성)

**함수 명명**:
```c
// 모듈명_동사_명사 형식
void display_init(void);
void display_write_pixel(uint16_t x, uint16_t y);
static void display_send_command(uint8_t cmd);  // private 함수
```

**변수 명명**:
```c
// 전역 변수: g_ 접두어
uint32_t g_system_tick;

// 지역 static 변수: 모듈명_ 접두어
static uint8_t display_brightness;

// 포인터: p_ 접두어 권장
uint8_t* p_buffer;
```

**타입 명명**:
```c
// 구조체: _t 접미어
typedef struct
{
    uint16_t x;
    uint16_t y;
} point_t;

// 열거형: _e 접미어
typedef enum
{
    STATE_IDLE,
    STATE_RUNNING,
    STATE_ERROR
} state_e;
```

#### 2.2 헤더 파일 (Header Files)

**규칙 2.2.a**: 모든 헤더 파일은 include guard 사용
```c
#ifndef MODULE_NAME_H
#define MODULE_NAME_H

// 내용

#endif /* MODULE_NAME_H */
```

**규칙 2.2.b**: 헤더에는 선언만, 정의는 소스 파일에
```c
// module.h
extern uint32_t g_counter;  // 선언

// module.c
uint32_t g_counter = 0;     // 정의
```

#### 2.3 소스 파일 (Source Files)

권장 구조:
```c
/**
 * @file    module_name.c
 * @brief   모듈 설명
 * @author  작성자
 * @date    작성일
 */

/* Includes ------------------------------------------------------------------*/
#include "module_name.h"    // 자신의 헤더 먼저
#include <stdint.h>         // 표준 라이브러리
#include "other_module.h"   // 프로젝트 헤더

/* Private defines -----------------------------------------------------------*/
#define BUFFER_SIZE  256

/* Private types -------------------------------------------------------------*/
typedef struct { ... } internal_data_t;

/* Private variables ---------------------------------------------------------*/
static uint8_t s_buffer[BUFFER_SIZE];

/* Private function prototypes -----------------------------------------------*/
static void helper_function(void);

/* Public functions ----------------------------------------------------------*/
void module_init(void) { ... }

/* Private functions ---------------------------------------------------------*/
static void helper_function(void) { ... }
```

---

### 3. 데이터 타입 규칙 (Data Type Rules)

#### 3.1 고정 폭 정수 (Fixed-Width Integers)

**규칙 3.1.a**: 비트 폭이 중요한 경우 반드시 고정 폭 정수 사용
```c
// 나쁜 예 - 플랫폼마다 크기가 다름
int counter;
unsigned long address;

// 좋은 예
int32_t counter;
uint32_t address;
```

**표준 타입**:
| 타입 | 크기 | 부호 |
|------|------|------|
| `int8_t` | 8비트 | 부호 있음 |
| `uint8_t` | 8비트 | 부호 없음 |
| `int16_t` | 16비트 | 부호 있음 |
| `uint16_t` | 16비트 | 부호 없음 |
| `int32_t` | 32비트 | 부호 있음 |
| `uint32_t` | 32비트 | 부호 없음 |
| `int64_t` | 64비트 | 부호 있음 |
| `uint64_t` | 64비트 | 부호 없음 |

#### 3.2 부호 있는/없는 정수

**규칙 3.2.a**: 비트 연산에는 unsigned 타입만 사용
```c
// 나쁜 예
int8_t flags = data >> 4;

// 좋은 예
uint8_t flags = data >> 4;
```

**규칙 3.2.b**: signed와 unsigned 혼합 연산 금지
```c
// 위험한 코드
int32_t a = -1;
uint32_t b = 1;
if (a < b)  // 예상과 다르게 동작할 수 있음!
```

#### 3.3 부동소수점 (Floating Point)

- 가능하면 정수 연산으로 대체
- 부동소수점 비교 시 epsilon 사용
```c
#define EPSILON  0.0001f
if (fabs(a - b) < EPSILON)
{
    // 같음
}
```

#### 3.4 불리언 (Booleans)

**규칙**: `<stdbool.h>` 사용
```c
#include <stdbool.h>

bool is_valid = true;
bool is_empty = false;
```

---

### 4. 함수 규칙 (Procedure Rules)

#### 4.1 함수 (Functions)

**규칙 4.1.a**: 함수 길이는 한 페이지(약 50줄, 최대 100줄) 이내
```c
// 함수가 너무 길면 분리
void long_function(void)
{
    step1();
    step2();
    step3();
}

static void step1(void) { ... }
static void step2(void) { ... }
static void step3(void) { ... }
```

**규칙 4.1.b**: 함수는 하나의 출구점만 가지는 것이 좋음
```c
// 좋은 예 - 단일 return
int process_data(const uint8_t* data)
{
    int result = ERROR;

    if (data != NULL)
    {
        // 처리
        result = SUCCESS;
    }

    return result;
}
```

**규칙 4.1.c**: 모든 public 함수는 헤더에 프로토타입 선언

**규칙 4.1.d**: private 함수는 반드시 `static` 선언

**규칙 4.1.e**: 매개변수가 없는 함수는 `void` 명시
```c
void init(void);  // (void) 명시
```

#### 4.2 함수형 매크로 (Function-Like Macros)

**규칙 4.2.a**: 가능하면 inline 함수로 대체
```c
// 나쁜 예 - 매크로
#define SQUARE(x)  ((x) * (x))

// 좋은 예 - inline 함수
static inline int32_t square(int32_t x)
{
    return x * x;
}
```

**규칙 4.2.b**: 매크로 사용 시 규칙
- 전체 매크로 본문을 괄호로 감쌈
- 각 매개변수를 괄호로 감쌈
- 매개변수는 한 번만 사용 (부작용 방지)
- `return` 등 제어 흐름 변경 금지

```c
// 올바른 매크로 정의
#define MAX(a, b)  (((a) > (b)) ? (a) : (b))
```

---

### 5. 변수 규칙 (Variable Rules)

#### 5.1 초기화

**규칙 5.1.a**: 모든 변수는 선언 시 또는 사용 전 초기화
```c
uint32_t counter = 0;
uint8_t buffer[SIZE] = {0};
```

#### 5.2 const 사용

**규칙 5.2.a**: 변경되지 않는 변수는 `const` 사용
```c
const uint32_t TIMEOUT_MS = 1000;

void process(const uint8_t* data, size_t len)  // 포인터가 가리키는 데이터 보호
```

#### 5.3 volatile 사용

**규칙 5.3.a**: 다음 경우 반드시 `volatile` 사용
- 메모리 매핑 I/O 레지스터
- ISR과 공유되는 변수
- 멀티스레드 공유 변수

```c
volatile uint32_t* const p_uart_status = (uint32_t*)0x40000000;

static volatile bool g_data_ready = false;  // ISR에서 설정
```

---

### 6. 구문 규칙 (Statement Rules)

#### 6.1 switch 문

**규칙 6.1.a**: 모든 case는 `break` 또는 `return`으로 종료
```c
switch (state)
{
    case STATE_IDLE:
        handle_idle();
        break;

    case STATE_RUN:
        handle_run();
        break;

    default:
        handle_error();
        break;
}
```

**규칙 6.1.b**: `default` case 필수

**규칙 6.1.c**: fall-through 의도 시 주석 명시
```c
case STATE_A:
    // Fall through
case STATE_B:
    handle_both();
    break;
```

#### 6.2 if-else 문

**규칙 6.2.a**: `else if` 체인은 `else`로 종료
```c
if (x > 100)
{
    // ...
}
else if (x > 50)
{
    // ...
}
else
{
    // 기본 처리
}
```

#### 6.3 반복문

**규칙 6.3.a**: 무한 루프는 `for(;;)` 사용
```c
for (;;)
{
    // main loop
}
```

**규칙 6.3.b**: 루프 인덱스는 루프 내에서만 수정

---

## MISRA-C:2012/2023

> **출처**: [MISRA 공식 사이트](https://misra.org.uk/publications/)
> **참고**: [MISRA C and MISRA C++](https://www.perforce.com/resources/qac/misra-c-cpp)

### 개요

- **Motor Industry Software Reliability Association** 개발
- 자동차 산업에서 시작, 현재 다양한 안전 중시 산업에서 사용
- **ISO 26262** (자동차 기능 안전)에서 권장

### 규칙 분류

| 분류 | 설명 | 준수 요구 |
|------|------|-----------|
| **Mandatory** | 필수 | 예외 없이 준수 |
| **Required** | 필요 | 문서화된 편차 허용 |
| **Advisory** | 권고 | 편차 기록 권장 |

### 주요 규칙 카테고리

#### 1. Standard C Environment (규칙 1.1-1.4)
- C90, C99, C11 중 사용 버전 명시
- 컴파일러 확장 기능 문서화

#### 2. Unused Code (규칙 2.1-2.7)
- 도달 불가능한 코드 금지
- 사용되지 않는 매개변수 처리

```c
// MISRA 준수 - 사용되지 않는 매개변수
void callback(int32_t event_id)
{
    (void)event_id;  // 의도적으로 사용하지 않음
}
```

#### 3. Comments (규칙 3.1-3.2)
- `/* */` 주석 내 `/*` 금지
- 코드 비활성화에 `#if 0` 사용

```c
// 나쁜 예
/* 주석 /* 중첩 */ 오류 */

// 좋은 예 - 코드 비활성화
#if 0
    disabled_code();
#endif
```

#### 4. Character Sets and Lexical Conventions (규칙 4.1-4.2)
- 옥탈 및 이스케이프 시퀀스 규칙

#### 5. Identifiers (규칙 5.1-5.9)
- 식별자 고유성 (31자 이내 구별)
- 타입과 변수 이름 구분

#### 6. Types (규칙 6.1-6.2)
- 비트필드는 적절한 타입으로만

#### 7. Literals and Constants (규칙 7.1-7.4)
- 옥탈 상수 사용 금지 (0으로 시작)
- 문자열 리터럴 직접 수정 금지

```c
// 나쁜 예 - 옥탈 상수
int permissions = 0755;  // 혼동 가능

// 좋은 예
int permissions = 493;  // 또는 0x1ED
```

#### 8. Declarations and Definitions (규칙 8.1-8.14)
- 모든 함수/변수 명시적 타입 선언
- 외부 링크 객체는 하나의 정의만

#### 9. Initialization (규칙 9.1-9.5)
- 모든 변수 사용 전 초기화
- 배열/구조체 초기화 규칙

```c
// 부분 초기화 시 모든 요소가 0으로 초기화됨
uint8_t arr[10] = {1, 2};  // arr[2]~arr[9]는 0
```

#### 10. Essential Type Model (규칙 10.1-10.8)
- 암시적 변환 제한
- 복합 표현식 규칙

#### 11. Pointer Type Conversions (규칙 11.1-11.9)
- 포인터 간 변환 제한
- 함수 포인터 규칙

```c
// MISRA 위반 - 포인터를 정수로
uintptr_t addr = (uintptr_t)ptr;  // 피해야 함
```

#### 12. Expressions (규칙 12.1-12.5)
- 연산자 우선순위 명확히
- 부작용 있는 표현식 주의

```c
// 나쁜 예 - 평가 순서 불명확
x = arr[i] + i++;

// 좋은 예
x = arr[i];
i++;
```

#### 13. Side Effects (규칙 13.1-13.6)
- 초기화 리스트 내 부작용 금지
- volatile 접근 규칙

#### 14. Control Statement Expressions (규칙 14.1-14.4)
- 루프 카운터 적절히 사용
- 부동소수점 루프 카운터 금지

```c
// MISRA 위반 - 부동소수점 루프
for (float f = 0.0f; f < 1.0f; f += 0.1f)  // 금지!
```

#### 15. Control Flow (규칙 15.1-15.7)
- `goto` 제한적 사용 (앞으로만, 같은 블록 내)
- `switch` 문 규칙

#### 16. Switch Statements (규칙 16.1-16.7)
- well-formed switch 문 요구
- default case 필수

#### 17. Functions (규칙 17.1-17.8)
- 표준 라이브러리 함수 규칙
- 함수 프로토타입 필수

#### 18. Pointers and Arrays (규칙 18.1-18.8)
- 포인터 산술 제한
- 배열 범위 검사

#### 19. Overlapping Storage (규칙 19.1-19.2)
- union 사용 제한

#### 20. Preprocessing Directives (규칙 20.1-20.14)
- `#include` 지시문 규칙
- 매크로 정의 규칙

```c
// MISRA 권장 - 매크로 이름은 대문자
#define MAX_BUFFER_SIZE  256

// MISRA 위반 - 여러 줄 매크로에서 문제 가능
#define MACRO  do { \
    stmt1;  \
    stmt2;  \
} while(0)
```

#### 21. Standard Libraries (규칙 21.1-21.21)
- 금지된 함수: `abort`, `exit`, `getenv`, `system`
- 동적 메모리 할당 제한: `malloc`, `calloc`, `realloc`, `free`

#### 22. Resources (규칙 22.1-22.10)
- 리소스 해제 규칙
- 파일 핸들링

---

## SEI CERT C Coding Standard

> **출처**: [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c)
> **PDF**: [CERT C 2016 Edition](http://chenweixiang.github.io/docs/SEI_CERT_C_Coding_Standard_2016_Edition.pdf)

### 개요

- Carnegie Mellon University의 Software Engineering Institute 개발
- **보안 취약점 방지**에 중점
- CWE (Common Weakness Enumeration)와 연계

### 규칙 카테고리

#### PRE: Preprocessor (전처리기)
- PRE00-C: 함수형 매크로보다 inline 함수 선호
- PRE01-C: 매크로 내 괄호 사용
- PRE02-C: 매크로 이름 충돌 방지

#### DCL: Declarations (선언)
- DCL00-C: const 정확성 유지
- DCL01-C: 서브프로그램 이름 재사용 금지
- DCL30-C: 객체의 올바른 저장 기간 선언

#### EXP: Expressions (표현식)
- EXP00-C: 괄호로 연산자 우선순위 명확히
- EXP30-C: 부작용 평가 순서 의존 금지
- EXP33-C: 초기화되지 않은 메모리 읽기 금지

#### INT: Integers (정수)
- INT00-C: 정수 크기 가정 금지
- INT30-C: unsigned 정수 오버플로 주의
- INT32-C: signed 정수 오버플로 undefined behavior

```c
// CERT 위반 - 오버플로 가능
int32_t result = a + b;  // 오버플로 검사 없음

// CERT 준수
if (((b > 0) && (a > (INT32_MAX - b))) ||
    ((b < 0) && (a < (INT32_MIN - b))))
{
    // 오버플로 발생
}
else
{
    int32_t result = a + b;
}
```

#### FLP: Floating Point (부동소수점)
- FLP00-C: 부동소수점 연산 한계 이해
- FLP30-C: 루프 카운터로 부동소수점 금지

#### ARR: Arrays (배열)
- ARR00-C: 배열 크기 이해
- ARR30-C: 배열 범위 외 접근 금지

#### STR: Strings (문자열)
- STR00-C: 문자 데이터와 널 종료 문자열 구분
- STR30-C: 문자열 리터럴 수정 금지

#### MEM: Memory Management (메모리 관리)
- MEM00-C: 동일 추상화 수준에서 메모리 할당/해제
- MEM30-C: 해제된 메모리 접근 금지
- MEM33-C: 유연한 배열 멤버 올바른 할당
- MEM35-C: 객체에 충분한 메모리 할당

```c
// CERT 위반 - use after free
free(ptr);
*ptr = 0;  // 위험!

// CERT 준수
free(ptr);
ptr = NULL;
```

#### FIO: File I/O (파일 입출력)
- FIO30-C: 포맷 문자열에 사용자 입력 금지
- FIO42-C: 더 이상 필요 없으면 파일 닫기

#### ENV: Environment (환경)
- ENV00-C: getenv() 반환값 수정 금지
- ENV30-C: 함수 포인터 복사 주의

#### SIG: Signals (시그널)
- SIG30-C: signal 핸들러에서 비동기 안전 함수만 호출

#### ERR: Error Handling (오류 처리)
- ERR00-C: errno 올바르게 사용
- ERR30-C: 함수 호출 후 errno 검사

#### CON: Concurrency (동시성)
- CON30-C: 스레드 생성 후 리소스 정리
- CON32-C: 뮤텍스 올바른 사용

#### MSC: Miscellaneous (기타)
- MSC00-C: 높은 경고 수준으로 컴파일
- MSC30-C: rand() 대신 안전한 난수 생성기 사용

---

## Linux Kernel Coding Style

> **출처**: [Linux Kernel Coding Style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html)
> **참고**: [Kernel Newbies - Programming Style](https://kernelnewbies.org/New_Kernel_Hacking_HOWTO/Kernel_Programming_Style_Guidelines)

### 1. 들여쓰기 (Indentation)

- **탭 = 8칸** (타협 없음)
- 들여쓰기 3단계 이상이면 코드 리팩토링 필요
- 라인 길이: **80자** 권장 (강력한 권고)

```c
// 올바른 들여쓰기
void foo(void)
{
        if (condition) {
                do_something();
        }
}
```

### 2. 중괄호 배치 (Brace Placement)

- **K&R 스타일**: 여는 중괄호는 같은 줄 끝에
- **예외**: 함수 정의는 새 줄에 여는 중괄호

```c
// 제어문 - K&R 스타일
if (condition) {
        action();
} else {
        other_action();
}

// 함수 - 새 줄
int function(int x)
{
        return x * 2;
}
```

### 3. 명명 규칙 (Naming)

- **간결하게**: `tmp`, `i`, `j` 등 짧은 이름 허용
- **소문자 + 밑줄**: `read_file()`, `cmd_group_size`
- **금지**: 헝가리안 표기법, 대소문자 혼합

```c
// 좋은 예
int i, cnt;
char *tmp;
void init_module(void);

// 나쁜 예
int loopCounter;
int iLoopCounter;  // 헝가리안
void CommandAllocationGroupSize(void);  // 너무 김
```

### 4. 함수 (Functions)

- **길이**: 1-2 화면 (24-48줄)
- **지역 변수**: 최대 5-10개
- **하나의 기능**: 함수는 한 가지만 잘 수행

### 5. 주석 (Comments)

- **무엇(what)** 보다 **왜(why)** 설명
- 코드가 명확하면 주석 불필요
- C89 스타일 `/* */` 사용 (커널 코드)

```c
/*
 * 여러 줄 주석 형식
 * 각 줄은 *로 시작
 */

/* 한 줄 주석 */
```

### 6. 반환값 규칙

- **액션/명령 함수**: 성공 시 0, 실패 시 음수 오류 코드
- **술어 함수**: 참이면 1, 거짓이면 0

```c
// 명령 함수
int add_work(work_t *work)
{
        if (error)
                return -EBUSY;
        return 0;
}

// 술어 함수
int pci_dev_present(struct pci_dev *dev)
{
        if (found)
                return 1;
        return 0;
}
```

---

## 함수 크기 권장 사항 비교

| 출처 | 권장 크기 | 비고 |
|------|-----------|------|
| **Barr Group** | 50줄 권장, 최대 100줄 | 한 페이지 기준 |
| **MISRA-C** | 직접 규정 없음 | 복잡도 제한 간접 적용 |
| **Linux Kernel** | 24-48줄 (1-2 화면) | 지역 변수 5-10개 제한 |
| **Google C++** | ~40줄 | 스크롤 없이 볼 수 있는 크기 |
| **Sibros** | 10줄 | 매우 엄격 |
| **clang-tidy 기본값** | 800문장 | 도구 기본값 (매우 관대) |

### 실무 권장

- **일반 함수**: 30-50줄 목표
- **ISR/인터럽트**: 최대한 짧게, 최소한의 처리만
- **복잡한 상태 머신**: 100줄까지 허용 가능 (단, 주석 필수)

---

## 공통 핵심 규칙

### 1. 변수 규칙

| 규칙 | 설명 |
|------|------|
| 항상 초기화 | 선언 시 또는 사용 전 초기화 |
| 고정 폭 정수 | `int` 대신 `int32_t` 등 사용 |
| const 활용 | 변경되지 않는 값은 const |
| volatile 정확히 | 하드웨어/ISR 공유 변수에만 |
| 전역 최소화 | 가능한 static 또는 지역 변수 |

### 2. 함수 규칙

| 규칙 | 설명 |
|------|------|
| 단일 책임 | 하나의 기능만 수행 |
| 짧게 유지 | 30-50줄 권장 |
| 명확한 프로토타입 | 헤더에 선언, void 매개변수 명시 |
| static 활용 | 모듈 내부 함수는 static |
| 반환값 검사 | 오류 발생 가능 함수 반환값 확인 |

### 3. 포인터 규칙

| 규칙 | 설명 |
|------|------|
| NULL 검사 | 역참조 전 NULL 확인 |
| 초기화 | 선언 시 NULL 또는 유효 주소 |
| 해제 후 NULL | free() 후 NULL 할당 |
| 배열 범위 | 인덱스 유효성 검사 |

### 4. 메모리 규칙

| 규칙 | 설명 |
|------|------|
| 동적 할당 제한 | 초기화 시에만 할당 권장 |
| 할당 크기 검증 | 오버플로 주의 |
| 메모리 누수 방지 | 할당/해제 쌍 맞추기 |
| 스택 크기 주의 | 큰 지역 배열 피하기 |

### 5. 전처리기 규칙

| 규칙 | 설명 |
|------|------|
| 매크로 대문자 | `#define MAX_SIZE 100` |
| 괄호 사용 | `#define SQUARE(x) ((x)*(x))` |
| inline 함수 선호 | 매크로보다 타입 안전 |
| include guard | 모든 헤더에 필수 |

---

## 실무 적용 가이드

### 프로젝트 유형별 권장 표준

| 프로젝트 유형 | 권장 표준 | 이유 |
|---------------|-----------|------|
| 자동차/항공 | MISRA-C + BARR-C | 기능 안전 인증 요구 |
| 의료 기기 | MISRA-C + CERT C | 안전성 + 보안성 |
| 일반 임베디드 | BARR-C | 실용적, 버그 방지 |
| 리눅스 드라이버 | Linux Kernel Style | 커널 통합 시 필수 |
| IoT 보안 | CERT C + BARR-C | 보안 중시 |

### 정적 분석 도구

| 도구 | 지원 표준 | 특징 |
|------|-----------|------|
| **PC-lint** | MISRA, CERT, BARR | 상용, 광범위 지원 |
| **Polyspace** | MISRA, CERT | MathWorks, 인증 지원 |
| **Helix QAC** | MISRA, CERT, BARR | Perforce, 자동차 산업 표준 |
| **cppcheck** | 일부 MISRA | 오픈소스, 무료 |
| **clang-tidy** | CERT, 일부 MISRA | 오픈소스, LLVM |

### clang-tidy 설정 예시

```yaml
# .clang-tidy
Checks: >
  -*,
  bugprone-*,
  cert-*,
  misc-*,
  modernize-*,
  performance-*,
  readability-*,
  -readability-magic-numbers

CheckOptions:
  - key: readability-function-size.StatementThreshold
    value: 50
  - key: readability-function-size.LineThreshold
    value: 100
  - key: readability-identifier-naming.FunctionCase
    value: lower_case
  - key: readability-identifier-naming.VariableCase
    value: lower_case
  - key: readability-identifier-naming.GlobalConstantCase
    value: UPPER_CASE
```

### 점진적 적용 전략

1. **1단계**: 컴파일러 경고 레벨 최대 (`-Wall -Wextra -Werror`)
2. **2단계**: BARR-C 스타일 규칙 적용 (포맷팅)
3. **3단계**: 정적 분석 도구 도입 (낮은 심각도부터)
4. **4단계**: MISRA/CERT 규칙 점진적 적용
5. **5단계**: CI/CD에 자동 검사 통합

---

## 참고 자료

### 공식 문서
- [Barr Group BARR-C:2018](https://barrgroup.com/embedded-systems/books/embedded-c-coding-standard1)
- [MISRA Publications](https://misra.org.uk/publications/)
- [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c)
- [Linux Kernel Coding Style](https://www.kernel.org/doc/html/v4.10/process/coding-style.html)

### 도서
- "Embedded C Coding Standard" - Michael Barr (Barr Group)
- "MISRA C:2012 Guidelines" - MISRA Consortium
- "The CERT C Coding Standard" - Robert C. Seacord

### 도구
- [LDRA - BARR-C 지원](https://ldra.com/barr-c/)
- [Perforce Helix QAC](https://www.perforce.com/products/helix-qac)
- [clang-tidy](https://clang.llvm.org/extra/clang-tidy/)

---

> **작성자 노트**: 이 문서는 주요 임베디드 C 코딩 표준의 핵심 내용을 정리한 것입니다.
> 각 표준의 전체 규칙은 공식 문서를 참조하시기 바랍니다.
> 특히 MISRA-C는 유료 문서이므로 정확한 규칙 번호와 내용은 공식 발행물을 확인해야 합니다.
