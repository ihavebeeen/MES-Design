# CavityCell

> `cavity-cell` · data-display · Tier 3 · stable · 공개

## 역할

값 없음·값 있음·선택 상태를 10×10 배열에서 동일 규격으로 표시한다.

## 사용 기준

- 값 없음·값 있음·선택 상태를 10×10 배열에서 동일 규격으로 표시한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `CavityCellProps`, `CavityCell`
- 주요 Props: `value`, `selected`
- 상태: `disabled`, `selected`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/cavity-cell.tsx`
- 웹 문서: `/components/cavity-cell`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
