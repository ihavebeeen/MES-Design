# DatePicker

> `date-picker` · form · Tier 2 · provisional · 공개

## 역할

업무 값으로 날짜 하루를 직접 선택한다.

## 생성 선택 기준

- 업무 값으로 날짜 하루를 직접 선택한다.

선택하지 않는 경우:
- 목록 조회 기간이나 시작·종료 범위를 한 번에 정하는 경우

## API와 상태

- 공개 심볼: `DatePickerProps`, `DatePicker`, `buildMonthMatrix`, `isSameDay`, `formatDate`, `WEEKDAYS`
- 주요 Props: `value`, `onValueChange`, `placeholder`, `disabled`, `className`, `separator`, `iconPosition`, `iconColor`, `size`, `minDate`, `maxDate`
- State: `closed`, `open`
- Value: `empty`, `filled`
- Disabled: `false`, `true`
- Size: `default`, `small`
- Interaction: `rest`, `hover`, `focus`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 구현에 선언된 `aria-label`, `aria-pressed` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/date-picker.tsx`
- 웹 문서: `/components/date-picker`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
