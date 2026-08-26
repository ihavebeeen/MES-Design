# NumberInput

> `number-input` · form · Tier 2 · provisional · 공개

## 역할

증가·감소 버튼이 업무 흐름에 실제로 필요한 수량 입력

## 생성 선택 기준

- 증가·감소 버튼이 업무 흐름에 실제로 필요한 수량 입력

선택하지 않는 경우:
- Figma나 업무 근거 없이 단순 숫자 입력을 꾸미는 경우
- 표 안의 조밀한 숫자 편집

## API와 상태

- 공개 심볼: `NumberInputProps`, `NumberInput`
- 주요 Props: `value`, `defaultValue`, `onValueChange`, `min`, `max`, `step`, `size`, `disabled`, `className`
- 상태: `default`, `disabled`, `min`, `max`
- 변형: `default`, `small`

## 접근성과 제약

- 증가·감소 버튼에 접근 가능한 이름을 유지한다.
- 키보드 직접 입력을 막지 않는다.
- 전용 Figma 원형이 없는 provisional 자산이므로 화면 근거 없이 신규 표준에 사용하지 않는다.
- min·max·step과 직접 입력을 같은 값 모델에서 관리한다.

## 근거

- 구현: `src/components/ui/number-input.tsx`
- 웹 문서: `/components/number-input`
- 생성 선택 규칙: 적용됨
- 참고 화면: `defect-quantity-input`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
