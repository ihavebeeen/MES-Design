# TreeSelect

> `tree-select` · form · Tier 3 · provisional · 공개

## 역할

계층 구조를 펼쳐 보면서 하나 또는 승인된 복수 대상을 선택한다.

## 생성 선택 기준

- 계층 구조를 펼쳐 보면서 하나 또는 승인된 복수 대상을 선택한다.

선택하지 않는 경우:
- 평면 옵션이나 단계별 선택만으로 충분한 경우

## API와 상태

- 공개 심볼: `TreeSelectNode`, `TreeSelectProps`, `TreeSelect`
- 주요 Props: `nodes`, `value`, `defaultValue`, `onValueChange`, `className`
- 상태: `disabled`, `checked`, `selected`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/tree-select.tsx`
- 웹 문서: `/components/tree-select`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
