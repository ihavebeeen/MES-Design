# FormGrid / FormFieldRow

> `form-grid` · layout · Tier 1 · stable · 공개

## 역할

FormGrid는 열 수와 행·열 간격을 소유하고 FormFieldRow는 라벨·필수표시·control 정렬을 소유한다.

## 사용 기준

- FormGrid는 열 수와 행·열 간격을 소유하고 FormFieldRow는 라벨·필수표시·control 정렬을 소유한다.
- labelWidth는 raw pixel이 아니라 standard(100px) 또는 wide(108px) variant를 사용한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `FormGridColumns`, `FormGridDensity`, `FormFieldLabelWidth`, `FormGridProps`, `FormFieldRowProps`, `FormFieldRow`, `FormGrid`
- 주요 Props: `columns`, `density`, `compact`, `comfortable`, `label`, `required`, `labelWidth`, `children`, `standard`, `wide`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-hidden`, `aria-labelledby`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/form-grid.tsx`
- 웹 문서: `/components/form-grid`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
