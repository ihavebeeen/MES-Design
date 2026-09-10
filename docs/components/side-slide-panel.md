# SideSlidePanel

> `side-slide-panel` · overlay · Tier 1 · stable · 공개

## 역할

기본정보와 확장정보·검사·반복 항목처럼 여러 섹션을 한 등록·편집 흐름으로 이어서 처리함

## 생성 선택 기준

- 기본정보와 확장정보·검사·반복 항목처럼 여러 섹션을 한 등록·편집 흐름으로 이어서 처리함
- 내부 자산의 순서와 관계가 전체 높이의 연속 작업 공간과 맞고 원본 또는 사용자 지정도 우측 슬라이드를 지지함

선택하지 않는 경우:
- 중앙 조회·선택 팝업
- 짧은 확인
- 독립 전체 페이지

## API와 상태

- 공개 심볼: `SideSlidePanelSize`, `SideSlidePanelProps`, `SideSlidePanel`, `sideSlidePanelSizeClasses`
- 주요 Props: `open`, `onOpenChange`, `title`, `children`, `cancelLabel`, `onCancel`, `confirmLabel`, `onConfirm`, `size`, `actions`, `footer`, `bodyPadding`, `scrollMode`, `bodyAlign`, `contentClassName`, `className`
- State: `default`, `open`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`
- 변형: `narrow-760`, `medium-849`, `standard-900`, `wide-960`

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 제목을 Dialog title로 연결한다.
- Esc·X·backdrop·취소가 동일 dismiss 정책을 사용한다.
- 760·849·900·960px 승인 preset만 사용한다.
- 본문 섹션만 스크롤하고 헤더·푸터는 고정한다.
- 기본 취소는 fillGray, 확인은 fillMain이며 버튼 160×40px·간격10px을 유지한다. 명시적 actions·footer는 우선한다.

## 근거

- 구현: `src/components/ui/side-slide-panel.tsx`
- 웹 문서: `/components/side-slide-panel`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `receiving`, `production-result`, `operation-log`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
