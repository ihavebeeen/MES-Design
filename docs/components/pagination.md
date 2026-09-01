# Pagination

> `pagination` · navigation · Tier 2 · provisional · 공개

## 역할

서버나 업무 계약이 명시적으로 페이지 단위 이동과 총 페이지 개념을 제공한다.

## 생성 선택 기준

- 서버나 업무 계약이 명시적으로 페이지 단위 이동과 총 페이지 개념을 제공한다.

선택하지 않는 경우:
- MES 메인 목록처럼 무한 스크롤을 사용하는 화면이나 팝업 내부 단순 목록

## API와 상태

- 공개 심볼: `PaginationProps`, `Pagination`
- 주요 Props: `page`, `totalPages`, `onPageChange`, `siblingCount`, `className`
- 상태: `disabled`, `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/pagination.tsx`
- 웹 문서: `/components/pagination`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
