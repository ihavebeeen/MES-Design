"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Table, type TableColumn, type TableGroup } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Radio } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Filter } from "@/components/ui/filter";
import { GroupQuery } from "@/components/ui/group-query";
import { QuickQuery, QuickQueryPresetDialog, type QuickQuerySlot } from "@/components/ui/quick-query";
import { SearchInput } from "@/components/ui/search-input";
import { Tag } from "@/components/ui/tag";
import { Toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { Sidebar, SidebarSettingsIcon, type SidebarNavItem } from "@/components/ui/sidebar";
import { AlarmListItem } from "@/components/ui/alarm-list-item";
import {
  NotificationPanel,
  type NotificationPanelItem,
  type NotificationSettingItem,
} from "@/components/ui/notification-panel";
import { RadioChoiceDialog } from "@/components/ui/radio-choice-dialog";
import { IconButton, CloseButton } from "@/components/ui/icon-button";
import { Divider } from "@/components/ui/divider";
import { Tooltip } from "@/components/ui/tooltip";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "@/components/ui/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Accordion } from "@/components/ui/accordion";
import { Collapsible } from "@/components/ui/collapsible";
import { ButtonGroup } from "@/components/ui/button-group";
import { ToggleButton } from "@/components/ui/toggle-button";
import { NumberInput } from "@/components/ui/number-input";
import { PasswordInput } from "@/components/ui/password-input";
import { MultiSelectInput } from "@/components/ui/multi-select-input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { List, ListItem } from "@/components/ui/list";
import { Panel } from "@/components/ui/panel";
import { Fieldset } from "@/components/ui/fieldset";
import { Descriptions } from "@/components/ui/descriptions";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Navbar } from "@/components/ui/navbar";
import { Container, Grid } from "@/components/ui/grid-container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StickyHeader, StickyFooter } from "@/components/ui/sticky-header-footer";
import { Logo } from "@/components/ui/logo";
import { UserAccountMenu } from "@/components/ui/user-account-menu";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { X } from "lucide-react";
import {
  IconArrow,
  IconArrowDownRight,
  IconArrowLine,
  IconBell,
  IconBox,
  IconCalendar,
  IconChartBar,
  IconCompany,
  IconCopy,
  IconDownload,
  IconExclamationCircle,
  IconFileNote,
  IconFilter,
  IconFlatBoxCheck,
  IconFlatFileCheck,
  IconFlatIn,
  IconFlatOut,
  IconGrid,
  IconGroupDown,
  IconMedalCheck,
  IconPlus,
  IconQaO,
  IconQaTriangle,
  IconQaX,
  IconReload,
  IconScan,
  IconSearch,
  IconShare,
  IconStar,
  IconTrash,
  IconTrendingDown,
  IconTrendingUp,
  IconUserMono,
  IconWrench,
  IconX,
  IconXCircle,
} from "@/components/icons";

/**
 * 컴포넌트별 예시를 "행/열이 맞는 그리드 + 컴포넌트명·상태값 라벨 병기" 형태로 정리한
 * 미리보기 페이지 (2026-07-28 담당자 지적 반영: 단순히 나눠 배치하는 게 아니라
 * 오와 열을 맞추고, 각 예시마다 컴포넌트명과 상태값을 같이 표기할 것).
 */

/**
 * 2026-07-30 담당자 요청 — 페이지 상단에 섹션 바로가기 링크 추가. 각 항목의 `id`는
 * 아래 섹션들의 `id`(또는 `<Section id="...">`)와 1:1로 맞춰야 함 — 섹션 id를 바꾸면
 * 여기도 같이 바꿀 것.
 */
const TOC_LINKS: { id: string; label: string }[] = [
  { id: "color-palette", label: "색상 팔레트" },
  { id: "typography", label: "타이포그래피" },
  { id: "spacing", label: "간격" },
  { id: "radius", label: "Radius" },
  { id: "shadow", label: "그림자" },
  { id: "semantic-tokens", label: "시맨틱 토큰" },
  { id: "button-size", label: "Button 사이즈" },
  { id: "button-icon", label: "Button 아이콘" },
  { id: "button-color", label: "Button 컬러" },
  { id: "icon-button", label: "IconButton" },
  { id: "divider", label: "Divider" },
  { id: "tooltip", label: "Tooltip" },
  { id: "loading-spinner", label: "LoadingSpinner" },
  { id: "skeleton", label: "Skeleton" },
  { id: "switch", label: "Switch" },
  { id: "textarea", label: "Textarea" },
  { id: "label", label: "Label" },
  { id: "link", label: "Link" },
  { id: "input", label: "Input" },
  { id: "select", label: "Select" },
  { id: "badge", label: "Badge" },
  { id: "radio", label: "Radio" },
  { id: "checkbox", label: "Checkbox" },
  { id: "progress", label: "Progress" },
  { id: "filter", label: "Filter" },
  { id: "group-query", label: "GroupQuery" },
  { id: "quick-query", label: "QuickQuery" },
  { id: "search-input", label: "SearchInput" },
  { id: "tag", label: "Tag" },
  { id: "combobox", label: "Combobox" },
  { id: "toast", label: "Toast" },
  { id: "confirm-dialog", label: "ConfirmDialog" },
  { id: "notice-banner", label: "NoticeBanner" },
  { id: "radio-choice-dialog", label: "RadioChoiceDialog" },
  { id: "nested-modal", label: "Nested Modal" },
  { id: "page-top-tab-item", label: "PageTopTabItem" },
  { id: "sidebar", label: "Sidebar" },
  { id: "alarm-list-item", label: "AlarmListItem" },
  { id: "notification-panel", label: "NotificationPanel" },
  { id: "card", label: "Card" },
  { id: "empty-state", label: "EmptyState" },
  { id: "error-state", label: "ErrorState" },
  { id: "popover", label: "Popover" },
  { id: "accordion", label: "Accordion" },
  { id: "collapsible", label: "Collapsible" },
  { id: "button-group", label: "ButtonGroup" },
  { id: "toggle-button", label: "ToggleButton" },
  { id: "number-input", label: "NumberInput" },
  { id: "password-input", label: "PasswordInput" },
  { id: "multi-select-input", label: "MultiSelectInput" },
  { id: "breadcrumb", label: "Breadcrumb" },
  { id: "pagination", label: "Pagination" },
  { id: "dropdown-menu", label: "DropdownMenu" },
  { id: "list", label: "List" },
  { id: "panel", label: "Panel" },
  { id: "fieldset", label: "Fieldset" },
  { id: "descriptions", label: "Descriptions" },
  { id: "date-picker", label: "DatePicker" },
  { id: "date-range-picker", label: "DateRangePicker" },
  { id: "time-picker", label: "TimePicker" },
  { id: "navbar", label: "Navbar" },
  { id: "grid-container", label: "Grid/Container" },
  { id: "scroll-area", label: "ScrollArea" },
  { id: "sticky-header-footer", label: "StickyHeader/Footer" },
  { id: "logo", label: "Logo" },
  { id: "user-account-menu", label: "UserAccountMenu" },
  { id: "loading-overlay", label: "LoadingOverlay" },
  { id: "icons", label: "아이콘" },
  { id: "table-parts", label: "Table 분리" },
  { id: "table-full", label: "Table 합본" },
];

/**
 * 2026-07-31 신규 — 당근 Seed Design System(seed-design.io) 구조 참고, "메뉴 위치"
 * 컨셉만 차용: 상단 얇은 헤더 바 + 좌측 고정 사이드바(카테고리별 섹션 목록, 스크롤에 따라
 * 현재 위치 강조) + 본문. Seed는 다크 테마지만 이 프로젝트는 기존 화이트 톤을 그대로
 * 유지 — 톤은 가져오지 않고 레이아웃 구조만 가져옴.
 *
 * 2026-07-31, 곧바로 이어서 — 담당자가 "Button 사이즈/컬러/아이콘처럼 한 컴포넌트의
 * 하위 항목끼리는 [Button]이라는 상위 메뉴 밑에 묶여야 한다"고 지적. 사이드바만 리프
 * (leaf, 단일 섹션)와 브랜치(branch, 하위 섹션 여러 개를 가진 상위 메뉴) 2종 노드로
 * 트리화함 — 스크롤 스파이가 관찰하는 실제 앵커 대상은 여전히 `TOC_LINKS`(평평한 목록,
 * 안 바뀜)이고, 사이드바 트리는 그 위에 얹는 "표시용" 구조라 두 값이 어긋날 일이 없음
 * (branch 하위 항목의 id는 전부 `leaf()` 헬퍼로 TOC_LINKS에서 그대로 가져옴).
 * 현재 그룹화 대상: Button(사이즈/컬러/아이콘 3종), Table(합본/분리 2종) — 나머지는
 * 전부 컴포넌트 1개당 섹션 1개라 묶을 하위 항목이 없음.
 */
type SidebarNode =
  | { kind: "leaf"; id: string; label: string }
  | { kind: "branch"; label: string; children: { id: string; label: string }[] };

function leaf(id: string): SidebarNode {
  const item = TOC_LINKS.find((l) => l.id === id);
  if (!item) throw new Error(`TOC_LINKS에 없는 id: ${id}`);
  return { kind: "leaf", id: item.id, label: item.label };
}

/** `stripPrefix + " "`를 하위 항목 라벨에서 떼어내고(예: "Button 사이즈" → "사이즈") 상위 메뉴로 묶는다 */
function branch(label: string, ids: string[], stripPrefix: string): SidebarNode {
  return {
    kind: "branch",
    label,
    children: ids.map((id) => {
      const item = TOC_LINKS.find((l) => l.id === id);
      if (!item) throw new Error(`TOC_LINKS에 없는 id: ${id}`);
      return { id: item.id, label: item.label.replace(`${stripPrefix} `, "") };
    }),
  };
}

function firstIdOfNode(node: SidebarNode): string {
  return node.kind === "leaf" ? node.id : node.children[0].id;
}

const FOUNDATION_NODES: SidebarNode[] = TOC_LINKS.slice(0, 6).map((l) => leaf(l.id));

const COMPONENT_NODES: SidebarNode[] = [
  branch("Button", ["button-size", "button-icon", "button-color"], "Button"),
  leaf("icon-button"),
  leaf("divider"),
  leaf("tooltip"),
  leaf("loading-spinner"),
  leaf("skeleton"),
  leaf("switch"),
  leaf("textarea"),
  leaf("label"),
  leaf("link"),
  leaf("input"),
  leaf("select"),
  leaf("badge"),
  leaf("radio"),
  leaf("checkbox"),
  leaf("progress"),
  leaf("filter"),
  leaf("group-query"),
  leaf("quick-query"),
  leaf("search-input"),
  leaf("tag"),
  leaf("combobox"),
  leaf("toast"),
  leaf("confirm-dialog"),
  leaf("notice-banner"),
  leaf("radio-choice-dialog"),
  leaf("nested-modal"),
  leaf("page-top-tab-item"),
  leaf("sidebar"),
  leaf("alarm-list-item"),
  leaf("notification-panel"),
  leaf("card"),
  leaf("empty-state"),
  leaf("error-state"),
  leaf("popover"),
  leaf("accordion"),
  leaf("collapsible"),
  leaf("button-group"),
  leaf("toggle-button"),
  leaf("number-input"),
  leaf("password-input"),
  leaf("multi-select-input"),
  leaf("breadcrumb"),
  leaf("pagination"),
  leaf("dropdown-menu"),
  leaf("list"),
  leaf("panel"),
  leaf("fieldset"),
  leaf("descriptions"),
  leaf("date-picker"),
  leaf("date-range-picker"),
  leaf("time-picker"),
  leaf("navbar"),
  leaf("grid-container"),
  leaf("scroll-area"),
  leaf("sticky-header-footer"),
  leaf("logo"),
  leaf("user-account-menu"),
  leaf("loading-overlay"),
  leaf("icons"),
  branch("Table", ["table-parts", "table-full"], "Table"),
];

const SIDEBAR_GROUPS: { title: string; nodes: SidebarNode[] }[] = [
  { title: "Foundations", nodes: FOUNDATION_NODES },
  { title: "Components", nodes: COMPONENT_NODES },
];

/**
 * 2026-08-03 신규 — 담당자 요청: "'임시'인 건 좌측 메뉴 리스트에도 '임시' 태그를 달아줘".
 * 각 섹션의 `<Section badge="임시">`와 1:1로 맞춰 수동 관리하는 id 목록(FOUNDATION_IDS와
 * 같은 방식) — 새 섹션에 `badge="임시"`를 달거나 뗄 때 여기도 같이 바꿀 것.
 */
const TEMP_BADGE_IDS = new Set([
  "icon-button",
  "divider",
  "tooltip",
  "loading-spinner",
  "skeleton",
  "switch",
  "textarea",
  "label",
  "link",
  "card",
  "empty-state",
  "error-state",
  "popover",
  "accordion",
  "collapsible",
  "button-group",
  "toggle-button",
  "number-input",
  "password-input",
  "multi-select-input",
  "breadcrumb",
  "pagination",
  "dropdown-menu",
  "list",
  "panel",
  "fieldset",
  "descriptions",
  "date-picker",
  "date-range-picker",
  "time-picker",
  "navbar",
  "grid-container",
  "scroll-area",
  "sticky-header-footer",
  "logo",
  "user-account-menu",
  "loading-overlay",
]);

/**
 * 2026-08-03 신규 — 담당자 요청: "티어 1 2 3 4 5도 좌측 리스트에 표기를 둬봐". 각 id를
 * `docs/UI_컴포넌트_총망라_체크리스트.md`의 티어 값과 1:1로 맞춰 수동 관리(TEMP_BADGE_IDS와
 * 같은 방식 — 체크리스트에서 컴포넌트를 새로 완료하거나 티어를 바꾸면 여기도 같이 바꿀 것).
 * Foundation 6개는 각각 대응하는 토큰 체크리스트 행(Color/Typography/Spacing/Radius/
 * Shadow Scale)의 티어, "semantic-tokens"는 체크리스트에 별도 행이 없어 배지 없음.
 */
const TIER_BY_ID: Record<string, number> = {
  "color-palette": 1,
  typography: 1,
  spacing: 2,
  radius: 2,
  shadow: 1,
  "button-size": 1,
  "button-icon": 1,
  "button-color": 1,
  "icon-button": 2,
  divider: 2,
  tooltip: 2,
  "loading-spinner": 2,
  skeleton: 2,
  switch: 2,
  textarea: 2,
  label: 2,
  link: 2,
  input: 1,
  select: 1,
  badge: 1,
  radio: 1,
  checkbox: 1,
  progress: 1,
  filter: 1,
  "group-query": 1,
  "quick-query": 1,
  "search-input": 1,
  tag: 1,
  combobox: 1,
  toast: 1,
  "confirm-dialog": 1,
  "notice-banner": 1,
  "radio-choice-dialog": 1,
  "nested-modal": 1,
  "page-top-tab-item": 1,
  sidebar: 1,
  "alarm-list-item": 1,
  "notification-panel": 1,
  card: 2,
  "empty-state": 2,
  "error-state": 2,
  popover: 2,
  accordion: 2,
  collapsible: 2,
  "button-group": 2,
  "toggle-button": 2,
  "number-input": 2,
  "password-input": 2,
  "multi-select-input": 2,
  breadcrumb: 2,
  pagination: 2,
  "dropdown-menu": 2,
  list: 2,
  panel: 2,
  fieldset: 2,
  descriptions: 2,
  "date-picker": 2,
  "date-range-picker": 2,
  "time-picker": 2,
  navbar: 2,
  "grid-container": 2,
  "scroll-area": 2,
  "sticky-header-footer": 2,
  logo: 2,
  "user-account-menu": 2,
  "loading-overlay": 2,
  icons: 2,
  "table-parts": 1,
  "table-full": 1,
};

const TIER_COLOR: Record<number, string> = {
  1: "bg-mes-bg-danger/10 text-mes-danger-70",
  2: "bg-mes-bg-brand-subtle-strong text-mes-text-brand",
  3: "bg-mes-bg-subtle text-mes-gray-90",
  4: "bg-mes-bg-subtle text-mes-gray-70",
  5: "bg-mes-bg-subtle text-mes-gray-50",
};

/**
 * 2026-08-03 신규 — 담당자 요청: "티어별로 순서 배치하고 같은 티어 안에서는 알파벳
 * 순서대로 정렬". `COMPONENT_NODES`는 지금까지 작업한 순서(연대순)로 쌓여 있었는데,
 * 이제 티어 오름차순 → 같은 티어면 라벨 알파벳(로케일 비교)순으로 재정렬. `.sort()`는
 * 배열을 제자리에서 바꾸므로 `SIDEBAR_GROUPS`(아래에서 이 배열을 참조)에도 그대로
 * 반영됨 — 별도 복사본을 안 만듦. 티어 정보가 없는 항목(TIER_BY_ID에 없는 id)은
 * 맨 뒤로 보냄(`?? 99`).
 */
COMPONENT_NODES.sort((a, b) => {
  const tierA = TIER_BY_ID[firstIdOfNode(a)] ?? 99;
  const tierB = TIER_BY_ID[firstIdOfNode(b)] ?? 99;
  if (tierA !== tierB) return tierA - tierB;
  return a.label.localeCompare(b.label, "en");
});

/** 사이드바 그룹과 1:1 매칭되는 최상단 탭. `firstId`는 그 그룹의 첫 섹션으로 스크롤 이동. */
const TOP_NAV: { key: string; label: string; firstId?: string }[] = [
  { key: "foundations", label: "Foundations", firstId: firstIdOfNode(FOUNDATION_NODES[0]) },
  { key: "components", label: "Components", firstId: firstIdOfNode(COMPONENT_NODES[0]) },
  // 2026-07-31 신규 — AGENTS.md에 기록된 3층 구조(1층 토큰=Foundations, 2층
  // 컴포넌트=Components, 3층 합성 패턴 카탈로그)의 3층에 해당. 아직 코드/문서 둘 다
  // 없어서 클릭 불가 상태(비활성)로만 자리를 잡아둠 — 실제 내용이 생기면 firstId를
  // 채우고 활성화.
  { key: "patterns", label: "Patterns" },
];

/** Foundation 6개 섹션 id 집합 — 상단 탭 활성 표시를 스크롤 위치(activeId)와 연동할 때 씀 */
const FOUNDATION_IDS = new Set(TOC_LINKS.slice(0, 6).map((l) => l.id));

/** Sidebar 데모용 1-depth 항목 — MES 설정만 2-depth 실측값을 갖고 있음(주석 참고) */
const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { key: "material", label: "자재관리", icon: <IconBox size={20} /> },
  { key: "production", label: "생산관리", icon: <IconCompany size={20} /> },
  { key: "quality", label: "품질관리", icon: <IconMedalCheck size={20} /> },
  { key: "facility", label: "설비관리", icon: <IconWrench size={20} /> },
  { key: "stats", label: "통계분석", icon: <IconChartBar size={20} /> },
  {
    key: "mes-setting",
    label: "MES 설정",
    icon: <SidebarSettingsIcon size={20} />,
    children: [
      { key: "vendor-register", label: "거래처 등록" },
      { key: "user-setting", label: "사용자 설정" },
      { key: "item-register", label: "품목 등록" },
      { key: "warehouse-register", label: "창고 등록" },
      { key: "production-setting", label: "생산 정보 설정" },
      { key: "quality-setting", label: "품질 정보 설정" },
      { key: "facility-setting", label: "설비 정보 설정" },
    ],
  },
];

/**
 * 2026-08-03 신규 — GroupQuery 데모에서 발견된 "컴포넌트가 세로로 찌그러져 다른 섹션 위로
 * 겹쳐 보이는" 버그(원인: Filter의 shrink-0 누락, `filter.tsx` 주석 참고)의 재발 방지용
 * 구조적 방어막. Section이 `grid-cols-4`라 각 Sample은 컬럼 폭(약 200px대)을 넘는 콘텐츠를
 * 담을 수 있는데, 기본값(`min-width: auto`)에서는 grid item이 콘텐츠의 min-content 폭
 * 아래로 줄어들지 못해 넘친 부분이 이웃 셀 위로 시각적으로 겹쳐 보임. `min-w-0`으로 grid
 * item 자체는 줄어들 수 있게 풀어주고, 내부 콘텐츠 래퍼에 `overflow-x-auto`를 둬서 실제로
 * 폭이 부족하면 컴포넌트가 찌그러지거나 겹치는 대신 그 Sample 안에서만 가로 스크롤되도록
 * 함 — 개별 컴포넌트가 shrink-0 방어를 빠뜨리더라도 최악의 경우가 "스크롤바"로 끝나게
 * 하는 마지막 안전망.
 */
/** 사이드바 항목 옆에 티어 숫자를 작게 표기하는 뱃지 — `TIER_BY_ID`에 없는 id는 렌더링 안 함 */
function TierBadge({ id }: { id: string }) {
  const tier = TIER_BY_ID[id];
  if (!tier) return null;
  return (
    <span
      className={cn(
        "shrink-0 rounded px-1 py-0 text-[10px] font-semibold leading-[1.6]",
        TIER_COLOR[tier]
      )}
    >
      T{tier}
    </span>
  );
}

/**
 * 2026-08-03 — 앞서 넣었던 `overflow-x-auto`("최악의 경우 스크롤바로 끝나게") 안전망을
 * 담당자가 되돌리라고 지적: "컴포넌트 안에 스크롤 만드는 건 극도로 지양", "줄바꿈도 좀
 * 그래". 스크롤/줄바꿈 둘 다 눈속임이지 진짜 해결이 아니라는 지적이 맞아서, 실제 해결로
 * 교체함 — Section의 `grid-cols-4` 컬럼(약 222px)보다 넓은 콘텐츠는 애초에 좁은 칸에
 *욱여넣지 않고 `wide` prop으로 4칸을 전부 차지하는 한 줄을 통째로 내줌(Toast, Card,
 * MultiSelectInput 등 실측 결과 컬럼보다 넓은 컴포넌트에 전부 적용, 아래 데모 목록 참고).
 * `min-w-0`은 grid item이 콘텐츠 크기 때문에 트랙 자체를 밀어 늘리는 "grid blowout"만
 * 막는 용도로 유지(스크롤/클립과는 무관, 부작용 없음).
 */
function Sample({
  label,
  wide,
  children,
}: {
  label: string;
  /** 컴포넌트 실측 폭이 grid-cols-4 한 칸(~222px)보다 넓을 때 4칸 전체를 차지하도록 */
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-2", wide && "col-span-4")}>
      <span className="font-mono text-[12px] font-medium leading-none text-mes-gray-90">
        {label}
      </span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function Section({
  id,
  title,
  badge,
  children,
}: {
  id: string;
  title: string;
  /** 2026-07-31 신규 — "Tooltip (신규, 판단값 — CSS 경량 구현)"처럼 제목 문자열에
   *  경위 설명을 욱여넣던 걸 담당자가 "제목이 이게 뭐냐"고 지적해서 분리. 제목은
   *  컴포넌트명만 깔끔하게, 부가 설명은 옆의 작은 칩으로.
   *  2026-07-31 25차 — 칩 텍스트를 "판단값"→"임시"로, 색은 회색(bg-mes-bg-subtle)
   *  →파랑(`bg-mes-bg-brand-subtle-strong` + `text-mes-text-brand`, Badge
   *  컴포넌트의 blueLight 변형과 동일 톤)으로 변경. */
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8"
    >
      <h2 className="flex items-center gap-2 border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
        {title}
        {badge && (
          <span className="rounded-full bg-mes-bg-brand-subtle-strong px-2 py-0.5 text-[11px] font-medium text-mes-text-brand">
            {badge}
          </span>
        )}
      </h2>
      <div className="grid grid-cols-4 items-end gap-x-6 gap-y-6">{children}</div>
    </section>
  );
}

/**
 * 2026-07-30 신규 — 페이지 상단 "Foundation"(색상/타이포) 섹션.
 * 담당자 지적: 색상·폰트 값이 각 컴포넌트 섹션에 흩어져 있어 한눈에 보기 어려움 —
 * `docs/디자인_토큰_사용_규칙.md`에 이미 정리된 값을 페이지 최상단에 시각적으로도 모아둠.
 * Tailwind는 클래스명을 정적으로 스캔하므로(`bg-mes-gray-${step}` 같은 동적 조합은
 * 감지 못 함) 스와치 배경은 실제 hex를 inline style로 직접 지정 — `globals.css`의
 * `--mes-*` 값과 100% 동일해야 하며, 값이 바뀌면 여기도 같이 갱신할 것.
 */
const GRAY_PALETTE = [
  { step: "0", hex: "#FFFFFF" },
  { step: "10", hex: "#F8FAFC" },
  { step: "20", hex: "#EFF2F8" },
  { step: "30", hex: "#E4E7EE" },
  { step: "40", hex: "#D7DCE5" },
  { step: "50", hex: "#B4C0D3" },
  { step: "60", hex: "#99A3B8" },
  { step: "70", hex: "#8491A7" },
  { step: "80", hex: "#67738E" },
  { step: "90", hex: "#5C667B" },
  { step: "100", hex: "#475067" },
  { step: "110", hex: "#373F57" },
  { step: "120", hex: "#292E41" },
  { step: "130", hex: "#011327" },
  { step: "140", hex: "#000000" },
] as const;

const PRIMARY_PALETTE = [
  { step: "10", hex: "#EFF8FF" },
  { step: "20", hex: "#E8F5FF" },
  { step: "30", hex: "#C7E4FF" },
  { step: "40", hex: "#7BBBFF" },
  { step: "50", hex: "#4096FF" },
  { step: "60", hex: "#1573FB" },
  { step: "70", hex: "#0958D9" },
  { step: "80", hex: "#003EB3" },
  { step: "90", hex: "#002C8C" },
  { step: "100", hex: "#001D66" },
  { step: "110", hex: "#00113D" },
] as const;

const DANGER_PALETTE = [
  { step: "10", hex: "#FBEFF0" },
  { step: "20", hex: "#F5D6D9" },
  { step: "30", hex: "#FFB7BC" },
  { step: "40", hex: "#FB8992" },
  { step: "50", hex: "#FD6672" },
  { step: "60", hex: "#F04452" },
  { step: "70", hex: "#AB2B36" },
  { step: "80", hex: "#7A1F26" },
  { step: "90", hex: "#521419" },
  { step: "100", hex: "#310C0F" },
  { step: "110", hex: "#21080A" },
] as const;

/** `docs/디자인_토큰_사용_규칙.md` 2절과 동일한 값. 실측값이라 4px 배수에서 벗어난
 * 것(5px, 6px 등)도 그대로 유지 — 임의로 반올림하지 않음. */
const SPACING_SCALE = [
  { value: 1, usage: "테두리 두께(거의 전부), Radio 바깥 원 인셋" },
  { value: 2, usage: "Progress 트랙-라벨 gap" },
  { value: 3, usage: "Badge/Tag 세로 padding, FilterTag 우측 padding, Checkbox radius" },
  { value: 4, usage: "Sidebar 1-depth 리스트 gap, Tag 요소간 gap, Button 기본 radius" },
  { value: 5, usage: "검색창 아이콘-텍스트 gap, 활성 필터 태그 박스 padding" },
  { value: 6, usage: "아이콘-라벨 좁은 gap(대부분의 gap-1.5)" },
  { value: 8, usage: "카드/토스트 내부 padding, Select·Combobox 패널 내부 padding" },
  { value: 10, usage: "표준 요소간 gap — 이 시스템에서 가장 많이 재사용됨" },
  { value: 12, usage: "Sidebar 2-depth 항목 좌우 padding, Table 여백" },
  { value: 14, usage: "다이얼로그 헤더 우측 padding(닫기 버튼 균형용)" },
  { value: 16, usage: "카드 padding — Toast 전체, RadioChoiceDialog 경고배너 상하" },
  { value: 20, usage: "다이얼로그 표준 간격 — 헤더/본문 좌측, 본문↔푸터" },
  { value: 24, usage: "그림자 blur 값에서 주로 등장" },
  { value: 30, usage: "Progress 전체 높이, RadioChoiceDialog 경고배너 좌우 padding" },
  { value: 32, usage: "ConfirmDialog 본문 padding(원래 실측값)" },
] as const;

/** `docs/디자인_토큰_사용_규칙.md` 4절과 동일한 값 */
const RADIUS_SCALE = [
  { label: "2px", radius: "2px", usage: "Button xsmall, Badge, Tag", pill: false },
  { label: "3px", radius: "3px", usage: "Input small, Checkbox, FilterTag", pill: false },
  { label: "4px", radius: "4px", usage: "Button basic·small, Input default, Table", pill: false },
  { label: "8px", radius: "8px", usage: "드롭다운·플라이아웃 패널, Sidebar 2-depth", pill: false },
  { label: "12px", radius: "12px", usage: "ConfirmDialog", pill: false },
  { label: "16px", radius: "16px", usage: "RadioChoiceDialog", pill: false },
  { label: "full", radius: "9999px", usage: "Progress 트랙, Toast, Sidebar 토글", pill: true },
] as const;

/**
 * `docs/디자인_토큰_사용_규칙.md` 5절과 동일한 값. 실제 CSS는 box-shadow와
 * filter:drop-shadow가 섞여 있지만(4번째 값 "토스트"만 원래 drop-shadow), 미리보기는
 * 전부 `filter: drop-shadow(...)`로 통일해서 렌더링 — 스프레드 값이 없는 그림자라
 * box-shadow와 시각적으로 동일함.
 */
const SHADOW_SCALE = [
  { label: "낮은 부유", value: "0 2px 8px rgba(0,0,0,.12)", usage: "Select·Combobox·Filter 드롭다운 패널" },
  { label: "중간 모달", value: "0 4px 16px rgba(0,0,0,.2)", usage: "ConfirmDialog" },
  { label: "큰/집중형 모달", value: "0 0 24px rgba(0,0,0,.2)", usage: "RadioChoiceDialog" },
  { label: "토스트", value: "0 0 12px rgba(0,0,0,.2)", usage: "Toast" },
] as const;

/**
 * 2026-07-31 신규 — 스케일 토큰(위 팔레트/스케일)을 가리키기만 하는 "용도" 이름.
 * `globals.css`의 `--mes-*` 시맨틱 변수, `component-library/src/components/ui/*`의
 * 실제 적용과 1:1로 동일 — 값이 바뀌면 세 곳(여기·globals.css·컴포넌트) 다 같이
 * 갱신해야 한다. 카테고리별로 묶어서 보여준다.
 */
const SEMANTIC_TOKENS: { group: string; tokens: { name: string; scale: string; usage: string }[] }[] = [
  {
    group: "텍스트",
    tokens: [
      { name: "text-default", scale: "Gray-130", usage: "기본 텍스트(제목/본문 강조)" },
      { name: "text-secondary", scale: "Gray-90", usage: "보조 텍스트(설명/부제)" },
      { name: "text-placeholder", scale: "Gray-60", usage: "플레이스홀더/힌트" },
      { name: "text-disabled", scale: "Gray-70", usage: "비활성 텍스트" },
      { name: "text-inverse", scale: "white", usage: "채워진 배경 위 텍스트" },
      { name: "text-brand", scale: "Primary-60", usage: "브랜드 강조 텍스트/링크" },
      { name: "text-danger", scale: "Danger-60", usage: "위험/에러 텍스트" },
    ],
  },
  {
    group: "배경·테두리",
    tokens: [
      { name: "border-default", scale: "Gray-30", usage: "기본 테두리/구분선" },
      { name: "border-strong", scale: "Gray-130", usage: "focus·open 강조 테두리" },
      { name: "border-warning-subtle", scale: "Yellow-20", usage: "경고 배너 테두리" },
      { name: "bg-subtle", scale: "Gray-20", usage: "hover 옅은 배경, 카드/배너 배경" },
      { name: "bg-subtler", scale: "Gray-10", usage: "더 옅은 hover 배경" },
      { name: "bg-disabled", scale: "Gray-30", usage: "비활성 배경" },
      { name: "bg-brand", scale: "Primary-60", usage: "브랜드 기본 배경" },
      { name: "bg-brand-hover", scale: "Primary-70", usage: "브랜드 hover" },
      { name: "bg-brand-subtle", scale: "Primary-10", usage: "브랜드 옅은 배경" },
      { name: "bg-brand-subtle-strong", scale: "Primary-20", usage: "브랜드 옅은 배경(진한 쪽)" },
      { name: "bg-danger", scale: "Danger-60", usage: "위험/에러 강조 배경" },
      { name: "bg-warning-subtle", scale: "Yellow-10", usage: "경고 배너 배경" },
      { name: "icon-warning", scale: "Yellow-50", usage: "경고 아이콘" },
      { name: "bg-info", scale: "Primary-60", usage: "정보 강조(브랜드색 재사용)" },
      { name: "bg-strong", scale: "Gray-130", usage: "검정(고대비) 배경" },
    ],
  },
  {
    group: "Radius / Spacing",
    tokens: [
      { name: "radius-control-xs", scale: "2px", usage: "Button xsmall, Badge, Tag" },
      { name: "radius-control-sm", scale: "3px", usage: "Input small, Checkbox, FilterTag" },
      { name: "radius-control", scale: "4px", usage: "Button basic·small, Input default" },
      { name: "radius-panel", scale: "8px", usage: "드롭다운·플라이아웃 패널" },
      { name: "radius-modal-sm", scale: "12px", usage: "작은 확인 모달(ConfirmDialog)" },
      { name: "radius-modal-lg", scale: "16px", usage: "큰 모달(RadioChoiceDialog)" },
      { name: "spacing-tight", scale: "6px", usage: "아이콘-텍스트처럼 붙어있는 gap" },
      { name: "spacing-default", scale: "10px", usage: "표준 요소간 gap(가장 흔함)" },
      { name: "spacing-card", scale: "16px", usage: "카드/토스트류 padding" },
      { name: "spacing-dialog-x", scale: "20px", usage: "다이얼로그/패널 좌우 padding, 본문↔푸터 간격" },
      { name: "spacing-dialog-header-end", scale: "14px", usage: "다이얼로그 헤더 우측 padding" },
    ],
  },
  {
    group: "그림자",
    tokens: [
      { name: "shadow-panel", scale: "0 2px 8px .12", usage: "드롭다운/플라이아웃 패널" },
      { name: "shadow-modal-sm", scale: "0 4px 16px .2", usage: "작은 확인 모달" },
      { name: "shadow-modal-lg", scale: "0 0 24px .2", usage: "큰/집중형 모달" },
      { name: "drop-shadow-toast", scale: "0 0 12px .2", usage: "Toast" },
    ],
  },
];

/**
 * 2026-07-30 담당자가 준 "System Color" 레퍼런스 프레임(node 20170:67850)으로 전 단계
 * 확정 — Gray/Primary/Danger와 동일한 10~110 11단계 구조. 역할 라벨: 20=surface,
 * 40=Base, 50=Text. 이전엔 우연히 마주친 3단계(10/20/50)만 확정 상태였음.
 */
const YELLOW_PALETTE = [
  { step: "10", hex: "#FFF3DB" },
  { step: "20", hex: "#FFE0A3" },
  { step: "30", hex: "#FFC95C" },
  { step: "40", hex: "#FFB114" },
  { step: "50", hex: "#F2A406" },
  { step: "60", hex: "#C68501" },
  { step: "70", hex: "#8A5C00" },
  { step: "80", hex: "#614100" },
  { step: "90", hex: "#422C00" },
  { step: "100", hex: "#2E1F00" },
  { step: "110", hex: "#241800" },
] as const;

/** 알람 리스트 전용 별도 색상군 — 단계형 팔레트 아님, 색상당 1개 값만 존재 */
const ALARM_PALETTE = [
  { step: "blue", hex: "#4A90E2" },
  { step: "red", hex: "#E15B5B" },
  { step: "yellow", hex: "#E99B41" },
  { step: "green", hex: "#4BB866" },
] as const;

function PaletteRow({
  title,
  note,
  colors,
}: {
  title: string;
  note?: string;
  colors: readonly { step: string; hex: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-medium text-mes-gray-70">
        {title}
        {note && <span className="ml-2 font-normal text-mes-gray-60">{note}</span>}
      </span>
      <div className="flex flex-wrap gap-3">
        {colors.map((c) => (
          <div key={c.step} className="flex flex-col items-center gap-1">
            <div
              className="size-10 rounded border border-mes-gray-20"
              style={{ backgroundColor: c.hex }}
              title={`${c.step} / ${c.hex}`}
            />
            <span className="font-mono text-[10px] text-mes-gray-70">{c.step}</span>
            <span className="font-mono text-[10px] text-mes-gray-60">{c.hex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 2026-07-30 담당자가 참고 이미지(Pretendard 굵기별 크기 스케일 + 실사용 조합에 점 표시)를
 * 주면서 "이렇게 깔끔하게 정리해달라"고 요청 — 기존의 크기별 표(자간/행간을 컴포넌트마다
 * 예외로 나열)는 지저분하다고 판단해 폐기. 동시에 "자간은 0, 행간은 150%로 통일하자,
 * 130% 같은 예외를 둘 이유가 없다"는 표준화 결정도 내림 — 그래서 컴포넌트 코드 자체도
 * 같이 정리함(Tag/Badge/Sidebar MES·FEMS 토글/AlarmListItem/NotificationPanel의
 * 개별 tracking 값 제거, Table/Progress/NoticeBanner의 leading-1.3·1.4를 1.5로,
 * ConfirmDialog 설명의 leading-normal도 1.5로 통일). 이제 자간 0 / 행간 150%가 전
 * 컴포넌트에 공통 적용된 상태.
 *
 * 굵기(Bold/SemiBold/Medium/Regular) × 크기(12~18px) 매트릭스에서 실제로 코드에 쓰이는
 * 조합만 `USED_TYPE_COMBOS`에 표시 — `component-library/src/components/ui/*.tsx` 전수
 * 재확인 결과.
 */
const TYPE_WEIGHTS = [
  { label: "Bold", weight: 700 },
  { label: "SemiBold", weight: 600 },
  { label: "Medium", weight: 500 },
  { label: "Regular", weight: 400 },
] as const;

const TYPE_SIZES = [18, 16, 15, 14, 13, 12] as const;

/** `${굵기}-${크기}` 키로 실사용 조합 표시. 값은 어디서 쓰이는지 메모(툴팁용). */
const USED_TYPE_COMBOS: Record<string, string> = {
  "Bold-18": "다이얼로그 헤더 제목(ConfirmDialog/RadioChoiceDialog)",
  "SemiBold-16": "ConfirmDialog heading, RadioChoiceDialog 옵션 제목, NotificationPanel 헤더",
  "Medium-16": "RadioChoiceDialog 질문",
  "SemiBold-15": "Button basic 라벨, Toast, NotificationPanel 빈 상태 문구",
  "Medium-15": "Sidebar 즐겨찾기·대시보드, Sidebar 1-depth(강조 상태)",
  "Regular-15": "Sidebar 1-depth(기본 상태)",
  "SemiBold-14": "Button small 라벨, AlarmListItem 제목, Table 총계행",
  "Medium-14": "Filter 트리거, Table 그룹 라벨, Sidebar 2-depth(활성)·이동/로그아웃 버튼",
  "Regular-14": "Input, RadioChoiceDialog 설명, Sidebar 2-depth(기본), Table 셀, Progress 퍼센트",
  "SemiBold-13": "Sidebar MES/FEMS 토글, Table 헤더 라벨, NoticeBanner 링크, PageTopTabItem(활성)",
  "Medium-13": "FilterTag 카테고리 라벨",
  "Regular-13": "Select·Combobox 목록, PageTopTabItem(기본), Filter 입력·옵션, NoticeBanner 본문, AlarmListItem 설명, Input/Select small",
  "SemiBold-12": "Tag 카운트, Badge, Button xsmall 라벨",
  "Medium-12": "FilterTag 카운트 뱃지",
  "Regular-12": "AlarmListItem 날짜",
};

const shiftOptions = [
  { value: "day", label: "주간 근무조" },
  { value: "night", label: "야간 근무조" },
  { value: "swing", label: "교대 근무조" },
  { value: "bom1", label: "BOM-2026-001" },
  { value: "bom2", label: "BOM-2026-002" },
];

const filterCategories = [
  {
    id: "group",
    label: "그룹명",
    options: [
      { id: "normal", label: "NORMAL_USER" },
      { id: "admin", label: "SUPER_ADMIN" },
      { id: "acc", label: "경리팀" },
    ],
  },
  {
    id: "desc",
    label: "그룹설명",
    options: [{ id: "d1", label: "설명 A" }],
  },
  {
    id: "member",
    label: "구성원",
    options: [{ id: "m1", label: "홍길동" }],
  },
  {
    id: "perm",
    label: "권한 설정",
    options: [
      { id: "normal", label: "NORMAL_USER" },
      { id: "admin", label: "SUPER_ADMIN" },
      { id: "acc", label: "경리팀" },
      { id: "gong", label: "공무팀" },
      { id: "manager", label: "관리자" },
    ],
  },
  { id: "modified", label: "최종변경일", options: [{ id: "today", label: "오늘" }] },
];

/**
 * GroupQuery 데모용 옵션 — 담당자 스크린샷("생산지시" 화면)의 드롭다운 목록 문구를 그대로
 * 인용(전체/지시일/근무조/설비/공정/담당기사/품목코드/품목명/품목구분). "전체"는 GroupQuery가
 * 자체적으로 목록 맨 위에 렌더링하므로(2026-08-03 재설계) 여기 옵션 목록엔 안 넣음.
 */
const groupQueryOptions = [
  { id: "date", label: "지시일" },
  { id: "shift", label: "근무조" },
  { id: "facility", label: "설비" },
  { id: "process", label: "공정" },
  { id: "manager", label: "담당기사" },
  { id: "itemCode", label: "품목코드" },
  { id: "itemName", label: "품목명" },
  { id: "itemType", label: "품목구분" },
];

/** QuickQuery 데모용 초기 프리셋 — node 17963:81433 실측 예시("설정 1" 인스턴스) 그대로 인용 */
const initialQuickQuerySlots: QuickQuerySlot[] = [
  {
    id: "p1",
    name: "주간 성형기 확인용",
    detail: {
      grouping: "품목명>담당자명>일자",
      filters: [
        { label: "품목명", count: 7 },
        { label: "품목구분", count: 10 },
        { label: "발주일", count: 7 },
      ],
      view: { hidden: 2, total: 2, reordered: 2 },
    },
  },
  { id: "p2", name: null },
  { id: "p3", name: null },
];

/** NotificationPanel "클릭하면 사라짐" 데모용 초기 알림 목록 */
const initialNotificationItems: NotificationPanelItem[] = [
  {
    id: "1",
    tone: "blue",
    title: "작업 지시 생성",
    time: "20:25",
    description: "yyyy.mm.dd/[설비]/n건의 작업 지시가 생성되었습니다.",
  },
  {
    id: "2",
    tone: "red",
    title: "출하 승인 취소",
    time: "20:25",
    description: "yyyy.mm.dd/[거래처]/n건의 출하 승인이 취소되었습니다.",
  },
  {
    id: "3",
    tone: "green",
    title: "입고 완료",
    time: "20:25",
    description: "yyyy.mm.dd/[설비]/n건의 입고가 완료되었습니다.",
  },
];

/** NotificationPanel "알림 설정" 데모용 초기 목록 — 담당자 스크린샷 문구·순서 그대로 인용,
 *  전부 켜짐(enabled: true) 상태로 시작. */
const initialNotificationSettings: NotificationSettingItem[] = [
  { id: "inbound-done", label: "입고 완료", enabled: true },
  { id: "inbound-inspect-request", label: "입고 검사 요청", enabled: true },
  { id: "inbound-inspect-done", label: "입고 검사 완료", enabled: true },
  { id: "work-order-created", label: "작업 지시 생성", enabled: true },
  { id: "work-order-changed", label: "작업 지시 변경", enabled: true },
  { id: "production-done", label: "생산 완료", enabled: true },
  { id: "process-inspect-request", label: "공정 검사 요청", enabled: true },
  { id: "process-inspect-done", label: "공정 검사 완료", enabled: true },
];

/**
 * Table 데모용 데이터 — node 16938:42501("생산계획(일) 리스트" 실제 화면) 값을 그대로 인용.
 * 컬럼 폭은 그 화면에서 실측한 px 그대로(합계 약 1858px, 가로 스크롤 필요).
 */
interface ProductionRow {
  date: string;
  shift: string;
  equipment: string;
  manager: string;
  item: string;
  packCount: number;
  startTime: string;
  endTime: string;
  unit: string;
  qty: number;
  defectQty: number;
  packQty: number;
}

/**
 * 컬럼 정렬(align) 기준 — 2026-07-28 2차 피드백 "헤더 정렬이 제멋대로" 반영해 재조정,
 * 6차에서 규칙을 한 번 더 명확히 다듬음(여전히 "제멋대로"로 보인다는 지적 받음).
 * **규칙**: (1) 링크 없는 순수 짧은 값(근무조/설비/담당기사/단위/시간 등 — 대략 10자
 * 이내 코드·이름·시각)은 전부 가운데 정렬로 통일, (2) 예외적으로 길게 늘어질 수 있는
 * 자유 텍스트(품목명)만 좌측 정렬, (3) 숫자·금액류(수량/불량/포장수량 등)는 우측 정렬.
 * 이전엔 "equipment"(설비)만 왜인지 좌측으로 남아 있어서 같은 성격의 manager(가운데)와
 * 안 맞았던 게 "제멋대로로 보인다"는 지적의 실제 원인 중 하나 — 이번에 가운데로 통일함.
 * 실제 화면 스크린샷 육안 대조 기반 판단이며 Figma 실측은 아님.
 * "지시일(date)" 컬럼은 데모에서 Level 1 그룹 라벨로만 쓰고 별도 컬럼으로는 노출하지
 * 않음 — 실제 화면도 그룹 기준으로 쓰인 최상위 값(생산일)은 컬럼에 반복 표시하지
 * 않는 패턴이라 이를 따름(2·3단계 그룹 키인 공정/담당자는 반대로 컬럼에도 그대로
 * 남겨두는 게 실제 화면과 일치).
 * 7차 후속: 담당자가 "다른 컴포넌트 데모와 안 어울릴 만큼 테이블이 넓다"며 실사용
 * 화면에서 참고용으로만 있던 창고명(warehouse)·품목구분(itemType) 컬럼을 제거해달라고
 * 요청 — 두 컬럼과 `ProductionRow`의 해당 필드를 전부 삭제해 폭을 줄임.
 */
const productionColumns: TableColumn<ProductionRow>[] = [
  { key: "shift", label: "근무조", width: 57, align: "center" },
  { key: "equipment", label: "설비", width: 125, align: "center" },
  { key: "manager", label: "담당기사", width: 65, align: "center" },
  {
    key: "item",
    label: "품목명",
    width: 148,
    align: "left",
    render: (row) => (
      <a href="#" className="text-mes-primary-60 underline">
        {row.item}
      </a>
    ),
  },
  {
    key: "packCount",
    label: "포장인원",
    width: 69,
    align: "right",
    render: (row) => row.packCount.toLocaleString("ko-KR"),
  },
  { key: "startTime", label: "시작시간", width: 124, align: "center" },
  { key: "endTime", label: "종료시간", width: 124, align: "center" },
  { key: "unit", label: "단위", width: 51, align: "center" },
  {
    key: "qty",
    label: "생산수량",
    width: 104,
    align: "right",
    render: (row) => row.qty.toLocaleString("ko-KR"),
  },
  {
    key: "defectQty",
    label: "불량수량",
    width: 104,
    align: "right",
    render: (row) => row.defectQty.toLocaleString("ko-KR"),
  },
  {
    key: "input",
    label: "투입",
    width: 91,
    align: "center",
    render: () => (
      <a href="#" className="text-[13px] font-semibold text-mes-primary-60 underline">
        투입정보
      </a>
    ),
  },
  {
    key: "packQty",
    label: "포장수량",
    width: 100,
    align: "right",
    render: (row) => row.packQty.toLocaleString("ko-KR"),
  },
  {
    key: "lot",
    label: "라벨정보",
    width: 91,
    align: "center",
    render: () => (
      <a href="#" className="text-[13px] font-semibold text-mes-primary-60 underline">
        LOT조회
      </a>
    ),
  },
];

/**
 * 2026-07-28 2차 피드백 "2·3차 그룹화도 가능해야 함" 반영 데모 — 기존 1차 데이터(성형기
 * 1호/2호, r1~r8)를 재구성해서 Level 1(지시일) → Level 2(설비) 2단 중첩으로 표현.
 * 집계값(packCount/qty/defectQty/packQty)은 하위 리프 행 실제 합으로 재계산함(1차 데모의
 * 집계값 일부가 실제 합과 안 맞았던 것도 이번에 같이 바로잡음).
 */
const rowR1 = { id: "r1", data: { date: "2025-10-30", shift: "주간", equipment: "성형기 1호", manager: "이해빈", item: "더블비안코뚜껑", packCount: 5, startTime: "15:00", endTime: "18:00", unit: "kg", qty: 2000, defectQty: 10, packQty: 20 } };
const rowR2 = { id: "r2", data: { date: "2025-10-29", shift: "주간", equipment: "성형기 1호", manager: "이해빈", item: "더블비안코뚜껑", packCount: 5, startTime: "15:00", endTime: "18:00", unit: "kg", qty: 2000, defectQty: 10, packQty: 20 } };
const rowR3 = { id: "r3", data: { date: "2025-10-29", shift: "야간", equipment: "성형기 1호", manager: "이해빈", item: "더블비안코뚜껑", packCount: 5, startTime: "15:00", endTime: "18:00", unit: "kg", qty: 2000, defectQty: 10, packQty: 20 } };
const rowR4 = { id: "r4", data: { date: "2025-10-30", shift: "주간", equipment: "성형기 2호", manager: "이해빈", item: "비비빅", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20 } };
const rowR5 = { id: "r5", data: { date: "2025-10-28", shift: "주간", equipment: "성형기 2호", manager: "이해빈", item: "비비빅", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20 } };
const rowR6 = { id: "r6", data: { date: "2025-10-28", shift: "주간", equipment: "성형기 2호", manager: "이해빈", item: "비비빅", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20 } };
const rowR7 = { id: "r7", data: { date: "2025-10-27", shift: "주간", equipment: "성형기 2호", manager: "이해빈", item: "비비빅", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20 }, isNew: true };
// 8차 후속: 담당자가 disabled 행의 정확한 색(텍스트 Gray-80/배경 Gray-10)을 줘서, 데모에서
// 눈으로 확인할 수 있게 r8을 disabled 예시로 지정.
const rowR8 = { id: "r8", data: { date: "2025-10-26", shift: "야간", equipment: "성형기 2호", manager: "이해빈", item: "비비빅", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20 }, disabled: true };

/**
 * 2026-07-28 3차 피드백 "3단계 그룹화(지시일>설비>담당기사)도 실제로 되는지 보여줘" 반영 —
 * 기존 2단(지시일>설비) 구조에서 설비 그룹 바로 아래에 담당기사 그룹을 한 단 더 끼워
 * 넣음(rows를 groups로 감쌈). 컴포넌트는 이미 재귀 구조라 로직 변경 없이 데이터만 바꿔서
 * 3단이 됨.
 *
 * 7차: "숫자에 1000단위 콤마 넣어달라" 반영 — 집계값(summary)은 아래 `fmt()`로 문자열
 * 미리 포맷해서 넣음(1000 미만 값도 그냥 fmt 통과시켜서 일관성 유지, 콤마는 자동으로
 * 안 붙음). 데이터 행 자체의 수량 컬럼(포장인원/생산수량/불량수량/포장수량)은
 * `productionColumns`의 `render`에서 `toLocaleString()`으로 포맷함.
 */
const fmt = (n: number) => n.toLocaleString("ko-KR");

const productionGroups: TableGroup<ProductionRow>[] = [
  {
    id: "date-1030",
    label: "지시일: 2025-10-30",
    summary: { packCount: fmt(8), qty: fmt(4000), defectQty: fmt(10), packQty: fmt(40) },
    groups: [
      {
        id: "eq1-1030",
        label: "설비: 성형기 1호",
        summary: { packCount: fmt(5), qty: fmt(2000), defectQty: fmt(10), packQty: fmt(20) },
        groups: [
          { id: "mgr-eq1-1030", label: "담당기사: 이해빈", summary: { packCount: fmt(5), qty: fmt(2000), defectQty: fmt(10), packQty: fmt(20) }, rows: [rowR1] },
        ],
      },
      {
        id: "eq2-1030",
        label: "설비: 성형기 2호",
        summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) },
        groups: [
          { id: "mgr-eq2-1030", label: "담당기사: 이해빈", summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) }, rows: [rowR4] },
        ],
      },
    ],
  },
  {
    id: "date-1029",
    label: "지시일: 2025-10-29",
    summary: { packCount: fmt(10), qty: fmt(4000), defectQty: fmt(20), packQty: fmt(40) },
    groups: [
      {
        id: "eq1-1029",
        label: "설비: 성형기 1호",
        summary: { packCount: fmt(10), qty: fmt(4000), defectQty: fmt(20), packQty: fmt(40) },
        groups: [
          { id: "mgr-eq1-1029", label: "담당기사: 이해빈", summary: { packCount: fmt(10), qty: fmt(4000), defectQty: fmt(20), packQty: fmt(40) }, rows: [rowR2, rowR3] },
        ],
      },
    ],
  },
  {
    id: "date-1028",
    label: "지시일: 2025-10-28",
    summary: { packCount: fmt(6), qty: fmt(4000), defectQty: fmt(0), packQty: fmt(40) },
    groups: [
      {
        id: "eq2-1028",
        label: "설비: 성형기 2호",
        summary: { packCount: fmt(6), qty: fmt(4000), defectQty: fmt(0), packQty: fmt(40) },
        groups: [
          { id: "mgr-eq2-1028", label: "담당기사: 이해빈", summary: { packCount: fmt(6), qty: fmt(4000), defectQty: fmt(0), packQty: fmt(40) }, rows: [rowR5, rowR6] },
        ],
      },
    ],
  },
  {
    id: "date-1027",
    label: "지시일: 2025-10-27",
    summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) },
    groups: [
      {
        id: "eq2-1027",
        label: "설비: 성형기 2호",
        summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) },
        groups: [
          { id: "mgr-eq2-1027", label: "담당기사: 이해빈", summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) }, rows: [rowR7] },
        ],
      },
    ],
  },
  {
    id: "date-1026",
    label: "지시일: 2025-10-26",
    summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) },
    groups: [
      {
        id: "eq2-1026",
        label: "설비: 성형기 2호",
        summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) },
        groups: [
          { id: "mgr-eq2-1026", label: "담당기사: 이해빈", summary: { packCount: fmt(3), qty: fmt(2000), defectQty: fmt(0), packQty: fmt(20) }, rows: [rowR8] },
        ],
      },
    ],
  },
];

/**
 * 2026-07-28 7차 후속: "합본 데모가 마음에 들긴 하는데 한 화면에 다 몰아넣은 느낌이라
 * 헤더는?/그룹화는?/컬럼 2개 이상인 경우는?/총계행은? 을 각각 따로 보고 싶다"는 요청
 * 반영 — 위 합본 Table 데모는 그대로 두고, 구조 요소별로 쪼갠 미니 데모 4개를 추가함.
 * 같은 Table 컴포넌트를 재사용하되 columns/rows/groups/totals 중 어떤 prop을 채우고
 * 비우느냐로 요소를 하나씩 분리해서 보여줌. 합본 데모의 15개 컬럼을 그대로 쓰면 미니
 * 데모도 다시 넓어져 버리므로, 여기서는 별도의 훨씬 단순한 3컬럼 데이터를 씀.
 */
interface FlatRow {
  shift: string;
  manager: string;
  qty: number;
}

const flatColumns: TableColumn<FlatRow>[] = [
  { key: "shift", label: "근무조", width: 90, align: "center" },
  { key: "manager", label: "담당기사", width: 90, align: "center" },
  {
    key: "qty",
    label: "생산수량",
    width: 100,
    align: "right",
    render: (row) => row.qty.toLocaleString("ko-KR"),
  },
];

const flatRows = [
  { id: "f1", data: { shift: "주간", manager: "이해빈", qty: 1200 } },
  { id: "f2", data: { shift: "야간", manager: "이해빈", qty: 980 } },
  { id: "f3", data: { shift: "주간", manager: "이해빈", qty: 2000 } },
];

const miniGroups: TableGroup<FlatRow>[] = [
  {
    id: "mini-g1",
    label: "지시일: 2025-10-30",
    summary: { qty: (1200 + 1980).toLocaleString("ko-KR") },
    rows: [
      { id: "mini-g1-r1", data: { shift: "주간", manager: "이해빈", qty: 1200 } },
      { id: "mini-g1-r2", data: { shift: "야간", manager: "이해빈", qty: 1980 } },
    ],
  },
  {
    id: "mini-g2",
    label: "지시일: 2025-10-29",
    summary: { qty: (2000).toLocaleString("ko-KR") },
    rows: [{ id: "mini-g2-r1", data: { shift: "주간", manager: "이해빈", qty: 2000 } }],
  },
];

/**
 * 2026-07-31 신규 — 담당자가 "테이블 예시에 그룹화 3개까지 된 것도 해줘야지"라고 요청.
 * `TableGroup.groups`는 이미 재귀 구조라 깊이 제한이 없지만(합본 데모의 지시일→설비→
 * 담당기사 3단이 실제 증거), 분리 데모 쪽엔 1단(`miniGroups`)짜리만 있었던 것 — 같은
 * 3컬럼(`flatColumns`)으로 지시일 → 설비 → 담당기사 3단 그룹화 예시를 별도로 추가.
 */
const miniGroups3: TableGroup<FlatRow>[] = [
  {
    id: "mini3-date",
    label: "지시일: 2025-10-30",
    summary: { qty: (1200 + 980 + 2000).toLocaleString("ko-KR") },
    groups: [
      {
        id: "mini3-eq1",
        label: "설비: 성형기 1호",
        summary: { qty: (1200 + 980).toLocaleString("ko-KR") },
        groups: [
          {
            id: "mini3-mgr1",
            label: "담당기사: 이해빈",
            summary: { qty: (1200 + 980).toLocaleString("ko-KR") },
            rows: [
              { id: "mini3-r1", data: { shift: "주간", manager: "이해빈", qty: 1200 } },
              { id: "mini3-r2", data: { shift: "야간", manager: "이해빈", qty: 980 } },
            ],
          },
        ],
      },
      {
        id: "mini3-eq2",
        label: "설비: 성형기 2호",
        summary: { qty: (2000).toLocaleString("ko-KR") },
        groups: [
          {
            id: "mini3-mgr2",
            label: "담당기사: 이해빈",
            summary: { qty: (2000).toLocaleString("ko-KR") },
            rows: [{ id: "mini3-r3", data: { shift: "주간", manager: "이해빈", qty: 2000 } }],
          },
        ],
      },
    ],
  },
];

export default function Home() {
  const [comboValue, setComboValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState<Record<string, string[]>>({
    perm: ["normal"],
    group: ["normal", "admin"],
  });
  // 2026-08-03 — GroupQuery(그룹화 조회) 데모용. Level 1=지시일, Level 2=설비, Level 3=전체(미지정)로
  // 시작 — 담당자 스크린샷의 초기 상태와 동일하게 맞춤.
  const [groupQueryLevels, setGroupQueryLevels] = useState<(string | null)[]>([
    "date",
    "facility",
    null,
  ]);
  // 2026-08-03 — QuickQuery(빠른 조회) 데모용. slots는 관리 모달과 트리거 바가 공유하는 단일
  // 소스; activeId는 트리거 바에서 현재 "적용 중"인 프리셋(모달의 저장 여부와는 별개 상태).
  const [quickQuerySlots, setQuickQuerySlots] = useState<QuickQuerySlot[]>(
    initialQuickQuerySlots
  );
  const [quickQueryActiveId, setQuickQueryActiveId] = useState<string | null>("p1");
  const [quickQueryDialogOpen, setQuickQueryDialogOpen] = useState(false);
  // 2026-08-03 — SearchInput 데모용. 실측 인스턴스와 동일하게 "숯불치킨 뚜껑"으로 시작해서
  // 값이 있을 때의 배경색 강조 상태를 바로 보여줌.
  const [groupQuerySearchValue, setGroupQuerySearchValue] = useState("숯불치킨 뚜껑");
  const [searchInputValue, setSearchInputValue] = useState("");
  // 2026-08-03 — NotificationPanel "클릭하면 목록에서 사라짐" 데모용. 컴포넌트 자체는
  // items를 그대로 렌더링만 하는 순수 컨트롤형이라, 제거 로직은 데모(호출부)에서 관리.
  const [notificationItems, setNotificationItems] = useState(initialNotificationItems);
  // 알림 설정 화면 데모용 — 스크린샷 문구·순서 그대로, 전부 켜짐 상태로 시작.
  const [notificationSettings, setNotificationSettings] = useState(
    initialNotificationSettings
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  // 2026-07-29: ConfirmDialog 톤 확장(경고/알림) + 확인·취소 2버튼 + 안내 배너 데모용
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [radioDialogOpen, setRadioDialogOpen] = useState(false);
  // 2026-07-31 — Nested Modal(2-depth) 데모용. Center Modal은 담당자 지시로 보류 중이라
  // 건드리지 않고, 이미 완성된 ConfirmDialog 두 개를 겹쳐 여는 방식으로 시연.
  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [nestedModalConfirmOpen, setNestedModalConfirmOpen] = useState(false);
  // 2026-08-03 — 담당자 요청: "선택 항목을 삭제하시겠습니까"에서 확인 누르면
  // "삭제되었습니다"가 뜨도록. 최종 확정 후 조용히 닫히기만 하던 것에 3번째 단계(성공
  // 알림)를 추가 — "삭제 완료 알림"(infoDialogOpen)과 같은 info 톤 패턴 재사용.
  const [nestedModalSuccessOpen, setNestedModalSuccessOpen] = useState(false);
  const [sidebarExpandedKey, setSidebarExpandedKey] = useState<string | undefined>(
    "mes-setting"
  );
  const [sidebarActiveSubKey, setSidebarActiveSubKey] = useState<string | undefined>(
    "user-setting"
  );
  // 2026-07-31 22차 — "사이드바 자체를 접고 펴는" 우상단 화살표 버튼 데모용 상태.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tableSelectedIds, setTableSelectedIds] = useState<string[]>(["r4"]);
  // 2026-07-28 8차: "테이블이 시선강탈"이라는 지적 반영 — 합본 Table 데모(15컬럼, 화면
  // 전체 폭)는 페이지에서 눈에 가장 많이 띄는 블록이라 기본은 접어두고, 필요할 때만
  // 펼쳐보도록 토글 추가. 미니 데모 4개(헤더만/그룹화만/컬럼2개+/총계행만)는 원래도
  // 작아서 접을 필요가 없다고 판단해 그대로 둠.
  const [productionTableOpen, setProductionTableOpen] = useState(false);
  const [toggleButtonPressed, setToggleButtonPressed] = useState(false);
  const [multiSelectValues, setMultiSelectValues] = useState(["A라인", "B라인"]);
  const [paginationPage, setPaginationPage] = useState(4);
  const [datePickerValue, setDatePickerValue] = useState<Date | null>(new Date(2026, 7, 3));
  const [dateRangeValue, setDateRangeValue] = useState<DateRange>({
    start: new Date(2026, 7, 1),
    end: new Date(2026, 7, 10),
  });
  const [timePickerValue, setTimePickerValue] = useState<string | undefined>("09:00");
  // 2026-08-03 — 담당자 요청: "우측 상단에 검색창 넣어서 이름별로 검색 가능하게".
  // 사이드바 리스트 항목(leaf/branch 둘 다) 이름에 대한 대소문자 무시 부분일치 검색.
  const [sidebarSearch, setSidebarSearch] = useState("");
  // 2026-07-31 — "테이블 예시 체크박스가 기동하지 않아" 버그 리포트: 분리 데모(table-parts)의
  // 미니 Table들이 selectedIds/onSelectedIdsChange를 안 넘기고 있었음. Table 내부
  // toggleOne/toggleAll/toggleGroup은 `if (!onSelectedIdsChange) return;`로 시작해서
  // 콜백이 없으면 클릭해도 아무 반응이 없는 게 당연한 동작이었던 것 — 데모마다 각각
  // 독립된 state를 만들어 실제로 체크되도록 연결.
  const [miniGroupSelectedIds, setMiniGroupSelectedIds] = useState<string[]>([]);
  const [miniGroup3SelectedIds, setMiniGroup3SelectedIds] = useState<string[]>([]);
  const [miniColSelectedIds, setMiniColSelectedIds] = useState<string[]>([]);
  const [miniTotalsSelectedIds, setMiniTotalsSelectedIds] = useState<string[]>([]);

  // 2026-07-31 신규 — 좌측 사이드바 스크롤 스파이. 현재 뷰포트 상단에 가장 가까운 섹션의
  // id를 activeId로 잡아서 사이드바에서 굵게 강조. IntersectionObserver 하나로 모든
  // TOC_LINKS의 id 엘리먼트를 동시에 관찰(개수가 많지 않아 성능 문제 없음).
  const [activeId, setActiveId] = useState<string>(TOC_LINKS[0]?.id ?? "");
  const activeGroup = FOUNDATION_IDS.has(activeId) ? "foundations" : "components";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-64px 0px -70% 0px", threshold: 0 }
    );
    TOC_LINKS.forEach((link) => {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-mes-gray-10">
      <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center gap-8 border-b border-mes-gray-30 bg-white px-6">
        <span className="shrink-0 text-[15px] font-bold text-mes-gray-130">MES Design System</span>
        <nav className="flex items-center gap-1">
          {TOP_NAV.map((tab) =>
            tab.firstId ? (
              <a
                key={tab.key}
                href={`#${tab.firstId}`}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  activeGroup === tab.key
                    ? "bg-mes-bg-subtle text-mes-text-brand"
                    : "text-mes-gray-70 hover:bg-mes-bg-subtle hover:text-mes-gray-130"
                )}
              >
                {tab.label}
              </a>
            ) : (
              <span
                key={tab.key}
                title="준비 중"
                className="flex cursor-not-allowed items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium text-mes-gray-40"
              >
                {tab.label}
                <span className="text-[10px]">예정</span>
              </span>
            )
          )}
        </nav>
        {/* 2026-08-03 신규 — 담당자 요청: "우측 상단에 검색창 넣어서 이름별로 검색
            가능하게". 사이드바 항목(leaf/branch label) 이름 부분일치 검색 — 검색 결과는
            사이드바 목록만 필터링하고, 페이지 스크롤 위치는 항목을 클릭해야 이동. */}
        <div className="relative ml-auto flex items-center">
          <Search className="pointer-events-none absolute left-2.5 size-3.5 text-mes-gray-50" />
          <input
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
            placeholder="컴포넌트 이름 검색"
            className="h-8 w-[200px] rounded-mes-control border border-mes-border-default bg-white py-1.5 pl-8 pr-2 text-[13px] text-mes-text-default outline-none placeholder:text-mes-text-placeholder focus:border-mes-border-strong"
          />
        </div>
      </header>

      <div className="flex w-full flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[240px] shrink-0 overflow-y-auto border-r border-mes-gray-30 bg-white px-3 py-6 lg:block">
          {SIDEBAR_GROUPS.map((group) => {
            // 2026-08-03 신규 — 검색어와 leaf/branch(및 그 children) 라벨을 부분일치
            // 비교. branch는 자기 라벨이 맞거나 children 중 하나라도 맞으면 노출하고,
            // children은 검색어에 맞는 것만 남긴다(검색어 없으면 전부 그대로).
            const q = sidebarSearch.trim().toLowerCase();
            const matches = (label: string) => !q || label.toLowerCase().includes(q);
            const visibleNodes = group.nodes
              .map((node) => {
                if (node.kind === "leaf") return matches(node.label) ? node : null;
                const visibleChildren = node.children.filter(
                  (c) => matches(node.label) || matches(c.label)
                );
                return visibleChildren.length > 0 ? { ...node, children: visibleChildren } : null;
              })
              .filter((n): n is SidebarNode => n !== null);

            if (visibleNodes.length === 0) return null;

            return (
              <div key={group.title} className="mb-6">
                <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wide text-mes-gray-60">
                  {group.title}
                </div>
                <nav className="flex flex-col gap-0.5">
                  {visibleNodes.map((node) =>
                    node.kind === "leaf" ? (
                      <a
                        key={node.id}
                        href={`#${node.id}`}
                        className={cn(
                          "flex items-center gap-1.5 truncate rounded-md px-2 py-1.5 text-[13px] transition-colors",
                          activeId === node.id
                            ? "bg-mes-bg-subtle font-semibold text-mes-text-brand"
                            : "text-mes-gray-90 hover:bg-mes-bg-subtle hover:text-mes-gray-130"
                        )}
                      >
                        <TierBadge id={node.id} />
                        <span className="truncate">{node.label}</span>
                        {TEMP_BADGE_IDS.has(node.id) && (
                          <span className="shrink-0 rounded-full bg-mes-bg-brand-subtle-strong px-1.5 py-0 text-[10px] font-medium leading-[1.6] text-mes-text-brand">
                            임시
                          </span>
                        )}
                      </a>
                    ) : (
                      <div key={node.label} className="flex flex-col gap-0.5">
                        <span
                          className={cn(
                            "truncate px-2 py-1.5 text-[13px] font-semibold",
                            node.children.some((c) => c.id === activeId)
                              ? "text-mes-text-brand"
                              : "text-mes-gray-100"
                          )}
                        >
                          {node.label}
                        </span>
                        {node.children.map((child) => (
                          <a
                            key={child.id}
                            href={`#${child.id}`}
                            className={cn(
                              "ml-3 flex items-center gap-1.5 truncate rounded-md border-l border-mes-gray-30 py-1.5 pl-3 text-[13px] transition-colors",
                              activeId === child.id
                                ? "border-mes-primary-60 font-semibold text-mes-text-brand"
                                : "text-mes-gray-70 hover:text-mes-gray-130"
                            )}
                          >
                            <TierBadge id={child.id} />
                            <span className="truncate">{child.label}</span>
                            {TEMP_BADGE_IDS.has(child.id) && (
                              <span className="shrink-0 rounded-full bg-mes-bg-brand-subtle-strong px-1.5 py-0 text-[10px] font-medium leading-[1.6] text-mes-text-brand">
                                임시
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    )
                  )}
                </nav>
              </div>
            );
          })}
        </aside>

        <main className="flex flex-1 flex-col items-center gap-20 p-16">
          <h1 className="w-full max-w-[960px] text-xl font-semibold text-mes-gray-130">
            MES 컴포넌트 라이브러리
          </h1>

          {/* 2026-08-03 신규 — 담당자 요청: 메인 화면에도 사이드바처럼 Foundation/
              Components 구분자를 두라고 함. 사이드바 그룹 제목과 짝을 맞춘 큰 이름표 +
              한 줄 설명. */}
          <div className="flex w-full max-w-[960px] flex-col gap-1">
            <span className="text-[13px] font-bold uppercase tracking-widest text-mes-primary-60">
              Foundation
            </span>
            <p className="text-[13px] leading-[1.5] text-mes-gray-70">
              화면을 구성하는 가장 기초적인 값들입니다 — 색상, 타이포그래피, 간격, radius,
              그림자, 시맨틱 토큰. 아래 모든 컴포넌트는 이 값들을 조합해서 만들어집니다.
            </p>
          </div>

          <section id="color-palette" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">색상 팔레트</h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                Gray/Primary/Danger/Yellow 각 10~110 11단계. Alarm은 알람 리스트 전용 별도 색상군.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <PaletteRow title="Gray" colors={GRAY_PALETTE} />
              <PaletteRow title="Primary" colors={PRIMARY_PALETTE} />
              <PaletteRow title="Danger" colors={DANGER_PALETTE} />
              <PaletteRow title="Yellow" colors={YELLOW_PALETTE} />
              <PaletteRow title="Alarm severity" note="(알람 리스트 전용, 팔레트 아님)" colors={ALARM_PALETTE} />
            </div>
          </section>

          <section id="typography" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">타이포그래피 스케일</h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                Pretendard, 자간 0 / 행간 150% 고정. 회색 밑줄 = 실사용 조합.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-8">
              {TYPE_WEIGHTS.map((w) => (
                <div key={w.label} className="flex flex-col gap-3">
                  <span className="text-[13px] font-bold text-mes-gray-130">{w.label}</span>
                  <div className="flex flex-col gap-2.5">
                    {TYPE_SIZES.map((size) => {
                      const usage = USED_TYPE_COMBOS[`${w.label}-${size}`];
                      return (
                        <span
                          key={size}
                          title={usage}
                          style={{ fontSize: size, fontWeight: w.weight, letterSpacing: 0, lineHeight: 1.5 }}
                          className={cn(
                            "block whitespace-nowrap text-left text-mes-gray-130",
                            usage && "underline decoration-mes-gray-40 decoration-2 underline-offset-4"
                          )}
                        >
                          Pretendard / {w.label} / {size}px
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="spacing" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
                간격
              </h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                실측값 그대로 — 4px 배수를 벗어난 값(5px, 6px 등)도 있음.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {SPACING_SCALE.map((s) => (
                <div key={s.value} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-right font-mono text-[11px] text-mes-gray-60">
                    {s.value}px
                  </span>
                  <div className="flex h-4 w-10 shrink-0 items-center">
                    <div
                      className="h-3 rounded-sm bg-mes-primary-40"
                      style={{ width: s.value }}
                    />
                  </div>
                  <span className="text-[11px] text-mes-gray-70">{s.usage}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="radius" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
                Radius
              </h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                작은 요소 2~4px, 떠 있는 패널 8px, 모달 12~16px, 캡슐형 full.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              {RADIUS_SCALE.map((r) => (
                <div key={r.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "border border-mes-primary-40 bg-mes-primary-20",
                      r.pill ? "h-8 w-16" : "size-12"
                    )}
                    style={{ borderRadius: r.radius }}
                  />
                  <span className="font-mono text-[11px] text-mes-gray-70">{r.label}</span>
                  <span className="max-w-[110px] text-center text-[10px] leading-tight text-mes-gray-60">
                    {r.usage}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section id="shadow" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
                그림자
              </h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                오프셋 있으면 &quot;떠 있는 패널&quot;, 오프셋 없이 사방 확산이면 &quot;중앙
                집중형 모달&quot;.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              {SHADOW_SCALE.map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <div
                    className="flex h-16 w-28 items-center justify-center rounded-lg bg-white text-[11px] text-mes-gray-70"
                    style={{ filter: `drop-shadow(${s.value})` }}
                  >
                    {s.label}
                  </div>
                  <span className="font-mono text-[10px] text-mes-gray-60">{s.value}</span>
                  <span className="text-[11px] text-mes-gray-70">{s.usage}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="semantic-tokens" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
                시맨틱 토큰
              </h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                위 스케일 값을 가리키기만 하는 용도 이름. 스케일 값이 바뀌면 자동으로 따라 바뀐다.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {SEMANTIC_TOKENS.map((g) => (
                <div key={g.group} className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-bold text-mes-gray-100">{g.group}</span>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {g.tokens.map((t) => (
                      <div key={t.name} className="flex items-baseline gap-2 text-[11px]">
                        <span className="shrink-0 font-mono text-mes-gray-130">mes-{t.name}</span>
                        <span className="shrink-0 font-mono text-mes-gray-60">→ {t.scale}</span>
                        <span className="truncate text-mes-gray-70">{t.usage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="flex w-full max-w-[960px] flex-col gap-1">
            <span className="text-[13px] font-bold uppercase tracking-widest text-mes-primary-60">
              Components
            </span>
            <p className="text-[13px] leading-[1.5] text-mes-gray-70">
              Foundation 값들을 조합해 만든 실제 UI 조각들입니다 — 버튼 같은 기본 단위부터
              테이블·알림 패널 같은 복합 컴포넌트까지.
            </p>
          </div>

      <Section id="button-size" title="Button — 사이즈">
        <Sample label="Button · Basic · Default">
          <Button size="basic">Basic 버튼</Button>
        </Sample>
        <Sample label="Button · Small · Default">
          <Button size="small">Small 버튼</Button>
        </Sample>
        <Sample label="Button · Xsmall · Default">
          <Button size="xsmall">Xsmall 버튼</Button>
        </Sample>
        <Sample label="Button · Basic · Disabled">
          <Button size="basic" disabled>
            비활성
          </Button>
        </Sample>
      </Section>

      <Section id="button-icon" title="Button — 아이콘">
        <Sample label="Button · StartIcon">
          <Button size="basic" startIcon={<Plus size={16} />}>
            아이콘 왼쪽
          </Button>
        </Sample>
        <Sample label="Button · EndIcon">
          <Button size="basic" endIcon={<Plus size={16} />}>
            아이콘 오른쪽
          </Button>
        </Sample>
        <Sample label="Button · Start+EndIcon">
          <Button
            size="basic"
            startIcon={<Plus size={16} />}
            endIcon={<Plus size={16} />}
          >
            아이콘 양쪽
          </Button>
        </Sample>
      </Section>

      <Section id="button-color" title="Button — 컬러">
        <Sample label="Button · fillMain">
          <Button size="basic" variant="fillMain">
            fillMain
          </Button>
        </Sample>
        <Sample label="Button · fillGray">
          <Button size="basic" variant="fillGray">
            fillGray
          </Button>
        </Sample>
        <Sample label="Button · fillBlack">
          <Button size="basic" variant="fillBlack">
            fillBlack
          </Button>
        </Sample>
        <Sample label="Button · fillRed">
          <Button size="basic" variant="fillRed">
            fillRed
          </Button>
        </Sample>
        <Sample label="Button · lineMain">
          <Button size="basic" variant="lineMain">
            lineMain
          </Button>
        </Sample>
        <Sample label="Button · lineBlacktxt">
          <Button size="basic" variant="lineBlacktxt">
            lineBlacktxt
          </Button>
        </Sample>
        <Sample label="Button · opacityMain">
          <Button size="basic" variant="opacityMain">
            opacityMain
          </Button>
        </Sample>
      </Section>

      {/* 2026-07-31 신규 — 티어2 컴포넌트 1차 배치(Figma 디자인 없어서 기존 토큰
          체계 기반 판단값으로 구현, 각 컴포넌트 파일 주석 참고). Button 바로 아래
          배치한 이유는 IconButton/CloseButton이 Button 색상 variant 네이밍을
          그대로 이어받아서 개념적으로 가장 가까운 이웃이기 때문. */}
      <Section id="icon-button" title="IconButton / CloseButton" badge="임시">
        <Sample label="IconButton · basic/ghost">
          <IconButton icon={<IconFilter />} aria-label="필터" size="basic" />
        </Sample>
        <Sample label="IconButton · small/fillMain">
          <IconButton icon={<IconBell />} aria-label="알림" variant="fillMain" size="small" />
        </Sample>
        <Sample label="IconButton · small/fillGray">
          <IconButton icon={<IconFilter />} aria-label="필터" variant="fillGray" size="small" />
        </Sample>
        <Sample label="IconButton · small/fillBlack">
          <IconButton icon={<IconBell />} aria-label="알림" variant="fillBlack" size="small" />
        </Sample>
        <Sample label="IconButton · small/lineBlacktxt">
          <IconButton
            icon={<IconFilter />}
            aria-label="필터"
            variant="lineBlacktxt"
            size="small"
          />
        </Sample>
        <Sample label="IconButton · xsmall/ghost">
          <IconButton icon={<IconBell />} aria-label="알림" size="xsmall" />
        </Sample>
        <Sample label="IconButton · disabled">
          <IconButton icon={<IconFilter />} aria-label="필터" size="small" disabled />
        </Sample>
        <Sample label="CloseButton · 기본(small)">
          <CloseButton />
        </Sample>
      </Section>

      <Section id="divider" title="Divider" badge="임시">
        <Sample label="Divider · horizontal">
          <div className="flex w-40 flex-col gap-2">
            <span className="text-[12px] text-mes-gray-70">위</span>
            <Divider />
            <span className="text-[12px] text-mes-gray-70">아래</span>
          </div>
        </Sample>
        <Sample label="Divider · vertical">
          <div className="flex h-8 items-center gap-2">
            <span className="text-[12px] text-mes-gray-70">왼쪽</span>
            <Divider orientation="vertical" />
            <span className="text-[12px] text-mes-gray-70">오른쪽</span>
          </div>
        </Sample>
      </Section>

      <Section id="tooltip" title="Tooltip" badge="임시">
        <Sample label="Tooltip · top(기본)">
          <Tooltip content="위쪽 툴팁">
            <Button size="small" variant="lineBlacktxt">
              hover
            </Button>
          </Tooltip>
        </Sample>
        <Sample label="Tooltip · bottom">
          <Tooltip content="아래쪽 툴팁" side="bottom">
            <Button size="small" variant="lineBlacktxt">
              hover
            </Button>
          </Tooltip>
        </Sample>
        <Sample label="Tooltip · IconButton과 조합">
          <Tooltip content="필터 열기">
            <IconButton icon={<IconFilter />} aria-label="필터" size="small" />
          </Tooltip>
        </Sample>
      </Section>

      <Section id="loading-spinner" title="LoadingSpinner" badge="임시">
        <Sample label="LoadingSpinner · 16px">
          <LoadingSpinner size={16} />
        </Sample>
        <Sample label="LoadingSpinner · 20px(기본)">
          <LoadingSpinner />
        </Sample>
        <Sample label="LoadingSpinner · fillMain 버튼 위">
          <Button size="basic" variant="fillMain" disabled className="gap-2">
            <LoadingSpinner size={16} className="text-mes-text-inverse" />
            처리 중
          </Button>
        </Sample>
      </Section>

      <Section id="skeleton" title="Skeleton" badge="임시">
        <Sample label="Skeleton · text">
          <div className="flex w-40 flex-col gap-1.5">
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        </Sample>
        <Sample label="Skeleton · rect">
          <Skeleton variant="rect" className="w-40" />
        </Sample>
        <Sample label="Skeleton · circle">
          <Skeleton variant="circle" />
        </Sample>
        <Sample label="Skeleton · 카드 조합 예시">
          <div className="flex w-40 items-center gap-2">
            <Skeleton variant="circle" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
          </div>
        </Sample>
      </Section>

      <Section id="switch" title="Switch" badge="임시">
        <Sample label="Switch · off">
          <Switch />
        </Sample>
        <Sample label="Switch · on">
          <Switch defaultChecked />
        </Sample>
        <Sample label="Switch · disabled(off)">
          <Switch disabled />
        </Sample>
        <Sample label="Switch · disabled(on)">
          <Switch disabled defaultChecked />
        </Sample>
      </Section>

      <Section id="textarea" title="Textarea" badge="임시">
        <Sample label="Textarea · Default(placeholder)">
          <Textarea placeholder="내용 입력" className="h-20 w-[220px]" />
        </Sample>
        <Sample label="Textarea · 입력됨">
          <Textarea defaultValue={"설비 점검 중 이상 소음 발생.\n정지 후 재확인 필요."} className="h-20 w-[220px]" />
        </Sample>
        <Sample label="Textarea · readonly">
          <Textarea readOnly defaultValue="수정 불가 내용" className="h-20 w-[220px]" />
        </Sample>
        <Sample label="Textarea · disabled">
          <Textarea disabled defaultValue="비활성" className="h-20 w-[220px]" />
        </Sample>
      </Section>

      <Section id="label" title="Label" badge="임시">
        <Sample label="Label · 기본">
          <Label>품목명</Label>
        </Sample>
        <Sample label="Label · required">
          <Label required>거래처</Label>
        </Sample>
        <Sample label="Label + Input 조합">
          <div className="flex flex-col gap-1.5">
            <Label required>수량</Label>
            <Input placeholder="0" className="w-[160px]" />
          </div>
        </Sample>
      </Section>

      <Section id="link" title="Link" badge="임시">
        <Sample label="Link · 기본">
          <Link href="#">조설정 바로가기</Link>
        </Sample>
        <Sample label="Link · 화살표 포함">
          <Link href="#">자세히 보기 →</Link>
        </Sample>
      </Section>

      <Section id="input" title="Input">
        <Sample label="Input · Default(placeholder)">
          <Input placeholder="내용 입력" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Default(filled)">
          <Input defaultValue="내용" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Readonly">
          <Input placeholder="내용 입력" readOnly defaultValue="내용" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Disabled">
          <Input placeholder="내용 입력" disabled className="w-[200px]" />
        </Sample>
        <Sample label="Input · Small(placeholder)">
          <Input size="small" placeholder="내용 입력" className="w-[200px]" />
        </Sample>
        <Sample label="Input · Small(filled)">
          <Input size="small" defaultValue="내용" className="w-[200px]" />
        </Sample>
      </Section>

      <Section id="select" title="Select">
        <Sample label="Select · Default(placeholder)">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
              <SelectItem value="2">옵션 2</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · Default(selected)">
          <Select defaultValue="1">
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">내용</SelectItem>
              <SelectItem value="2">옵션 2</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · Small">
          <Select>
            <SelectTrigger size="small" className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · Disabled">
          <Select disabled>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample label="Select · 커스텀 아이콘(꺾쇠 대신)">
          <Select>
            <SelectTrigger className="w-[200px]" icon={<IconFilter size={14} className="shrink-0 opacity-80" />}>
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">최신순</SelectItem>
              <SelectItem value="2">이름순</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
      </Section>

      <Section id="badge" title="Badge">
        <Sample label="Badge · blue">
          <Badge variant="blue">출하중</Badge>
        </Sample>
        <Sample label="Badge · red">
          <Badge variant="red">취소요청</Badge>
        </Sample>
        <Sample label="Badge · grayFill(구 이름 orange)">
          <Badge variant="grayFill">대기</Badge>
        </Sample>
        <Sample label="Badge · blue2(구 이름 yellow, blue와 값 동일)">
          <Badge variant="blue2">승인중</Badge>
        </Sample>
        <Sample label="Badge · gray(배경 없음)">
          <Badge variant="gray">완료</Badge>
        </Sample>
        <Sample label="Badge · blueLight(구 이름 variant6)">
          <Badge variant="blueLight">완료</Badge>
        </Sample>
        <Sample label="Badge · blueOutline(구 이름 variant7)">
          <Badge variant="blueOutline">완료</Badge>
        </Sample>
      </Section>

      <Section id="radio" title="Radio">
        <Sample label="Radio · Unselected">
          <Radio name="demo-radio-unsel" />
        </Sample>
        <Sample label="Radio · Selected">
          <Radio name="demo-radio-sel" defaultChecked />
        </Sample>
        <Sample label="Radio · Disabled(선택 안 됨)">
          <Radio name="demo-radio-disabled-off" disabled />
        </Sample>
        <Sample label="Radio · Disabled(선택됨, Figma에 없어 판단값)">
          <Radio name="demo-radio-disabled-on" disabled defaultChecked />
        </Sample>
      </Section>

      <Section id="checkbox" title="Checkbox">
        <Sample label="Checkbox · Unchecked">
          <Checkbox />
        </Sample>
        <Sample label="Checkbox · Checked · main">
          <Checkbox defaultChecked color="main" />
        </Sample>
        <Sample label="Checkbox · Checked · gray">
          <Checkbox defaultChecked color="gray" />
        </Sample>
        <Sample label="Checkbox · Checked · black">
          <Checkbox defaultChecked color="black" />
        </Sample>
        <Sample label="Checkbox · Disabled(판단값)">
          <Checkbox disabled />
        </Sample>
        <Sample label="Checkbox · Disabled+Checked(판단값)">
          <Checkbox disabled defaultChecked />
        </Sample>
      </Section>

      <Section id="progress" title="Progress Bar">
        <Sample label="Progress · 78%">
          <Progress value={78} className="w-[160px]" />
        </Sample>
        <Sample label="Progress · 0%">
          <Progress value={0} className="w-[160px]" />
        </Sample>
        <Sample label="Progress · 50%">
          <Progress value={50} className="w-[160px]" />
        </Sample>
        <Sample label="Progress · 100%">
          <Progress value={100} className="w-[160px]" />
        </Sample>
      </Section>

      <section id="filter" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          Filter
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          필터 추가 → 카테고리·체크박스 선택 → 태그로 표시 → X로 해제.
        </p>
        <Filter
          categories={filterCategories}
          value={filterValue}
          onChange={(categoryId, optionIds) =>
            setFilterValue((prev) => ({ ...prev, [categoryId]: optionIds }))
          }
        />
      </section>

      <section id="group-query" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="flex items-center gap-2 border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          GroupQuery
          <span className="rounded-full bg-mes-bg-brand-subtle-strong px-2 py-0.5 text-[11px] font-medium text-mes-text-brand">임시</span>
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          Level 1~3 드롭다운으로 그룹화 기준 지정, 값 있으면 칩+X로 표시. 옆은 Filter,
          오른쪽 끝은 SearchInput 재사용.
        </p>
        {/* 2026-08-03 — Filter의 shrink-0 누락 버그(주석 참고)를 고치면서, 이 줄 자체도
            방어적으로 `flex-wrap` 추가: 폭이 정말 부족해지면(예: 좁은 화면) 컴포넌트가
            찌그러지는 대신 SearchInput이 다음 줄로 자연스럽게 내려가도록 함. */}
        <div className="flex w-full flex-wrap items-center justify-between gap-x-2.5 gap-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <GroupQuery
              options={groupQueryOptions}
              levels={groupQueryLevels}
              onLevelChange={(index, value) =>
                setGroupQueryLevels((prev) => prev.map((v, i) => (i === index ? value : v)))
              }
            />
            <Filter
              categories={filterCategories}
              value={filterValue}
              onChange={(categoryId, optionIds) =>
                setFilterValue((prev) => ({ ...prev, [categoryId]: optionIds }))
              }
            />
          </div>
          <SearchInput value={groupQuerySearchValue} onChange={setGroupQuerySearchValue} />
        </div>
      </section>

      <section id="quick-query" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          QuickQuery
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          조회 조건(그룹화/필터/조회 설정)을 즐겨찾기로 저장·적용. 톱니 아이콘 클릭 → &quot;조회
          조건 프리셋&quot; 관리 모달(최대 3개 슬롯: 미설정/저장됨/저장 중 3가지 상태).
        </p>
        <QuickQuery
          presets={quickQuerySlots
            .filter((s): s is QuickQuerySlot & { name: string } => s.name !== null)
            .map((s) => ({ id: s.id, label: s.name }))}
          activeId={quickQueryActiveId}
          onApply={setQuickQueryActiveId}
          onClearActive={() => setQuickQueryActiveId(null)}
          onSettingsClick={() => setQuickQueryDialogOpen(true)}
        />
        <QuickQueryPresetDialog
          open={quickQueryDialogOpen}
          onOpenChange={setQuickQueryDialogOpen}
          slots={quickQuerySlots}
          onDelete={(id) =>
            setQuickQuerySlots((prev) =>
              prev.map((s) => (s.id === id ? { ...s, name: null, detail: undefined } : s))
            )
          }
          onSaveSlot={(id, name) =>
            setQuickQuerySlots((prev) =>
              prev.map((s) =>
                s.id === id
                  ? {
                      ...s,
                      name,
                      detail: { grouping: "품목명>담당자명>일자" },
                    }
                  : s
              )
            )
          }
          currentPreview={{ grouping: "품목명>담당자명>일자" }}
        />
      </section>

      <Section id="search-input" title="SearchInput">
        <Sample label="값 없음(기본)">
          <SearchInput value="" onChange={() => {}} />
        </Sample>
        <Sample label="값 있음(실측 — 배경색 강조)">
          <SearchInput value="숯불치킨 뚜껑" onChange={() => {}} />
        </Sample>
        <Sample label="제어형(직접 입력해보기)">
          <SearchInput value={searchInputValue} onChange={setSearchInputValue} />
        </Sample>
      </Section>

      <Section id="tag" title="Tag">
        <Sample label="Tag · main · start+endIcon(실측 그대로)">
          <Tag color="main" startIcon={<X className="size-3" />} endIcon={<X className="size-3" />}>
            태그 텍스트
          </Tag>
        </Sample>
        <Sample label="Tag · gray · endIcon만(실사용 예시)">
          <Tag color="gray" endIcon={<X className="size-3" />}>태그 텍스트</Tag>
        </Sample>
        <Sample label="Tag · red · 아이콘 없음">
          <Tag color="red">태그 텍스트</Tag>
        </Sample>
      </Section>

      <Section id="combobox" title="Combobox">
        <Sample label="Combobox · Default(제어형, 검색 가능)">
          <Combobox
            options={shiftOptions}
            value={comboValue}
            onValueChange={setComboValue}
            placeholder="근무조 선택"
            searchPlaceholder="근무조 검색"
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Default(비제어, 초기값 있음)">
          <Combobox
            options={shiftOptions}
            defaultValue="night"
            searchPlaceholder="근무조 검색"
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Small(비제어, 초기값 있음)">
          <Combobox
            options={shiftOptions}
            defaultValue="bom1"
            searchPlaceholder="BOM 검색"
            size="small"
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Small · Disabled">
          <Combobox
            options={shiftOptions}
            defaultValue="bom1"
            size="small"
            disabled
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · Default · Disabled">
          <Combobox
            options={shiftOptions}
            placeholder="내용 입력"
            disabled
            className="w-[200px]"
          />
        </Sample>
        <Sample label="Combobox · 커스텀 아이콘(꺾쇠 대신)">
          <Combobox
            options={shiftOptions}
            placeholder="정렬 기준"
            searchPlaceholder="검색"
            icon={<IconFilter size={14} className="shrink-0 opacity-80" />}
            className="w-[200px]"
          />
        </Sample>
      </Section>

      <Section id="toast" title="Toast">
        <Sample label="Toast · red" wide>
          <Toast variant="red" message="필수 항목을 입력해주세요." onClose={() => {}} />
        </Sample>
        <Sample label="Toast · blue" wide>
          <Toast variant="blue" message="선택한 n건이 합격 처리되었습니다." onClose={() => {}} />
        </Sample>
      </Section>

      <Section id="confirm-dialog" title="ConfirmDialog">
        <Sample label="ConfirmDialog · error 톤(기본), 확인 1버튼">
          <Button size="basic" onClick={() => setDialogOpen(true)}>
            삭제 시도
          </Button>
        </Sample>
        <Sample label="ConfirmDialog · warning 톤, 확인+취소 2버튼">
          <Button size="basic" onClick={() => setWarningDialogOpen(true)}>
            반품 시도
          </Button>
        </Sample>
        <Sample label="ConfirmDialog · info 톤, 확인 1버튼">
          <Button size="basic" onClick={() => setInfoDialogOpen(true)}>
            삭제 완료 알림
          </Button>
        </Sample>
        <Sample label="ConfirmDialog · error 톤 + 안내 배너(링크 포함)">
          <Button size="basic" onClick={() => setBannerDialogOpen(true)}>
            라벨 생성 시도
          </Button>
        </Sample>
      </Section>

      <ConfirmDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="삭제 불가"
        heading="삭제 불가합니다."
        description="이미 사용되었거나 후속 작업(생산, 출하, 연동) 진행 이력이 있어 삭제 불가합니다."
        actions={[{ label: "확인", onClick: () => setDialogOpen(false) }]}
      />

      <ConfirmDialog
        open={warningDialogOpen}
        onOpenChange={setWarningDialogOpen}
        title="경고"
        heading="선택 항목을 삭제(반품)하시겠습니까?"
        description="선택한 발주가 리스트에서 삭제됩니다."
        tone="warning"
        actions={[
          { label: "취소", variant: "fillGray", onClick: () => setWarningDialogOpen(false) },
          { label: "확인", variant: "fillBlack", onClick: () => setWarningDialogOpen(false) },
        ]}
      />

      <ConfirmDialog
        open={infoDialogOpen}
        onOpenChange={setInfoDialogOpen}
        title="알림"
        heading="삭제 완료"
        description="생산목표가 삭제(등록)되었습니다."
        tone="info"
        actions={[{ label: "확인", onClick: () => setInfoDialogOpen(false) }]}
      />

      <ConfirmDialog
        open={bannerDialogOpen}
        onOpenChange={setBannerDialogOpen}
        title="라벨 생성 불가"
        heading="라벨 생성 불가"
        description="품목 정보에서 입상수 기준수량을 등록해 주세요."
        banner={{
          message: "담당자의 조가 설정되지 않았습니다. 조를 설정하면 LOT 일련번호에 반영됩니다.",
          linkLabel: "조설정 바로가기",
        }}
        actions={[{ label: "확인", onClick: () => setBannerDialogOpen(false) }]}
      />

      <section id="notice-banner" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          NoticeBanner
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          ConfirmDialog 안내 배너로도, 독립적으로도 사용 가능.
        </p>
        <NoticeBanner
          message="담당자의 조가 설정되지 않았습니다. 조를 설정하면 LOT 일련번호에 반영됩니다."
          linkLabel="조설정 바로가기"
          className="max-w-[420px]"
        />
      </section>

      <Section id="radio-choice-dialog" title="RadioChoiceDialog">
        <Sample label="RadioChoiceDialog · 열기">
          <Button size="basic" onClick={() => setRadioDialogOpen(true)}>
            투입품목 추가
          </Button>
        </Sample>
      </Section>

      <RadioChoiceDialog
        open={radioDialogOpen}
        onOpenChange={setRadioDialogOpen}
        title="투입품목 추가"
        question="투입품목 추가 방식을 선택하세요."
        options={[
          { title: "삭제 후 재등록", description: "기존 투입품목 내역을 전체 삭제하고 처음부터 다시 등록합니다." },
          { title: "투입품목 추가", description: "기존 투입품목 내역을 유지하고 누락된 품목을 추가합니다." },
        ]}
        warning="선택한 내용을 되돌릴 수 없습니다."
        onConfirm={() => setRadioDialogOpen(false)}
      />

      <section id="nested-modal" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="flex items-center gap-2 border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          Nested Modal
          <span className="rounded-full bg-mes-bg-brand-subtle-strong px-2 py-0.5 text-[11px] font-medium text-mes-text-brand">
            임시
          </span>
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          팝업 위에 또 다른 팝업이 뜨는 2-depth 패턴. Figma상 Center Modal에서 겹친
          형태로 추정되는 원본은 담당자 지시로 아직 보류 중이라(자료 전달 대기),
          정확한 구조를 새로 짓는 대신 이미 완성된 ConfirmDialog 두 개를 겹쳐 여는
          방식으로 시연.
        </p>
        <Button size="basic" onClick={() => setNestedModalOpen(true)}>
          품목 삭제
        </Button>
      </section>

      <ConfirmDialog
        open={nestedModalOpen}
        onOpenChange={setNestedModalOpen}
        title="품목 삭제"
        heading="이 품목을 삭제하시겠습니까?"
        description="연결된 BOM/재고 정보가 있으면 함께 영향을 받을 수 있습니다."
        tone="warning"
        actions={[
          { label: "취소", variant: "fillGray", onClick: () => setNestedModalOpen(false) },
          {
            label: "삭제",
            variant: "fillRed",
            onClick: () => setNestedModalConfirmOpen(true),
          },
        ]}
      />
      <ConfirmDialog
        open={nestedModalConfirmOpen}
        onOpenChange={setNestedModalConfirmOpen}
        title="최종 확인"
        heading="정말 삭제하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다."
        tone="error"
        actions={[
          {
            label: "취소",
            variant: "fillGray",
            onClick: () => setNestedModalConfirmOpen(false),
          },
          {
            label: "삭제 확정",
            variant: "fillRed",
            onClick: () => {
              setNestedModalConfirmOpen(false);
              setNestedModalOpen(false);
              setNestedModalSuccessOpen(true);
            },
          },
        ]}
      />
      <ConfirmDialog
        open={nestedModalSuccessOpen}
        onOpenChange={setNestedModalSuccessOpen}
        title="알림"
        heading="삭제되었습니다"
        tone="info"
        actions={[{ label: "확인", onClick: () => setNestedModalSuccessOpen(false) }]}
      />

      <section id="page-top-tab-item" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          PageTopTabItem
        </h2>
        <p className="text-[12px] text-mes-gray-70">default/hover/active 3종.</p>
        <div className="flex">
          <PageTopTabItem label="생산계획(일) 리스트" active />
          <PageTopTabItem label="판매관리 리스트" />
          <PageTopTabItem label="품질검사 이력" bookmarked />
        </div>
      </section>

      <section id="sidebar" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          Sidebar / SNB
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          node 9873:83338(펼침)·9873:83651(접힘) 실측. 1-depth hover(Gray-120)/
          active(Primary-60) 구분, 2-depth 트리 연결선 포함. 우상단 화살표로 62px
          아이콘 레일로 접기 가능.
        </p>
        <div
          className={cn(
            "h-[820px] overflow-hidden rounded-lg border border-mes-gray-30 transition-[width]",
            sidebarCollapsed ? "w-[62px]" : "w-[260px]"
          )}
        >
          <Sidebar
            items={SIDEBAR_NAV_ITEMS}
            expandedKey={sidebarExpandedKey}
            onExpandedKeyChange={setSidebarExpandedKey}
            activeSubKey={sidebarActiveSubKey}
            onSubItemClick={(_, subKey) => setSidebarActiveSubKey(subKey)}
            collapsed={sidebarCollapsed}
            onCollapseClick={() => setSidebarCollapsed((v) => !v)}
          />
        </div>
      </section>

      <section id="alarm-list-item" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          AlarmListItem
        </h2>
        <p className="text-[12px] text-mes-gray-70">tone 4색(blue/red/yellow/green).</p>
        <div className="flex w-[400px] flex-col border border-mes-gray-30">
          <AlarmListItem
            tone="blue"
            title="작업 지시 생성"
            time="20:25"
            description="yyyy.mm.dd/[설비]/n건의 작업 지시가 생성되었습니다."
          />
          <AlarmListItem
            tone="red"
            title="출하 승인 취소"
            time="20:25"
            description="yyyy.mm.dd/[거래처]/n건의 출하 승인이 취소되었습니다."
          />
          <AlarmListItem
            tone="yellow"
            title="작업 지시 변경"
            time="20:25"
            description="yyyy.mm.dd/[설비]/n건의 작업 지시가 변경되었습니다."
          />
          <AlarmListItem
            tone="green"
            title="입고 완료"
            time="20:25"
            description="yyyy.mm.dd/[거래처]/n건의 입고가 완료되었습니다."
          />
        </div>
      </section>

      <section id="notification-panel" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          NotificationPanel
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          AlarmListItem을 재사용한 알림 드롭다운. 항목 클릭 시 목록에서 제거, 설정 아이콘
          클릭 시 알림 설정 화면으로 전환.
        </p>
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex flex-col items-start gap-2">
            <span className="text-[12px] font-medium text-mes-gray-70">
              데이터 있음(클릭해서 제거해보기 · 설정 아이콘 클릭 가능)
            </span>
            <NotificationPanel
              items={notificationItems}
              onItemClick={(id) =>
                setNotificationItems((prev) => prev.filter((item) => item.id !== id))
              }
              settingsItems={notificationSettings}
              onSettingsItemChange={(id, enabled) =>
                setNotificationSettings((prev) =>
                  prev.map((item) => (item.id === id ? { ...item, enabled } : item))
                )
              }
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-[12px] font-medium text-mes-gray-70">빈 상태</span>
            <NotificationPanel items={[]} />
          </div>
        </div>
      </section>

      <Section id="card" title="Card" badge="임시">
        <Sample label="Card · 기본" wide>
          <Card className="w-[260px]">
            <CardHeader>
              <CardTitle>작업 지시 #1024</CardTitle>
              <CardDescription>2026.08.03 생성</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-[13px] leading-[1.5] text-mes-text-default">
                설비 A라인 · 수량 500
              </span>
            </CardContent>
            <CardFooter>
              <Button size="small" variant="lineBlacktxt">
                상세
              </Button>
              <Button size="small" variant="fillMain">
                승인
              </Button>
            </CardFooter>
          </Card>
        </Sample>
      </Section>

      <Section id="empty-state" title="EmptyState" badge="임시">
        <Sample label="EmptyState · 아이콘+액션">
          <EmptyState
            icon={<IconFileNote size={40} />}
            title="데이터가 없습니다"
            description="조회 조건을 변경해보세요."
            action={
              <Button size="small" variant="lineBlacktxt">
                필터 초기화
              </Button>
            }
          />
        </Sample>
      </Section>

      <Section id="error-state" title="ErrorState" badge="임시">
        <Sample label="ErrorState · 재시도 액션">
          <ErrorState
            icon={<IconExclamationCircle size={40} />}
            description="잠시 후 다시 시도해주세요."
            action={
              <Button size="small" variant="lineMain">
                다시 시도
              </Button>
            }
          />
        </Sample>
      </Section>

      <Section id="popover" title="Popover" badge="임시">
        <Sample label="Popover · 클릭해서 열기">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="small" variant="lineBlacktxt">
                열기
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px]">
              <span className="text-[13px] leading-[1.5] text-mes-text-default">
                특정 요소 옆에 뜨는 팝업 콘텐츠입니다.
              </span>
            </PopoverContent>
          </Popover>
        </Sample>
      </Section>

      <Section id="accordion" title="Accordion" badge="임시">
        <Sample label="Accordion · multiple(기본)" wide>
          <Accordion
            className="w-[280px]"
            items={[
              { id: "a1", title: "기본 정보", content: "품목명, 규격, 단위 등" },
              { id: "a2", title: "재고 정보", content: "현재고, 안전재고, 위치" },
              { id: "a3", title: "이력", content: "입출고 이력 목록" },
            ]}
            defaultOpenIds={["a1"]}
          />
        </Sample>
      </Section>

      <Section id="collapsible" title="Collapsible" badge="임시">
        <Sample label="Collapsible · 단일 트리거" wide>
          <Collapsible trigger="상세 옵션" className="w-[240px]">
            <span className="text-[13px] leading-[1.5] text-mes-gray-80">
              여기에 추가 필드가 들어갑니다.
            </span>
          </Collapsible>
        </Sample>
      </Section>

      <Section id="button-group" title="ButtonGroup" badge="임시">
        <Sample label="ButtonGroup · 3개 연결">
          <ButtonGroup>
            <Button size="small" variant="lineBlacktxt">
              일간
            </Button>
            <Button size="small" variant="lineBlacktxt">
              주간
            </Button>
            <Button size="small" variant="lineBlacktxt">
              월간
            </Button>
          </ButtonGroup>
        </Sample>
      </Section>

      <Section id="toggle-button" title="ToggleButton" badge="임시">
        <Sample label="ToggleButton · 눌림 상태 토글">
          <ToggleButton
            size="small"
            pressed={toggleButtonPressed}
            onPressedChange={setToggleButtonPressed}
          >
            즐겨찾기
          </ToggleButton>
        </Sample>
      </Section>

      <Section id="number-input" title="NumberInput" badge="임시">
        <Sample label="NumberInput · 기본">
          <NumberInput defaultValue={10} min={0} max={999} />
        </Sample>
      </Section>

      <Section id="password-input" title="PasswordInput" badge="임시">
        <Sample label="PasswordInput · 보기/숨기기 토글">
          <PasswordInput defaultValue="password123" className="w-[200px]" />
        </Sample>
      </Section>

      <Section id="multi-select-input" title="MultiSelectInput" badge="임시">
        <Sample label="MultiSelectInput · 태그 추가/제거" wide>
          <MultiSelectInput
            values={multiSelectValues}
            onValuesChange={setMultiSelectValues}
            className="w-[260px]"
          />
        </Sample>
      </Section>

      <Section id="breadcrumb" title="Breadcrumb" badge="임시">
        <Sample label="Breadcrumb · 3단계" wide>
          <Breadcrumb
            items={[
              { label: "자재관리", onClick: () => {} },
              { label: "입고 관리", onClick: () => {} },
              { label: "입고 상세" },
            ]}
          />
        </Sample>
      </Section>

      <Section id="pagination" title="Pagination" badge="임시">
        <Sample label="Pagination · 10페이지 중 4페이지" wide>
          <Pagination page={paginationPage} totalPages={10} onPageChange={setPaginationPage} />
        </Sample>
      </Section>

      <Section id="dropdown-menu" title="DropdownMenu" badge="임시">
        <Sample label="DropdownMenu · 클릭해서 열기">
          <DropdownMenu
            trigger={
              <Button size="small" variant="lineBlacktxt">
                작업 ▾
              </Button>
            }
            items={[
              { id: "edit", label: "수정" },
              { id: "copy", label: "복사" },
              { id: "delete", label: "삭제", danger: true },
            ]}
          />
        </Sample>
      </Section>

      <Section id="list" title="List" badge="임시">
        <Sample label="List · 클릭 가능 항목">
          <List className="w-[220px]">
            <ListItem onClick={() => {}}>자재 A</ListItem>
            <ListItem onClick={() => {}}>자재 B</ListItem>
            <ListItem onClick={() => {}}>자재 C</ListItem>
          </List>
        </Sample>
      </Section>

      <Section id="panel" title="Panel" badge="임시">
        <Sample label="Panel · 기본">
          <Panel className="w-[220px] p-4">
            <span className="text-[13px] leading-[1.5] text-mes-text-default">
              그림자가 있는 떠 있는 영역
            </span>
          </Panel>
        </Sample>
      </Section>

      <Section id="fieldset" title="Fieldset" badge="임시">
        <Sample label="Fieldset · 필드 묶음" wide>
          <Fieldset legend="거래처 정보" className="w-[260px]">
            <Input placeholder="거래처명" size="small" />
            <Input placeholder="담당자" size="small" />
          </Fieldset>
        </Sample>
      </Section>

      <Section id="descriptions" title="Descriptions" badge="임시">
        <Sample label="Descriptions · 1열" wide>
          <Descriptions
            className="w-[280px]"
            items={[
              { label: "품목명", value: "볼트 M8" },
              { label: "규격", value: "M8 x 20mm" },
              { label: "현재고", value: "1,200" },
            ]}
          />
        </Sample>
      </Section>

      <Section id="date-picker" title="DatePicker" badge="임시">
        <Sample label="DatePicker · 단일 날짜">
          <DatePicker value={datePickerValue} onValueChange={setDatePickerValue} />
        </Sample>
      </Section>

      <Section id="date-range-picker" title="DateRangePicker" badge="임시">
        <Sample label="DateRangePicker · 기간 선택" wide>
          <DateRangePicker value={dateRangeValue} onValueChange={setDateRangeValue} />
        </Sample>
      </Section>

      <Section id="time-picker" title="TimePicker" badge="임시">
        <Sample label="TimePicker · 30분 간격">
          <TimePicker value={timePickerValue} onValueChange={setTimePickerValue} />
        </Sample>
      </Section>

      <Section id="navbar" title="Navbar" badge="임시">
        <Sample label="Navbar · 3-슬롯" wide>
          <Navbar
            className="w-[600px]"
            left={<Logo size="small" />}
            right={
              <Button size="small" variant="lineBlacktxt">
                로그아웃
              </Button>
            }
          />
        </Sample>
      </Section>

      <Section id="grid-container" title="Grid / Container" badge="임시">
        <Sample label="Grid · 3열" wide>
          <Grid columns={3} gap={2} className="w-[300px]">
            <div className="rounded-mes-control bg-mes-bg-subtle p-3 text-center text-[12px]">1</div>
            <div className="rounded-mes-control bg-mes-bg-subtle p-3 text-center text-[12px]">2</div>
            <div className="rounded-mes-control bg-mes-bg-subtle p-3 text-center text-[12px]">3</div>
          </Grid>
        </Sample>
      </Section>

      <Section id="scroll-area" title="ScrollArea" badge="임시">
        <Sample label="ScrollArea · 고정 높이">
          <ScrollArea className="h-[100px] w-[200px] rounded-mes-control border border-mes-border-default p-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="py-1 text-[13px] text-mes-text-default">
                항목 {i + 1}
              </div>
            ))}
          </ScrollArea>
        </Sample>
      </Section>

      <Section id="sticky-header-footer" title="StickyHeader / StickyFooter" badge="임시">
        <Sample label="Sticky · 컨테이너 내부 스크롤">
          <div className="h-[140px] w-[220px] overflow-y-auto rounded-mes-control border border-mes-border-default">
            <StickyHeader className="px-3 py-2 text-[12px] font-semibold">헤더</StickyHeader>
            <div className="p-3 text-[12px] text-mes-gray-70">
              스크롤해도 헤더/푸터는 고정됩니다. 스크롤해도 헤더/푸터는 고정됩니다.
            </div>
            <StickyFooter className="px-3 py-2 text-[12px] text-mes-gray-70">푸터</StickyFooter>
          </div>
        </Sample>
      </Section>

      <Section id="logo" title="Logo" badge="임시">
        <Sample label="Logo · default/small">
          <div className="flex items-center gap-4">
            <Logo />
            <Logo size="small" />
          </div>
        </Sample>
      </Section>

      <Section id="user-account-menu" title="UserAccountMenu" badge="임시">
        <Sample label="UserAccountMenu · 클릭해서 열기">
          <UserAccountMenu
            name="이해빈"
            items={[
              { id: "profile", label: "프로필" },
              { id: "settings", label: "설정" },
              { id: "logout", label: "로그아웃", danger: true },
            ]}
          />
        </Sample>
      </Section>

      <Section id="loading-overlay" title="LoadingOverlay" badge="임시">
        <Sample label="LoadingOverlay · 영역 덮기">
          <div className="relative h-[100px] w-[200px] rounded-mes-control border border-mes-border-default">
            <LoadingOverlay label="불러오는 중" />
          </div>
        </Sample>
      </Section>

      <section id="icons" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          아이콘 라이브러리
        </h2>
        <p className="text-[12px] text-mes-gray-70">담당자가 export한 실측 벡터 39종.</p>
        <div className="grid grid-cols-8 gap-4 text-mes-gray-130">
          {[
            { label: "calendar", node: <IconCalendar /> },
            { label: "filter", node: <IconFilter /> },
            { label: "plus", node: <IconPlus /> },
            { label: "search", node: <IconSearch /> },
            { label: "x", node: <IconX /> },
            { label: "arrow", node: <IconArrow /> },
            { label: "star·outline", node: <IconStar /> },
            { label: "star·filled", node: <IconStar variant="filled" /> },
            { label: "arrow-line", node: <IconArrowLine /> },
            { label: "bell·outline", node: <IconBell /> },
            { label: "bell·filled", node: <IconBell variant="filled" /> },
            { label: "user·line", node: <IconUserMono /> },
            { label: "user·solid", node: <IconUserMono variant="solid" /> },
            { label: "group-down", node: <IconGroupDown /> },
            { label: "grid", node: <IconGrid /> },
            { label: "chart-bar", node: <IconChartBar /> },
            { label: "wrench", node: <IconWrench /> },
            { label: "box", node: <IconBox /> },
            { label: "medal-check", node: <IconMedalCheck /> },
            { label: "company", node: <IconCompany /> },
            { label: "download", node: <IconDownload /> },
            { label: "copy", node: <IconCopy /> },
            { label: "trash", node: <IconTrash /> },
            { label: "exclamation-circle", node: <IconExclamationCircle /> },
            { label: "x-circle", node: <IconXCircle /> },
            { label: "arrow-down-right", node: <IconArrowDownRight /> },
            { label: "flat-in", node: <IconFlatIn /> },
            { label: "flat-out", node: <IconFlatOut /> },
            { label: "flat-box-check", node: <IconFlatBoxCheck /> },
            { label: "trending-down", node: <IconTrendingDown /> },
            { label: "trending-up", node: <IconTrendingUp /> },
            { label: "flat-file-check", node: <IconFlatFileCheck /> },
            { label: "scan", node: <IconScan /> },
            { label: "share", node: <IconShare /> },
            { label: "qa-x", node: <IconQaX /> },
            { label: "qa-triangle", node: <IconQaTriangle /> },
            { label: "qa-o", node: <IconQaO /> },
            { label: "reload", node: <IconReload /> },
            { label: "file-note", node: <IconFileNote /> },
          ].map(({ label, node }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="flex size-10 items-center justify-center rounded border border-mes-gray-30 bg-white">
                {node}
              </div>
              <span className="font-mono text-[10px] leading-none text-mes-gray-70">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="table-parts" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-6 border-b border-mes-gray-30 pb-8">
        <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">
          Table — 구조 요소별 분리 데모
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          헤더/그룹화/컬럼/총계행을 <code>Table</code> 하나로 각각 따로 확인.
        </p>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 헤더만 (rows/groups/totals 전부 없음)
          </span>
          <Table columns={flatColumns} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 그룹화만 (1단 그룹, 총계행 없음)
          </span>
          <Table
            columns={flatColumns}
            groups={miniGroups}
            selectedIds={miniGroupSelectedIds}
            onSelectedIdsChange={setMiniGroupSelectedIds}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 그룹화 3단 (지시일 → 설비 → 담당기사)
          </span>
          <Table
            columns={flatColumns}
            groups={miniGroups3}
            selectedIds={miniGroup3SelectedIds}
            onSelectedIdsChange={setMiniGroup3SelectedIds}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 컬럼 2개 이상 + 그룹화 없음 (평범한 플랫 테이블)
          </span>
          <Table
            columns={flatColumns}
            rows={flatRows}
            selectedIds={miniColSelectedIds}
            onSelectedIdsChange={setMiniColSelectedIds}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 총계행만
          </span>
          <Table
            columns={flatColumns}
            rows={flatRows}
            selectedIds={miniTotalsSelectedIds}
            onSelectedIdsChange={setMiniTotalsSelectedIds}
            totals={{ qty: (1200 + 980 + 2000).toLocaleString("ko-KR") }}
          />
        </div>
      </section>

      {/* 2026-07-28 8차 후속: 담당자가 (1) 데모 페이지에 라운드별 수정 이력을 문단으로
          길게 적어둔 게 "주절주절"하다고 지적해 삭제(이력은 AGENTS.md/Table_수정_
          대기목록.md에 이미 기록돼 있으니 그쪽 참고), (2) 접기/펼치기 헤더 줄의 폭이
          다른 섹션들과 안 맞는다고 지적 → 섹션 자체는 다른 데모들과 같은
          max-w-[960px]로 맞추고, 실제 테이블(컬럼 합 1600px대)만 그 안에서 별도
          `overflow-x-auto` 박스로 가로 스크롤 처리(대기목록 17번).
          2026-07-31: 담당자가 "테이블 합본이 하단에 있도록"이라고 요청 — 분리 데모
          (table-parts) 다음, 페이지 맨 아래로 순서 이동(내용 변경 없음). */}
      <section id="table-full" className="flex w-full max-w-[960px] scroll-mt-6 flex-col gap-4 pb-8">
        <button
          type="button"
          onClick={() => setProductionTableOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-left text-[15px] font-bold text-mes-gray-130"
        >
          <ChevronRight
            size={16}
            className={cn(
              "shrink-0 text-mes-gray-70 transition-transform",
              productionTableOpen && "rotate-90"
            )}
          />
          Table · 합본 데모 — 클릭해서 접기/펼치기
        </button>
        {productionTableOpen && (
          <div className="w-full overflow-x-auto">
            <Table
              columns={productionColumns}
              groups={productionGroups}
              selectedIds={tableSelectedIds}
              onSelectedIdsChange={setTableSelectedIds}
              totals={{ qty: fmt(16000), defectQty: fmt(30), packQty: fmt(160) }}
            />
          </div>
        )}
      </section>
        </main>
      </div>
    </div>
  );
}
