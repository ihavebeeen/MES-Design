# ConfirmDialog

> `confirm-dialog` · overlay · Tier 1 · stable · 공개

## 역할

현재 행동의 대상·영향·변경 결과를 짧게 이해하고 실행 여부를 결정함

## 생성 선택 기준

- 현재 행동의 대상·영향·변경 결과를 짧게 이해하고 실행 여부를 결정함
- 한두 개 결론 또는 작은 변경 전후 비교가 의사결정에 충분함

선택하지 않는 경우:
- 여러 대상을 검색·선택함
- 긴 입력이나 여러 섹션 편집이 필요함
- 결정에 필요한 비교 구조를 짧은 문구로 축약하면 의미가 사라짐

## API와 상태

- 공개 심볼: `ConfirmDialogAction`, `ConfirmDialogTone`, `ConfirmDialogProps`, `ConfirmDialog`
- 주요 Props: `label`, `onClick`, `variant`, `error`, `warning`, `info`, `open`, `onOpenChange`, `title`, `heading`, `description`, `actions`, `tone`, `banner`, `children`, `footer`, `onCancel`, `className`
- 상태: `closed`, `open`, `dismiss`, `confirm`
- 변형: `default`, `danger`, `comparison`

## 접근성과 제약

- 제목과 결과 설명을 Dialog에 연결한다.
- 위험 동작은 버튼 라벨만으로도 결과를 이해할 수 있어야 한다.
- 짧다는 이유로 필요한 대상·영향 정보를 생략하지 않는다.
- 본문 표현은 메시지·요약 영역·작은 비교표 중 정보 관계에 맞게 선택한다.
- 취소·X·Esc·backdrop은 동일 dismiss 정책을 사용한다.

## 근거

- 구현: `src/components/ui/confirm-dialog.tsx`
- 웹 문서: `/components/confirm-dialog`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 적용됨
- 참고 화면: `production-quantity-reregistration`, `user-password-settings`
- 참고 화면의 역할: 선택 규칙을 설명하는 참고 자료이며 단독 표준 근거가 아님

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
