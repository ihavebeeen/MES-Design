# MesProductSwitcher

> `mes-product-switcher` · navigation · Tier 1 · stable · 공개

## 역할

MES 공통 탐색에서 현재 제품을 식별하고 다른 제품으로 전환한다.

## 생성 선택 기준

- MES 공통 탐색에서 현재 제품을 식별하고 다른 제품으로 전환한다.

선택하지 않는 경우:
- 업무 필드의 품목·공장 등을 선택하거나 단순 로고만 표시하는 경우

## API와 상태

- 공개 심볼: `MesProductSwitcherProps`, `MesProductSwitcher`
- 주요 Props: `value`, `onValueChange`, `collapsed`, `className`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label`, `aria-pressed` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/mes-product-switcher.tsx`
- 웹 문서: `/components/mes-product-switcher`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
