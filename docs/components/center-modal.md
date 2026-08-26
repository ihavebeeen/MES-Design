# CenterModal

> `center-modal` · overlay · Tier 1 · stable · 공개

## 역할

현재 맥락을 차단하고 중앙에서 짧은 조회·선택·편집을 완료

## 사용 기준

- 현재 맥락을 차단하고 중앙에서 짧은 조회·선택·편집을 완료
- 원본이 중앙 팝업으로 확인됨

사용하지 않는 경우:
- 긴 등록 흐름
- 우측 슬라이드 원본
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

## 근거

- 구현: `src/components/ui/center-modal.tsx`
- 웹 문서: `/components/center-modal`
- 상세 사용 계약: 등록됨
- 화면 근거: `batch-work-order`, `material-input-settings`, `inventory-add`

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
