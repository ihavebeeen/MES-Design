# Sidebar

> `sidebar` · navigation · Tier 1 · stable · 공개

## 역할

MES 데스크톱 전체 페이지에서 제품의 1차 메뉴와 현재 메뉴 상태를 제공한다.

## 생성 선택 기준

- MES 데스크톱 전체 페이지에서 제품의 1차 메뉴와 현재 메뉴 상태를 제공한다.

선택하지 않는 경우:
- 팝업 내부에 중복하거나 독립 임시 탐색 UI로 다시 만드는 경우

## API와 상태

- 공개 심볼: `SidebarSubItem`, `SidebarNavItem`, `SidebarProps`, `Sidebar`, `SidebarSettingsIcon`
- 주요 Props: `key`, `label`, `icon`, `children`, `items`, `expandedKey`, `onExpandedKeyChange`, `activeKey`, `activeSubKey`, `onSubItemClick`, `onItemClick`, `favorited`, `onFavoriteClick`, `onDashboardClick`, `dashboardActive`, `collapsed`, `onCollapseClick`, `onManualClick`, `onLogoutClick`, `logo`
- State: `default`, `open`
- Value: `not-applicable`
- Disabled: `not-applicable`
- Size: `not-applicable`
- Interaction: `rest`, `hover`
- 변형: 등록된 별도 variant 없음

다섯 축은 독립적으로 조합하며, 모든 경우의 수를 별도 variant로 만들지 않고 실제 유효 조합만 구현·검증합니다.

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 구현된 상태 범위 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/sidebar.tsx`
- 웹 문서: `/components/sidebar`
- 생성 선택 맥락: 적용됨
- 상세 선택 계약: 기본 맥락만 적용
- 참고 화면: 없음
- 참고 화면의 역할: 직접 화면 근거 없이 의미·API 맥락으로 정의

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
