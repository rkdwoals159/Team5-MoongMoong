# 디자인 토큰 가이드

Team5-MoongMoong 프로젝트의 디자인 토큰 문서입니다.

## 📋 목차

- [타이포그래피](#타이포그래피)
- [컬러 시스템](#컬러-시스템)
- [스페이싱](#스페이싱)
- [라운드](#라운드)
- [타이포그래피 유틸리티 클래스](#타이포그래피-유틸리티-클래스)

---

## 타이포그래피

### 폰트 웨이트 (Font Weight)

| 토큰           | 값  | 설명      |
| -------------- | --- | --------- |
| `--fw-regular` | 400 | 일반 굵기 |
| `--fw-medium`  | 500 | 중간 굵기 |
| `--fw-bold`    | 700 | 볼드 굵기 |

### 행간 (Line Height)

| 토큰       | 값  | 비율 |
| ---------- | --- | ---- |
| `--lh-140` | 1.4 | 140% |
| `--lh-150` | 1.5 | 150% |
| `--lh-160` | 1.6 | 160% |

### 폰트 사이즈 (Font Size)

#### Headline

| 토큰              | 값      | px 환산 |
| ----------------- | ------- | ------- |
| `--fs-headline-l` | 2rem    | 32px    |
| `--fs-headline-m` | 1.75rem | 28px    |
| `--fs-headline-s` | 1.5rem  | 24px    |

#### Title

| 토큰           | 값       | px 환산 |
| -------------- | -------- | ------- |
| `--fs-title-l` | 1.375rem | 22px    |
| `--fs-title-m` | 1.25rem  | 20px    |
| `--fs-title-s` | 1.125rem | 18px    |

#### Body

| 토큰          | 값       | px 환산 |
| ------------- | -------- | ------- |
| `--fs-body-l` | 1rem     | 16px    |
| `--fs-body-m` | 0.875rem | 14px    |
| `--fs-body-s` | 0.75rem  | 12px    |

#### Caption

| 토큰             | 값        | px 환산 |
| ---------------- | --------- | ------- |
| `--fs-caption-l` | 0.8125rem | 13px    |
| `--fs-caption-m` | 0.75rem   | 12px    |
| `--fs-caption-s` | 0.6875rem | 11px    |

---

## 컬러 시스템

### Primitive Colors (기본 컬러)

#### White

| 토큰                | 값         | 설명            |
| ------------------- | ---------- | --------------- |
| `--color-white-100` | #ffffff    | 순수 흰색       |
| `--color-white-50`  | #ffffff/50 | 50% 투명도 흰색 |

#### Black

| 토큰                | 값         | 설명             |
| ------------------- | ---------- | ---------------- |
| `--color-black`     | #000000    | 순수 검정        |
| `--color-black-20`  | #000000/20 | 20% 투명도 검정  |
| `--color-black-60`  | #000000/60 | 60% 투명도 검정  |
| `--color-black-100` | #000000    | 100% 불투명 검정 |

#### Gray

| 토큰               | 값      | 용도                    |
| ------------------ | ------- | ----------------------- |
| `--color-gray-30`  | #f9fafb | 가장 밝은 회색          |
| `--color-gray-50`  | #f4f5f7 | 매우 밝은 회색          |
| `--color-gray-80`  | #f0f3f5 | 밝은 회색               |
| `--color-gray-100` | #e5e8eb | 연한 회색               |
| `--color-gray-200` | #d2d6db | 중간 밝은 회색          |
| `--color-gray-300` | #b2b8c0 | 중간 회색               |
| `--color-gray-400` | #8d95a0 | 중간 어두운 회색        |
| `--color-gray-500` | #6d7683 | 어두운 회색             |
| `--color-gray-600` | #505967 | 더 어두운 회색          |
| `--color-gray-700` | #353d4a | 매우 어두운 회색        |
| `--color-gray-800` | #1a1f27 | 거의 검정에 가까운 회색 |
| `--color-gray-900` | #181818 | 가장 어두운 회색        |

#### Yellow

| 토큰                 | 값      | 용도             |
| -------------------- | ------- | ---------------- |
| `--color-yellow-50`  | #fffdf5 | 가장 밝은 노란색 |
| `--color-yellow-100` | #fef7e5 | 매우 밝은 노란색 |
| `--color-yellow-150` | #fff1c2 | 밝은 노란색      |
| `--color-yellow-200` | #f9de87 | 중간 밝은 노란색 |
| `--color-yellow-300` | #ffcc01 | 순수 노란색      |
| `--color-yellow-400` | #ffbf36 | 중간 노란색      |
| `--color-yellow-500` | #f8b016 | 진한 노란색      |

#### Red

| 토큰              | 값      | 용도                     |
| ----------------- | ------- | ------------------------ |
| `--color-red-100` | #fff1f1 | 밝은 빨간색 (배경)       |
| `--color-red-500` | #e64f58 | 진한 빨간색 (에러, 경고) |

#### Blue

| 토큰               | 값      | 용도               |
| ------------------ | ------- | ------------------ |
| `--color-blue-100` | #eaf3fe | 밝은 파란색 (배경) |
| `--color-blue-500` | #4880ee | 진한 파란색 (정보) |

#### Green

| 토큰                | 값      | 용도               |
| ------------------- | ------- | ------------------ |
| `--color-green-100` | #eafff0 | 밝은 초록색 (배경) |
| `--color-green-500` | #45c477 | 진한 초록색 (성공) |

#### Purple

| 토큰                 | 값      | 용도               |
| -------------------- | ------- | ------------------ |
| `--color-purple-100` | #edeafa | 밝은 보라색 (배경) |
| `--color-purple-500` | #654dd9 | 진한 보라색        |

#### Orange

| 토큰                 | 값      | 용도               |
| -------------------- | ------- | ------------------ |
| `--color-orange-100` | #ffeada | 밝은 주황색 (배경) |
| `--color-orange-500` | #ef8216 | 진한 주황색        |

#### Turquoise

| 토큰                    | 값      | 용도               |
| ----------------------- | ------- | ------------------ |
| `--color-turquoise-100` | #ebfeff | 밝은 청록색 (배경) |
| `--color-turquoise-500` | #107f7f | 진한 청록색        |

### Semantic Colors (의미론적 컬러)

#### Primary

| 토큰                       | 참조                 | 용도              |
| -------------------------- | -------------------- | ----------------- |
| `--color-primary`          | `--color-gray-800`   | 기본 Primary 색상 |
| `--color-primary-hover`    | `--color-yellow-100` | Hover 상태        |
| `--color-primary-pressed`  | `--color-gray-300`   | Pressed 상태      |
| `--color-primary-disabled` | `--color-gray-200`   | Disabled 상태     |
| `--color-primary-checked`  | `--color-yellow-150` | Checked 상태      |

#### Text

| 토큰                   | 참조               | 용도                           |
| ---------------------- | ------------------ | ------------------------------ |
| `--color-text-base`    | `--color-gray-800` | 기본 텍스트 색상               |
| `--color-text-sub`     | `--color-gray-300` | 보조 텍스트 색상               |
| `--color-text-inverse` | `--color-white`    | 반전 텍스트 색상 (어두운 배경) |

#### Border

| 토큰                    | 참조               | 용도        |
| ----------------------- | ------------------ | ----------- |
| `--color-border-heavy`  | `--color-gray-300` | 진한 테두리 |
| `--color-border-normal` | `--color-gray-200` | 일반 테두리 |
| `--color-border-light`  | `--color-gray-100` | 밝은 테두리 |

### Component Aliases (컴포넌트별 컬러)

#### Button Primary

| 토큰                                 | 참조                       | 용도                  |
| ------------------------------------ | -------------------------- | --------------------- |
| `--color-button-primary-bg`          | `--color-primary`          | Primary 버튼 배경     |
| `--color-button-primary-bg-hover`    | `--color-primary-hover`    | Primary 버튼 Hover    |
| `--color-button-primary-bg-pressed`  | `--color-primary-pressed`  | Primary 버튼 Pressed  |
| `--color-button-primary-bg-disabled` | `--color-primary-disabled` | Primary 버튼 Disabled |

#### Neutral (Extra)

| 토큰                  | 참조               | 용도            |
| --------------------- | ------------------ | --------------- |
| `--color-neutral-100` | `--color-gray-100` | 중립적인 배경색 |

---

## 스페이싱

Figma 디자인 스케일을 기반으로 한 간격 토큰입니다.

| 토큰             | 값       | px 환산 |
| ---------------- | -------- | ------- |
| `--spacing-0`    | 0rem     | 0px     |
| `--spacing-100`  | 0.125rem | 2px     |
| `--spacing-200`  | 0.25rem  | 4px     |
| `--spacing-250`  | 0.375rem | 6px     |
| `--spacing-300`  | 0.5rem   | 8px     |
| `--spacing-350`  | 0.625rem | 10px    |
| `--spacing-400`  | 0.75rem  | 12px    |
| `--spacing-500`  | 1rem     | 16px    |
| `--spacing-550`  | 1.125rem | 18px    |
| `--spacing-600`  | 1.25rem  | 20px    |
| `--spacing-700`  | 1.5rem   | 24px    |
| `--spacing-800`  | 1.75rem  | 28px    |
| `--spacing-850`  | 1.875rem | 30px    |
| `--spacing-900`  | 2rem     | 32px    |
| `--spacing-1000` | 2.25rem  | 36px    |
| `--spacing-1100` | 2.5rem   | 40px    |
| `--spacing-1200` | 3.75rem  | 60px    |

---

## 라운드

Figma 디자인 스케일을 기반으로 한 Border Radius 토큰입니다.

| 토큰           | 값       | px 환산 |
| -------------- | -------- | ------- |
| `--radius-100` | 0.125rem | 2px     |
| `--radius-200` | 0.25rem  | 4px     |
| `--radius-250` | 0.375rem | 6px     |
| `--radius-300` | 0.5rem   | 8px     |
| `--radius-400` | 0.625rem | 10px    |
| `--radius-500` | 0.75rem  | 12px    |
| `--radius-600` | 1rem     | 16px    |
| `--radius-700` | 1.25rem  | 20px    |
| `--radius-800` | 2.75rem  | 44px    |

---

## 타이포그래피 유틸리티 클래스

프로젝트에서는 타이포그래피 스타일을 쉽게 적용할 수 있도록 미리 정의된 유틸리티 클래스를 제공합니다.

### 명명 규칙

```
typo-{size}-{weight}
```

- **size**: `headline-l`, `headline-m`, `headline-s`, `title-l`, `title-m`, `title-s`, `body-l`, `body-m`, `body-s`, `caption-l`, `caption-m`, `caption-s`
- **weight**: `bold`, `medium`, `regular`

### Headline

| 클래스                     | Font Size | Line Height | Font Weight |
| -------------------------- | --------- | ----------- | ----------- |
| `.typo-headline-l-bold`    | 32px      | 140%        | Bold        |
| `.typo-headline-l-medium`  | 32px      | 160%        | Medium      |
| `.typo-headline-l-regular` | 32px      | 160%        | Regular     |
| `.typo-headline-m-bold`    | 28px      | 160%        | Bold        |
| `.typo-headline-m-medium`  | 28px      | 160%        | Medium      |
| `.typo-headline-m-regular` | 28px      | 160%        | Regular     |
| `.typo-headline-s-bold`    | 24px      | 160%        | Bold        |
| `.typo-headline-s-medium`  | 24px      | 150%        | Medium      |
| `.typo-headline-s-regular` | 24px      | 160%        | Regular     |

### Title

| 클래스                  | Font Size | Line Height | Font Weight |
| ----------------------- | --------- | ----------- | ----------- |
| `.typo-title-l-bold`    | 22px      | 160%        | Bold        |
| `.typo-title-l-medium`  | 22px      | 160%        | Medium      |
| `.typo-title-l-regular` | 22px      | 160%        | Regular     |
| `.typo-title-m-bold`    | 20px      | 160%        | Bold        |
| `.typo-title-m-medium`  | 20px      | 160%        | Medium      |
| `.typo-title-m-regular` | 20px      | 160%        | Regular     |
| `.typo-title-s-bold`    | 18px      | 160%        | Bold        |
| `.typo-title-s-medium`  | 18px      | 160%        | Medium      |
| `.typo-title-s-regular` | 18px      | 160%        | Regular     |

### Body

| 클래스                 | Font Size | Line Height | Font Weight |
| ---------------------- | --------- | ----------- | ----------- |
| `.typo-body-l-bold`    | 16px      | 160%        | Bold        |
| `.typo-body-l-medium`  | 16px      | 160%        | Medium      |
| `.typo-body-l-regular` | 16px      | 160%        | Regular     |
| `.typo-body-m-bold`    | 14px      | 160%        | Bold        |
| `.typo-body-m-medium`  | 14px      | 160%        | Medium      |
| `.typo-body-m-regular` | 14px      | 160%        | Regular     |
| `.typo-body-s-bold`    | 12px      | 160%        | Bold        |
| `.typo-body-s-medium`  | 12px      | 160%        | Medium      |
| `.typo-body-s-regular` | 12px      | 160%        | Regular     |

### Caption

| 클래스                    | Font Size | Line Height | Font Weight |
| ------------------------- | --------- | ----------- | ----------- |
| `.typo-caption-l-bold`    | 13px      | 160%        | Bold        |
| `.typo-caption-l-medium`  | 13px      | 160%        | Medium      |
| `.typo-caption-l-regular` | 13px      | 160%        | Regular     |
| `.typo-caption-m-bold`    | 12px      | 160%        | Bold        |
| `.typo-caption-m-medium`  | 12px      | 160%        | Medium      |
| `.typo-caption-m-regular` | 12px      | 160%        | Regular     |
| `.typo-caption-s-bold`    | 11px      | 160%        | Bold        |
| `.typo-caption-s-medium`  | 11px      | 160%        | Medium      |
| `.typo-caption-s-regular` | 11px      | 160%        | Regular     |

---

## 사용 예시

### CSS에서 디자인 토큰 사용

```css
.my-button {
  background-color: var(--color-button-primary-bg);
  padding: var(--spacing-400) var(--spacing-600);
  border-radius: var(--radius-300);
  font-size: var(--fs-body-m);
  font-weight: var(--fw-medium);
}

.my-button:hover {
  background-color: var(--color-button-primary-bg-hover);
}
```

### 유틸리티 클래스 사용

```html
<h1 class="typo-headline-l-bold">제목</h1>
<p class="typo-body-m-regular">본문 텍스트입니다.</p>
<span class="typo-caption-s-medium">작은 캡션</span>
```

### Tailwind CSS와 함께 사용

```html
<button class="bg-[var(--color-button-primary-bg)] px-[var(--spacing-600)] py-[var(--spacing-400)]">
  버튼
</button>
```

---

## 주의사항

1. **rem 단위 기준**: 모든 크기 값은 `1rem = 16px`을 기준으로 합니다.
2. **변수 우선 사용**: 직접 색상 코드나 픽셀 값을 사용하지 말고, 항상 디자인 토큰 변수를 사용하세요.
3. **Semantic 우선**: Primitive 컬러보다는 Semantic 컬러나 Component Aliases를 우선적으로 사용하세요.
4. **일관성 유지**: 디자인 시스템의 일관성을 위해 정의된 토큰 외의 값은 사용하지 마세요.

---

**마지막 업데이트**: 2026년 1월 22일
