# MainListFooterActions

> `main-list-footer-actions` · system · Tier 1 · stable · 공개

## 역할

메인 리스트 하단 바의 우하단 액션

## 생성 선택 기준

- 메인 리스트 하단 바의 우하단 액션
- 32px 버튼 1~3개를 한 묶음으로 배치

선택하지 않는 경우:
- 중앙 모달이나 우측 패널의 하단 액션
- 본문 내부의 로컬 버튼 묶음

## API와 상태

- 공개 심볼: `MainListFooterAction`, `MainListFooterActionsProps`, `MainListFooterActions`
- 주요 Props: `id`, `label`, `variant`, `startIcon`, `endIcon`, `disabled`, `onClick`, `className`, `actions`
- State: `default`
- Value: `not-applicable`
- Disabled: `false`, `true`
- Size: `not-applicable`
- Interaction: `rest`
- 변형: `one`, `two`, `three`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 탭 순서는 시각 순서와 일치한다.
- 버튼 라벨은 실행 결과를 명시한다.
- 버튼은 160×32px·간격10px를 사용한다.
- 기본 순서는 fillBlack·fillMain·fillGray이며 화면별 명시적 variant가 우선한다.

## 근거

- 구현: `src/components/ui/main-list-footer-actions.tsx`
- 웹 문서: `/components/main-list-footer-actions`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `sales-transaction-statement`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
