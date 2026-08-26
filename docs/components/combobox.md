# Combobox

> `combobox` · form · Tier 1 · stable · 공개

## 역할

트리거 우측 아이콘 — 기본값은 ChevronDown, 다른 아이콘으로 교체 가능(2026-07-28 추가)

## 사용 기준

- 등록된 화면·패턴에서 같은 의미가 필요할 때 사용합니다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `ComboboxOption`, `ComboboxProps`, `Combobox`
- 주요 Props: `value`, `label`, `options`, `defaultValue`, `onValueChange`, `placeholder`, `searchPlaceholder`, `emptyText`, `size`, `disabled`, `className`, `icon`
- 상태: `disabled`, `selected`, `open`, `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/combobox.tsx`
- 웹 문서: `/components/combobox`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
