# Sidebar

> `sidebar` · navigation · Tier 1 · stable · 공개

## 역할

펼쳐진 1-depth 항목 key (없으면 전부 접힘)

## 사용 기준

- 등록된 화면·패턴에서 같은 의미가 필요할 때 사용합니다.

사용하지 않는 경우:
- 역할이 다른 기존 컴포넌트로 표현할 수 있으면 새 용도로 확장하지 않습니다.

## API와 상태

- 공개 심볼: `SidebarSubItem`, `SidebarNavItem`, `SidebarProps`, `Sidebar`, `SidebarSettingsIcon`
- 주요 Props: `key`, `label`, `icon`, `children`, `items`, `expandedKey`, `onExpandedKeyChange`, `activeKey`, `activeSubKey`, `onSubItemClick`, `onItemClick`, `favorited`, `onFavoriteClick`, `onDashboardClick`, `dashboardActive`, `collapsed`, `onCollapseClick`, `onManualClick`, `onLogoutClick`, `logo`
- 상태: `open`, `hover`
- 변형: 등록된 별도 variant 없음

## 접근성과 제약

- 구현에 선언된 `aria-label` 의미를 제거하지 않습니다.
- 공개 Props와 등록된 사용 맥락 밖으로 임의 확장하지 않습니다.

## 근거

- 구현: `src/components/ui/sidebar.tsx`
- 웹 문서: `/components/sidebar`
- 상세 사용 계약: 기본 계약만 등록됨
- 화면 근거: 구현 주석·레지스트리 규칙

이 문서는 `npm run sync:assets`로 생성합니다. 직접 수정하지 않습니다.
