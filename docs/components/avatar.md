# Avatar

> `avatar` · data-display · Tier 4 · provisional · 공개

## 역할

사용자·작업자를 사진이나 이니셜로 축약 식별한다.

## 생성 선택 기준

- 사용자·작업자를 사진이나 이니셜로 축약 식별한다.

선택하지 않는 경우:
- 이름 없이 장식 이미지만 필요하거나 업무 대상을 표시하는 경우

## API와 상태

- 공개 심볼: `AvatarProps`, `Avatar`
- 주요 Props: `name`, `initials`, `size`, `status`
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label`, `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/avatar.tsx`
- 웹 문서: `/components/avatar`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
