# FormGrid / FormFieldRow

> `form-grid` · layout · Tier 1 · stable · 공개

## 역할

하나의 대상 또는 같은 정보 묶음의 이름-값 관계를 읽거나 편집함

## 생성 선택 기준

- 하나의 대상 또는 같은 정보 묶음의 이름-값 관계를 읽거나 편집함
- 입력값과 그 값을 판단하는 읽기 정보가 동일한 필드 위계로 정렬되어야 함

선택하지 않는 경우:
- 여러 레코드를 같은 열 기준으로 비교함
- 시간순·공정순 반복 기록을 목록으로 스캔함
- 단일 결론을 강조하기 위한 장식 영역

## API와 상태

- 공개 심볼: `FormGridColumns`, `FormGridDensity`, `FormFieldLabelWidth`, `FormGridProps`, `FormFieldRowProps`, `FormFieldRow`, `FormGrid`
- 주요 Props: `columns`, `density`, `compact`, `comfortable`, `label`, `required`, `labelWidth`, `children`, `standard`, `wide`
- 상태: `static`, `editable`, `readonly`, `disabled`, `error`
- 변형: `one-column`, `two-column`, `compact`, `comfortable`

## 접근성과 제약

- label과 control을 연결한다.
- readonly와 disabled 의미를 구분한다.
- FormGrid가 열과 gap을, FormFieldRow가 label·control 정렬과 필수 표시를 소유한다.
- 읽기 값도 왜 현재 작업에 필요한지 확인하고 단순 빈칸 채우기용 필드로 만들지 않는다.

## 근거

- 구현: `src/components/ui/form-grid.tsx`
- 웹 문서: `/components/form-grid`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `receiving`, `production-result`, `form-inspection-criteria`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
