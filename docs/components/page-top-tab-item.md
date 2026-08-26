# PageTopTabItem

> `page-top-tab-item` · navigation · Tier 1 · stable · 공개

## 역할

제품·메뉴·페이지·계층 사이의 이동을 제공합니다.

## 생성 선택 기준

이 컴포넌트는 전역 선택 가드 대상이 아닙니다. 실제 코드 API와 부모 패턴 계약만 따르며, 별도 사용처 전수조사를 만들지 않습니다.

## API와 상태

- 공개 심볼: `PageTopTabItemProps`, `PageTopTabItem`
- 주요 Props: `label`, `active`, `bookmarked`, `onBookmarkClick`, `onClose`, `closable`, `className`
- 상태: `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/page-top-tab-item.tsx`
- 웹 문서: `/components/page-top-tab-item`
- 생성 선택 규칙: 적용 안 함(API 문서만 사용)
- 참고 화면: 없음
- 참고 화면의 역할: 해당 없음

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
