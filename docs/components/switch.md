# Switch

> `switch` · form · Tier 2 · stable · 공개

## 역할

기본 40×20은 설정 목록에 사용한다.

## 사용 기준

- 기본 40×20은 설정 목록에 사용한다.
- compact 26×18은 표준단가 카드의 단가 동기화에 사용한다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `SwitchProps`, `Switch`
- 주요 Props: `size`
- 상태: `disabled`, `checked`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `role` 의미를 제거하지 않습니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/switch.tsx`
- 웹 문서: `/components/switch`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
