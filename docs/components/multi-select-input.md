# MultiSelectInput

> `multi-select-input` · form · Tier 2 · provisional · 공개

## 역할

제한된 후보 중 여러 값을 선택하고 선택 결과를 입력 영역에서 확인한다.

## 생성 선택 기준

- 제한된 후보 중 여러 값을 선택하고 선택 결과를 입력 영역에서 확인한다.

선택하지 않는 경우:
- 하나만 고르거나 테이블 행 자체를 복수 선택하는 경우

## API와 상태

- 공개 심볼: `MultiSelectInputProps`, `MultiSelectInput`
- 주요 Props: `values`, `onValuesChange`, `placeholder`, `disabled`, `className`
- 상태: `disabled`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/multi-select-input.tsx`
- 웹 문서: `/components/multi-select-input`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
