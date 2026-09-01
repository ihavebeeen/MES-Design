# CenterModal

> `center-modal` · overlay · Tier 1 · stable · 공개

## 역할

현재 작업 위에서 제한된 선택·비교·처리·설정을 집중해 마친 뒤 원래 흐름으로 돌아감

## 생성 선택 기준

- 현재 작업 위에서 제한된 선택·비교·처리·설정을 집중해 마친 뒤 원래 흐름으로 돌아감
- 내부 자산의 관계가 중앙의 제한된 작업 공간과 맞고 원본 또는 사용자 지정도 중앙 팝업을 지지함

선택하지 않는 경우:
- 배경 유지·건수·입력 길이·폭 하나로 중앙/우측을 결정함
- 유지해야 할 우측 슬라이드 원본
- 짧은 확인만 필요한 작은 대화상자

## API와 상태

- 공개 심볼: `CenterModalSize`, `CenterModalProps`, `CenterModal`, `centerModalSizeClasses`
- 주요 Props: `open`, `onOpenChange`, `title`, `children`, `cancelLabel`, `onCancel`, `confirmLabel`, `onConfirm`, `size`, `actions`, `footer`, `headerDivider`, `bodyPadding`, `scrollMode`, `bodyAlign`, `exactWidth`, `exactHeight`, `maxHeight`, `contentClassName`, `className`
- 상태: `closed`, `open`, `dismiss`, `confirm`
- 변형: `compact-400`, `compact-480`, `medium-600`, `standard-960`, `wide-1024`, `large-1100`, `wide-1142`, `wide-1400`

## 접근성과 제약

- 제목을 Dialog title로 연결한다.
- Esc·X·backdrop·취소가 동일 dismiss 정책을 사용한다.
- 임의 overlay와 wrapper로 재구현하지 않는다.
- 헤더·본문·푸터와 본문 scroll 책임을 셸이 소유한다.
- 기본 취소는 fillGray, 확인은 fillMain이며 버튼 160×40px·간격10px을 유지한다. 명시적 actions·footer는 우선한다.

## 근거

- 구현: `src/components/ui/center-modal.tsx`
- 웹 문서: `/components/center-modal`
- 생성 선택 규칙: 적용됨
- 참고 화면: `batch-work-order`, `material-input-settings`, `inventory-add`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
