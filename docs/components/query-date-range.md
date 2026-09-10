# QueryDateRange

> `query-date-range` · form · Tier 1 · stable · 공개

## 역할

MES 메인 목록이나 조회 팝업에서 시작일·종료일을 하나의 조회 조건으로 변경

## 생성 선택 기준

- MES 메인 목록이나 조회 팝업에서 시작일·종료일을 하나의 조회 조건으로 변경
- 기간 라벨과 두 날짜 입력이 한 줄의 조회 도구로 함께 보여야 함

선택하지 않는 경우:
- 업무 레코드에 저장되는 단일 날짜
- 일반 폼에서 저장되는 날짜 범위
- 원본과 업무 조건에 기간 조회가 없는 화면

## API와 상태

- 공개 심볼: `QueryDateRangeProps`, `QueryDateRange`
- 주요 Props: `label`, `start`, `end`, `onStartChange`, `onEndChange`, `className`
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `not-applicable`
- 변형: `default`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 시작일과 종료일 입력을 각각 식별한다.
- 달력 열기와 날짜 이동을 키보드로 수행할 수 있어야 한다.
- 시작일은 종료일보다 늦을 수 없다.
- 메인 목록에서는 기간 라벨·시작일·종료일을 승인된 32px 조회 컨트롤로 유지한다.
- 조회 결과를 갱신하는 다른 도구와 같은 query state를 사용한다.

## 근거

- 구현: `src/components/ui/query-date-range.tsx`
- 웹 문서: `/components/query-date-range`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `grouped-production-list`, `production-result-responsive`, `equipment-inspection-records`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
