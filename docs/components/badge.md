# Badge

> `badge` · data-display · Tier 1 · stable · 공개

## 역할

행이나 항목의 상태·분류를 짧게 표시

## 생성 선택 기준

- 행이나 항목의 상태·분류를 짧게 표시

선택하지 않는 경우:
- 클릭해 상세로 이동
- 필터를 제거하는 조작
- 긴 설명 문구

## API와 상태

- 공개 심볼: `BadgeProps`, `Badge`, `badgeVariants`
- 주요 Props: 별도 Props 선언 없음
- 상태: `static`
- 변형: `blue`, `red`, `grayFill`, `blue2`, `gray`, `blueLight`, `blueOutline`, `amber`

## 접근성과 제약

- 색상만으로 상태를 구분하지 않고 텍스트를 함께 제공한다.
- 동일 의미에 화면마다 다른 색 variant를 임의 적용하지 않는다.
- 링크처럼 밑줄이나 클릭 affordance를 추가하지 않는다.

## 근거

- 구현: `src/components/ui/badge.tsx`
- 웹 문서: `/components/badge`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `material-input-settings`, `grouped-production-list`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
