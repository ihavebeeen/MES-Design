# RadioChoiceDialog

> `radio-choice-dialog` · overlay · Tier 1 · stable · 공개

## 역할

짧은 배타적 선택지 하나를 팝업에서 고른 뒤 확정해야 한다.

## 생성 선택 기준

- 짧은 배타적 선택지 하나를 팝업에서 고른 뒤 확정해야 한다.

선택하지 않는 경우:
- 일반 폼 안에서 바로 비교할 수 있거나 여러 값을 선택하는 경우

## API와 상태

- 공개 심볼: `RadioChoiceOption`, `RadioChoiceDialogProps`, `RadioChoiceDialog`
- 주요 Props: `title`, `description`, `open`, `onOpenChange`, `question`, `options`, `selectedIndex`, `defaultSelectedIndex`, `onSelectedIndexChange`, `warning`, `cancelLabel`, `confirmLabel`, `onCancel`, `onConfirm`
- 상태: `checked`, `open`, `error`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/radio-choice-dialog.tsx`
- 웹 문서: `/components/radio-choice-dialog`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
