# Combobox

> `combobox` · form · Tier 1 · stable · 공개

## 역할

선택지가 많아 검색하면서 하나를 골라야 한다.

## 생성 선택 기준

- 선택지가 많아 검색하면서 하나를 골라야 한다.

선택하지 않는 경우:
- 자유 문자열을 저장하거나 선택지가 짧아 바로 비교 가능한 경우

## API와 상태

- 공개 심볼: `ComboboxOption`, `ComboboxProps`, `Combobox`
- 주요 Props: `value`, `label`, `options`, `defaultValue`, `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyText`, `size`, `disabled`, `className`, `icon`
- 상태: `disabled`, `selected`, `open`, `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/combobox.tsx`
- 웹 문서: `/components/combobox`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
