# SearchInput

> `search-input` · form · Tier 1 · stable · 공개

## 역할

현재 목록·표의 검색어 입력

## 생성 선택 기준

- 현재 목록·표의 검색어 입력
- 조회 툴바 우측 검색 슬롯

선택하지 않는 경우:
- 필터 조건 추가
- 업무 필드 값 입력

## API와 상태

- 공개 심볼: `SearchInputProps`, `SearchInput`
- 주요 Props: `value`, `onChange`, `placeholder`, `className`, `width`, `iconColor`, `size`, `background`
- State: `default`
- Value: `empty`, `filled`
- Disabled: `not-applicable`
- Size: `default`, `compact`
- Interaction: `rest`, `focus`
- 변형: `default`, `compact`, `fixed`, `fill`, `white`, `subtle`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- placeholder만으로 목적이 불명확하면 aria-label을 보강한다.
- 지우기 동작은 키보드로 접근 가능해야 한다.
- 컴포넌트는 크기만 소유하고 툴바가 배치와 수직 중앙 정렬을 소유한다.
- 필터 추가를 검색창으로 대체하지 않는다.

## 근거

- 구현: `src/components/ui/search-input.tsx`
- 웹 문서: `/components/search-input`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `material-input-settings`, `batch-work-order`, `grouped-production-list`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
