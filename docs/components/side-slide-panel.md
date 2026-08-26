# SideSlidePanel

> `side-slide-panel` · overlay · Tier 1 · stable · 공개

## 역할

현재 목록 맥락을 유지하며 긴 등록·편집을 우측에서 수행

## 사용 기준

- 현재 목록 맥락을 유지하며 긴 등록·편집을 우측에서 수행
- 원본이 우측 슬라이드 팝업으로 확인됨

사용하지 않는 경우:
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
- 상세 사용 계약: 등록됨
- 화면 근거: `receiving`, `production-result`, `operation-log`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
