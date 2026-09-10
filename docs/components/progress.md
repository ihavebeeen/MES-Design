# Progress

> `progress` · feedback · Tier 1 · stable · 공개

## 역할

완료 비율이나 단계 진행량을 수평 길이와 수치로 비교한다.

## 생성 선택 기준

- 완료 비율이나 단계 진행량을 수평 길이와 수치로 비교한다.

선택하지 않는 경우:
- 완료 시점을 알 수 없거나 단순 상태 라벨이면 충분한 경우

## API와 상태

- 공개 심볼: `ProgressProps`, `Progress`
- 주요 Props: `value`, `showLabel`, `labelTone`
- State: `default`
- Value: `empty`, `filled`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 구현에 선언된 `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/progress.tsx`
- 웹 문서: `/components/progress`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
