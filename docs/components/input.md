# Input

> `input` · form · Tier 1 · stable · 공개

## 역할

자유 텍스트 입력

## 생성 선택 기준

- 자유 텍스트 입력
- 화면 계약상 숫자 문자열을 직접 입력
- 읽기 전용 필드

선택하지 않는 경우:
- 정해진 선택지 중 하나를 고름
- 검색 전용 입력
- 증감 버튼이 필수인 수량 입력

## API와 상태

- 공개 심볼: `InputProps`, `Input`, `inputVariants`
- 주요 Props: 별도 Props 선언 없음
- 상태: `default`, `focus`, `complete`, `readonly`, `disabled`
- 변형: `default`, `small`

## 접근성과 제약

- label 또는 aria-label을 연결한다.
- 오류 상태는 설명 텍스트와 연결한다.
- value를 전달하면 onChange 또는 readOnly를 함께 제공한다.
- 필수 표시와 label 정렬은 FormFieldRow가 소유한다.

## 근거

- 구현: `src/components/ui/input.tsx`
- 웹 문서: `/components/input`
- 생성 선택 규칙: 적용됨
- 참고 화면: `receiving`, `batch-work-order`, `inventory-add`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
