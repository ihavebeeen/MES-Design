# ProgressCircle

> `progress-circle` · feedback · Tier 4 · provisional · 공개

## 역할

좁은 요약 영역에서 하나의 완료 비율을 원형으로 강조한다.

## 생성 선택 기준

- 좁은 요약 영역에서 하나의 완료 비율을 원형으로 강조한다.

선택하지 않는 경우:
- 여러 진행량을 정밀 비교하거나 가로 공간이 충분한 경우

## API와 상태

- 공개 심볼: `ProgressCircleProps`, `ProgressCircle`
- 주요 Props: `value`, `size`, `label`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-valuemax`, `aria-valuemin`, `aria-valuenow`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/progress-circle.tsx`
- 웹 문서: `/components/progress-circle`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
