# SideSlidePanel

> `side-slide-panel` · overlay · Tier 1 · stable · 공개

## 역할

전체 컨셉·정보 관계·진입/종료와 MES 근거를 함께 검토해 우측 형식을 선택함

## 생성 선택 기준

- 전체 컨셉·정보 관계·진입/종료와 MES 근거를 함께 검토해 우측 형식을 선택함
- 원본 또는 사용자 지정이 우측 슬라이드 팝업으로 확인됨

선택하지 않는 경우:
- 중앙 조회·선택 팝업
- 짧은 확인
- 독립 전체 페이지

## API와 상태

- 공개 심볼: `SideSlidePanelSize`, `SideSlidePanelProps`, `SideSlidePanel`, `sideSlidePanelSizeClasses`
- 주요 Props: `open`, `onOpenChange`, `title`, `children`, `cancelLabel`, `onCancel`, `confirmLabel`, `onConfirm`, `size`, `actions`, `footer`, `bodyPadding`, `scrollMode`, `bodyAlign`, `contentClassName`, `className`
- 상태: `closed`, `open`, `dismiss`, `save`
- 변형: `narrow-760`, `medium-849`, `standard-900`, `wide-960`

## 접근성과 제약

- 제목을 Dialog title로 연결한다.
- Esc·X·backdrop·취소가 동일 dismiss 정책을 사용한다.
- 760·849·900·960px 승인 preset만 사용한다.
- 본문 섹션만 스크롤하고 헤더·푸터는 고정한다.

## 근거

- 구현: `src/components/ui/side-slide-panel.tsx`
- 웹 문서: `/components/side-slide-panel`
- 생성 선택 규칙: 적용됨
- 참고 화면: `receiving`, `production-result`, `operation-log`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
