# Select

> `select` · form · Tier 1 · stable · 공개

## 역할

유한한 선택지 중 하나를 고름

## 생성 선택 기준

- 유한한 선택지 중 하나를 고름
- 선택 행에서 편집 가능한 코드·구분 값을 선택

선택하지 않는 경우:
- 여러 값을 동시에 선택
- 자유 입력
- 라디오로 모든 옵션을 한눈에 비교해야 함

## API와 상태

- 공개 심볼: `SelectTriggerProps`, `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem`, `selectTriggerVariants`
- 주요 Props: `icon`
- State: `closed`, `open`
- Value: `empty`, `selected`
- Disabled: `false`, `true`
- Size: `default`, `small`
- Interaction: `rest`, `hover`
- 변형: `default`, `small`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 트리거에 label 또는 aria-label을 연결한다.
- 키보드 열기·이동·선택을 유지한다.
- 현재 value는 options에 존재해야 한다.
- 선택 행에서만 보여야 하는 경우 행 선택 state에서 노출을 파생한다.

## 근거

- 구현: `src/components/ui/select.tsx`
- 웹 문서: `/components/select`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `receiving`, `batch-work-order`, `team-settings`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
