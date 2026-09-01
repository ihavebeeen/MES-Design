# NotificationPanel

> `notification-panel` · overlay · Tier 1 · stable · 공개

## 역할

여러 알림을 현재 화면 위에서 시간순으로 확인하고 상태를 관리한다.

## 생성 선택 기준

- 여러 알림을 현재 화면 위에서 시간순으로 확인하고 상태를 관리한다.

선택하지 않는 경우:
- 단일 즉시 알림이나 업무 선택 팝업인 경우

## API와 상태

- 공개 심볼: `NotificationPanelItem`, `NotificationSettingItem`, `NotificationPanelProps`, `NotificationPanel`
- 주요 Props: `id`, `label`, `enabled`, `totalCount`, `items`, `onClose`, `onItemClick`, `settingsItems`, `onSettingsItemChange`, `className`
- 상태: `checked`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/notification-panel.tsx`
- 웹 문서: `/components/notification-panel`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
