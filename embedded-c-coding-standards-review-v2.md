---
title: "임베디드 C 코딩 표준, 제대로 알고 쓰자"
date: "2026-02-07"
tags: ["Embedded", "C", "Coding Standards", "clang-tidy", "MISRA", "ARM", "Kinetis"]
excerpt: "NXP Kinetis MK22F 프로젝트에 clang-tidy를 도입하면서 임베디드 C 코딩 표준 4가지를 비교 분석했다. BARR-C, MISRA-C, CERT C, Linux Kernel Style까지, ARM Cortex-M4 환경에서의 선택 기준을 정리했다."
---

# NXP Kinetis, 그리고 코딩 표준

회사에서 **NXP Kinetis MK22F** 기반 프로젝트를 진행하게 되었다. ARM Cortex-M4 코어, 120MHz, 512KB Flash. 빌드 시스템은 **CMake + Ninja**로 구성했다.

프로젝트가 커지면서 코드 품질이 고민되기 시작했다. 인터럽트 핸들러에서 전역 변수를 마구 건드리고, `volatile` 없이 하드웨어 레지스터를 접근하고, 배열 범위 체크 없이 포인터를 사용하는 코드들이 보였다.

"**clang-tidy**를 도입해보자."

하지만 막상 `.clang-tidy` 설정 파일을 만들려니 막막했다. 어떤 규칙을 활성화해야 할까? ARM 임베디드 환경에 맞는 체크 항목은 뭘까?

그래서 제대로 조사해보기로 했다. 이 글은 **clang-tidy 설정을 위해 조사한 4가지 임베디드 C 코딩 표준**과 **ARM Cortex-M4 환경에서의 적용 방법**을 정리한 내용이다.

---

## C 언어, ARM에서 더 위험한 이유

C 언어는 임베디드의 표준 언어지만, **ARM Cortex-M4 같은 환경**에서는 더욱 조심해야 한다.

### 1. 하드웨어 레지스터 접근

```c
// ❌ 위험한 코드 - volatile 없음
uint32_t* p_gpio = (uint32_t*)0x400FF000;  // GPIOA_PDOR
*p_gpio = 0x01;  // 컴파일러가 최적화로 날려버릴 수 있음!

// ✅ 올바른 코드
volatile uint32_t* p_gpio = (volatile uint32_t*)0x400FF000;
*p_gpio = 0x01;
```

Kinetis MK22F의 GPIO, UART, SPI 레지스터 접근 시 `volatile` 없으면 컴파일러 최적화에 의해 **쓰기 연산이 사라질 수 있다**.

### 2. 인터럽트와 공유 변수

```c
// ❌ 위험한 코드
uint32_t g_tick_count = 0;  // volatile 없음!

void SysTick_Handler(void) {
    g_tick_count++;  // ISR에서 수정
}

void delay_ms(uint32_t ms) {
    uint32_t start = g_tick_count;  // 메인 루프에서 읽기
    while ((g_tick_count - start) < ms);  // 무한 루프 가능!
}
```

ARM Cortex-M에서 인터럽트와 메인 코드가 공유하는 변수는 **반드시 `volatile`**이어야 한다. 안 그러면 컴파일러가 루프를 최적화하면서 변수 읽기를 생략할 수 있다.

```c
// ✅ 올바른 코드
volatile uint32_t g_tick_count = 0;
```

### 3. Unaligned Access

```c
// ❌ ARM에서 위험한 코드
uint8_t buffer[10];
uint32_t* p = (uint32_t*)(buffer + 1);  // 정렬되지 않은 주소!
*p = 0x12345678;  // Hard Fault 발생 가능!
```

ARM Cortex-M4는 기본적으로 **4바이트 정렬**을 요구한다. Unaligned access는 하드웨어 설정에 따라 동작하거나 **Hard Fault**를 일으킨다.

### 4. Stack Overflow

Kinetis MK22F는 RAM이 **128KB**밖에 안 된다. 스택 크기 설정을 잘못하면 바로 오버플로다.

```c
// ❌ 스택 폭탄
void process_data(void) {
    uint8_t huge_buffer[10240];  // 10KB 스택 사용!
    // ...
}
```

이런 이유로 **코딩 표준**이 필요하다. 컴파일러가 잡지 못하는 문제를 사전에 방지하는 것이다.

---

## 4가지 주요 코딩 표준

조사 결과, 임베디드 C 코딩 표준은 크게 4가지로 정리됐다:

| 표준 | 개발 기관 | 규칙 수 | 주요 목적 | ARM 적합성 |
|------|-----------|---------|-----------|-----------|
| **BARR-C:2018** | Barr Group | ~60개 | 스타일 + 버그 방지 | ⭐⭐⭐⭐ 매우 좋음 |
| **MISRA-C:2012** | MISRA | 159개 | 안전성 + 이식성 | ⭐⭐⭐⭐⭐ 최고 |
| **CERT C** | SEI CMU | 99+185개 | 보안 취약점 방지 | ⭐⭐⭐ 좋음 |
| **Linux Kernel** | Linus Torvalds | 스타일 가이드 | 일관성 + 가독성 | ⭐⭐ 보통 |

---

## 1. BARR-C:2018 - ARM 임베디드의 베스트 프렌드

> **PDF**: [Barr Group 공식 사이트](https://barrgroup.com/sites/default/files/barr_c_coding_standard_2018.pdf)

**특징**:
- MISRA-C:2012와 완전 호환
- ARM 임베디드에 최적화된 실용 규칙
- 명확하고 적용하기 쉬움

### ARM 특화 규칙 예시

#### 규칙 1: volatile 정확히 사용

```c
// Kinetis MK22F UART 레지스터 정의
typedef struct {
    volatile uint8_t  BDH;      // Baud Rate High
    volatile uint8_t  BDL;      // Baud Rate Low
    volatile uint8_t  C1;       // Control 1
    volatile uint8_t  C2;       // Control 2
    volatile uint8_t  S1;       // Status 1
    volatile uint8_t  S2;       // Status 2
    volatile uint8_t  C3;       // Control 3
    volatile uint8_t  D;        // Data
} UART_Type;

#define UART0 ((UART_Type*)0x4006A000)
```

**왜 volatile?**
- 하드웨어 레지스터는 CPU 외부에서 변경 가능
- 컴파일러 최적화 방지

#### 규칙 2: 고정 폭 정수 사용 (ARM 이식성)

```c
// ❌ 나쁜 예 - ARM과 AVR에서 크기 다름
int counter;
unsigned long address;

// ✅ 좋은 예 - 모든 플랫폼에서 일관됨
int32_t counter;
uint32_t address;
```

ARM Cortex-M4는 32비트지만, AVR ATmega는 8비트다. `int`의 크기가 다르다.

#### 규칙 3: ISR에서 최소한만 처리

```c
// ✅ BARR-C 권장 ISR 패턴
volatile bool g_uart_rx_ready = false;
volatile uint8_t g_uart_rx_data = 0;

void UART0_RX_TX_IRQHandler(void) {
    if (UART0->S1 & UART_S1_RDRF_MASK) {
        g_uart_rx_data = UART0->D;  // 데이터 읽기만
        g_uart_rx_ready = true;     // 플래그 설정만
        // 복잡한 처리는 메인 루프에서!
    }
}

void main_loop(void) {
    if (g_uart_rx_ready) {
        g_uart_rx_ready = false;
        process_uart_data(g_uart_rx_data);  // 여기서 처리
    }
}
```

**이유**: ISR은 짧아야 한다. 다른 인터럽트를 방해하지 않도록.

---

## 2. MISRA-C:2012 - 자동차급 안전성

> **공식 사이트**: [MISRA](https://misra.org.uk/) (유료)

자동차, 항공, 의료 기기 개발에서 **사실상 표준**이다. ARM 임베디드에서도 가장 엄격하고 안전한 규칙을 제공한다.

### ARM 관련 주요 규칙

#### 규칙 11.4: 포인터 타입 캐스팅 제한

```c
// ❌ MISRA 위반 - 임의 타입 캐스팅
uint32_t addr = 0x40048000;
GPIO_Type* p_gpio = (GPIO_Type*)addr;

// ✅ MISRA 준수 - uintptr_t 경유
uintptr_t addr = 0x40048000;
GPIO_Type* p_gpio = (GPIO_Type*)addr;
```

#### 규칙 11.3: 정수를 포인터로 캐스팅 시 주의

```c
// Kinetis MK22F 하드웨어 레지스터 접근 (MISRA 예외)
// 임베디드에서는 허용되지만 문서화 필요
#define GPIOA_BASE  (0x400FF000u)
#define GPIOA       ((GPIO_Type*)GPIOA_BASE)  // Deviation 문서화
```

#### 규칙 1.3: Undefined Behavior 금지

```c
// ❌ UB - signed 오버플로
int32_t a = INT32_MAX;
int32_t b = a + 1;  // UB!

// ✅ MISRA 준수 - 오버플로 검사
if (a > (INT32_MAX - 1)) {
    // 오버플로 처리
} else {
    int32_t b = a + 1;
}
```

---

## 3. CERT C - 보안까지 챙기는 IoT 시대

> **공식 사이트**: [SEI CERT C](https://wiki.sei.cmu.edu/confluence/display/c)

**특징**:
- 보안 취약점 방지 중심
- IoT 디바이스에 적합
- 무료 공개

### ARM IoT 디바이스 관련 규칙

#### MEM35-C: 충분한 메모리 할당 (Stack Overflow 방지)

```c
// ❌ CERT 위반 - 스택 폭탄
void uart_send_string(const char* str) {
    char buffer[1024];  // 스택에 1KB!
    snprintf(buffer, sizeof(buffer), "Data: %s\n", str);
}

// ✅ CERT 준수 - 정적 할당
static char g_uart_buffer[256];  // BSS 영역

void uart_send_string(const char* str) {
    snprintf(g_uart_buffer, sizeof(g_uart_buffer), "Data: %s\n", str);
}
```

Kinetis MK22F는 RAM 128KB. 스택은 보통 **8KB 이하**로 설정한다.

#### STR31-C: 버퍼 오버플로 방지

```c
// ❌ CERT 위반
void copy_data(const uint8_t* src, size_t len) {
    uint8_t buffer[64];
    memcpy(buffer, src, len);  // len이 64 초과하면?
}

// ✅ CERT 준수
void copy_data(const uint8_t* src, size_t len) {
    uint8_t buffer[64];
    size_t copy_len = (len > sizeof(buffer)) ? sizeof(buffer) : len;
    memcpy(buffer, src, copy_len);
}
```

---

## 4. Linux Kernel - 가독성 중시

**ARM 임베디드 적합도**: 낮음

Linux Kernel 스타일은 **탭 8칸**, **K&R 중괄호** 등 스타일 중심이다. 안전성 규칙은 부족해서 ARM 임베디드에는 부적합하다.

---

## NXP Kinetis MK22F 프로젝트, 어떤 표준?

### 프로젝트 특성 기반 선택

| 프로젝트 유형 | 추천 표준 |
|---------------|-----------|
| **의료 기기, 자동차** | MISRA-C + BARR-C |
| **일반 제품** | BARR-C |
| **IoT 보안 디바이스** | CERT C + BARR-C |

### 우리 프로젝트 선택: BARR-C

이유:
1. **실용적**: 규칙이 60개로 적당함 (MISRA 159개는 부담)
2. **ARM 최적화**: volatile, ISR, 하드웨어 레지스터 규칙 명확
3. **MISRA 호환**: 나중에 확장 가능
4. **clang-tidy 지원**: 자동화 가능

---

## CMake + Ninja 환경에서 clang-tidy 통합

### 1. CMakeLists.txt 설정

```cmake
# CMakeLists.txt
cmake_minimum_required(VERSION 3.15)
project(kinetis_mk22f C ASM)

# ARM Cortex-M4 툴체인
set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR arm)

set(CMAKE_C_COMPILER arm-none-eabi-gcc)
set(CMAKE_ASM_COMPILER arm-none-eabi-gcc)

# clang-tidy 활성화
find_program(CLANG_TIDY_EXE NAMES clang-tidy)
if(CLANG_TIDY_EXE)
    set(CMAKE_C_CLANG_TIDY 
        ${CLANG_TIDY_EXE};
        -config-file=${CMAKE_SOURCE_DIR}/.clang-tidy;
        -header-filter=.*
    )
    message(STATUS "clang-tidy found: ${CLANG_TIDY_EXE}")
endif()

# 타겟 정의
add_executable(firmware
    src/main.c
    src/uart.c
    src/gpio.c
    # ...
)

target_compile_options(firmware PRIVATE
    -mcpu=cortex-m4
    -mthumb
    -mfloat-abi=hard
    -mfpu=fpv4-sp-d16
    -Wall -Wextra -Werror
)
```

### 2. .clang-tidy 설정 (BARR-C 기반)

```yaml
# .clang-tidy
Checks: >
  -*,
  bugprone-*,
  cert-*,
  misc-*,
  readability-*,
  -readability-magic-numbers,
  -cert-err33-c

CheckOptions:
  # BARR-C: 함수 크기 제한
  - key: readability-function-size.StatementThreshold
    value: 50
  - key: readability-function-size.LineThreshold
    value: 100
  
  # BARR-C: 명명 규칙
  - key: readability-identifier-naming.FunctionCase
    value: lower_case
  - key: readability-identifier-naming.VariableCase
    value: lower_case
  - key: readability-identifier-naming.GlobalConstantCase
    value: UPPER_CASE
  - key: readability-identifier-naming.MacroDefinitionCase
    value: UPPER_CASE
  
  # ARM 임베디드: 매직 넘버 허용 (하드웨어 주소)
  # readability-magic-numbers 비활성화됨
```

### 3. 빌드 및 검사

```bash
# Ninja로 빌드 (clang-tidy 자동 실행)
mkdir build && cd build
cmake -G Ninja ..
ninja

# clang-tidy만 실행 (빌드 없이)
cmake --build . --target clang-tidy
```

---

## ARM Cortex-M4 특화 clang-tidy 설정

### ISR 함수 인식

```c
// ISR은 함수 크기 제한 예외
// NOLINTNEXTLINE(readability-function-size)
void UART0_RX_TX_IRQHandler(void) {
    // ISR 코드 (길어도 OK)
}
```

### volatile 검사

```c
// clang-tidy가 volatile 누락 경고
uint32_t* p_reg = (uint32_t*)0x40048000;  // Warning!

// 수정
volatile uint32_t* p_reg = (volatile uint32_t*)0x40048000;
```

### 하드웨어 주소 매직 넘버 허용

```yaml
# .clang-tidy
Checks: >
  -readability-magic-numbers  # 하드웨어 주소 0x40048000 등 허용
```

---

## 점진적 적용 전략

코딩 표준을 갑자기 전부 적용하면 팀 반발이 크다. 단계적으로 진행했다.

### 1단계: 컴파일러 경고 최대화 (1주)

```cmake
target_compile_options(firmware PRIVATE
    -Wall -Wextra -Werror
    -Wstrict-prototypes
    -Wmissing-prototypes
)
```

### 2단계: clang-tidy 경고만 활성화 (2주)

```bash
# 오류 무시, 경고만
cmake -DCLANG_TIDY_WARNINGS_ONLY=ON ..
```

### 3단계: 신규 코드에만 적용 (1개월)

```yaml
# .clang-tidy
HeaderFilterRegex: 'src/new_module/.*'  # 신규 모듈만
```

### 4단계: 레거시 코드 점진 수정 (3개월)

- 파일별로 하나씩 수정
- PR마다 린트 오류 개수 모니터링

### 5단계: CI/CD 통합

```yaml
# .github/workflows/ci.yml
- name: Run clang-tidy
  run: |
    cmake -G Ninja -DCLANG_TIDY=ON ..
    ninja clang-tidy
```

---

## Kinetis MK22F 프로젝트 실전 적용 결과

### Before

```c
// 수정 전 코드
void uart_init() {
    UART0->BDH = 0;
    UART0->BDL = 26;
    UART0->C2 = 0x0C;
}

int data;  // 전역 변수 남용
```

**문제점**:
- 함수 이름 규칙 위반 (`uart_init` → `uart_init(void)`)
- 매직 넘버 (`26`, `0x0C`)
- 타입 불명확 (`int` → `int32_t`?)
- `volatile` 누락 가능성

### After (BARR-C 적용)

```c
// 수정 후 코드
#define UART_BAUD_115200_BDL  (26u)
#define UART_C2_TX_RX_ENABLE  (0x0Cu)

void uart_init(void) {
    UART0->BDH = 0u;
    UART0->BDL = UART_BAUD_115200_BDL;
    UART0->C2 = UART_C2_TX_RX_ENABLE;
}

static int32_t s_uart_data;  // 모듈 static, 타입 명확
```

**개선점**:
- ✅ `void` 명시
- ✅ 매직 넘버 → 매크로
- ✅ 타입 명확화
- ✅ 전역 변수 최소화 (`static`)

---

## 정적 분석 도구 비교 (ARM 크로스 컴파일 지원)

| 도구 | ARM 지원 | BARR-C | MISRA | 가격 |
|------|----------|--------|-------|------|
| **clang-tidy** | ⭐⭐⭐ (좋음) | 일부 | 일부 | 무료 |
| **PC-lint** | ⭐⭐⭐⭐⭐ (최고) | ✅ | ✅ | $500+ |
| **Helix QAC** | ⭐⭐⭐⭐⭐ (최고) | ✅ | ✅ | $$$$ |
| **cppcheck** | ⭐⭐ (보통) | 일부 | 일부 | 무료 |

**선택**: **clang-tidy** (무료, CMake 통합 쉬움, CI/CD 친화적)

---

## 배운 점

### 1. 표준은 도구다, 목적이 아니다

MISRA-C 159개 규칙을 전부 따르려다가 생산성이 떨어졌다. **프로젝트 특성에 맞게** BARR-C 60개로 시작하는 게 나았다.

### 2. ARM 임베디드는 volatile이 생명이다

하드웨어 레지스터, ISR 공유 변수 - 이 두 가지만 제대로 `volatile` 붙여도 버그 절반은 막는다.

### 3. CMake + clang-tidy = 최고의 조합

빌드할 때마다 자동으로 코드 검사. 별도 스크립트 필요 없음. CI/CD 통합도 쉬움.

---

## 다음 편 예고

이 시리즈는 계속된다:

- **2편**: BARR-C:2018 완전 가이드 - ARM 임베디드 실전 규칙 60개
- **3편**: MISRA-C가 엄격한 이유 - 자동차급 안전성 규칙 159개 분석
- **4편**: CMake + clang-tidy 심화 - .clang-tidy 설정 파헤치기

---

## 참고 자료

### 공식 문서
- [Barr Group BARR-C:2018 PDF](https://barrgroup.com/sites/default/files/barr_c_coding_standard_2018.pdf)
- [MISRA 공식 사이트](https://misra.org.uk/)
- [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c)
- [clang-tidy 공식 문서](https://clang.llvm.org/extra/clang-tidy/)

### NXP Kinetis
- [Kinetis MK22F Reference Manual](https://www.nxp.com/docs/en/reference-manual/K22P121M120SF7RM.pdf)
- [ARM Cortex-M4 Programming Guide](https://developer.arm.com/documentation/dui0553/latest/)

### 도구
- [CMake Documentation](https://cmake.org/documentation/)
- [Ninja Build System](https://ninja-build.org/)

---

**시리즈**: [1편] 코딩 표준 비교 | [2편] BARR-C 실전 | [3편] MISRA-C 심화 | [4편] clang-tidy 설정
