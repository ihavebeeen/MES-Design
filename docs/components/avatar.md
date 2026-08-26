# Avatar

> `avatar` · data-display · Tier 4 · provisional · 공개

## 역할

사용자·작업자 식별의 축약 표시에 사용한다.

## 사용 기준

- 사용자·작업자 식별의 축약 표시에 사용한다.
- 온라인 상태는 보조 표식이며 이름 텍스트를 대체하지 않는다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `AvatarProps`, `Avatar`
- 주요 Props: `name`, `initials`, `size`, `status`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label`, `role` 의미를 제거하지 않습니다.
- 실제 MES 근거를 확인하기 전 신규 화면의 기본 선택으로 사용하지 않습니다.

## 근거

- 구현: `src/components/ui/avatar.tsx`
- 웹 문서: `/components/avatar`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
