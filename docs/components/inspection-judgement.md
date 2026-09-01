# InspectionJudgement

> `inspection-judgement` · system · Tier 3 · stable · 공개

## 역할

검사항목의 정상·이상 등 승인된 판정값을 일관된 상태와 동작으로 입력한다.

## 생성 선택 기준

- 검사항목의 정상·이상 등 승인된 판정값을 일관된 상태와 동작으로 입력한다.

선택하지 않는 경우:
- 일반 단일 선택이나 결과를 정적으로 표시하는 경우

## API와 상태

- 공개 심볼: `InspectionJudgementValue`, `InspectionJudgementProps`, `InspectionJudgement`
- 주요 Props: `value`, `onValueChange`, `className`
- 상태: `checked`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-checked`, `aria-label`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/inspection-judgement.tsx`
- 웹 문서: `/components/inspection-judgement`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
