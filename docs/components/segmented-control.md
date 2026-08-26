# SegmentedControl

> `segmented-control` · form · Tier 4 · provisional · 공개

## 역할

서로 배타적인 소수의 보기·상태 중 하나를 즉시 전환할 때 사용한다.

## 사용 기준

- 서로 배타적인 소수의 보기·상태 중 하나를 즉시 전환할 때 사용한다.
- ButtonGroup의 단순 배치나 ToggleButton의 독립 on/off와 구분한다.
- 방향키·Home·End 이동과 roving tabindex를 유지한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `SegmentedControlOption`, `SegmentedControlProps`, `SegmentedControl`
- 주요 Props: `options`, `value`, `defaultValue`, `onValueChange`, `ariaLabel`
- 상태: `disabled`, `checked`, `selected`, `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-checked`, `aria-label`, `role` 의미를 제거하지 않습니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/segmented-control.tsx`
- 웹 문서: `/components/segmented-control`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
