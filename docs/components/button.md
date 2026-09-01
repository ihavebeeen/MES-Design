# Button

> `button` · action · Tier 1 · stable · 공개

## 역할

사용자가 즉시 실행하는 명시적 동작

## 생성 선택 기준

- 사용자가 즉시 실행하는 명시적 동작
- DialogFooter 또는 조회 툴바의 액션

선택하지 않는 경우:
- 다른 화면이나 상세로 이동하는 링크 의미
- 상태값을 표시하는 경우
- 아이콘만 필요한 32px 이하 동작

## API와 상태

- 공개 심볼: `ButtonProps`, `Button`, `buttonVariants`
- 주요 Props: `asChild`, `startIcon`, `endIcon`
- 상태: `default`, `hover`, `disabled`
- 변형: `fillMain`, `fillGray`, `fillBlack`, `fillRed`, `lineMain`, `lineBlacktxt`, `opacityMain`, `softMain`, `softDanger`, `loginPrimary`

## 접근성과 제약

- 텍스트가 없는 버튼은 aria-label을 제공한다.
- disabled 상태는 실제 disabled 속성과 연결한다.
- 화면 구현에서 raw button을 직접 만들지 않는다.
- 주요 액션은 한 영역에서 하나만 primary 계열로 강조한다.

## 근거

- 구현: `src/components/ui/button.tsx`
- 웹 문서: `/components/button-size`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `batch-work-order`, `receiving`, `self-inspection`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
