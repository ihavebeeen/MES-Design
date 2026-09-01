# ToggleButton

> `toggle-button` · action · Tier 2 · provisional · 공개

## 역할

버튼 형태의 동작이 활성·비활성 상태를 유지하며 같은 기능을 전환한다.

## 생성 선택 기준

- 버튼 형태의 동작이 활성·비활성 상태를 유지하며 같은 기능을 전환한다.

선택하지 않는 경우:
- 독립 boolean 설정이나 여러 보기 중 하나를 선택하는 경우

## API와 상태

- 공개 심볼: `ToggleButtonProps`, `ToggleButton`
- 주요 Props: `pressed`, `onPressedChange`, `size`, `basic`, `small`, `xsmall`
- 상태: `disabled`, `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-pressed` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/toggle-button.tsx`
- 웹 문서: `/components/toggle-button`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
