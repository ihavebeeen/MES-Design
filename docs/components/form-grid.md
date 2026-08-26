# FormGrid / FormFieldRow

> `form-grid` · layout · Tier 1 · stable · 공개

## 역할

FormGrid는 열 수와 행·열 간격을 소유하고 FormFieldRow는 라벨·필수표시·control 정렬을 소유한다.

## 생성 선택 기준

이 컴포넌트는 전역 선택 가드 대상이 아닙니다. 실제 코드 API와 부모 패턴 계약만 따르며, 별도 사용처 전수조사를 만들지 않습니다.

## API와 상태

- 공개 심볼: `FormGridColumns`, `FormGridDensity`, `FormFieldLabelWidth`, `FormGridProps`, `FormFieldRowProps`, `FormFieldRow`, `FormGrid`
- 주요 Props: `columns`, `density`, `compact`, `comfortable`, `label`, `required`, `labelWidth`, `children`, `standard`, `wide`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-hidden`, `aria-labelledby`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/form-grid.tsx`
- 웹 문서: `/components/form-grid`
- 생성 선택 규칙: 적용 안 함(API 문서만 사용)
- 참고 화면: 없음
- 참고 화면의 역할: 해당 없음

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
