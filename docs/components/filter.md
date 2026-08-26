# Filter

> `filter` · form · Tier 1 · stable · 공개

## 역할

목록에 구조화된 복수 조건을 추가

## 생성 선택 기준

- 목록에 구조화된 복수 조건을 추가
- 필터 카테고리와 값을 단계적으로 선택

선택하지 않는 경우:
- 자유 검색어 입력
- 단일 업무 필드 값 선택

## API와 상태

- 공개 심볼: `FilterOption`, `FilterCategory`, `FilterProps`, `Filter`
- 주요 Props: `id`, `label`, `options`, `categories`, `value`, `onChange`, `className`, `searchable`, `triggerLabel`, `showTriggerArrow`, `showActiveTags`, `placeholder`
- 상태: `closed`, `category-open`, `options-open`, `active`
- 변형: `label`, `icon-only`, `searchable`, `non-searchable`

## 접근성과 제약

- 열림 상태와 현재 카테고리를 전달한다.
- 활성 태그 제거를 키보드로 수행할 수 있어야 한다.
- 검색창으로 대체하지 않는다.
- 검색 입력과 같은 toolbar 안에서 수직 중앙 정렬한다.

## 근거

- 구현: `src/components/ui/filter.tsx`
- 웹 문서: `/components/filter`
- 생성 선택 규칙: 적용됨
- 참고 화면: `material-input-settings`, `batch-work-order`, `grouped-production-list`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
