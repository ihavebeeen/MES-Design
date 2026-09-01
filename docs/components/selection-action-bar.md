# SelectionActionBar

> `selection-action-bar` · feedback · Tier 2 · stable · 공개

## 역할

목록 선택이 생겼을 때 선택 건수와 그 대상에만 적용되는 동작을 노출한다.

## 생성 선택 기준

- 목록 선택이 생겼을 때 선택 건수와 그 대상에만 적용되는 동작을 노출한다.

선택하지 않는 경우:
- 항상 가능한 페이지 공통 동작이나 저장·취소 푸터인 경우

## API와 상태

- 공개 심볼: `SelectionActionBarProps`, `SelectionActionBar`
- 주요 Props: `selectedCount`, `onDelete`, `onMove`, `onClear`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/selection-action-bar.tsx`
- 웹 문서: `/components/selection-action-bar`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
