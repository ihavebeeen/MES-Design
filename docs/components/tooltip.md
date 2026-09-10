# Tooltip

> `tooltip` · overlay · Tier 2 · provisional · 공개

## 역할

아이콘·축약 라벨의 의미를 포인터·키보드 포커스 시 짧게 보충한다.

## 생성 선택 기준

- 아이콘·축약 라벨의 의미를 포인터·키보드 포커스 시 짧게 보충한다.

선택하지 않는 경우:
- 업무 수행에 필수인 정보나 상호작용 콘텐츠를 숨기는 경우

## API와 상태

- 공개 심볼: `TooltipProps`, `Tooltip`
- 주요 Props: `content`, `children`, `side`, `className`
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 구현에 선언된 `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/tooltip.tsx`
- 웹 문서: `/components/tooltip`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
