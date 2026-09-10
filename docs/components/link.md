# Link

> `link` · action · Tier 2 · provisional · 공개

## 역할

다른 화면·상세·관련 목록으로 이동

## 생성 선택 기준

- 다른 화면·상세·관련 목록으로 이동
- 표 셀에서 연결된 건수나 식별자를 여는 경우

선택하지 않는 경우:
- 상태값 표시
- 저장·삭제 등 즉시 실행 동작

## API와 상태

- 공개 심볼: `LinkProps`, `Link`
- 주요 Props: 별도 Props 선언 없음
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`, `hover`
- 변형: `default`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 목적을 텍스트만으로 식별할 수 있어야 한다.
- 새 창이면 접근 가능한 안내를 제공한다.
- 링크 의미를 Badge나 Tag로 대체하지 않는다.
- 클릭 결과가 이동이 아니라 상태 변경이면 Button을 사용한다.

## 근거

- 구현: `src/components/ui/link.tsx`
- 웹 문서: `/components/link`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `purchase-order-lookup`, `team-settings`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
