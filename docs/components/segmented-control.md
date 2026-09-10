# SegmentedControl

> `segmented-control` · form · Tier 4 · provisional · 공개

## 역할

같은 화면·데이터의 소수 보기 모드 중 하나를 즉시 전환한다.

## 생성 선택 기준

- 같은 화면·데이터의 소수 보기 모드 중 하나를 즉시 전환한다.

선택하지 않는 경우:
- 업무 값을 저장하거나 서로 다른 페이지·열린 업무 탭을 이동하는 경우

## API와 상태

- 공개 심볼: `SegmentedControlOption`, `SegmentedControlProps`, `SegmentedControl`
- 주요 Props: `options`, `value`, `defaultValue`, `onValueChange`, `ariaLabel`
- State: `default`
- Value: `unselected`, `selected`
- Disabled: `false`, `true`
- Size: `not-applicable`
- Interaction: `rest`, `hover`, `focus`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 구현에 선언된 `aria-checked`, `aria-label`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/segmented-control.tsx`
- 웹 문서: `/components/segmented-control`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
