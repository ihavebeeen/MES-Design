# SearchHighlight

> `search-highlight` · data-display · Tier 3 · provisional · 공개

## 역할

검색 결과 텍스트 안에서 실제 일치 문자열만 강조한다.

## 사용 기준

- 검색 결과 텍스트 안에서 실제 일치 문자열만 강조한다.
- 검색·필터 상태는 SearchInput 또는 호출부가 소유한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `SearchHighlightProps`, `SearchHighlight`
- 주요 Props: `text`, `query`, `caseSensitive`, `markClassName`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/search-highlight.tsx`
- 웹 문서: `/components/search-highlight`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
