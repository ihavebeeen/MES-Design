# Switch

> `switch` · form · Tier 2 · stable · 공개

## 역할

켜짐·꺼짐이 즉시 적용되는 독립 설정을 변경한다.

## 생성 선택 기준

- 켜짐·꺼짐이 즉시 적용되는 독립 설정을 변경한다.

선택하지 않는 경우:
- 복수 항목 선택, 저장 전 선택값, 단순 상태 표시인 경우

## API와 상태

- 공개 심볼: `SwitchProps`, `Switch`
- 주요 Props: `size`
- 상태: `disabled`, `checked`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/switch.tsx`
- 웹 문서: `/components/switch`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
