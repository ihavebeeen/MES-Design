# SearchInput

> `search-input` · form · Tier 1 · stable · 공개

## 역할

현재 목록·표의 검색어 입력

## 사용 기준

- 현재 목록·표의 검색어 입력
- 조회 툴바 우측 검색 슬롯

사용하지 않는 경우:
- 필터 조건 추가
- 업무 필드 값 입력

## API와 상태

- 공개 심볼: `SearchInputProps`, `SearchInput`
- 주요 Props: `value`, `onChange`, `placeholder`, `className`, `width`, `iconColor`, `size`, `background`
- 상태: `empty`, `value`, `focus`
- 변형: `default`, `compact`, `fixed`, `fill`, `white`, `subtle`

## 접근성과 제약

- placeholder만으로 목적이 불명확하면 aria-label을 보강한다.
- 지우기 동작은 키보드로 접근 가능해야 한다.
- 컴포넌트는 크기만 소유하고 툴바가 배치와 수직 중앙 정렬을 소유한다.
- 필터 추가를 검색창으로 대체하지 않는다.

## 근거

- 구현: `src/components/ui/search-input.tsx`
- 웹 문서: `/components/search-input`
- 상세 사용 계약: 등록됨
- 화면 근거: `material-input-settings`, `batch-work-order`, `grouped-production-list`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
