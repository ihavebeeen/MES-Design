# UserAccountMenu

> `user-account-menu` · navigation · Tier 2 · provisional · 공개

## 역할

현재 로그인 사용자 식별과 계정·로그아웃 관련 동작을 공통 탐색 영역에서 제공한다.

## 생성 선택 기준

- 현재 로그인 사용자 식별과 계정·로그아웃 관련 동작을 공통 탐색 영역에서 제공한다.

선택하지 않는 경우:
- 업무 담당자를 선택하거나 일반 동작 메뉴를 제공하는 경우

## API와 상태

- 공개 심볼: `UserAccountMenuProps`, `UserAccountMenu`
- 주요 Props: `name`, `items`, `className`
- State: `default`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`, `hover`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 네이티브 의미와 부모 컨텍스트의 접근 가능한 이름을 유지합니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/user-account-menu.tsx`
- 웹 문서: `/components/user-account-menu`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
