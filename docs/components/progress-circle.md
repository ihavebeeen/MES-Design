# ProgressCircle

> `progress-circle` · feedback · Tier 4 · provisional · 공개

## 역할

좁은 카드에서 단일 진행률을 요약할 때 사용한다.

## 사용 기준

- 좁은 카드에서 단일 진행률을 요약할 때 사용한다.
- 목록 비교나 긴 진행 영역은 선형 Progress를 우선한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `ProgressCircleProps`, `ProgressCircle`
- 주요 Props: `value`, `size`, `label`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `role` 의미를 제거하지 않습니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/progress-circle.tsx`
- 웹 문서: `/components/progress-circle`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
