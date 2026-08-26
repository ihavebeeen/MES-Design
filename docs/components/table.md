# Table

> `table` · data-display · Tier 1 · stable · 공개

## 역할

열 정렬이 중요한 복수 행 비교

## 사용 기준

- 열 정렬이 중요한 복수 행 비교
- 스캔·정렬·선택·그룹 집계가 필요한 목록

사용하지 않는 경우:
- 몇 개의 독립 입력 행을 정렬하기 위한 용도
- 카드형 정보가 더 자연스러운 비정형 내용

## API와 상태

- 공개 심볼: `TableColumn`, `TableRowData`, `TableGroup`, `TableProps`, `Table`
- 주요 Props: `key`, `label`, `headerDetail`, `width`, `align`, `render`, `id`, `data`, `isNew`, `disabled`, `hideSelection`, `summary`, `rows`, `groups`, `defaultExpanded`, `columns`, `selectedIds`, `activeId`, `activeRowAppearance`, `selectedRowAppearance`
- 상태: `default`, `selected`, `active`, `disabled`, `empty`
- 변형: `flat`, `grouped`, `selectable`, `readonly`, `inline-edit`

## 접근성과 제약

- 헤더와 셀의 의미 관계를 유지한다.
- 행 선택과 활성 행 조작을 키보드로 수행할 수 있어야 한다.
- header·group·row·totals는 선택열과 컬럼 폭 배열을 공유한다.
- 가로 스크롤 허용 여부와 scroll owner를 화면 계약에 명시한다.
- 선택·활성·편집 상태를 서로 다른 하드코딩 index로 관리하지 않는다.

## 근거

- 구현: `src/components/ui/table.tsx`
- 웹 문서: `/components/table-full`
- 상세 사용 계약: 등록됨
- 화면 근거: `batch-work-order`, `material-input-settings`, `grouped-production-list`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
