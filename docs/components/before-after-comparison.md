# BeforeAfterComparison

> `before-after-comparison` · data-display · Tier 3 · stable · 공개

## 역할

동일 항목의 기존값·변경값·증감 또는 영향을 같은 기준에서 확인함

## 생성 선택 기준

- 동일 항목의 기존값·변경값·증감 또는 영향을 같은 기준에서 확인함
- 저장·재등록·적용 전에 변경 결과를 짧게 판단해야 함

선택하지 않는 경우:
- 서로 다른 엔티티 목록을 탐색·선택함
- 변경값 하나만 강조하면 충분해 열 비교가 불필요함
- 원본과 대상 사이에 항목을 이동·복사하는 상호작용이 필요함

## API와 상태

- 공개 심볼: `BeforeAfterComparisonMetric`, `BeforeAfterComparisonSnapshot`, `BeforeAfterComparisonProps`, `BeforeAfterComparison`
- 주요 Props: `key`, `label`, `id`, `values`, `emphasized`, `metrics`, `snapshots`, `className`
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`
- 변형: `single-value`, `multi-row`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 증감 방향을 색상만으로 전달하지 않는다.
- 기존값과 변경값의 열 또는 라벨 관계를 읽을 수 있어야 한다.
- 기존값·변경값·차이의 단위와 방향을 일관되게 표시한다.
- 표현이 작은 표처럼 보여도 일반 목록 조회·검색·선택 기능을 붙이지 않는다.

## 근거

- 구현: `src/components/ui/before-after-comparison.tsx`
- 웹 문서: `/components/before-after-comparison`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `production-quantity-reregistration`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
