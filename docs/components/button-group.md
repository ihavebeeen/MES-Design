# ButtonGroup

> `button-group` · action · Tier 2 · provisional · 공개

## 역할

서로 관련된 동작을 하나의 조작 단위로 묶고 경계를 보여준다.

## 생성 선택 기준

- 서로 관련된 동작을 하나의 조작 단위로 묶고 경계를 보여준다.

선택하지 않는 경우:
- 서로 독립된 저장·취소 동작이나 단일 선택 상태를 표현하는 경우

## API와 상태

- 공개 심볼: `ButtonGroup`
- 주요 Props: 별도 Props 선언 없음
- 상태: 정적 표시
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `role` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/button-group.tsx`
- 웹 문서: `/components/button-group`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
