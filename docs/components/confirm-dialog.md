# ConfirmDialog

> `confirm-dialog` · overlay · Tier 1 · stable · 공개

## 역할

작은 확인·안내 팝업은 CenterModal이 아니라 12px radius와 modal-shadow를 가진 ConfirmDialog를 사용한다.

## 사용 기준

- 작은 확인·안내 팝업은 CenterModal이 아니라 12px radius와 modal-shadow를 가진 ConfirmDialog를 사용한다.
- 합성 콘텐츠가 필요하면 children과 footer 슬롯을 사용하되 외곽 헤더·그림자 규격을 다시 그리지 않는다.
- X·Esc·배경 클릭은 onCancel을 거쳐 닫는다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `ConfirmDialogAction`, `ConfirmDialogTone`, `ConfirmDialogProps`, `ConfirmDialog`
- 주요 Props: `label`, `onClick`, `variant`, `error`, `warning`, `info`, `open`, `onOpenChange`, `title`, `heading`, `description`, `actions`, `tone`, `banner`, `children`, `footer`, `onCancel`, `className`
- 상태: `open`, `error`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/confirm-dialog.tsx`
- 웹 문서: `/components/confirm-dialog`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
