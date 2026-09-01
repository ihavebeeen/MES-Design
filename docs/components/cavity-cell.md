# CavityCell

> `cavity-cell` · data-display · Tier 3 · stable · 공개

## 역할

캐비티 번호·선택·교환처럼 공간 배열 안의 한 위치 상태를 표현한다.

## 생성 선택 기준

- 캐비티 번호·선택·교환처럼 공간 배열 안의 한 위치 상태를 표현한다.

선택하지 않는 경우:
- 일반 표 셀이나 순서 목록의 항목인 경우

## API와 상태

- 공개 심볼: `CavityCellProps`, `CavityCell`
- 주요 Props: `value`, `selected`
- 상태: `disabled`, `selected`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/cavity-cell.tsx`
- 웹 문서: `/components/cavity-cell`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
