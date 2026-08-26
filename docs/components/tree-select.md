# TreeSelect

> `tree-select` · form · Tier 3 · provisional · 공개

## 역할

계층을 보며 복수 값을 제출하는 입력에 사용한다.

## 사용 기준

- 계층을 보며 복수 값을 제출하는 입력에 사용한다.
- 부모·자식 선택 전파는 업무 규칙이므로 호출부가 명시한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `TreeSelectNode`, `TreeSelectProps`, `TreeSelect`
- 주요 Props: `nodes`, `value`, `defaultValue`, `onValueChange`, `className`
- 상태: `disabled`, `checked`, `selected`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/tree-select.tsx`
- 웹 문서: `/components/tree-select`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
