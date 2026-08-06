"use client";

import {
  useState,
  useRef,
  useContext,
  createContext,
  Children,
  isValidElement,
  cloneElement,
  Fragment,
} from "react";
import {
  ChevronRight,
  Plus,
  Search,
  Palette,
  Blocks,
  Hammer,
  LayoutTemplate,
  Settings,
  Pencil,
} from "lucide-react";
import NextLink from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import { CenterModal } from "@/components/ui/center-modal";
import { SideSlidePanel } from "@/components/ui/side-slide-panel";
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


import {
  type SidebarNode,
  FOUNDATION_NODES,
  COMPONENT_NODES,
  PATTERN_NODES,
  SIDEBAR_GROUPS,
  TEMP_BADGE_IDS,
  TIER_BY_ID,
  TIER_COLOR,
  TOP_NAV,
  idToHref,
  BREADCRUMB_MAP,
  ALL_SEARCHABLE_ITEMS,
} from "@/lib/sidebar-data";

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
 * 2026-08-04 신규 — 담당자가 SEED 디자인 시스템 사이트 스크린샷을 보여주며 "그룹 구분이
 * 애매하다, 이런 카드 그리드로 개요를 보여주자"고 요청(라이트 테마 유지, 카드 안 미리보기는
 * 없이 이름+티어뱃지만 — 담당자가 선택한 옵션). `/foundations`, `/components`처럼 구체적
 * 항목 없이 그룹 루트만 보고 있을 때(activeId 없음) 첫 항목을 그냥 보여주는 대신 이 그리드로
 * 전체 항목을 한눈에 보여주고, 카드 클릭 시 해당 항목 페이지로 이동.
 */
function OverviewCard({
  id,
  label,
  labelEn,
}: {
  id: string;
  label: string;
  labelEn?: string;
}) {
  return (
    <NextLink
      href={idToHref(id)}
      className="flex flex-col gap-2.5 rounded-mes-control border border-mes-border-default bg-white p-4 transition-colors hover:border-mes-primary-60 hover:shadow-sm"
    >
      <div className="flex items-center gap-1.5">
        <TierBadge id={id} />
        {TEMP_BADGE_IDS.has(id) && (
          <span className="shrink-0 rounded-full bg-mes-bg-brand-subtle-strong px-1.5 py-0 text-[10px] font-medium leading-[1.6] text-mes-text-brand">
            임시
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-semibold leading-tight text-mes-gray-130">{label}</span>
        {labelEn && (
          <span className="text-[12px] leading-tight text-mes-gray-60">{labelEn}</span>
        )}
      </div>
    </NextLink>
  );
}

function OverviewGrid({ nodes }: { nodes: SidebarNode[] }) {
  const cards = nodes.flatMap((node) =>
    node.kind === "leaf"
      ? [{ id: node.id, label: node.label, labelEn: node.labelEn }]
      : node.children.map((child) => ({
          id: child.id,
          label: `${node.label} — ${child.label}`,
          labelEn:
            node.labelEn && child.labelEn ? `${node.labelEn} — ${child.labelEn}` : child.labelEn,
        }))
  );
  return (
    <div className="grid w-full max-w-[960px] grid-cols-3 gap-3">
      {cards.map((c) => (
        <OverviewCard key={c.id} {...c} />
      ))}
    </div>
  );
}

/**
 * 2026-08-05 신규 — Patterns(3층) 첫 항목 "리스트형 등록 모달"에서 반복되는 "라벨(100px
 * 고정) + 입력 컨트롤" 한 줄짜리 폼 필드 레이아웃을 헬퍼로 뺌(공정 등록/작업지시 등록
 * 모달 두 곳에서 총 13번 반복되는 구조). Figma 실측(node 19414:94157/19098:64815):
 * 라벨 너비 100px, 라벨↔인풋 간격 8px(gap-2 = 8px), 라벨 텍스트 14px, 필수 표시는
 * 라벨 바로 뒤 빨간 "*". `PatternFieldRow`라는 이름으로 이 패턴 파일 전용 헬퍼임을
 * 표시 — 범용 컴포넌트로 승격은 다른 화면에서도 같은 구조가 재확인되면 그때 진행.
 */
function PatternFieldRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-[100px] shrink-0 items-center gap-[3px] text-[14px] leading-[1.5] text-mes-gray-130">
        {label}
        {required && <span className="text-mes-danger-60">*</span>}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
    </div>
  );
}

/**
 * 2026-08-05 신규, 2026-08-05 수정(사용자 재지적) — Patterns "리스트형 등록 모달"/
 * "검사 체크리스트 모달"의 "기본정보"/"품목등록"/"대상정보"/"검사항목" 구획 제목.
 * 옅은 회색 필(pill) 배경 안에 제목 텍스트가 들어가는 형태.
 *
 * 최초 구현은 `w-full`로 만들어서 형제 요소(버튼)와 flex 한 줄에 놓일 때 회색
 * 배경이 버튼 앞까지 넓게 늘어나 보였음 — 실제 Figma 고해상도 스크린샷을 다시
 * 대조해보니 "기본정보"/"대상정보"처럼 버튼이 없는 줄도, "품목등록"처럼 우측에
 * 버튼(리스트 조회/선택)이 같이 있는 줄도, 회색 필은 항상 텍스트 길이에 딱 맞는
 * hug-width였고 나머지 공간은 흰 배경 그대로였음. `w-full`→hug(`inline-flex`+
 * `self-start`)로 수정.
 * 실측: 높이 28px(hug), 좌우 padding 10px, 배경 Gray-20, 텍스트 13px semibold Gray-130.
 *
 * 2026-08-05 재수정 — `get_design_context`로 node 19414:94157/19098:64815("공정 등록"/
 * "작업지시 등록" 모달)을 직접 읽어보니 "기본정보" 필 배경이 실제로는
 * `var(--gray30,#e4e7ee)`(Gray-30)였음 — 스크린샷 육안 대조로는 Gray-20/30 차이가
 * 육안 구분이 거의 안 돼서(둘 다 아주 옅은 회색) 이전엔 Gray-20으로 오판했던 것.
 * 두 모달 인스턴스 모두 동일하게 Gray-30을 써서 확정 채택.
 *
 * 2026-08-06 재수정(사용자 직접 지적, 본인이 만든 Figma 디자인 기준) — "'기본정보'
 * 부분 그레이 배경이 화면 끝으로 가야 한다"고 명시적으로 정정받음. hug-width로
 * 바꿨던 판단이 이번엔 틀렸음 — 최초 구현(`w-full`)이 맞았던 것으로 원복.
 */
function PatternGroupHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-7 w-full shrink-0 items-center rounded-mes-control bg-mes-gray-30 px-2.5">
      <span className="whitespace-nowrap text-[13px] font-semibold leading-[1.5] text-mes-gray-130">
        {children}
      </span>
    </div>
  );
}

/**
 * 2026-08-05 신규 — 검사 체크리스트 모달의 O/△/X/− 4단 토글 버튼 그룹(Pallet 상태,
 * 표기사항, 포장상태, 상차밴딩 등 검사항목 행마다 반복). 아이콘은 이전 세션에서 이미
 * 확인된 기존 아이콘(IconQaO/IconQaTriangle/IconQaX)을 재사용 — 이 패턴을 위해 새
 * 아이콘을 만들지 않음. 실측(스크린샷 대조): 버튼 54x32px, gap 8px, 선택 시 배경
 * Primary-60 채움+흰 아이콘, 미선택 시 흰 배경+Gray-30 테두리+옅은 아이콘(Gray-40
 * 톤 — 정확한 hex는 벡터라 미실측, 판단값으로 text-mes-gray-40 사용).
 */
type QaToggleState = "o" | "triangle" | "x" | "dash";

function QaToggleGroup({
  value,
  onChange,
}: {
  value: QaToggleState;
  onChange: (next: QaToggleState) => void;
}) {
  const options: { key: QaToggleState; render: (selected: boolean) => React.ReactNode }[] = [
    { key: "o", render: () => <IconQaO size={16} /> },
    { key: "triangle", render: () => <IconQaTriangle size={16} /> },
    { key: "x", render: () => <IconQaX size={16} /> },
    { key: "dash", render: () => <span className="text-[16px] leading-none">-</span> },
  ];
  return (
    <div className="flex items-center gap-2">
      {options.map((opt) => {
        const selected = value === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            aria-pressed={selected}
            className={cn(
              "flex h-8 w-[54px] shrink-0 items-center justify-center rounded-mes-control-sm border transition-colors",
              selected
                ? "border-mes-primary-60 bg-mes-bg-brand text-white"
                : "border-mes-border-default bg-white text-mes-gray-40"
            )}
          >
            {opt.render(selected)}
          </button>
        );
      })}
    </div>
  );
}

/**
 * 2026-08-03 — 담당자 지시로 Section 내부 레이아웃을 전면 재구성.
 * "지금 컴포넌트들이 다 가로로 정렬되어있잖아? 세로 정렬로 바꾸기 / 세로로 바뀌면서
 * 남는 공간에 사이즈(패딩·마진 등) 적기 / 우측 빈 공간에 그 섹션의 하위 컴포넌트
 * 리스트를 두고 클릭하면 그 위치로 이동".
 *
 * - 기존 `grid grid-cols-4`(한 칸 ~222px) 구조를 세로 스택으로 교체 — 이전에 있던
 *   `wide` prop(컬럼보다 넓은 콘텐츠를 4칸 전체로 펼치던 안전장치)은 모든 행이 이제
 *   항상 전체 폭을 쓰므로 자연히 필요 없어져 제거.
 * - "사이즈 적기"는 컴포넌트마다 padding/margin 값을 일일이 손으로 재서 써넣는 대신
 *   `ResizeObserver`로 실제 렌더링된 W×H를 라이브로 측정해 라벨 옆에 표시 — 항상
 *   정확하고 컴포넌트가 바뀌어도 자동으로 맞음(판단값: padding/margin 자체는 컴포넌트
 *   내부 구조라 바깥에서 일반적으로 측정할 방법이 없어 제외, 필요하면 각 컴포넌트
 *   파일의 실측 주석 참고).
 *   2026-08-03 정정 — 담당자 지적: "실측값(ResizeObserver로 잰 렌더링 W×H)은 내부
 *   텍스트/콘텐츠에 따라 달라지는 값이라, 그 숫자만 보고 다른 컴포넌트와 같이 배치한
 *   실제 화면을 그리면 문제가 생길 수 있다". 맞는 지적 — 예를 들어 Button은 높이는
 *   고정(basic=40px)이지만 너비는 hug(내용 텍스트 길이에 따라 가변)라, 데모에 적힌
 *   "fillMain"이라는 우연한 라벨 텍스트로 잰 픽셀값을 마치 컴포넌트의 실제 스펙인 것
 *   처럼 보여주는 건 오히려 오해를 유발함. 그래서 자동 측정(`useMeasuredSize`/
 *   ResizeObserver)을 완전히 제거하고, 아래 `spec`(사람이 직접 적는, 내용과 무관하게
 *   고정인 값만) 하나로 통일 — 고정폭이 아닌 컴포넌트는 스펙에 "너비: hug(가변)"처럼
 *   명시적으로 적어서 가변이라는 사실 자체를 정보로 전달.
 * - "우측 하위 컴포넌트 리스트"는 페이지 우측의 비어있던 공간(왼쪽 사이드바+가운데
 *   960px 콘텐츠 바깥 여백)에 두 번째 사이드바(`RightRail`)로 구현 — 현재 스크롤 중인
 *   섹션의 Sample 라벨 목록을 보여주고 클릭하면 해당 Sample로 스크롤 이동. Section이
 *   렌더링될 때마다 자기 Sample 목록을 `SectionRegistryContext`에 등록해두면
 *   `RightRail`이 같은 렌더 패스 안에서 바로 읽어 씀(자세한 배선은 RightRail 정의 참고).
 */
const SectionRegistryContext = createContext<
  React.RefObject<Map<string, { id: string; label: string }[]>> | null
>(null);

/**
 * 2026-08-04 신규 — 페이지 분할 도입. `Section`은 모듈 최상단에 정의돼 있어 Home()의
 * 지역 상태(현재 라우트의 activeId)를 직접 못 읽는다 — 51곳의 호출부를 전부 손대는
 * 대신 컨텍스트 하나로 배선. `Section`은 자기 id가 현재 activeId와 다르면 `hidden`
 * 처리(언마운트 대신 CSS로 숨김 — Sample 내부 상태를 다른 섹션 이동 시에도 보존).
 */
const ActiveIdContext = createContext<string>("");

function Sample({
  id,
  label,
  spec,
  children,
}: {
  /** Section이 자식을 순회하며 주입(호출부에서 직접 넘길 필요 없음) — 우측 리스트의 앵커 타겟. */
  id?: string;
  label: string;
  /**
   * 2026-08-03 — "왜 텍스트로 주절주절 적냐, 색상:크기:R값:테두리 이렇게 우측에
   * 구조화해서 적어라" 지적 반영. 산문 문자열(`React.ReactNode`)이던 걸 항목별
   * key-value 배열로 바꾸고, 컴포넌트 우측에 별도 박스로 렌더링(위에 얹던 방식에서
   * 옆으로 변경). 값은 반드시 내용(children)과 무관하게 항상 참인 값만 — 높이 고정값,
   * 패딩(상/하/좌/우 각각), 아이콘 px, 아이콘↔텍스트 간격, radius, 색상 토큰명처럼
   * 해당 컴포넌트 파일의 실측 주석/Tailwind 클래스에 있는 값 그대로. 너비가 hug(내용에
   * 따라 가변)라 고정값이 없으면 "hug(가변)"라고 적어 가변이라는 사실 자체를 전달.
   * 126개 Sample 전부를 이번에 다 채우진 못했고, 담당자가 예로 든 곳부터 채움 —
   * 나머지는 후속 작업(AGENTS.md 참고).
   */
  spec?: { label: string; value: string }[];
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="flex w-full scroll-mt-24 items-start justify-between gap-6 py-7">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
        <span className="font-mono text-[13px] font-semibold leading-none text-mes-gray-100">
          {label}
        </span>
        <div className="flex w-fit min-w-0 items-center">{children}</div>
      </div>
      {spec && spec.length > 0 && (
        <div className="flex w-[280px] shrink-0 flex-col gap-1.5 rounded-mes-control border border-mes-border-default bg-mes-bg-subtle px-3 py-2.5">
          {spec.map((row) => (
            <Fragment key={row.label}>
              <div className="flex items-baseline justify-between gap-3 text-[12px] leading-[1.5]">
                <span className="shrink-0 text-mes-gray-60">{row.label}</span>
                <span className="text-right font-mono text-mes-gray-100">{row.value}</span>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({
  id,
  title,
  titleEn,
  badge,
  children,
}: {
  id: string;
  title: string;
  /** 2026-08-04 신규 — 담당자 지적: "ConfirmDialog/RadioChoiceDialog처럼 영어 코드
   *  이름을 그대로 화면 제목으로 쓰면, 이 페이지를 보는 담당자(디자이너, 비개발자)
   *  입장에서 알아보기 어렵다". 제목은 한국어를 메인으로 쓰고, 실제 코드 컴포넌트
   *  이름(파일명과 1:1 대응)은 그 아래 작은 회색 글씨로 병기 — 코드 참조가 필요할 때만
   *  보조적으로 쓰라는 의도. 선택 사항(없으면 영문 줄 자체를 안 그림). */
  titleEn?: string;
  /** 2026-07-31 신규 — "Tooltip (신규, 판단값 — CSS 경량 구현)"처럼 제목 문자열에
   *  경위 설명을 욱여넣던 걸 담당자가 "제목이 이게 뭐냐"고 지적해서 분리. 제목은
   *  컴포넌트명만 깔끔하게, 부가 설명은 옆의 작은 칩으로.
   *  2026-07-31 25차 — 칩 텍스트를 "판단값"→"임시"로, 색은 회색(bg-mes-bg-subtle)
   *  →파랑(`bg-mes-bg-brand-subtle-strong` + `text-mes-text-brand`, Badge
   *  컴포넌트의 blueLight 변형과 동일 톤)으로 변경. */
  badge?: string;
  children: React.ReactNode;
}) {
  const registryRef = useContext(SectionRegistryContext);
  const currentId = useContext(ActiveIdContext);
  const samplesWithIds: { id: string; label: string }[] = [];
  let sampleIndex = 0;
  const laidOutChildren = Children.map(children, (child) => {
    if (isValidElement(child) && child.type === Sample) {
      const sampleId = `${id}--s${sampleIndex}`;
      sampleIndex += 1;
      const label = (child.props as { label: string }).label;
      samplesWithIds.push({ id: sampleId, label });
      return cloneElement(child as React.ReactElement<{ id?: string }>, { id: sampleId });
    }
    return child;
  });
  registryRef?.current.set(id, samplesWithIds);

  return (
    <section
      id={id}
      className={cn(
        "flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8",
        currentId !== id && "hidden"
      )}
    >
      <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
        <h2 className="flex items-center gap-2 text-[17px] font-bold leading-tight text-mes-gray-130">
          {title}
          {badge && (
            <span className="rounded-full bg-mes-bg-brand-subtle-strong px-2 py-0.5 text-[11px] font-medium text-mes-text-brand">
              {badge}
            </span>
          )}
        </h2>
        {titleEn && <span className="text-[12px] leading-tight text-mes-gray-60">{titleEn}</span>}
      </div>
      <div className="flex w-full flex-col divide-y divide-mes-gray-30">{laidOutChildren}</div>
    </section>
  );
}

/**
 * 2026-08-03 신규 — 세로 정렬 전환으로 남은 페이지 우측 공간에 두 번째(보조) 사이드바.
 * 현재 스크롤 중인 섹션(좌측 사이드바와 같은 `activeId` 재사용)의 Sample 라벨 목록을
 * 보여주고, 클릭하면 그 Sample로 스크롤 이동(앵커 링크, `Sample`의 `id`와 매칭).
 * Foundation 톤 섹션(색상 팔레트/타이포 등)·Table·아이콘처럼 `Section` 헬퍼가 아니라
 * 순수 `<section>`을 직접 쓰는 곳은 레지스트리에 등록되지 않아 목록이 비는데, 그때는
 * 폭만 유지한 채 빈 채로 둬서 레이아웃이 덜컹거리지 않게 함.
 */
function RightRail({
  activeId,
  registryRef,
}: {
  activeId: string;
  registryRef: React.RefObject<Map<string, { id: string; label: string }[]>>;
}) {
  const items = registryRef.current.get(activeId) ?? [];
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[200px] shrink-0 overflow-y-auto px-4 py-6 xl:block">
      {items.length > 0 && (
        <>
          <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wide text-mes-gray-60">
            이 섹션 안에서
          </div>
          <nav className="flex flex-col gap-0.5">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="truncate rounded-md px-2 py-1 text-[12px] leading-[1.5] text-mes-gray-70 transition-colors hover:bg-mes-bg-subtle hover:text-mes-gray-130"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </aside>
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
      { name: "text-success", scale: "Success-60", usage: "성공 텍스트 (2026-08-04 신규, 실사용 사례 없음)" },
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
      { name: "border-success-subtle", scale: "Success-20", usage: "성공 배너 테두리 (2026-08-04 신규, 실사용 사례 없음)" },
      { name: "bg-success-subtle", scale: "Success-10", usage: "성공 배너 배경 (2026-08-04 신규, 실사용 사례 없음)" },
      { name: "icon-success", scale: "Success-50", usage: "성공 아이콘 (2026-08-04 신규, 실사용 사례 없음)" },
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

/** 2026-08-04 신규 — 데스크탑 Figma엔 없어 모바일에서 확정된 값을 그대로 가져옴(담당자 확인) */
const SUCCESS_PALETTE = [
  { step: "10", hex: "#EAF6EC" },
  { step: "20", hex: "#D8EEDD" },
  { step: "30", hex: "#A9DAB4" },
  { step: "40", hex: "#7EC88E" },
  { step: "50", hex: "#3FA654" },
  { step: "60", hex: "#228738" },
  { step: "70", hex: "#267337" },
  { step: "80", hex: "#285D33" },
  { step: "90", hex: "#1F4727" },
  { step: "100", hex: "#122B18" },
  { step: "110", hex: "#0E2012" },
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
  // 2026-08-03 — 담당자가 클라우드MES "Modal" 스펙 페이지(node 9873:82872, Type01/02)를
  // 전달해 보류 해제. Center Modal(화면 중앙)/Side Slide Panel(우측 고정) 둘 다 신규 구현.
  const [centerModalOpen, setCenterModalOpen] = useState(false);
  // 2026-08-05 신규 — Patterns "리스트형 등록 모달"의 예시 2개(공정 등록/작업지시 등록)
  // 각각 독립된 열림 상태. 폼 필드 자체는 이 페이지의 다른 폼 데모들과 동일하게
  // defaultValue(비제어)로만 구성 — 실제 저장 로직 없는 정적 시연이 목적.
  const [processRegisterModalOpen, setProcessRegisterModalOpen] = useState(false);
  const [workOrderRegisterModalOpen, setWorkOrderRegisterModalOpen] = useState(false);
  // 2026-08-06 신규 — 사용자가 실제 개발된 화면(품목 미등록 상태 스크린샷)을 제공하며
  // "리스트 정보가 없을 때 화면도 작성해달라" 요청 — 위 workOrderRegisterModalOpen과
  // 별도의 열림 상태로 분리(같은 모달의 "값이 채워진 데모" vs "빈 리스트 데모" 두
  // 상태를 동시에 시연하기 위함, 이 파일의 다른 Section들도 상태별로 별도 트리거를
  // 쓰는 관례를 그대로 따름).
  const [workOrderEmptyModalOpen, setWorkOrderEmptyModalOpen] = useState(false);
  // 2026-08-05 수정 — 작업지시 등록 모달의 "지시일" 필드가 원래는 plain Input이었는데,
  // Figma 스크린샷 재대조 결과 우측에 캘린더 아이콘이 있는 실제 DatePicker 트리거였음
  // (사용자가 "피그마 원본과 전혀 다르다"고 지적한 항목 중 하나) — 기존 DatePicker
  // 컴포넌트 데모(다른 Section)와 상태를 공유하면 서로 영향을 주므로 로컬로 분리.
  const [workOrderInspectionDate, setWorkOrderInspectionDate] = useState<Date | null>(
    new Date(2025, 9, 30)
  );
  // 2026-08-05 신규 — Patterns "검사 체크리스트 모달"(공정검사). QaToggleGroup 4개 행의
  // 선택 상태만 실제로 인터랙티브하게 관리(나머지 폼 필드는 다른 패턴과 동일하게
  // defaultValue 비제어) — Figma 스크린샷 기준 4개 행 전부 기본값 "o"(합격 표시).
  const [inspectionChecklistModalOpen, setInspectionChecklistModalOpen] = useState(false);
  const [qaChecklist, setQaChecklist] = useState<Record<string, QaToggleState>>({
    palletStatus: "o",
    labelStatus: "o",
    packagingStatus: "o",
    bandingStatus: "o",
  });
  // 2026-08-05 신규 — Patterns "그룹화 리스트 관리 화면"(메인 리스트) 미리보기 전용
  // 사이드바 접힘 상태. 사이드바 컴포넌트 자체 데모 섹션의 `sidebarCollapsed`와 상태를
  // 공유하면 서로 다른 두 섹션이 우연히 서로의 UI를 바꿔버리는 결합이 생겨서(한쪽에서
  // 접으면 다른 섹션도 접힘) 의도적으로 분리된 로컬 state를 새로 둠 — 나머지
  // (GroupQuery/Filter/QuickQuery/SearchInput/Table/DateRangePicker) 상태는 전부 이
  // 페이지의 기존 컴포넌트 데모가 이미 갖고 있는 state를 그대로 재사용(같은 화면
  // 구성요소를 다시 만들지 않기 위함 — 실제로 이 Figma 화면 자체가 그 데모들의
  // 근거였던 "생산실적/생산지시" 스크린샷과 동일 계열임).
  const [patternScreenSidebarCollapsed, setPatternScreenSidebarCollapsed] = useState(true);
  const [sideSlidePanelOpen, setSideSlidePanelOpen] = useState(false);
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

  // 2026-08-04 — "한 페이지에 스크롤 개길게 하지 말고 분할하자, 브레드크럼으로" 요청 반영.
  // 기존엔 스크롤 위치를 IntersectionObserver로 관찰해 activeId를 추적했는데(스크롤 스파이),
  // 이제 한 페이지에 전부 렌더링하는 구조 자체가 없어져서 필요 없음 — 현재 항목은 URL
  // (/foundations/xxx, /components/xxx)에서 그대로 파생.
  // 2026-08-04 — 담당자가 SEED 디자인 시스템 스크린샷을 보여주며 "그룹 구분이 애매하다,
  // 이런 카드 그리드 개요 화면을 만들자" 요청 — slug[1](구체적 항목)이 없는 그룹 루트
  // (예: /components)에서는 예전처럼 첫 항목을 바로 보여주는 대신, 그 그룹 전체를
  // 카드 그리드로 보여줌(`OverviewGrid`, 아래 참고). 그래서 activeId는 이제 "선택된
  // 항목이 없을 수도 있음"을 그대로 반영해 `string | undefined`.
  // 2026-08-04 — 담당자 지적 3가지 반영:
  // 1) "홈 가면 foundation 카드만 뜨고 컴포넌트는 안 뜬다" — 지금까지 "/"은 그냥
  //    "/foundations"로 리다이렉트했었음(Foundations만 보임). "/"(슬러그 없음)을
  //    별도 "home" 상태로 분리해 Foundation+Components 그리드를 같이 보여줌
  //    (`app/page.tsx`도 이 컴포넌트를 그대로 렌더링하도록 변경 — 리다이렉트 제거).
  // 2) 좌상단 "MES Design System" 타이틀 클릭 시 홈으로.
  // 3) "radius 보는 중인데 하단에 Components/예정이 같이 뜬다" — Foundation/Components
  //    "구분자" 배너(28px 큰 타이틀)가 activeGroup과 무관하게 항상 렌더링되고 있었던
  //    버그. activeGroup에 "home"을 추가하고, 각 배너·오버뷰 그리드·티어3/4 안내를
  //    자기 그룹(또는 home)일 때만 보이도록 조건 추가.
  const routeParams = useParams<{ slug?: string[] }>();
  const router = useRouter();
  const slug = routeParams.slug ?? [];
  // 2026-08-05 — Patterns 그룹 추가로 "components 아니면 무조건 foundations"이던
  // 이진 분기를 3분기로 확장.
  const activeGroup: "home" | "foundations" | "components" | "patterns" =
    slug.length === 0
      ? "home"
      : slug[0] === "components"
        ? "components"
        : slug[0] === "patterns"
          ? "patterns"
          : "foundations";
  const activeId: string | undefined = slug[1];
  // 2026-08-03 — 우측 서브 내비(RightRail)용 Section→Sample 목록 레지스트리. Section이
  // 렌더링될 때마다 자기 목록을 여기 채워넣고, RightRail이 같은 렌더 패스에서 바로 읽음
  // (자세한 배선 이유는 Section/RightRail 정의 쪽 주석 참고).
  const sectionRegistryRef = useRef<Map<string, { id: string; label: string }[]>>(new Map());

  // 2026-08-03 — 검색창 밑 콤보박스형 드롭다운에 쓸 결과 목록. 사이드바 자체는 안 건드림.
  const normalizedSidebarSearch = sidebarSearch.trim().toLowerCase();
  const searchResults = normalizedSidebarSearch
    ? ALL_SEARCHABLE_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(normalizedSidebarSearch) ||
          item.labelEn?.toLowerCase().includes(normalizedSidebarSearch)
      )
    : [];

  const breadcrumbInfo = activeId ? BREADCRUMB_MAP[activeId] : undefined;

  return (
    <SectionRegistryContext.Provider value={sectionRegistryRef}>
    <ActiveIdContext.Provider value={activeId ?? ""}>
    <div className="flex min-h-screen flex-col bg-mes-gray-10">
      <header className="sticky top-0 z-30 flex h-14 w-full shrink-0 items-center gap-8 border-b border-mes-gray-30 bg-white px-6">
        <NextLink href="/" className="shrink-0 text-[15px] font-bold text-mes-gray-130 hover:text-mes-text-brand">
          MES Design System
        </NextLink>
        <nav className="flex items-center gap-1">
          {TOP_NAV.map((tab) =>
            tab.firstId ? (
              <NextLink
                key={tab.key}
                href={`/${tab.key}`}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  activeGroup === tab.key
                    ? "bg-mes-bg-subtle text-mes-text-brand"
                    : "text-mes-gray-70 hover:bg-mes-bg-subtle hover:text-mes-gray-130"
                )}
              >
                {tab.label}
              </NextLink>
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
      </header>

      <div className="flex w-full flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-56px)] w-[240px] shrink-0 overflow-y-auto border-r border-mes-gray-30 bg-white px-3 py-6 lg:block">
          {/* 2026-08-04 — 담당자 요청: "우상단에 있는 검색을 좌측 리스트 최상단으로 두자".
              헤더에 있던 검색창을 사이드바 리스트 맨 위로 이동(기능은 그대로 — 사이드바
              자체는 필터링하지 않고, 검색창 밑에 콤보박스처럼 결과 드롭다운). */}
          <Popover
            open={searchResults.length > 0}
            onOpenChange={(next) => {
              if (!next) setSidebarSearch("");
            }}
          >
            <PopoverTrigger asChild>
              <div className="relative mb-4 flex items-center px-2">
                <Search className="pointer-events-none absolute left-4.5 size-3.5 text-mes-gray-50" />
                <input
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  placeholder="컴포넌트 이름 검색"
                  className="h-8 w-full rounded-mes-control border border-mes-border-default bg-white py-1.5 pl-8 pr-2 text-[13px] text-mes-text-default outline-none placeholder:text-mes-text-placeholder focus:border-mes-border-strong"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="max-h-[280px] w-[220px] overflow-y-auto p-1.5"
            >
              {searchResults.map((item) => (
                <NextLink
                  key={item.id}
                  href={idToHref(item.id)}
                  onClick={() => setSidebarSearch("")}
                  className="flex items-center gap-1.5 rounded-mes-control px-2 py-[5px] text-left text-[13px] leading-[1.5] text-mes-text-default outline-none transition-colors hover:bg-mes-bg-subtle"
                >
                  <TierBadge id={item.id} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{item.label}</span>
                    {item.labelEn && (
                      <span className="truncate text-[11px] leading-tight text-mes-gray-60">
                        {item.labelEn}
                      </span>
                    )}
                  </span>
                </NextLink>
              ))}
            </PopoverContent>
          </Popover>
          {SIDEBAR_GROUPS.map((group) => {
            const GroupIcon =
              group.title === "Foundations" ? Palette : group.title === "Components" ? Blocks : Hammer;
            return (
            <div key={group.title} className="mb-7">
              <div className="mb-2 flex items-center gap-2 border-b-2 border-mes-gray-90 px-2 pb-2 text-[18px] font-extrabold tracking-tight text-mes-gray-130">
                <GroupIcon className="size-[18px] shrink-0 text-mes-primary-60" />
                {group.title}
              </div>
              {group.nodes.length === 0 && (
                <p className="px-2 text-[12px] leading-[1.5] text-mes-gray-60">
                  티어3(59)·티어4(41) 미착수 — 자리만 미리 만들어둠
                </p>
              )}
              <nav className="flex flex-col gap-0.5">
                {group.nodes.map((node) =>
                  node.kind === "leaf" ? (
                    <NextLink
                      key={node.id}
                      href={idToHref(node.id)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                        activeId === node.id
                          ? "bg-mes-bg-subtle font-semibold text-mes-text-brand"
                          : "text-mes-gray-90 hover:bg-mes-bg-subtle hover:text-mes-gray-130"
                      )}
                    >
                      <TierBadge id={node.id} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate">{node.label}</span>
                        {node.labelEn && (
                          <span className="truncate text-[11px] font-normal leading-tight text-mes-gray-60">
                            {node.labelEn}
                          </span>
                        )}
                      </span>
                      {TEMP_BADGE_IDS.has(node.id) && (
                        <span className="shrink-0 rounded-full bg-mes-bg-brand-subtle-strong px-1.5 py-0 text-[10px] font-medium leading-[1.6] text-mes-text-brand">
                          임시
                        </span>
                      )}
                    </NextLink>
                  ) : (
                    <div key={node.label} className="flex flex-col gap-0.5">
                      <div className="flex flex-col px-2 py-1.5">
                        <span
                          className={cn(
                            "truncate text-[13px] font-semibold",
                            node.children.some((c) => c.id === activeId)
                              ? "text-mes-text-brand"
                              : "text-mes-gray-100"
                          )}
                        >
                          {node.label}
                        </span>
                        {node.labelEn && (
                          <span className="truncate text-[11px] font-normal leading-tight text-mes-gray-60">
                            {node.labelEn}
                          </span>
                        )}
                      </div>
                      {node.children.map((child) => (
                        <NextLink
                          key={child.id}
                          href={idToHref(child.id)}
                          className={cn(
                            "ml-3 flex items-center gap-1.5 rounded-md border-l border-mes-gray-30 py-1.5 pl-3 text-[13px] transition-colors",
                            activeId === child.id
                              ? "border-mes-primary-60 font-semibold text-mes-text-brand"
                              : "text-mes-gray-70 hover:text-mes-gray-130"
                          )}
                        >
                          <TierBadge id={child.id} />
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate">{child.label}</span>
                            {child.labelEn && (
                              <span className="truncate text-[11px] font-normal leading-tight text-mes-gray-60">
                                {child.labelEn}
                              </span>
                            )}
                          </span>
                          {TEMP_BADGE_IDS.has(child.id) && (
                            <span className="shrink-0 rounded-full bg-mes-bg-brand-subtle-strong px-1.5 py-0 text-[10px] font-medium leading-[1.6] text-mes-text-brand">
                              임시
                            </span>
                          )}
                        </NextLink>
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

          {/* 2026-08-04 신규 — 담당자 요청: "한 페이지에 스크롤 개길게 하지 말고 분할하자,
              브레드크럼으로". 페이지 분할(라우팅) 도입에 맞춰 현재 위치를 브레드크럼으로
              표시 — 디자인 시스템 자체에 이미 있는 Breadcrumb 컴포넌트(id="breadcrumb"
              데모와 동일)를 그대로 재사용, onClick에서 router.push로 실제 이동. */}
          <Breadcrumb
            className="w-full max-w-[960px]"
            items={
              activeGroup === "home"
                ? // 2026-08-04 — "/"(홈)은 Foundations/Components 그리드를 같이 보여주는
                  // 자체 랜딩이라 그룹 하나로 못 좁혀서 "Home" 단독 표시.
                  [{ label: "Home" }]
                : activeId
                ? [
                    { label: "Home", onClick: () => router.push("/") },
                    {
                      label:
                        activeGroup === "foundations"
                          ? "Foundations"
                          : activeGroup === "patterns"
                            ? "Patterns"
                            : "Components",
                      onClick: () => router.push(`/${activeGroup}`),
                    },
                    ...(breadcrumbInfo?.branch ? [{ label: breadcrumbInfo.branch.label }] : []),
                    { label: breadcrumbInfo?.label ?? activeId },
                  ]
                : [
                    // 2026-08-04 — 구체적 항목 없이 그룹 루트(/foundations, /components)만
                    // 보고 있을 때(=카드 그리드 개요 화면)는 마지막 항목이 곧 "현재 그룹"
                    // 자체라 3번째 크럼 없이 2단계로 표시.
                    { label: "Home", onClick: () => router.push("/") },
                    {
                      label:
                        activeGroup === "foundations"
                          ? "Foundations"
                          : activeGroup === "patterns"
                            ? "Patterns"
                            : "Components",
                    },
                  ]
            }
          />

          {/* 2026-08-03 신규 — 담당자 요청: 메인 화면에도 사이드바처럼 Foundation/
              Components 구분자를 두라고 함. 사이드바 그룹 제목과 짝을 맞춘 큰 이름표 +
              한 줄 설명.
              2026-08-03 47차 — "섹션 헤더(17px)보다 더 큰 크기로 확 나눠줘" 재지적 —
              개별 섹션 h2(17px)보다 뚜렷이 큰 28px + 두꺼운 좌측 바(border-l-8)로,
              섹션들의 상위 카테고리임이 한눈에 보이도록 확대.
              2026-08-04 — 버그 수정: 이 배너가 activeGroup과 무관하게 항상 렌더링되고
              있었음(Components를 보든 특정 항목을 보든 "Foundation" 배너가 항상 같이
              뜸) — "radius 보는 중인데 하단에 Components/예정이 같이 뜬다"는 담당자
              리포트의 원인. Foundations 페이지이거나 홈("/")일 때만 보이도록 조건 추가. */}
          {(activeGroup === "foundations" || activeGroup === "home") && (
            <>
              <div className="flex w-full max-w-[960px] flex-col gap-1.5 border-l-8 border-mes-primary-60 pl-5">
                <span className="flex items-center gap-2.5 text-[28px] font-extrabold leading-tight tracking-tight text-mes-gray-130">
                  <Palette className="size-7 shrink-0 text-mes-primary-60" />
                  Foundation
                </span>
                <p className="text-[13px] leading-[1.5] text-mes-gray-70">
                  화면을 구성하는 가장 기초적인 값들입니다 — 색상, 타이포그래피, 간격, radius,
                  그림자, 시맨틱 토큰. 아래 모든 컴포넌트는 이 값들을 조합해서 만들어집니다.
                </p>
              </div>
              {!activeId && <OverviewGrid nodes={FOUNDATION_NODES} />}
            </>
          )}

          <section id="color-palette" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "color-palette" && "hidden")}>
            <div>
              <h2 className="border-l-4 border-mes-primary-60 pl-3 text-[17px] font-bold leading-tight text-mes-gray-130">색상 팔레트</h2>
              <p className="mt-1 text-[12px] text-mes-gray-70">
                Gray/Primary/Danger/Yellow/Success 각 10~110 11단계. Alarm은 알람 리스트 전용 별도 색상군.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <PaletteRow title="Gray" colors={GRAY_PALETTE} />
              <PaletteRow title="Primary" colors={PRIMARY_PALETTE} />
              <PaletteRow title="Danger" colors={DANGER_PALETTE} />
              <PaletteRow title="Yellow" colors={YELLOW_PALETTE} />
              <PaletteRow
                title="Success"
                note="(2026-08-04 신규 — 데스크탑 Figma엔 없어 모바일 확정값 재사용, 담당자 확인)"
                colors={SUCCESS_PALETTE}
              />
              <PaletteRow title="Alarm severity" note="(알람 리스트 전용, 팔레트 아님)" colors={ALARM_PALETTE} />
            </div>
          </section>

          <section id="typography" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "typography" && "hidden")}>
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

          <section id="spacing" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "spacing" && "hidden")}>
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

          <section id="radius" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "radius" && "hidden")}>
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

          <section id="shadow" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "shadow" && "hidden")}>
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

          <section id="semantic-tokens" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "semantic-tokens" && "hidden")}>
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

          {/* 2026-08-03 — 담당자 정정: "foundation에 icon이 들어가있다"는 헤더 아이콘
              얘기가 아니라 "아이콘/Grid 섹션 자체를 Foundation으로 옮겨라"는 뜻이었음.
              체크리스트 레이어 기준 "토큰"(아이콘 에셋)·"레이아웃 유틸"(그리드) 항목이라
              색상/타이포 등 다른 토큰 섹션들과 같은 층위로 물리적으로 이동(원래 위치는
              Components 끝, Table 섹션 바로 앞이었음). */}
          <section id="icons" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "icons" && "hidden")}>
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

          <Section id="grid-container" title="Grid / Container" badge="임시">
            <Sample
              label="Grid · 3열"
              spec={[
                { label: "컬럼", value: "3열(columns prop, 2/3/4/6/12 중 선택)" },
                { label: "간격", value: "gap-2 = 8px(2/4/6/8 중 선택 가능)" },
                { label: "Container 폭", value: "max-w-[960px](데모 페이지 콘텐츠 폭 재사용)" },
              ]}
            >
              <Grid columns={3} gap={2} className="w-[300px]">
                <div className="rounded-mes-control bg-mes-bg-subtle p-3 text-center text-[12px]">1</div>
                <div className="rounded-mes-control bg-mes-bg-subtle p-3 text-center text-[12px]">2</div>
                <div className="rounded-mes-control bg-mes-bg-subtle p-3 text-center text-[12px]">3</div>
              </Grid>
            </Sample>
          </Section>

          {/* 2026-08-03(55차) 담당자 지적: "좌측 사이드바만 알파벳순 정렬하면 안 되고
              메인 본문도 같은 순서여야 하지 않냐, 안 그러니까 스크롤해도 사이드바가
              안 따라오는 것처럼 보인다" — 정확한 지적. 사이드바(`COMPONENT_NODES`)는
              `.sort()`로 티어 오름차순→라벨 알파벳순 정렬돼 있었는데, 이 아래 실제
              <Section>/<section> JSX는 여태 작업한 연대순 그대로였음 — 두 순서가
              달라서 스크롤할 때 사이드바 강조 항목이 리스트 위아래로 널뛰는 것처럼
              보였던 것(스크롤 스파이 로직 자체는 id 기반이라 버그 없음, 순서만 문제).
              아래 Components 섹션들의 물리적 배치 순서를 `COMPONENT_NODES` 정렬
              결과와 정확히 1:1로 맞춤(Button/Table처럼 브랜치로 묶인 항목은 내부
              순서 유지, 그룹 전체가 정렬된 위치에 놓임) — 앞으로 컴포넌트를 추가할
              때도 이 순서를 깨지 않도록 `COMPONENT_NODES`에 추가한 다음 정렬 결과
              위치에 맞게 물리적으로 배치할 것. */}
          {/* 2026-08-04 — 위 Foundation 배너와 같은 이유로 조건 추가(버그 수정): Components
              페이지이거나 홈("/")일 때만 보이도록. */}
          {(activeGroup === "components" || activeGroup === "home") && (
            <>
              <div className="flex w-full max-w-[960px] flex-col gap-1.5 border-l-8 border-mes-primary-60 pl-5">
                <span className="flex items-center gap-2.5 text-[28px] font-extrabold leading-tight tracking-tight text-mes-gray-130">
                  <Blocks className="size-7 shrink-0 text-mes-primary-60" />
                  Components
                </span>
                <p className="text-[13px] leading-[1.5] text-mes-gray-70">
                  Foundation 값들을 조합해 만든 실제 UI 조각들입니다 — 버튼 같은 기본 단위부터
                  테이블·알림 패널 같은 복합 컴포넌트까지.
                </p>
              </div>
              {!activeId && <OverviewGrid nodes={COMPONENT_NODES} />}
            </>
          )}

          {/* 2026-08-05 신규 — Patterns(3층) 구분자. Foundation/Components 배너와 같은
              구조(28px 굵은 제목 + 좌측 두꺼운 바 + 설명 한 줄) + 같은 버그 방지 조건
              (Patterns 페이지이거나 홈일 때만). */}
          {(activeGroup === "patterns" || activeGroup === "home") && (
            <>
              <div className="flex w-full max-w-[960px] flex-col gap-1.5 border-l-8 border-mes-primary-60 pl-5">
                <span className="flex items-center gap-2.5 text-[28px] font-extrabold leading-tight tracking-tight text-mes-gray-130">
                  <LayoutTemplate className="size-7 shrink-0 text-mes-primary-60" />
                  Patterns
                </span>
                <p className="text-[13px] leading-[1.5] text-mes-gray-70">
                  Components를 조합해 실제 화면/플로우로 완성한 것들입니다 — 등록 모달,
                  체크리스트, 리스트 관리 화면처럼 여러 컴포넌트가 함께 쓰이는 단위.
                </p>
              </div>
              {!activeId && <OverviewGrid nodes={PATTERN_NODES} />}
            </>
          )}

      <Section id="search-input" title="검색창" titleEn="SearchInput">
        <Sample
          label="값 없음(기본)"
          spec={[
            { label: "크기", value: "고정 200×32px(hug 아님)" },
            { label: "R값", value: "3px(control-sm)" },
            { label: "배경/테두리", value: "흰색 / 1px Gray-30(판단값)" },
            { label: "검색 아이콘", value: "16px, 좌padding 12px" },
            { label: "아이콘↔텍스트", value: "gap 8px" },
          ]}
        >
          <SearchInput value="" onChange={() => {}} />
        </Sample>
        <Sample
          label="값 있음(실측 — 배경색 강조)"
          spec={[
            { label: "배경/테두리", value: "Primary-20 / 1px Primary-30(실측)" },
            { label: "텍스트", value: "16px medium, Gray-130" },
            { label: "닫기(X) 버튼", value: "32×32 히트영역, 아이콘16px, 값 있을 때만 노출" },
          ]}
        >
          <SearchInput value="숯불치킨 뚜껑" onChange={() => {}} />
        </Sample>
        <Sample
          label="제어형(직접 입력해보기)"
          spec={[{ label: "동작", value: "값 유무에 따라 배경 자동 전환" }]}
        >
          <SearchInput value={searchInputValue} onChange={setSearchInputValue} />
        </Sample>
      </Section>

      <section id="group-query" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "group-query" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="flex items-center gap-2 text-[17px] font-bold leading-tight text-mes-gray-130">
            그룹 조회
            <span className="rounded-full bg-mes-bg-brand-subtle-strong px-2 py-0.5 text-[11px] font-medium text-mes-text-brand">임시</span>
          </h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">GroupQuery</span>
        </div>
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

      <Section id="radio" title="라디오 버튼" titleEn="Radio">
        <Sample
          label="Radio · Unselected"
          spec={[
            { label: "전체 크기", value: "24×24px" },
            { label: "바깥 원", value: "지름22px(인셋1px), 테두리1.5px(판단값)" },
            { label: "바깥 원 색", value: "Gray-50" },
            { label: "내부 점", value: "없음" },
            { label: "형태", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Radio name="demo-radio-unsel" />
        </Sample>
        <Sample
          label="Radio · Selected"
          spec={[
            { label: "바깥 원/내부 점", value: "Primary-60 단색" },
            { label: "내부 점 크기", value: "지름14px(인셋5px)" },
            { label: "형태", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Radio name="demo-radio-sel" defaultChecked />
        </Sample>
        <Sample
          label="Radio · Disabled(선택 안 됨)"
          spec={[
            { label: "바깥 원", value: "Gray-30" },
            { label: "채움", value: "Gray-20" },
            { label: "형태", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Radio name="demo-radio-disabled-off" disabled />
        </Sample>
        <Sample
          label="Radio · Disabled(선택됨, Figma에 없어 판단값)"
          spec={[
            { label: "내부 점", value: "Gray-50(판단값, Figma 근거 없음)" },
            { label: "형태", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Radio name="demo-radio-disabled-on" disabled defaultChecked />
        </Sample>
      </Section>

      <section id="center-modal" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "center-modal" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">모달 — 중앙</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">Center Modal</span>
        </div>
        <p className="text-[12px] text-mes-gray-70">
          화면 중앙에 뜨는 기본 팝업. 폭 960px 고정, 최대 높이 80vh — 헤더·푸터는 항상
          고정, 본문 콘텐츠가 넘치면 본문만 스크롤. 2026-08-03 클라우드MES "Modal"
          스펙 페이지(node 9873:82872 Type01)로 보류 해제 후 실측 반영.
        </p>
        <Button size="basic" onClick={() => setCenterModalOpen(true)}>
          Center Modal 열기
        </Button>
      </section>

      <CenterModal
        open={centerModalOpen}
        onOpenChange={setCenterModalOpen}
        title="모달 타이틀"
        onCancel={() => setCenterModalOpen(false)}
        onConfirm={() => setCenterModalOpen(false)}
      >
        <div className="flex w-full flex-col gap-2 rounded-[4px] bg-mes-gray-20 px-[30px] py-3">
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} className="text-[13px] text-mes-gray-70">
              콘텐츠 영역 — 항목 {i + 1} (본문만 스크롤되는지 확인용 더미 행)
            </div>
          ))}
        </div>
      </CenterModal>

      <section id="side-slide-panel" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "side-slide-panel" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">모달 — 사이드</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">Side Slide Panel</span>
        </div>
        <p className="text-[12px] text-mes-gray-70">
          화면 우측에 붙어 세로 전체를 채우는 패널. 폭 960px 기본(콘텐츠 타입에 따라
          변형 가능) — 헤더·푸터 고정, 본문만 스크롤은 Center Modal과 동일 규칙.
          같은 스펙 페이지(node 9873:82872 Type02)로 신규 구현.
        </p>
        <Button size="basic" onClick={() => setSideSlidePanelOpen(true)}>
          Side Slide Panel 열기
        </Button>
      </section>

      <SideSlidePanel
        open={sideSlidePanelOpen}
        onOpenChange={setSideSlidePanelOpen}
        title="모달 타이틀"
        onCancel={() => setSideSlidePanelOpen(false)}
        onConfirm={() => setSideSlidePanelOpen(false)}
      >
        <div className="flex w-full flex-col gap-2 rounded-[4px] bg-mes-gray-20 px-[30px] py-3">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="text-[13px] text-mes-gray-70">
              콘텐츠 스크롤 영역 — 항목 {i + 1} (모달창 높이에 따라 가변)
            </div>
          ))}
        </div>
      </SideSlidePanel>

      <Section id="badge" title="뱃지" titleEn="Badge">
        <Sample
          label="Badge · blue"
          spec={[
            { label: "높이", value: "22px" },
            { label: "패딩", value: "좌우8px/상하3px" },
            { label: "R값", value: "2px(control-xs)" },
            { label: "폰트", value: "12px semibold" },
            { label: "배경/텍스트", value: "Primary-60 / 흰색" },
            { label: "너비", value: "hug(가변)" },
          ]}
        >
          <Badge variant="blue">출하중</Badge>
        </Sample>
        <Sample
          label="Badge · red"
          spec={[
            { label: "규격", value: "blue와 동일(22px/8px·3px/2px)" },
            { label: "배경/텍스트", value: "Danger-60 / 흰색" },
            { label: "R값", value: "2px(control-xs)" },
          ]}
        >
          <Badge variant="red">취소요청</Badge>
        </Sample>
        <Sample
          label="Badge · grayFill(구 이름 orange)"
          spec={[
            { label: "규격", value: "blue와 동일" },
            { label: "배경/텍스트", value: "Gray-40 / Gray-110" },
            { label: "R값", value: "2px(control-xs)" },
          ]}
        >
          <Badge variant="grayFill">대기</Badge>
        </Sample>
        <Sample
          label="Badge · blue2(구 이름 yellow, blue와 값 동일)"
          spec={[
            { label: "규격", value: "blue와 동일" },
            { label: "배경/텍스트", value: "Primary-60 / 흰색(blue와 동일값)" },
            { label: "R값", value: "2px(control-xs)" },
          ]}
        >
          <Badge variant="blue2">승인중</Badge>
        </Sample>
        <Sample
          label="Badge · gray(배경 없음)"
          spec={[
            { label: "규격", value: "blue와 동일" },
            { label: "배경", value: "없음(투명)" },
            { label: "텍스트", value: "Gray-90(secondary)" },
            { label: "R값", value: "2px(control-xs)" },
          ]}
        >
          <Badge variant="gray">완료</Badge>
        </Sample>
        <Sample
          label="Badge · blueLight(구 이름 variant6)"
          spec={[
            { label: "규격", value: "blue와 동일" },
            { label: "배경/텍스트", value: "Primary-20 / Primary-60" },
            { label: "R값", value: "2px(control-xs)" },
          ]}
        >
          <Badge variant="blueLight">완료</Badge>
        </Sample>
        <Sample
          label="Badge · blueOutline(구 이름 variant7)"
          spec={[
            { label: "높이/R값", value: "22px / 2px(control-xs)" },
            { label: "패딩", value: "좌우9px/상하1px(테두리 두께 보정)" },
            { label: "배경/테두리", value: "흰색 / 1px Primary-60" },
            { label: "텍스트", value: "Primary-60" },
          ]}
        >
          <Badge variant="blueOutline">완료</Badge>
        </Sample>
      </Section>

      <Section id="button-size" title="버튼 — 사이즈" titleEn="Button — Size">
        <Sample
          label="Button · Basic · Default"
          spec={[
            { label: "높이", value: "40px(hug), R값4px(control)" },
            { label: "좌우 패딩", value: "16px" },
            { label: "폰트", value: "15px semibold" },
            { label: "너비", value: "hug(가변)" },
          ]}
        >
          <Button size="basic">Basic 버튼</Button>
        </Sample>
        <Sample
          label="Button · Small · Default"
          spec={[
            { label: "높이", value: "32px(hug), R값4px(control)" },
            { label: "좌우 패딩", value: "10px" },
            { label: "폰트", value: "14px semibold" },
          ]}
        >
          <Button size="small">Small 버튼</Button>
        </Sample>
        <Sample
          label="Button · Xsmall · Default"
          spec={[
            { label: "높이", value: "22px(hug), R값2px(control-xs)" },
            { label: "좌우 패딩", value: "8px" },
            { label: "폰트", value: "12px semibold" },
          ]}
        >
          <Button size="xsmall">Xsmall 버튼</Button>
        </Sample>
        <Sample
          label="Button · Basic · Disabled"
          spec={[
            { label: "배경/텍스트", value: "Gray-40 / Gray-60" },
            { label: "처리", value: "opacity 아님, variant 무관 항상 동일 외형(Figma 그대로)" },
          ]}
        >
          <Button size="basic" disabled>
            비활성
          </Button>
        </Sample>
      </Section>

      <Section id="button-icon" title="버튼 — 아이콘" titleEn="Button — Icon">
        <Sample
          label="Button · StartIcon"
          spec={[
            { label: "아이콘 크기", value: "16px(데모 지정값, 고정 아님)" },
            { label: "아이콘↔텍스트", value: "6px(gap-1.5, flex gap)" },
            { label: "좌측(테두리→아이콘)", value: "16px(basic px-4)" },
            { label: "우측(텍스트→테두리)", value: "16px(basic px-4)" },
            { label: "높이", value: "40px, 수직 중앙 정렬" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" startIcon={<Plus size={16} />}>
            아이콘 왼쪽
          </Button>
        </Sample>
        <Sample
          label="Button · EndIcon"
          spec={[
            { label: "아이콘 크기", value: "16px(데모 지정값, 고정 아님)" },
            { label: "텍스트↔아이콘", value: "6px(gap-1.5, flex gap)" },
            { label: "좌측(텍스트→테두리)", value: "16px(basic px-4)" },
            { label: "우측(테두리→아이콘)", value: "16px(basic px-4)" },
            { label: "높이", value: "40px, 수직 중앙 정렬" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" endIcon={<Plus size={16} />}>
            아이콘 오른쪽
          </Button>
        </Sample>
        <Sample
          label="Button · Start+EndIcon"
          spec={[
            { label: "아이콘 크기", value: "16px(양쪽 동일, 데모 지정값)" },
            { label: "아이콘↔텍스트", value: "각 6px(gap-1.5, 아이콘·텍스트·아이콘 사이 동일)" },
            { label: "좌우(테두리→아이콘)", value: "16px(basic px-4)" },
            { label: "높이", value: "40px, 수직 중앙 정렬" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button
            size="basic"
            startIcon={<Plus size={16} />}
            endIcon={<Plus size={16} />}
          >
            아이콘 양쪽
          </Button>
        </Sample>
      </Section>

      <Section id="button-color" title="버튼 — 컬러" titleEn="Button — Color">
        <Sample
          label="Button · fillMain"
          spec={[
            { label: "배경", value: "Primary-60" },
            { label: "hover", value: "Primary-70" },
            { label: "텍스트", value: "흰색" },
            { label: "테두리", value: "없음" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="fillMain">
            fillMain
          </Button>
        </Sample>
        <Sample
          label="Button · fillGray"
          spec={[
            { label: "배경", value: "Gray-40" },
            { label: "hover", value: "Gray-50" },
            { label: "텍스트", value: "Gray-130" },
            { label: "테두리", value: "없음" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="fillGray">
            fillGray
          </Button>
        </Sample>
        <Sample
          label="Button · fillBlack"
          spec={[
            { label: "배경", value: "Gray-130" },
            { label: "hover", value: "Gray-110" },
            { label: "텍스트", value: "흰색" },
            { label: "테두리", value: "없음" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="fillBlack">
            fillBlack
          </Button>
        </Sample>
        <Sample
          label="Button · fillRed"
          spec={[
            { label: "배경", value: "Danger-60" },
            { label: "hover", value: "Danger-70" },
            { label: "텍스트", value: "흰색" },
            { label: "테두리", value: "없음" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="fillRed">
            fillRed
          </Button>
        </Sample>
        <Sample
          label="Button · lineMain"
          spec={[
            { label: "배경", value: "흰색" },
            { label: "hover", value: "Primary-10" },
            { label: "텍스트", value: "Primary-60" },
            { label: "테두리", value: "1px Primary-60" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="lineMain">
            lineMain
          </Button>
        </Sample>
        <Sample
          label="Button · lineBlacktxt"
          spec={[
            { label: "배경", value: "흰색" },
            { label: "hover", value: "Gray-10" },
            { label: "텍스트", value: "Gray-130" },
            { label: "테두리", value: "1px Gray-30" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="lineBlacktxt">
            lineBlacktxt
          </Button>
        </Sample>
        <Sample
          label="Button · opacityMain"
          spec={[
            { label: "배경", value: "Primary-20(옅은 브랜드)" },
            { label: "hover", value: "임의값(팔레트 스텝 밖)" },
            { label: "텍스트", value: "Primary-60" },
            { label: "테두리", value: "없음" },
            { label: "크기", value: "높이 40px · 좌우패딩 16px · 너비 hug(가변)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <Button size="basic" variant="opacityMain">
            opacityMain
          </Button>
        </Sample>
      </Section>

      {/* 2026-07-31 신규 — 티어2 컴포넌트 1차 배치(Figma 디자인 없어서 기존 토큰
          체계 기반 판단값으로 구현, 각 컴포넌트 파일 주석 참고).
          2026-08-03(55차) — 물리적 배치 순서는 더 이상 "개념적으로 가까운 이웃"
          기준이 아니라 사이드바와 동일한 티어 오름차순 → 알파벳순 정렬을 그대로
          따름(아래 참고). */}
      <section id="quick-query" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "quick-query" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">빠른 조회</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">QuickQuery</span>
        </div>
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

      <section id="sidebar" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "sidebar" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">사이드바</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">Sidebar / SNB</span>
        </div>
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

      <section id="page-top-tab-item" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "page-top-tab-item" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">상단 탭</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">PageTopTabItem</span>
        </div>
        <p className="text-[12px] text-mes-gray-70">default/hover/active 3종.</p>
        <div className="flex">
          <PageTopTabItem label="생산계획(일) 리스트" active />
          <PageTopTabItem label="판매관리 리스트" />
          <PageTopTabItem label="품질검사 이력" bookmarked />
        </div>
      </section>

      <Section id="radio-choice-dialog" title="선택형 확인 모달" titleEn="RadioChoiceDialog">
        <Sample
          label="RadioChoiceDialog · 열기"
          spec={[
            { label: "전체", value: "고정폭480px, R값16px, 그림자 0 0 24px rgba(0,0,0,.2)" },
            { label: "헤더", value: "높이52px(ConfirmDialog와 동일 패턴)" },
            { label: "옵션 gap", value: "세로20px, 라디오↔텍스트 gap 6px" },
            { label: "경고 배너", value: "배경Gray-20, R값4px, 패딩좌우30px/상하16px" },
            { label: "푸터 버튼", value: "고정폭160px/높이40px, gap 10px" },
          ]}
        >
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

      <Section id="select" title="셀렉트" titleEn="Select">
        <Sample
          label="Select · Default(placeholder)"
          spec={[
            { label: "트리거 높이", value: "32px(h-8)" },
            { label: "좌우 패딩", value: "10px" },
            { label: "테두리", value: "1px Gray-30" },
            { label: "R값", value: "4px(control)" },
            { label: "폰트", value: "14px" },
            { label: "placeholder 텍스트", value: "Gray-60" },
            { label: "패널 테두리", value: "1px Gray-30" },
            { label: "패널 내부 패딩", value: "8px" },
            { label: "패널 R값", value: "8px(판단값)" },
            { label: "항목 pitch", value: "30px, 좌우패딩 8px" },
          ]}
        >
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
        <Sample
          label="Select · Default(selected)"
          spec={[
            { label: "트리거 규격", value: "Default와 동일(32px/10px/4px)" },
            { label: "선택 텍스트", value: "Gray-130" },
            { label: "open 시 테두리", value: "Gray-130" },
            { label: "R값", value: "4px(control, Default와 동일)" },
          ]}
        >
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
        <Sample
          label="Select · Small"
          spec={[
            { label: "트리거 높이", value: "22px" },
            { label: "좌우 패딩", value: "6px" },
            { label: "R값", value: "3px(control-sm)" },
            { label: "폰트", value: "13px" },
          ]}
        >
          <Select>
            <SelectTrigger size="small" className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample
          label="Select · Disabled"
          spec={[
            { label: "테두리", value: "Gray-30" },
            { label: "배경", value: "Gray-30(테두리와 동일)" },
            { label: "텍스트", value: "Gray-70" },
            { label: "R값", value: "4px(control, Default와 동일)" },
          ]}
        >
          <Select disabled>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="내용 입력" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">옵션 1</SelectItem>
            </SelectContent>
          </Select>
        </Sample>
        <Sample
          label="Select · 커스텀 아이콘(꺾쇠 대신)"
          spec={[
            { label: "트리거 규격", value: "Default와 동일(32px/10px/4px)" },
            { label: "아이콘 크기", value: "14px(판단값)" },
            { label: "아이콘 투명도", value: "80%(opacity-80)" },
            { label: "R값", value: "4px(control, Default와 동일)" },
          ]}
        >
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

      <section id="notice-banner" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "notice-banner" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">안내 배너</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">NoticeBanner</span>
        </div>
        <p className="text-[12px] text-mes-gray-70">
          ConfirmDialog 안내 배너로도, 독립적으로도 사용 가능.
        </p>
        <NoticeBanner
          message="담당자의 조가 설정되지 않았습니다. 조를 설정하면 LOT 일련번호에 반영됩니다."
          linkLabel="조설정 바로가기"
          className="max-w-[420px]"
        />
      </section>

      <section id="alarm-list-item" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "alarm-list-item" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">알람 리스트 항목</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">AlarmListItem</span>
        </div>
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

      <section id="notification-panel" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "notification-panel" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">알림 패널</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">NotificationPanel</span>
        </div>
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

      <Section id="input" title="인풋 — 기본" titleEn="Input — Default">
        <Sample
          label="Input · Default(placeholder)"
          spec={[
            { label: "높이", value: "32px(h-8) 고정" },
            { label: "좌우 패딩", value: "10px(px-[10px])" },
            { label: "테두리", value: "1px Gray-30(border-default)" },
            { label: "R값", value: "4px(control)" },
            { label: "폰트", value: "14px" },
            { label: "너비", value: "100% hug(데모는 200px로 제한)" },
          ]}
        >
          <Input placeholder="내용 입력" className="w-[200px]" />
        </Sample>
        <Sample
          label="Input · Default(filled)"
          spec={[{ label: "패딩/테두리/R값", value: "placeholder와 동일" }, { label: "입력값 색", value: "Gray-130(text-default)" }]}
        >
          <Input defaultValue="내용" className="w-[200px]" />
        </Sample>
        <Sample
          label="Input · Readonly"
          spec={[
            { label: "패딩/테두리/R값", value: "동일" },
            { label: "배경만 변경", value: "Gray-20(bg-subtle)" },
          ]}
        >
          <Input placeholder="내용 입력" readOnly defaultValue="내용" className="w-[200px]" />
        </Sample>
        <Sample
          label="Input · Disabled"
          spec={[
            { label: "배경", value: "Gray-30(bg-disabled, 테두리색과 같아 경계가 안 보임)" },
            { label: "텍스트", value: "Gray-70(text-disabled)" },
            { label: "커서", value: "not-allowed" },
          ]}
        >
          <Input placeholder="내용 입력" disabled className="w-[200px]" />
        </Sample>
        <Sample
          label="Input · Small(placeholder)"
          spec={[
            { label: "높이", value: "22px(h-[22px]) 고정" },
            { label: "좌우 패딩", value: "6px(px-[6px])" },
            { label: "R값", value: "control-sm(default의 4px보다 작음)" },
            { label: "폰트", value: "13px" },
            { label: "참고", value: "Figma 원본에 small용 focus 상태 자체가 없음(디자인 누락, 임의 추가 안 함)" },
          ]}
        >
          <Input size="small" placeholder="내용 입력" className="w-[200px]" />
        </Sample>
        <Sample
          label="Input · Small(filled)"
          spec={[{ label: "패딩/R값/폰트", value: "small placeholder와 동일" }]}
        >
          <Input size="small" defaultValue="내용" className="w-[200px]" />
        </Sample>
      </Section>

      <Section id="number-input" title="인풋 — 숫자" titleEn="Input — Number" badge="임시">
        <Sample
          label="NumberInput · 기본"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "텍스트박스", value: "Input 실측 스타일 재사용(inputVariants)" },
            { label: "증감 버튼", value: "폭24px(w-6), 상하 분할, 아이콘10px" },
            { label: "버튼 테두리", value: "1px Gray-30, 텍스트박스와 이어붙임(border-r-0)" },
            { label: "R값", value: "4px(control, Input과 동일)" },
          ]}
        >
          <NumberInput defaultValue={10} min={0} max={999} />
        </Sample>
      </Section>

      <Section id="password-input" title="인풋 — 비밀번호" titleEn="Input — Password" badge="임시">
        <Sample
          label="PasswordInput · 보기/숨기기 토글"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "규격", value: "Input 실측 스타일 재사용(inputVariants)" },
            { label: "토글 아이콘", value: "16px, 우측 인셋8px(right-2)" },
            { label: "우측 여백", value: "아이콘 자리만큼 pr-8 추가" },
            { label: "R값", value: "4px(control, Input과 동일)" },
          ]}
        >
          <PasswordInput defaultValue="password123" className="w-[200px]" />
        </Sample>
      </Section>

      <Section id="progress" title="진행률" titleEn="Progress Bar">
        <Sample
          label="Progress · 78%"
          spec={[
            { label: "전체 높이", value: "30px, 좌우패딩6px" },
            { label: "트랙", value: "높이6px, 배경Gray-40, full-round" },
            { label: "채움색", value: "Gray-100" },
            { label: "트랙↔라벨 gap", value: "2px" },
            { label: "라벨", value: "고정폭44px, 14px, Gray-130" },
          ]}
        >
          <Progress value={78} className="w-[160px]" />
        </Sample>
        <Sample
          label="Progress · 0%"
          spec={[{ label: "규격", value: "78%와 동일, 채움 너비만 0%" }]}
        >
          <Progress value={0} className="w-[160px]" />
        </Sample>
        <Sample
          label="Progress · 50%"
          spec={[{ label: "규격", value: "78%와 동일, 채움 너비만 50%" }]}
        >
          <Progress value={50} className="w-[160px]" />
        </Sample>
        <Sample
          label="Progress · 100%"
          spec={[{ label: "규격", value: "78%와 동일, 채움이 트랙 전체" }]}
        >
          <Progress value={100} className="w-[160px]" />
        </Sample>
      </Section>

      <Section id="checkbox" title="체크박스" titleEn="Checkbox">
        <Sample
          label="Checkbox · Unchecked"
          spec={[
            { label: "전체 크기", value: "24×24px" },
            { label: "박스", value: "22×22px(인셋1px), R값3px(control-sm)" },
            { label: "배경/테두리", value: "흰색 / 1px Gray-40" },
          ]}
        >
          <Checkbox />
        </Sample>
        <Sample
          label="Checkbox · Checked · main"
          spec={[
            { label: "배경", value: "Primary-60" },
            { label: "체크마크", value: "흰색, 14px(size-3.5, 판단값)" },
            { label: "R값", value: "3px(control-sm)" },
          ]}
        >
          <Checkbox defaultChecked color="main" />
        </Sample>
        <Sample
          label="Checkbox · Checked · gray"
          spec={[
            { label: "배경", value: "Gray-50" },
            { label: "R값", value: "3px(control-sm)" },
          ]}
        >
          <Checkbox defaultChecked color="gray" />
        </Sample>
        <Sample
          label="Checkbox · Checked · black"
          spec={[
            { label: "배경", value: "Gray-130(bg-strong)" },
            { label: "R값", value: "3px(control-sm)" },
          ]}
        >
          <Checkbox defaultChecked color="black" />
        </Sample>
        <Sample
          label="Checkbox · Disabled(판단값)"
          spec={[
            { label: "테두리/배경", value: "Gray-30(판단값, Figma에 disabled 자체 없음)" },
            { label: "R값", value: "3px(control-sm)" },
          ]}
        >
          <Checkbox disabled />
        </Sample>
        <Sample
          label="Checkbox · Disabled+Checked(판단값)"
          spec={[
            { label: "처리", value: "위 Disabled와 동일 판단값" },
            { label: "체크마크", value: "Gray-60(판단값)" },
            { label: "R값", value: "3px(control-sm)" },
          ]}
        >
          <Checkbox disabled defaultChecked />
        </Sample>
      </Section>

      <Section id="combobox" title="콤보박스" titleEn="Combobox">
        <Sample
          label="Combobox · Default(제어형, 검색 가능)"
          spec={[
            { label: "트리거 규격", value: "Select와 동일(재사용, 32px/10px/4px)" },
            { label: "검색창", value: "높이26px, R값4px, 테두리1px Gray-30" },
            { label: "검색 아이콘", value: "16px, 좌인셋8px" },
            { label: "패널", value: "테두리1px Gray-30, R값8px(판단값), 그림자 0 2px 8px rgba(0,0,0,.12)" },
            { label: "항목", value: "13px/150%, 좌우패딩8px" },
            { label: "selected 배경", value: "#E8F0FE(실측)" },
          ]}
        >
          <Combobox
            options={shiftOptions}
            value={comboValue}
            onValueChange={setComboValue}
            placeholder="근무조 선택"
            searchPlaceholder="근무조 검색"
            className="w-[200px]"
          />
        </Sample>
        <Sample
          label="Combobox · Default(비제어, 초기값 있음)"
          spec={[{ label: "규격", value: "위 Default와 동일" }]}
        >
          <Combobox
            options={shiftOptions}
            defaultValue="night"
            searchPlaceholder="근무조 검색"
            className="w-[200px]"
          />
        </Sample>
        <Sample
          label="Combobox · Small(비제어, 초기값 있음)"
          spec={[
            { label: "트리거", value: "Select Small과 동일(22px/6px/3px)" },
          ]}
        >
          <Combobox
            options={shiftOptions}
            defaultValue="bom1"
            searchPlaceholder="BOM 검색"
            size="small"
            className="w-[200px]"
          />
        </Sample>
        <Sample
          label="Combobox · Small · Disabled"
          spec={[{ label: "처리", value: "Select Disabled와 동일 패턴" }]}
        >
          <Combobox
            options={shiftOptions}
            defaultValue="bom1"
            size="small"
            disabled
            className="w-[200px]"
          />
        </Sample>
        <Sample
          label="Combobox · Default · Disabled"
          spec={[{ label: "처리", value: "Select Disabled와 동일 패턴" }]}
        >
          <Combobox
            options={shiftOptions}
            placeholder="내용 입력"
            disabled
            className="w-[200px]"
          />
        </Sample>
        <Sample
          label="Combobox · 커스텀 아이콘(꺾쇠 대신)"
          spec={[{ label: "아이콘", value: "14px(판단값), opacity 80%" }]}
        >
          <Combobox
            options={shiftOptions}
            placeholder="정렬 기준"
            searchPlaceholder="검색"
            icon={<IconFilter size={14} className="shrink-0 opacity-80" />}
            className="w-[200px]"
          />
        </Sample>
      </Section>

      <Section id="tag" title="태그" titleEn="Tag">
        <Sample
          label="Tag · main · start+endIcon(실측 그대로)"
          spec={[
            { label: "높이", value: "22px, R값2px(control-xs)" },
            { label: "패딩", value: "좌우8px/상하3px" },
            { label: "요소 간 gap", value: "4px" },
            { label: "폰트", value: "12px semibold, 흰색 고정" },
            { label: "배경", value: "Primary-60(fill-main)" },
          ]}
        >
          <Tag color="main" startIcon={<X className="size-3" />} endIcon={<X className="size-3" />}>
            태그 텍스트
          </Tag>
        </Sample>
        <Sample
          label="Tag · gray · endIcon만(실사용 예시)"
          spec={[
            { label: "규격", value: "main과 동일" },
            { label: "배경", value: "Gray-90(fill-gray)" },
          ]}
        >
          <Tag color="gray" endIcon={<X className="size-3" />}>태그 텍스트</Tag>
        </Sample>
        <Sample
          label="Tag · red · 아이콘 없음"
          spec={[
            { label: "규격", value: "main과 동일" },
            { label: "배경", value: "Danger-60(fill-red)" },
          ]}
        >
          <Tag color="red">태그 텍스트</Tag>
        </Sample>
      </Section>

      <section id="table-parts" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-6 border-b border-mes-gray-30 pb-8", activeId !== "table-parts" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">테이블 — 분리 데모</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">Table — Parts</span>
        </div>
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
      <section id="table-full" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "table-full" && "hidden")}>
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
          테이블 · 합본 데모(Table — Full) — 클릭해서 접기/펼치기
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
      <Section id="toast" title="토스트" titleEn="Toast">
        <Sample
          label="Toast · red"
          spec={[
            { label: "높이", value: "46px, 내부패딩16px" },
            { label: "배경/테두리", value: "#F04452(Danger-60) / rgba(255,108,108,.2)" },
            { label: "아이콘↔텍스트", value: "gap 8px" },
            { label: "아이콘", value: "22px, 흰색" },
            { label: "닫기 아이콘", value: "16px" },
            { label: "R값", value: "rounded-full(캡슐)" },
          ]}
        >
          <Toast variant="red" message="필수 항목을 입력해주세요." onClose={() => {}} />
        </Sample>
        <Sample
          label="Toast · blue"
          spec={[
            { label: "규격", value: "red와 동일(46px/16px패딩/8px gap)" },
            { label: "배경/테두리", value: "#156BE9(원본값) / rgba(26,61,112,.6)" },
            { label: "닫기 아이콘", value: "18px(red와 다름, 실측 그대로)" },
            { label: "R값", value: "rounded-full(캡슐, red와 동일)" },
          ]}
        >
          <Toast variant="blue" message="선택한 n건이 합격 처리되었습니다." onClose={() => {}} />
        </Sample>
      </Section>

      <section id="filter" className={cn("flex w-full max-w-[960px] scroll-mt-20 flex-col gap-4 border-b border-mes-gray-30 pb-8", activeId !== "filter" && "hidden")}>
        <div className="flex flex-col gap-0.5 border-l-4 border-mes-primary-60 pl-3">
          <h2 className="text-[17px] font-bold leading-tight text-mes-gray-130">필터</h2>
          <span className="text-[12px] leading-tight text-mes-gray-60">Filter</span>
        </div>
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

      <Section id="confirm-dialog" title="확인 모달" titleEn="ConfirmDialog">
        <Sample
          label="ConfirmDialog · error 톤(기본), 확인 1버튼"
          spec={[
            { label: "전체", value: "흰배경, R값12px, 그림자 0 4px 16px rgba(0,0,0,.2)" },
            { label: "헤더", value: "높이52px, 하단테두리1px Gray-30, 제목18px Bold" },
            { label: "본문 아이콘", value: "44px, Danger-60(error 톤)" },
            { label: "본문↔아이콘 gap", value: "20px" },
            { label: "푸터", value: "패딩20px, 버튼높이40px, 1버튼일 땐 flex-1" },
          ]}
        >
          <Button size="basic" onClick={() => setDialogOpen(true)}>
            삭제 시도
          </Button>
        </Sample>
        <Sample
          label="ConfirmDialog · warning 톤, 확인+취소 2버튼"
          spec={[
            { label: "규격", value: "error 톤과 동일 레이아웃" },
            { label: "본문 아이콘 색", value: "Yellow-50(#F2A406)" },
            { label: "버튼", value: "취소=fillGray, 확인=fillBlack" },
          ]}
        >
          <Button size="basic" onClick={() => setWarningDialogOpen(true)}>
            반품 시도
          </Button>
        </Sample>
        <Sample
          label="ConfirmDialog · info 톤, 확인 1버튼"
          spec={[
            { label: "규격", value: "error 톤과 동일 레이아웃" },
            { label: "본문 아이콘 색", value: "Primary-60" },
          ]}
        >
          <Button size="basic" onClick={() => setInfoDialogOpen(true)}>
            삭제 완료 알림
          </Button>
        </Sample>
        <Sample
          label="ConfirmDialog · error 톤 + 안내 배너(링크 포함)"
          spec={[
            { label: "배너↔푸터 gap", value: "20px(담당자 확정값)" },
            { label: "배너 스타일", value: "판단값(devtools 응답 실패로 육안 대조)" },
          ]}
        >
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

      <Section id="user-account-menu" title="계정 메뉴" titleEn="UserAccountMenu" badge="임시">
        <Sample
          label="UserAccountMenu · 클릭해서 열기"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(DropdownMenu 재사용, 판단값)" },
            { label: "트리거", value: "패딩좌우8px/상하6px, 13px medium" },
            { label: "아바타 아이콘", value: "20px(IconUserMono, 실측 아이콘), Gray-70" },
            { label: "아이콘↔이름 gap", value: "6px(gap-1.5)" },
            { label: "패널", value: "DropdownMenu와 동일(align=end)" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
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

      {/* 2026-08-05 신규, 이후 사용자 지적 4회로 총 5판째 — Patterns(3층) 첫 항목
          "리스트형 등록 모달".
          1판(최초 구현, Figma 스크린샷 육안) → 2판("피그마 원본과 전혀 다르다" 지적,
          고해상도 스크린샷+get_variable_defs 재대조) → 3판("분명 슬라이드팝업이었는데
          아니고" 지적, CenterModal→SideSlidePanel 전환) → 4판(담당자가 실제 운영 중인
          서비스의 스크린샷 2장을 제공, "슬라이드팝업이 아니다"로 다시 정정 — 이땐 그
          근거를 CenterModal 원복으로 잘못 해석함) → 5판(담당자가 **Figma 파일 링크를
          직접 제공**하며 "테두리 r값이 어디 있냐, 품목등록 영역에 흐린 배경이 깔려
          있다"고 지적 — `get_design_context`로 해당 노드(19414:94157, 19098:64815)를
          코드 그대로 직접 읽어서 재구성. 지금까지 중 가장 신뢰도 높은 근거(dev-mode
          원본 마크업 그대로).
          5판에서 확인된 사실:
          A) 모달 루트에 radius 클래스가 아예 없음(그림자만 있음: drop-shadow(0 0 12px
             rgba(0,0,0,.2))) — 이 그림자 값이 저장소의 `SideSlidePanel`(우측 고정, 전체
             높이, radius 없음) 컴포넌트 문서 주석에 이미 정확히 같은 값으로 실측돼
             있었음. 즉 4판에서 "슬라이드팝업 아님, 중앙 모달"이라고 판단한 게 틀렸고,
             3판의 SideSlidePanel 선택이 맞았음 — SideSlidePanel로 재전환.
          B) "품목등록"/"작업지시 정보" 영역은 실제로 `bg-gray20(#eff2f8) rounded-8`
             카드로 감싸져 있고, "추가" 버튼이 카드 하단 경계에 절반씩 걸치도록
             (`absolute bottom-[-16px]`) 배치돼 있음 — 이게 사용자가 말한 "흐린색
             배경"의 정체. 이전 판들엔 이 카드 래퍼 자체가 없었음(가장 큰 누락).
          C) "기본정보" 필(pill) 배경은 Gray-20이 아니라 Gray-30이었음(다른 라운드에서
             육안 대조로 잘못 판단했던 부분, 이번에 direct read로 확정) — 공용
             `PatternGroupHeader` 자체를 Gray-30으로 수정(위 컴포넌트 주석 참고).
          D) "품목등록"/"작업지시 정보" 타이틀은 회색 필이 아니라 그냥 16px bold
             텍스트 — `PatternGroupHeader`를 쓰지 않음(기본정보만 필 사용).
          E) 라벨: "입고예정일"(등록일 아님, 리터럴 텍스트 확인), "사용 여부"(공백
             있음), "품목등록"(공백 없음, 4판에서 반대로 고쳤던 게 틀림) — 전부 Figma
             리터럴 텍스트 그대로 되돌림.
          F) "입고예정일"은 캘린더 아이콘이 없는 순수 정적 텍스트(readOnly, 인터랙션
             없음) — DatePicker 아님. 반대로 작업지시 등록의 "지시일"은 실제로 인라인
             캘린더 아이콘이 있어 DatePicker 유지가 맞음.
          G) "품목"(공정 등록)·"품목구분" 필드는 Select가 아니라 plain Input이었음
             (Input Textbox 인스턴스, 드롭다운 화살표 마크업 없음) — Select→Input 원복.
          H) 작업지시 등록의 품목구분/단위/규격 필드는 배경이 Gray-20이 아니라
             Gray-30 + 텍스트 Gray-70 — `Input`의 `readOnly`(Gray-20)가 아니라
             `disabled`(Gray-30/Gray-70) 상태와 정확히 일치해서 disabled로 교체.
             포장인원은 반대로 흰 배경 일반 입력 필드(readOnly 아님) — 수정.
          I) 품목 리스트 표: 공정 등록은 5개 컬럼이 전부 동일폭(flex-1)이고 체크박스
             칸이 없는 단순 표 — 공용 `Table`(체크박스+점선 구분선+회색 헤더 포함)이
             구조 자체가 안 맞아서 재사용 대신 이 패턴 전용 경량 표를 새로 만듦. 데모
             데이터도 Figma 원본 그대로 "비비빅/완제품/A/4,000" 2행으로 되돌림(4판에서
             임의로 넣은 실제 제품명들은 검증 안 된 추정이었음).
          "설정" 버튼: 폭 65px, 높이가 32px 행에 꽉 차는 걸 확인해서 xsmall(22px)이
          아니라 small(32px) 사이즈로 교체.
          여전히 판단값으로 남은 것: "설정" 버튼 아이콘(Figma "mes/icon-setting"이 이
          저장소엔 없어 lucide Settings 대체), 작업지시 리스트 표의 행별 하이라이트
          배경(파란/주황 톤 강조 — 장식적 요소라 우선순위 낮음으로 보류). */}
      <Section id="list-registration-modal" title="리스트형 등록 모달" titleEn="List Registration Modal">
        <Sample
          label="공정 등록"
          spec={[
            { label: "출처", value: "클라우드MES node 19414:94157 (get_design_context 직접 확인)" },
            { label: "형태", value: "SideSlidePanel(우측 고정, radius 없음), 948px(get_screenshot 실측, 기본 960px 오버라이드)" },
            { label: "구성", value: "기본정보 폼 + 회색 카드(품목등록 폼) + 품목 리스트 표" },
          ]}
        >
          <Button size="basic" onClick={() => setProcessRegisterModalOpen(true)}>
            공정 등록 모달 열기
          </Button>
        </Sample>
        <Sample
          label="생산지시 등록"
          spec={[
            {
              label: "출처",
              value: "클라우드MES node 19098:64815(Figma) + 실제 운영화면 스크린샷(라벨/타이틀은 스크린샷 우선)",
            },
            { label: "형태", value: "SideSlidePanel(우측 고정, radius 없음), 948px(get_screenshot 실측, 기본 960px 오버라이드)" },
            { label: "구성", value: "기본정보 폼 + 회색 카드(생산지시 정보 폼) + 생산지시 리스트 표" },
          ]}
        >
          <Button size="basic" onClick={() => setWorkOrderRegisterModalOpen(true)}>
            생산지시 등록 모달 열기
          </Button>
        </Sample>
        <Sample
          label="생산지시 등록 · 리스트 빈 상태"
          spec={[
            { label: "출처", value: "사용자 제공 실제 운영화면 스크린샷(신규/미입력 상태)" },
            { label: "구성", value: "선택 필드 전부 미선택 + 파생 필드 빈 값 + 리스트 영역 EmptyState" },
            { label: "안내 문구", value: "\"생산지시 품목을 추가하세요.\"" },
          ]}
        >
          <Button size="basic" onClick={() => setWorkOrderEmptyModalOpen(true)}>
            빈 리스트 상태로 열기
          </Button>
        </Sample>
      </Section>

      <SideSlidePanel
        open={processRegisterModalOpen}
        onOpenChange={setProcessRegisterModalOpen}
        title="공정 등록"
        className="max-w-[948px]"
        confirmLabel="등록"
        onCancel={() => setProcessRegisterModalOpen(false)}
        onConfirm={() => setProcessRegisterModalOpen(false)}
      >
        <div className="flex w-full flex-1 flex-col pb-5">
          <div className="flex w-full flex-col gap-3 border-b border-mes-gray-30 pb-5">
            <PatternGroupHeader>기본정보</PatternGroupHeader>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
              <PatternFieldRow label="공정명" required>
                <Input className="flex-1" placeholder="내용 입력" />
              </PatternFieldRow>
              <PatternFieldRow label="입고예정일">
                <Input className="flex-1" readOnly defaultValue="2025-04-01" />
              </PatternFieldRow>
              <PatternFieldRow label="불량유형">
                <Input className="flex-1 pr-1" defaultValue="4건" />
                <Button
                  variant="opacityMain"
                  size="small"
                  className="w-[65px] gap-2"
                  startIcon={<Settings size={16} />}
                >
                  설정
                </Button>
              </PatternFieldRow>
              <PatternFieldRow label="비가동유형">
                <Input className="flex-1 pr-1" defaultValue="3건" />
                <Button
                  variant="opacityMain"
                  size="small"
                  className="w-[65px] gap-2"
                  startIcon={<Settings size={16} />}
                >
                  설정
                </Button>
              </PatternFieldRow>
              <PatternFieldRow label="사용 여부" required>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-[14px] leading-[1.5] text-mes-gray-130">
                    <Radio name="process-register-use" defaultChecked />
                    사용
                  </label>
                  <label className="flex items-center gap-1.5 text-[14px] leading-[1.5] text-mes-gray-130">
                    <Radio name="process-register-use" />
                    미사용
                  </label>
                </div>
              </PatternFieldRow>
            </div>
          </div>

          <div className="flex w-full min-h-0 flex-1 flex-col gap-5 pt-5">
            {/* Figma node 19414:94157: "품목등록" 영역 전체가 bg-gray20/rounded-8 카드로
                감싸져 있고, "추가" 버튼이 카드 하단 경계에 절반 걸치도록 배치됨. */}
            <div className="relative flex w-full flex-col gap-4 rounded-lg bg-mes-gray-20 px-4 pb-8 pt-3">
              <div className="flex w-full flex-col gap-[10px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">품목등록</h3>
                  <Button
                    variant="fillBlack"
                    size="small"
                    className="h-7 gap-0.5"
                    endIcon={<IconArrow size={12} className="rotate-180" />}
                  >
                    리스트 조회/선택
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
                  <PatternFieldRow label="품목" required>
                    <Input className="flex-1" defaultValue="비비빅" />
                  </PatternFieldRow>
                  <PatternFieldRow label="품목구분">
                    <Input className="flex-1" readOnly defaultValue="완제품" />
                  </PatternFieldRow>
                </div>
              </div>
              <Button
                variant="fillMain"
                size="small"
                className="absolute -bottom-4 left-1/2 w-[160px] -translate-x-1/2"
                startIcon={<IconArrowLine size={16} className="-rotate-90" />}
              >
                추가
              </Button>
            </div>

            <div className="flex w-full min-h-0 flex-1 flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">품목리스트</h3>
                <SearchInput value="" onChange={() => {}} placeholder="검색어 입력.." className="w-[200px]" />
              </div>
              {/* 2026-08-06 재수정(사용자 직접 지적) — 이 노드(19414:94222)의 표 마크업만
                  그대로 옮겨서 흰 헤더+구분선 없는 형태로 만들었는데, 실제로는 이 파일
                  다른 곳의 공용 Table 컴포넌트와 동일하게 헤더 배경(Gray-10)과 칼럼 사이
                  점선 구분선(Gray-40)이 있어야 한다는 걸 확인받음 — 이 특정 프레임의
                  표가 단순화된 목업이었던 것으로 보고, 실제 서비스 전역에서 이미 검증된
                  Table 디자인 컨벤션(`table.tsx` 참고)에 맞춤. 체크박스 칼럼만 이 패턴엔
                  없어서(사용자가 이번엔 지적 안 함) 제외하고 나머지 시각 스타일만 통일.
                  2026-08-06 추가 재수정 — 표 박스 자체가 내용(헤더+2행)만큼만 hug되고
                  그 아래 빈 공간은 표 밖(섹션 배경)으로 남아있던 걸 "리스트 자체 높이도
                  화면을 채워야 한다"고 지적받음 — 표 박스에 flex-1을 줘서 테두리 자체가
                  남은 세로 공간을 다 채우도록 수정(행 높이 30px은 그대로, 빈 공간은
                  테두리 안쪽 흰 여백으로 표현됨). 상위 wrapper 체인(모달 콘텐츠→이
                  섹션)에도 flex-1/min-h-0을 연쇄로 걸어야 실제로 남는 공간이 전달됨. */}
              <div className="flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white">
                <div className="flex h-[30px] w-full shrink-0 items-center border-b border-mes-gray-30 bg-mes-gray-10">
                  {[
                    { label: "품목", align: "center" as const },
                    { label: "품목구분", align: "left" as const },
                    { label: "규격", align: "center" as const },
                    { label: "단위", align: "left" as const },
                    { label: "삭제", align: "center" as const },
                  ].map((col, i) => (
                    <div
                      key={col.label}
                      className={cn(
                        "flex h-full flex-1 items-center",
                        col.align === "center" ? "justify-center" : "justify-start pl-[6px]",
                        i < 4 && "border-r border-dashed border-mes-gray-40"
                      )}
                    >
                      <span className="text-[13px] font-semibold leading-[1.3] text-mes-gray-130">
                        {col.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                  {[
                    { item: "비비빅", type: "완제품", spec: "A", unit: "4,000" },
                    { item: "비비빅", type: "완제품", spec: "A", unit: "4,000" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex min-h-[30px] w-full shrink-0 items-center border-b border-mes-gray-30"
                    >
                      <div className="flex flex-1 items-center justify-center border-r border-dashed border-mes-gray-40 p-[6px]">
                        <span className="text-[14px] leading-[1.3] text-mes-gray-130">{row.item}</span>
                      </div>
                      <div className="flex flex-1 items-center justify-start border-r border-dashed border-mes-gray-40 p-[6px]">
                        <span className="text-[14px] leading-[1.3] text-mes-gray-130">{row.type}</span>
                      </div>
                      <div className="flex flex-1 items-center justify-center border-r border-dashed border-mes-gray-40 p-[6px]">
                        <span className="text-[14px] leading-[1.3] text-mes-gray-130">{row.spec}</span>
                      </div>
                      <div className="flex flex-1 items-center justify-start border-r border-dashed border-mes-gray-40 p-[6px]">
                        <span className="text-[14px] leading-[1.3] text-mes-gray-130">{row.unit}</span>
                      </div>
                      <div className="flex flex-1 items-center justify-center p-[6px]">
                        <button
                          type="button"
                          aria-label="삭제"
                          className="inline-flex items-center justify-center rounded-[2px] px-2 py-1 text-mes-gray-70"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SideSlidePanel>

      {/* 2026-08-06 재수정(사용자 직접 제공, "실제 화면으로 개발된 화면") — 실제
          운영 화면 스크린샷 기준으로 타이틀/라벨/placeholder를 다시 맞춤. Figma
          node 19098:64815엔 "작업지시 등록"/"작업지시 정보"/"작업지시 리스트"/"규격"으로
          찍혀 있었지만, 실제 배포된 화면은 "생산지시 등록"/"생산지시 정보"/
          "생산지시 리스트"/"제품규격"으로 다름 — Figma 목업과 실제 구현이 갈린
          또 다른 사례(이 파일에서 반복 확인된 패턴: 실측 스크린샷 > Figma).
          확인 버튼 라벨도 Figma엔 "저장"으로 찍혀 있었는데 이전 라운드에서 "등록"으로
          임의로 바꿔놨던 게 있어서 원복(SideSlidePanel 기본값이 "저장"이라 prop 자체를 뺌). */}
      <SideSlidePanel
        open={workOrderRegisterModalOpen}
        onOpenChange={setWorkOrderRegisterModalOpen}
        title="생산지시 등록"
        className="max-w-[948px]"
        onCancel={() => setWorkOrderRegisterModalOpen(false)}
        onConfirm={() => setWorkOrderRegisterModalOpen(false)}
      >
        <div className="flex w-full flex-1 flex-col pb-5">
          <div className="flex w-full flex-col gap-3 border-b border-mes-gray-30 pb-5">
            <PatternGroupHeader>기본정보</PatternGroupHeader>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
              <PatternFieldRow label="설비" required>
                <Select>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="설비 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq-1">성형기 1호</SelectItem>
                    <SelectItem value="eq-2">성형기 2호</SelectItem>
                  </SelectContent>
                </Select>
              </PatternFieldRow>
              <PatternFieldRow label="지시일" required>
                <DatePicker
                  value={workOrderInspectionDate}
                  onValueChange={setWorkOrderInspectionDate}
                  className="flex-1"
                />
              </PatternFieldRow>
            </div>
          </div>

          <div className="flex w-full min-h-0 flex-1 flex-col gap-5 pt-5">
            <div className="relative flex w-full flex-col gap-4 rounded-lg bg-mes-gray-20 px-4 pb-8 pt-3">
              <div className="flex w-full flex-col gap-[10px]">
                <h3 className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">생산지시 정보</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
                  <PatternFieldRow label="품목" required>
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="품목 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item-1">죠스바</SelectItem>
                        <SelectItem value="item-2">월드콘 뚜껑(소)</SelectItem>
                      </SelectContent>
                    </Select>
                  </PatternFieldRow>
                  <PatternFieldRow label="품목구분">
                    <Input className="flex-1" disabled defaultValue="완제품" />
                  </PatternFieldRow>
                  <PatternFieldRow label="담당기사">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="담당기사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mgr-1">윤대원</SelectItem>
                        <SelectItem value="mgr-2">신선미</SelectItem>
                      </SelectContent>
                    </Select>
                  </PatternFieldRow>
                  <PatternFieldRow label="단위">
                    <Input className="flex-1" disabled defaultValue="EA" />
                  </PatternFieldRow>
                  <PatternFieldRow label="근무조" required>
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="근무조 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shift-day">주간</SelectItem>
                        <SelectItem value="shift-night">야간</SelectItem>
                      </SelectContent>
                    </Select>
                  </PatternFieldRow>
                  <PatternFieldRow label="제품규격">
                    <Input className="flex-1" disabled defaultValue="아사노" />
                  </PatternFieldRow>
                  <PatternFieldRow label="지시수량" required>
                    <Input className="flex-1" placeholder="지시수량" defaultValue="1,000" />
                  </PatternFieldRow>
                  <PatternFieldRow label="포장인원">
                    <Input className="flex-1" placeholder="포장인원" />
                  </PatternFieldRow>
                </div>
              </div>
              <Button
                variant="fillMain"
                size="small"
                className="absolute -bottom-4 left-1/2 w-[160px] -translate-x-1/2"
                startIcon={<IconArrowLine size={16} className="-rotate-90" />}
              >
                추가
              </Button>
            </div>

            <div className="flex w-full min-h-0 flex-1 flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">생산지시 리스트</h3>
                <SearchInput value="" onChange={() => {}} placeholder="검색" className="w-[200px]" />
              </div>
              {(() => {
                {/* 2026-08-06 재수정(사용자 직접 지적) — 지시수량/생산수량 값에 증분
                    표기("2,600 (+600)")가 붙어 있어서 기존 폭(95px)으로는 줄바꿈이
                    발생했음. "포장인원/단위 같은 건 좁아도 된다"는 지적대로 짧은 값
                    컬럼(단위/포장인원/근무조/담당기사/상태/삭제)은 좁히고, 그만큼
                    여유를 지시수량/생산수량/품목에 배분. 셀에 whitespace-nowrap도
                    추가해서 폭을 넘는 값은 줄바꿈 대신 넘치도록(표 자체가
                    overflow-x-auto라 필요하면 가로 스크롤됨). */}
                const workOrderColumns: {
                  key: string;
                  label: string;
                  width: number;
                  align?: "left" | "center" | "right";
                }[] = [
                  { key: "shift", label: "근무조", width: 64 },
                  { key: "item", label: "품목", width: 200 },
                  { key: "type", label: "품목구분", width: 76 },
                  { key: "manager", label: "담당기사", width: 76 },
                  { key: "unit", label: "단위", width: 52 },
                  { key: "packCount", label: "포장인원", width: 64 },
                  { key: "orderQty", label: "지시수량", width: 130, align: "right" },
                  { key: "producedQty", label: "생산수량", width: 100, align: "right" },
                  { key: "status", label: "상태", width: 66 },
                  { key: "delete", label: "삭제", width: 56 },
                ];
                const workOrderRows = [
                  {
                    id: "wo-1",
                    shift: "주간",
                    item: "죠스바",
                    type: "완제품",
                    manager: "윤대원",
                    unit: "kg",
                    packCount: "5",
                    orderQty: "2,600 (+600)",
                    producedQty: "3000",
                    status: "작업중" as const,
                  },
                  {
                    id: "wo-2",
                    shift: "야간",
                    item: "월드콘 뚜껑(소)",
                    type: "완제품",
                    manager: "신선미",
                    unit: "kg",
                    packCount: "5",
                    orderQty: "3,000 (+3,000)",
                    producedQty: "-",
                    status: "대기" as const,
                  },
                  {
                    id: "wo-3",
                    shift: "주간",
                    item: "월드콘 뚜껑(대)",
                    type: "완제품",
                    manager: "신선미",
                    unit: "kg",
                    packCount: "5",
                    orderQty: "3000",
                    producedQty: "3,000",
                    status: "완료" as const,
                  },
                  {
                    id: "wo-4",
                    shift: "주간",
                    item: "팥빙수",
                    type: "완제품",
                    manager: "신선미",
                    unit: "kg",
                    packCount: "5",
                    orderQty: "3000",
                    producedQty: "4,000",
                    status: "완료" as const,
                  },
                ];
                {/* 2026-08-06 재수정(사용자 직접 지적) — 표 박스가 행 개수만큼만
                    hug되고 그 아래 빈 공간이 밖으로 남던 걸 flex-1로 채우도록 수정.
                    가로 스크롤(overflow-x, 칼럼 폭 합이 넓을 때)과 세로 스크롤(행이
                    많아 넘칠 때)을 같은 내부 컨테이너(overflow-auto)에서 같이
                    처리하고, 헤더는 sticky top-0로 고정. */}
                return (
                  <div className="flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white">
                    <div className="min-h-0 flex-1 overflow-auto">
                      <div className="sticky top-0 z-10 flex h-[30px] w-max min-w-full shrink-0 items-center border-b border-mes-gray-30 bg-mes-gray-10">
                        {workOrderColumns.map((col, i) => (
                          <div
                            key={col.key}
                            style={{ width: col.width }}
                            className={cn(
                              "flex h-full shrink-0 items-center justify-center",
                              i < workOrderColumns.length - 1 &&
                                "border-r border-dashed border-mes-gray-40"
                            )}
                          >
                            <span className="text-[13px] font-semibold leading-[1.3] text-mes-gray-130">
                              {col.label}
                            </span>
                          </div>
                        ))}
                      </div>
                      {workOrderRows.map((row) => (
                        <div
                          key={row.id}
                          className="flex min-h-[30px] w-max min-w-full items-center border-b border-mes-gray-30"
                        >
                          {workOrderColumns.map((col, i) => (
                            <div
                              key={col.key}
                              style={{ width: col.width }}
                              className={cn(
                                "flex h-full shrink-0 items-center p-[6px]",
                                col.align === "right" ? "justify-end" : "justify-center",
                                i < workOrderColumns.length - 1 &&
                                  "border-r border-dashed border-mes-gray-40"
                              )}
                            >
                              {col.key === "status" ? (
                                row.status === "작업중" ? (
                                  <Badge variant="blue">작업중</Badge>
                                ) : row.status === "대기" ? (
                                  <Badge variant="grayFill">대기</Badge>
                                ) : (
                                  <Badge variant="gray">완료</Badge>
                                )
                              ) : col.key === "delete" ? (
                                <button
                                  type="button"
                                  aria-label="삭제"
                                  className="inline-flex items-center justify-center rounded-[2px] px-2 py-1 text-mes-gray-70"
                                >
                                  <IconTrash size={16} />
                                </button>
                              ) : (
                                <span className="whitespace-nowrap text-[14px] leading-[1.3] text-mes-gray-130">
                                  {(row as unknown as Record<string, string>)[col.key]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </SideSlidePanel>

      {/* 2026-08-06 신규 — 사용자가 제공한 "실제 개발된 화면"(생산지시 미등록 상태)
          스크린샷을 그대로 반영한 빈 리스트 데모. 위 workOrderRegisterModalOpen과
          내용만 다르고 구조는 동일(필드 전부 미선택/빈 값, 리스트 영역만 EmptyState로
          교체) — 코드 중복이 있지만 이 파일 전체가 Section마다 상태별 별도 트리거로
          시연하는 관례라 그대로 따름. */}
      <SideSlidePanel
        open={workOrderEmptyModalOpen}
        onOpenChange={setWorkOrderEmptyModalOpen}
        title="생산지시 등록"
        className="max-w-[948px]"
        onCancel={() => setWorkOrderEmptyModalOpen(false)}
        onConfirm={() => setWorkOrderEmptyModalOpen(false)}
      >
        <div className="flex w-full flex-1 flex-col pb-5">
          <div className="flex w-full flex-col gap-3 border-b border-mes-gray-30 pb-5">
            <PatternGroupHeader>기본정보</PatternGroupHeader>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
              <PatternFieldRow label="설비" required>
                <Select>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="설비 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq-1">성형기 1호</SelectItem>
                    <SelectItem value="eq-2">성형기 2호</SelectItem>
                  </SelectContent>
                </Select>
              </PatternFieldRow>
              <PatternFieldRow label="지시일" required>
                <DatePicker value={null} onValueChange={() => {}} className="flex-1" />
              </PatternFieldRow>
            </div>
          </div>

          <div className="flex w-full min-h-0 flex-1 flex-col gap-5 pt-5">
            <div className="relative flex w-full flex-col gap-4 rounded-lg bg-mes-gray-20 px-4 pb-8 pt-3">
              <div className="flex w-full flex-col gap-[10px]">
                <h3 className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">생산지시 정보</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-[10px]">
                  <PatternFieldRow label="품목" required>
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="품목 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="item-1">죠스바</SelectItem>
                        <SelectItem value="item-2">월드콘 뚜껑(소)</SelectItem>
                      </SelectContent>
                    </Select>
                  </PatternFieldRow>
                  <PatternFieldRow label="품목구분">
                    <Input className="flex-1" disabled placeholder="" />
                  </PatternFieldRow>
                  <PatternFieldRow label="담당기사">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="담당기사 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mgr-1">윤대원</SelectItem>
                        <SelectItem value="mgr-2">신선미</SelectItem>
                      </SelectContent>
                    </Select>
                  </PatternFieldRow>
                  <PatternFieldRow label="단위">
                    <Input className="flex-1" disabled placeholder="" />
                  </PatternFieldRow>
                  <PatternFieldRow label="근무조" required>
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="근무조 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shift-day">주간</SelectItem>
                        <SelectItem value="shift-night">야간</SelectItem>
                      </SelectContent>
                    </Select>
                  </PatternFieldRow>
                  <PatternFieldRow label="제품규격">
                    <Input className="flex-1" disabled placeholder="" />
                  </PatternFieldRow>
                  <PatternFieldRow label="지시수량" required>
                    <Input className="flex-1" placeholder="지시수량" />
                  </PatternFieldRow>
                  <PatternFieldRow label="포장인원">
                    <Input className="flex-1" placeholder="포장인원" />
                  </PatternFieldRow>
                </div>
              </div>
              <Button
                variant="fillMain"
                size="small"
                className="absolute -bottom-4 left-1/2 w-[160px] -translate-x-1/2"
                startIcon={<IconArrowLine size={16} className="-rotate-90" />}
              >
                추가
              </Button>
            </div>

            <div className="flex w-full min-h-0 flex-1 flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold leading-[1.5] text-mes-gray-130">생산지시 리스트</h3>
                <SearchInput value="" onChange={() => {}} placeholder="검색" className="w-[200px]" />
              </div>
              <div className="flex w-full min-h-0 flex-1 flex-col overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white">
                <div className="flex h-[30px] w-full shrink-0 items-center border-b border-mes-gray-30 bg-mes-gray-10">
                  {[
                    "근무조",
                    "품목",
                    "품목구분",
                    "담당기사",
                    "단위",
                    "포장인원",
                    "지시수량",
                    "생산수량",
                    "상태",
                    "삭제",
                  ].map((label, i, arr) => (
                    <div
                      key={label}
                      className={cn(
                        "flex h-full flex-1 items-center justify-center",
                        i < arr.length - 1 && "border-r border-dashed border-mes-gray-40"
                      )}
                    >
                      <span className="text-[13px] font-semibold leading-[1.3] text-mes-gray-130">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <EmptyState title="생산지시 품목을 추가하세요." className="flex-1 py-16" />
              </div>
            </div>
          </div>
        </div>
      </SideSlidePanel>

      {/* 2026-08-05 신규 — Patterns(3층) 두 번째 항목 "검사 체크리스트 모달"(공정검사,
          Figma node 19414:93662, 760px 2단 레이아웃). 좌측 "대상정보"는 13개 필드 중
          검사일/검사시간/검사자/중량검사 4개만 필수(Figma에서 "*" 텍스트가 hidden=false로
          켜져 있는 필드만 확인해서 반영 — 나머지 9개는 "*" 레이어 자체는 있지만
          hidden=true라 화면엔 안 보임). 우측 "검사항목"은 이전 세션에 이미 확인해둔
          IconQaO/IconQaTriangle/IconQaX 아이콘을 재사용한 4단 토글(QaToggleGroup)로 4개
          행(Pallet 상태/표기사항/포장상태/상차밴딩) 구성 — 이 3개 아이콘 재사용이 애초에
          이 패턴을 CenterModal 하나로 구현 가능하게 만든 근거였음(신규 아이콘 제작 불필요).
          판단값: "입력" 버튼 아이콘(Figma "icon-pen", 저장소에 없음) → lucide-react
          Pencil로 대체. QaToggleGroup 미선택 색상은 벡터라 정확한 hex 미실측(text-mes-gray-40
          판단값). 날짜/시간/검사자 필드 옆 캘린더·화살표 아이콘은 장식용이라 생략
          (Input 컴포넌트가 trailing icon을 지원하지 않아 이 패턴만을 위해 확장하지 않음). */}
      <Section id="inspection-checklist-modal" title="검사 체크리스트 모달" titleEn="Inspection Checklist Modal">
        <Sample
          label="공정검사"
          spec={[
            { label: "출처", value: "클라우드MES node 19414:93662" },
            { label: "너비", value: "760px(기본 CenterModal 960px 오버라이드)" },
            { label: "구성", value: "대상정보 폼(좌 360px) + 검사항목 O/△/X/− 토글(우 400px)" },
          ]}
        >
          <Button size="basic" onClick={() => setInspectionChecklistModalOpen(true)}>
            공정검사 모달 열기
          </Button>
        </Sample>
      </Section>

      <CenterModal
        open={inspectionChecklistModalOpen}
        onOpenChange={setInspectionChecklistModalOpen}
        title="공정검사"
        className="max-w-[760px]"
        confirmLabel="저장"
        onCancel={() => setInspectionChecklistModalOpen(false)}
        onConfirm={() => setInspectionChecklistModalOpen(false)}
      >
        <div className="flex w-full gap-5 pb-5">
          <div className="flex w-[320px] shrink-0 flex-col gap-3">
            <PatternGroupHeader>대상정보</PatternGroupHeader>
            <div className="flex flex-col gap-3">
              <PatternFieldRow label="생산일">
                <Input className="flex-1" defaultValue="2024-10-30" />
              </PatternFieldRow>
              <PatternFieldRow label="작업자">
                <Input className="flex-1" defaultValue="홍길동" />
              </PatternFieldRow>
              <PatternFieldRow label="설비">
                <Input className="flex-1" defaultValue="A1" />
              </PatternFieldRow>
              <PatternFieldRow label="제품명">
                <Input className="flex-1" defaultValue="더블비얀코" />
              </PatternFieldRow>
              <PatternFieldRow label="공정">
                <Input className="flex-1" defaultValue="압출" />
              </PatternFieldRow>
              <PatternFieldRow label="검사일" required>
                <Input className="flex-1" defaultValue="2025-10-30" />
              </PatternFieldRow>
              <PatternFieldRow label="검사시간" required>
                <Input className="flex-1" defaultValue="14:45" />
              </PatternFieldRow>
              <PatternFieldRow label="검사자" required>
                <Input className="flex-1" defaultValue="김아무개" />
              </PatternFieldRow>
              <PatternFieldRow label="Box-No">
                <Input className="flex-1" defaultValue="150" />
              </PatternFieldRow>
              <PatternFieldRow label="실적입력시간">
                <Input className="flex-1" placeholder="-- : --" />
              </PatternFieldRow>
              <PatternFieldRow label="Sheet-Lot">
                <Input className="flex-1" placeholder="Sheet-Lot 입력" />
              </PatternFieldRow>
              <PatternFieldRow label="중량검사" required>
                <Input className="flex-1" defaultValue="4" />
                <Button variant="opacityMain" size="xsmall" startIcon={<Pencil size={14} />}>
                  입력
                </Button>
              </PatternFieldRow>
              <PatternFieldRow label="특이사항">
                <Input className="flex-1" placeholder="특이사항 입력" />
                <Button variant="opacityMain" size="xsmall" startIcon={<Pencil size={14} />}>
                  입력
                </Button>
              </PatternFieldRow>
              <PatternFieldRow label="결과">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 text-[14px] leading-[1.5] text-mes-gray-130">
                    <Radio name="inspection-result" defaultChecked />
                    합격
                  </label>
                  <label className="flex items-center gap-1 text-[14px] leading-[1.5] text-mes-gray-130">
                    <Radio name="inspection-result" />
                    일부
                  </label>
                  <label className="flex items-center gap-1 text-[14px] leading-[1.5] text-mes-gray-130">
                    <Radio name="inspection-result" />
                    불합
                  </label>
                </div>
              </PatternFieldRow>
            </div>
          </div>

          <div className="flex w-[360px] shrink-0 flex-col gap-3">
            <div className="flex items-center justify-between">
              <PatternGroupHeader>검사항목</PatternGroupHeader>
              <Button
                variant="fillBlack"
                size="xsmall"
                className="ml-2 shrink-0"
                startIcon={<IconPlus size={14} />}
              >
                항목 추가
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <PatternFieldRow label="Pallet 상태">
                <QaToggleGroup
                  value={qaChecklist.palletStatus}
                  onChange={(next) => setQaChecklist((prev) => ({ ...prev, palletStatus: next }))}
                />
              </PatternFieldRow>
              <PatternFieldRow label="표기사항">
                <QaToggleGroup
                  value={qaChecklist.labelStatus}
                  onChange={(next) => setQaChecklist((prev) => ({ ...prev, labelStatus: next }))}
                />
              </PatternFieldRow>
              <PatternFieldRow label="포장상태">
                <QaToggleGroup
                  value={qaChecklist.packagingStatus}
                  onChange={(next) => setQaChecklist((prev) => ({ ...prev, packagingStatus: next }))}
                />
              </PatternFieldRow>
              <PatternFieldRow label="상차밴딩">
                <QaToggleGroup
                  value={qaChecklist.bandingStatus}
                  onChange={(next) => setQaChecklist((prev) => ({ ...prev, bandingStatus: next }))}
                />
              </PatternFieldRow>
            </div>
          </div>
        </div>
      </CenterModal>

      {/* 2026-08-05 신규 — Patterns(3층) 세 번째 항목 "그룹화 리스트 관리 화면"(메인 리스트,
          Figma node 17000:39999). 이 노드는 get_metadata가 76,712자를 반환해 처리 한도를
          넘겨서(SSE 파싱 실패는 아니고 순수 크기 문제) 메타데이터 좌표 기반이 아니라
          스크린샷 육안 대조 + 판단값으로 구성 — 프로젝트 관례상 GroupQuery/QuickQuery를
          만들 때 쓴 것과 같은 방식(AGENTS.md 참고).
          이 패턴의 핵심은 신규 컴포넌트를 만드는 게 아니라, 이 페이지에 이미 실측/구현되어
          있는 화면 구성요소들을 그대로 조합하는 것 — 실제로 스크린샷을 보면 Sidebar(접힘
          레일 상태), PageTopTabItem, DateRangePicker, GroupQuery, Filter, QuickQuery,
          SearchInput, Table(그룹화+총계행)이 전부 이미 이 페이지 다른 Section에서 각각
          Figma 실측으로 구현된 상태였고, 심지어 Table의 productionColumns/productionGroups
          데이터 자체가 이미 이 계열("생산실적"/"생산지시") 화면 스크린샷에서 나온 값이라
          그대로 재사용함(중복 구현 방지). 따라서 아래 프리뷰의 GroupQuery/Filter/
          QuickQuery/SearchInput/DateRangePicker/Table은 전부 이 페이지의 기존 state를
          그대로 공유 — 새 state는 사이드바 접힘 여부(다른 Section의 사이드바 데모와
          결합되지 않도록 로컬로 분리) 하나만 추가함.
          판단값: 상단 탭 우측 벨/유저 아이콘은 스크린샷에 작게만 보여 정확한 사이즈/색
          미실측(18px, Gray-60으로 판단). 하단 "복사/다운로드"는 테두리 없는 텍스트+아이콘
          버튼으로 보여 기존 Button variant 중 맞는 게 없어 커스텀 버튼으로 구현. 우측
          3버튼(원료투입분석/삭제/생산실적등록)은 육안상 fillGray/fillGray/fillBlack으로
          판단(삭제도 danger 색이 아니라 회색이었음 — 실측 후 그대로 반영, 임의로 빨간색
          추정하지 않음). Table 그룹 구성 자체는 스크린샷의 "설비별 1단 그룹"과 완전히
          똑같지는 않음(재사용한 productionGroups는 지시일→설비→담당기사 3단) — 화면
          합성 패턴을 보여주는 게 목적이라 데이터를 새로 만들지 않고 기존 검증된 데이터를
          그대로 씀. */}
      <Section id="grouped-list-screen" title="그룹화 리스트 관리 화면" titleEn="Grouped List Screen">
        <Sample
          label="생산실적 리스트"
          spec={[
            { label: "출처", value: "클라우드MES node 17000:39999(스크린샷 기반)" },
            {
              label: "구성",
              value: "Sidebar+상단탭+조회헤더+GroupQuery/Filter/QuickQuery/SearchInput+Table+액션바",
            },
            { label: "재사용", value: "전부 이 페이지의 기존 컴포넌트·state 재사용" },
          ]}
        >
          <div className="w-full overflow-x-auto rounded-lg border border-mes-gray-30">
            <div className="flex h-[640px] min-w-[1040px]">
              <Sidebar
                items={SIDEBAR_NAV_ITEMS}
                collapsed={patternScreenSidebarCollapsed}
                onCollapseClick={() => setPatternScreenSidebarCollapsed((v) => !v)}
                activeKey="production"
              />
              <div className="flex min-w-0 flex-1 flex-col bg-white">
                <div className="flex h-[38px] shrink-0 items-center justify-between bg-black pr-3">
                  <div className="flex h-full">
                    <PageTopTabItem label="생산실적" active />
                    <PageTopTabItem label="거래처 등록" />
                    <PageTopTabItem label="품목 등록" />
                  </div>
                  <div className="flex items-center gap-2.5 text-mes-gray-60">
                    <IconBell size={18} />
                    <IconUserMono size={18} />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[17px] font-bold leading-tight text-mes-gray-130">
                      생산실적 리스트
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap text-[13px] text-mes-gray-70">
                        조회기준일자
                      </span>
                      <DateRangePicker value={dateRangeValue} onValueChange={setDateRangeValue} />
                      <Button size="small">조회</Button>
                      <Button variant="lineBlacktxt" size="small" startIcon={<Settings size={14} />}>
                        설정
                      </Button>
                    </div>
                  </div>

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
                    <div className="flex flex-wrap items-center gap-2.5">
                      <QuickQuery
                        presets={quickQuerySlots
                          .filter((s): s is QuickQuerySlot & { name: string } => s.name !== null)
                          .map((s) => ({ id: s.id, label: s.name }))}
                        activeId={quickQueryActiveId}
                        onApply={setQuickQueryActiveId}
                        onClearActive={() => setQuickQueryActiveId(null)}
                        onSettingsClick={() => setQuickQueryDialogOpen(true)}
                      />
                      <SearchInput value={groupQuerySearchValue} onChange={setGroupQuerySearchValue} />
                    </div>
                  </div>

                  <div className="w-full overflow-x-auto">
                    <Table
                      columns={productionColumns}
                      groups={productionGroups}
                      selectedIds={tableSelectedIds}
                      onSelectedIdsChange={setTableSelectedIds}
                      totals={{ qty: fmt(16000), defectQty: fmt(30), packQty: fmt(160) }}
                    />
                  </div>
                </div>

                <div className="flex h-14 shrink-0 items-center justify-between border-t border-mes-gray-30 px-4">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[13px] text-mes-gray-70"
                    >
                      <IconCopy size={16} />
                      복사
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[13px] text-mes-gray-70"
                    >
                      <IconDownload size={16} />
                      다운로드
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="fillGray" size="basic">
                      원료투입분석
                    </Button>
                    <Button variant="fillGray" size="basic">
                      삭제
                    </Button>
                    <Button variant="fillBlack" size="basic">
                      생산실적등록
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sample>
      </Section>

      {/* 2026-08-03 신규 — 담당자 요청: "더 작업이 필요한 것들의 구역을 미리 생성해 둬".
          아직 착수 안 한 티어3/4를 위한 자리만 미리 만들어둠(SIDEBAR_GROUPS의 "예정"
          그룹과 짝) — 실제 항목 125개를 지금 다 채우진 않음. 티어5(28개)는 체크리스트
          기준 이미 "제외" 확정이라 여기 포함하지 않음.
          2026-08-04 — 버그 수정: 이 배너도 Foundation/Components 배너와 똑같이
          activeGroup·activeId와 무관하게 항상 렌더링되고 있었음 — "피커 — 기간처럼
          구체적 컴포넌트를 보고 있는데도 '예정' 배너가 같이 뜬다"는 리포트의 진짜
          원인(처음엔 맨 아래 upcoming-tier3/4로 착각했는데, 실제로는 컴포넌트 목록
          중간에 물리적으로 끼어있던 이 배너였음). Components 루트(카드 그리드 개요
          화면)에서만 보이도록 조건 추가 — 아래 upcoming-tier3/4 EmptyState 두 개랑
          같은 조건. */}
      {activeGroup === "components" && !activeId && (
        <div className="flex w-full max-w-[960px] flex-col gap-1.5 border-l-8 border-mes-gray-60 pl-5">
          <span className="flex items-center gap-2.5 text-[28px] font-extrabold leading-tight tracking-tight text-mes-gray-130">
            <Hammer className="size-7 shrink-0 text-mes-gray-60" />
            예정
          </span>
          <p className="text-[13px] leading-[1.5] text-mes-gray-70">
            체크리스트 기준 티어3(59개, 필수)·티어4(41개, 포함권장 19 + 보류 22) 미착수
            항목이 여기 채워질 예정입니다. 티어5(28개)는 이미 범위 제외로 확정.
          </p>
        </div>
      )}
      <Section id="sticky-header-footer" title="고정 헤더 / 고정 푸터" titleEn="StickyHeader / StickyFooter" badge="임시">
        <Sample
          label="Sticky · 컨테이너 내부 스크롤"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "처리", value: "position: sticky, 헤더 top-0/푸터 bottom-0" },
            { label: "테두리", value: "헤더 하단1px / 푸터 상단1px, 둘 다 Gray-30" },
            { label: "배경", value: "흰색(스크롤 콘텐츠 위에 항상 불투명하게 덮임)" },
          ]}
        >
          <div className="h-[140px] w-[220px] overflow-y-auto rounded-mes-control border border-mes-border-default">
            <StickyHeader className="px-3 py-2 text-[12px] font-semibold">헤더</StickyHeader>
            <div className="p-3 text-[12px] text-mes-gray-70">
              스크롤해도 헤더/푸터는 고정됩니다. 스크롤해도 헤더/푸터는 고정됩니다.
            </div>
            <StickyFooter className="px-3 py-2 text-[12px] text-mes-gray-70">푸터</StickyFooter>
          </div>
        </Sample>
      </Section>

      <Section id="divider" title="구분선" titleEn="Divider" badge="임시">
        <Sample
          label="Divider · horizontal"
          spec={[
            { label: "두께", value: "1px 고정(h-px)" },
            { label: "색상", value: "Gray-30(border-default)" },
            { label: "너비", value: "100% hug(부모 기준)" },
          ]}
        >
          <div className="flex w-40 flex-col gap-2">
            <span className="text-[12px] text-mes-gray-70">위</span>
            <Divider />
            <span className="text-[12px] text-mes-gray-70">아래</span>
          </div>
        </Sample>
        <Sample
          label="Divider · vertical"
          spec={[
            { label: "두께", value: "1px 고정(w-px)" },
            { label: "색상", value: "Gray-30(border-default)" },
            { label: "높이", value: "100% hug(부모 기준)" },
          ]}
        >
          <div className="flex h-8 items-center gap-2">
            <span className="text-[12px] text-mes-gray-70">왼쪽</span>
            <Divider orientation="vertical" />
            <span className="text-[12px] text-mes-gray-70">오른쪽</span>
          </div>
        </Sample>
      </Section>

      <Section id="navbar" title="내비게이션 바" titleEn="Navbar" badge="임시">
        <Sample
          label="Navbar · 3-슬롯"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "높이", value: "56px(h-14, 데모 페이지 상단바와 동일값 재사용)" },
            { label: "패딩", value: "좌우16px(px-4)" },
            { label: "하단 테두리", value: "1px Gray-30" },
            { label: "슬롯 내부 gap", value: "12px(gap-3)" },
          ]}
        >
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

      <Section id="multi-select-input" title="다중 선택 입력" titleEn="MultiSelectInput" badge="임시">
        <Sample
          label="MultiSelectInput · 태그 추가/제거"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "바깥 박스", value: "Input과 동일 테두리/R값, 높이는 hug(min-h-8)" },
            { label: "패딩", value: "좌우8px/상하6px(px-2 py-1.5)" },
            { label: "태그", value: "Tag(gray) 재사용, gap 6px(gap-1.5)" },
            { label: "제거 아이콘", value: "10px(IconX)" },
          ]}
        >
          <MultiSelectInput
            values={multiSelectValues}
            onValuesChange={setMultiSelectValues}
            className="w-[260px]"
          />
        </Sample>
      </Section>

      <Section id="dropdown-menu" title="드롭다운 메뉴" titleEn="DropdownMenu" badge="임시">
        <Sample
          label="DropdownMenu · 클릭해서 열기"
          spec={[
            { label: "Figma", value: "명확한 전용 노드 못 찾음(판단값)" },
            { label: "패널", value: "폭180px, 패딩6px(Popover 재사용)" },
            { label: "항목", value: "패딩좌우8px/상하5px, 13px, R값4px" },
            { label: "hover 배경", value: "Gray-10(bg-subtle, Combobox 규칙 재사용)" },
            { label: "danger 항목", value: "텍스트 Danger색" },
          ]}
        >
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

      <Section id="label" title="라벨" titleEn="Label" badge="임시">
        <Sample
          label="Label · 기본"
          spec={[
            { label: "폰트", value: "13px medium" },
            { label: "텍스트색", value: "Gray-130(text-default)" },
          ]}
        >
          <Label>품목명</Label>
        </Sample>
        <Sample
          label="Label · required"
          spec={[
            { label: "폰트/색", value: "기본과 동일" },
            { label: "* 간격", value: "2px(ml-0.5)" },
            { label: "* 색상", value: "Danger(text-danger)" },
          ]}
        >
          <Label required>거래처</Label>
        </Sample>
        <Sample
          label="Label + Input 조합"
          spec={[{ label: "Label↔Input 간격", value: "6px(gap-1.5)" }]}
        >
          <div className="flex flex-col gap-1.5">
            <Label required>수량</Label>
            <Input placeholder="0" className="w-[160px]" />
          </div>
        </Sample>
      </Section>

      <Section id="logo" title="로고" titleEn="Logo" badge="임시">
        <Sample
          label="Logo · default/small"
          spec={[
            { label: "Figma", value: "실제 로고 애셋 없음, 텍스트 워드마크(판단값)" },
            { label: "default", value: "18px bold" },
            { label: "small", value: "14px bold" },
            { label: "심볼", value: "\"M\" 배지 — 배경Primary-60, 흰텍스트, R값2px" },
            { label: "심볼↔텍스트 gap", value: "6px(gap-1.5)" },
          ]}
        >
          <div className="flex items-center gap-4">
            <Logo />
            <Logo size="small" />
          </div>
        </Sample>
      </Section>

      <Section id="loading-spinner" title="로딩 스피너" titleEn="LoadingSpinner" badge="임시">
        <Sample
          label="LoadingSpinner · 16px"
          spec={[
            { label: "크기", value: "16px(size prop으로 지정)" },
            { label: "색상", value: "Primary-60(text-brand) 기본" },
          ]}
        >
          <LoadingSpinner size={16} />
        </Sample>
        <Sample
          label="LoadingSpinner · 20px(기본)"
          spec={[
            { label: "크기", value: "20px(기본값)" },
            { label: "색상", value: "Primary-60(text-brand)" },
          ]}
        >
          <LoadingSpinner />
        </Sample>
        <Sample
          label="LoadingSpinner · fillMain 버튼 위"
          spec={[
            { label: "크기", value: "16px" },
            { label: "색상", value: "흰색(text-inverse, className으로 덮어씀)" },
            { label: "텍스트와 간격", value: "8px(버튼 gap-2로 덮어씀, 기본은 6px)" },
          ]}
        >
          <Button size="basic" variant="fillMain" disabled className="gap-2">
            <LoadingSpinner size={16} className="text-mes-text-inverse" />
            처리 중
          </Button>
        </Sample>
      </Section>

      <Section id="loading-overlay" title="로딩 오버레이" titleEn="LoadingOverlay" badge="임시">
        <Sample
          label="LoadingOverlay · 영역 덮기"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값, Backdrop과는 별개 목적)" },
            { label: "처리", value: "absolute inset-0, 반투명 흰배경(bg-white/70)" },
            { label: "스피너", value: "28px(LoadingSpinner 재사용)" },
            { label: "스피너↔라벨 gap", value: "8px(gap-2)" },
            { label: "라벨", value: "13px, Gray-70" },
          ]}
        >
          <div className="relative h-[100px] w-[200px] rounded-mes-control border border-mes-border-default">
            <LoadingOverlay label="불러오는 중" />
          </div>
        </Sample>
      </Section>

      <Section id="list" title="리스트" titleEn="List" badge="임시">
        <Sample
          label="List · 클릭 가능 항목"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(Table 행 스타일 재사용, 판단값)" },
            { label: "테두리", value: "1px Gray-30, R값4px(control)" },
            { label: "항목", value: "패딩좌우12px/상하8px, 13px, 구분선1px Gray-30" },
            { label: "hover 배경", value: "Gray-20(bg-subtler, 클릭 가능할 때만)" },
          ]}
        >
          <List className="w-[220px]">
            <ListItem onClick={() => {}}>자재 A</ListItem>
            <ListItem onClick={() => {}}>자재 B</ListItem>
            <ListItem onClick={() => {}}>자재 C</ListItem>
          </List>
        </Sample>
      </Section>

      <Section id="link" title="링크" titleEn="Link" badge="임시">
        <Sample
          label="Link · 기본"
          spec={[
            { label: "폰트", value: "14px medium" },
            { label: "텍스트색", value: "Primary-60(text-brand)" },
            { label: "밑줄", value: "상시 표시(underline, offset 2px)" },
          ]}
        >
          <Link href="#">조설정 바로가기</Link>
        </Sample>
        <Sample label="Link · 화살표 포함" spec={[{ label: "폰트/색/밑줄", value: "기본과 동일 — 화살표는 텍스트에 직접 포함" }]}>
          <Link href="#">자세히 보기 →</Link>
        </Sample>
      </Section>

      <Section id="button-group" title="버튼 그룹" titleEn="ButtonGroup" badge="임시">
        <Sample
          label="ButtonGroup · 3개 연결"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(Button 감싸는 레이아웃)" },
            { label: "처리", value: "양끝만 라운드, 가운데는 -ml-px로 테두리 겹침" },
            { label: "버튼 자체 규격", value: "Button size별 값 그대로 재사용" },
          ]}
        >
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

      <Section id="breadcrumb" title="브레드크럼" titleEn="Breadcrumb" badge="임시">
        <Sample
          label="Breadcrumb · 3단계"
          spec={[
            { label: "Figma", value: "componentKey→node-id 변환 불가, 실측 못함(판단값)" },
            { label: "폰트", value: "13px" },
            { label: "구분자", value: "ChevronRight 14px, Gray-50" },
            { label: "요소 간 gap", value: "6px(gap-1.5)" },
            { label: "현재 위치(마지막)", value: "medium, Gray-130 / 그 외 Gray-70" },
          ]}
        >
          <Breadcrumb
            items={[
              { label: "자재관리", onClick: () => {} },
              { label: "입고 관리", onClick: () => {} },
              { label: "입고 상세" },
            ]}
          />
        </Sample>
      </Section>

      <Section id="empty-state" title="상태 — 없음" titleEn="State — Empty" badge="임시">
        <Sample
          label="EmptyState · 아이콘+액션"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "패딩", value: "좌우24px/상하48px(px-6 py-12)" },
            { label: "아이콘 색", value: "Gray-50" },
            { label: "아이콘↔텍스트블록 gap", value: "12px" },
            { label: "제목", value: "15px semibold, Gray-130" },
            { label: "설명", value: "13px, Gray-70" },
            { label: "텍스트블록↔액션 gap", value: "4px(mt-1)" },
          ]}
        >
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

      <Section id="error-state" title="상태 — 오류" titleEn="State — Error" badge="임시">
        <Sample
          label="ErrorState · 재시도 액션"
          spec={[
            { label: "레이아웃", value: "EmptyState와 동일(판단값)" },
            { label: "아이콘 색", value: "text-mes-text-danger(첫 실사용처)" },
            { label: "제목 기본값", value: "\"문제가 발생했습니다\"" },
          ]}
        >
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

      <Section id="descriptions" title="설명 목록" titleEn="Descriptions" badge="임시">
        <Sample
          label="Descriptions · 1열"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "테두리/R값", value: "1px Gray-30 / 4px(control)" },
            { label: "행", value: "패딩좌우16px/상하10px, 구분선1px Gray-30" },
            { label: "라벨", value: "고정폭100px, 13px, Gray-70" },
            { label: "값", value: "13px medium, Gray-130" },
          ]}
        >
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

      <Section id="switch" title="스위치" titleEn="Switch" badge="임시">
        <Sample
          label="Switch · off"
          spec={[
            { label: "트랙 크기", value: "44×24px(w-11 h-6) 고정, 판단값" },
            { label: "썸 크기", value: "20px(size-5) 원형" },
            { label: "트랙색(off)", value: "Gray-40" },
            { label: "R값", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Switch />
        </Sample>
        <Sample
          label="Switch · on"
          spec={[
            { label: "트랙색(on)", value: "Primary-60(bg-brand)" },
            { label: "썸 이동", value: "오른쪽으로 20px(translate-x-5)" },
            { label: "R값", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Switch defaultChecked />
        </Sample>
        <Sample
          label="Switch · disabled(off)"
          spec={[
            { label: "처리 방식", value: "색 유지 + opacity-40(색 스왑 대신 흐리게)" },
            { label: "R값", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Switch disabled />
        </Sample>
        <Sample
          label="Switch · disabled(on)"
          spec={[
            { label: "처리 방식", value: "on 색(Primary-60) 유지 + opacity-40" },
            { label: "R값", value: "완전 원형(rounded-full)" },
          ]}
        >
          <Switch disabled defaultChecked />
        </Sample>
      </Section>

      <Section id="skeleton" title="스켈레톤" titleEn="Skeleton" badge="임시">
        <Sample
          label="Skeleton · text"
          spec={[
            { label: "높이", value: "16px(h-4) 고정" },
            { label: "너비", value: "100% hug(className으로 조정 가능)" },
            { label: "R값", value: "2px(control-xs)" },
            { label: "배경", value: "Gray-20(bg-subtle) + animate-pulse" },
            { label: "줄 간격", value: "6px(gap-1.5)" },
          ]}
        >
          <div className="flex w-40 flex-col gap-1.5">
            <Skeleton variant="text" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        </Sample>
        <Sample
          label="Skeleton · rect"
          spec={[
            { label: "높이", value: "96px(h-24) 고정" },
            { label: "너비", value: "100% hug(데모는 w-40)" },
            { label: "R값", value: "4px(control)" },
            { label: "배경", value: "Gray-20(bg-subtle) + animate-pulse" },
          ]}
        >
          <Skeleton variant="rect" className="w-40" />
        </Sample>
        <Sample
          label="Skeleton · circle"
          spec={[
            { label: "크기", value: "40×40px(size-10) 고정" },
            { label: "R값", value: "완전 원형(rounded-full)" },
            { label: "배경", value: "Gray-20(bg-subtle) + animate-pulse" },
          ]}
        >
          <Skeleton variant="circle" />
        </Sample>
        <Sample
          label="Skeleton · 카드 조합 예시"
          spec={[
            { label: "circle↔text 간격", value: "8px(gap-2)" },
            { label: "text 줄 간격", value: "6px(gap-1.5)" },
          ]}
        >
          <div className="flex w-40 items-center gap-2">
            <Skeleton variant="circle" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton variant="text" />
              <Skeleton variant="text" className="w-2/3" />
            </div>
          </div>
        </Sample>
      </Section>

      <Section id="scroll-area" title="스크롤 영역" titleEn="ScrollArea" badge="임시">
        <Sample
          label="ScrollArea · 고정 높이"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "처리", value: "브라우저 기본 스크롤 + scrollbarWidth: thin" },
            { label: "새 의존성", value: "없음(별도 스크롤바 라이브러리 미사용)" },
          ]}
        >
          <ScrollArea className="h-[100px] w-[200px] rounded-mes-control border border-mes-border-default p-2">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="py-1 text-[13px] text-mes-text-default">
                항목 {i + 1}
              </div>
            ))}
          </ScrollArea>
        </Sample>
      </Section>

      <Section id="icon-button" title="아이콘 버튼 / 닫기 버튼" titleEn="IconButton / CloseButton" badge="임시">
        <Sample
          label="IconButton · basic/ghost"
          spec={[
            { label: "크기", value: "40×40px 고정" },
            { label: "아이콘", value: "20px" },
            { label: "배경", value: "투명 → hover Gray-bg-subtle" },
            { label: "아이콘색", value: "Gray-70" },
            { label: "테두리", value: "없음" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <IconButton icon={<IconFilter />} aria-label="필터" size="basic" />
        </Sample>
        <Sample
          label="IconButton · small/fillMain"
          spec={[
            { label: "크기", value: "32×32px 고정" },
            { label: "아이콘", value: "16px" },
            { label: "배경", value: "Primary-60" },
            { label: "아이콘색", value: "흰색" },
            { label: "테두리", value: "없음" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <IconButton icon={<IconBell />} aria-label="알림" variant="fillMain" size="small" />
        </Sample>
        <Sample
          label="IconButton · small/fillGray"
          spec={[
            { label: "크기", value: "32×32px 고정" },
            { label: "아이콘", value: "16px" },
            { label: "배경", value: "Gray-40" },
            { label: "아이콘색", value: "Gray-130" },
            { label: "테두리", value: "없음" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <IconButton icon={<IconFilter />} aria-label="필터" variant="fillGray" size="small" />
        </Sample>
        <Sample
          label="IconButton · small/fillBlack"
          spec={[
            { label: "크기", value: "32×32px 고정" },
            { label: "아이콘", value: "16px" },
            { label: "배경", value: "Gray-130" },
            { label: "아이콘색", value: "흰색" },
            { label: "테두리", value: "없음" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <IconButton icon={<IconBell />} aria-label="알림" variant="fillBlack" size="small" />
        </Sample>
        <Sample
          label="IconButton · small/lineBlacktxt"
          spec={[
            { label: "크기", value: "32×32px 고정" },
            { label: "아이콘", value: "16px" },
            { label: "배경", value: "흰색" },
            { label: "아이콘색", value: "Gray-130" },
            { label: "테두리", value: "1px Gray-30" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <IconButton
            icon={<IconFilter />}
            aria-label="필터"
            variant="lineBlacktxt"
            size="small"
          />
        </Sample>
        <Sample
          label="IconButton · xsmall/ghost"
          spec={[
            { label: "크기", value: "22×22px 고정" },
            { label: "아이콘", value: "14px" },
            { label: "배경", value: "투명 → hover bg-subtle" },
            { label: "아이콘색", value: "Gray-70" },
            { label: "테두리", value: "없음" },
            { label: "R값", value: "2px(control-xs, basic/small의 4px과 다름)" },
          ]}
        >
          <IconButton icon={<IconBell />} aria-label="알림" size="xsmall" />
        </Sample>
        <Sample
          label="IconButton · disabled"
          spec={[
            { label: "크기", value: "32×32px 고정" },
            { label: "아이콘", value: "16px" },
            { label: "배경", value: "Gray-40(variant 무관 공통)" },
            { label: "아이콘색", value: "Gray-60" },
            { label: "테두리", value: "없음" },
            { label: "R값", value: "4px(control)" },
          ]}
        >
          <IconButton icon={<IconFilter />} aria-label="필터" size="small" disabled />
        </Sample>
        <Sample
          label="CloseButton · 기본(small)"
          spec={[
            { label: "구성", value: "IconButton + IconX 고정 프리셋" },
            { label: "크기", value: "32×32px 고정" },
            { label: "아이콘", value: "16px(IconX)" },
            { label: "R값", value: "4px(control, IconButton small과 동일)" },
          ]}
        >
          <CloseButton />
        </Sample>
      </Section>

      <Section id="accordion" title="아코디언" titleEn="Accordion" badge="임시">
        <Sample
          label="Accordion · multiple(기본)"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(순수 React state)" },
            { label: "테두리", value: "1px Gray-30, R값4px(control)" },
            { label: "항목 구분선", value: "1px Gray-30(첫 항목 제외)" },
            { label: "트리거", value: "패딩좌우16px/상하12px, 14px medium" },
            { label: "화살표", value: "16px, 펼침 시 rotate-90" },
            { label: "본문", value: "패딩좌우16px/하단12px, 13px, Gray-80" },
          ]}
        >
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

      <Section id="collapsible" title="접기·펼치기" titleEn="Collapsible" badge="임시">
        <Sample
          label="Collapsible · 단일 트리거"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(Accordion과 화살표 규칙 공유)" },
            { label: "트리거", value: "14px medium, 화살표↔텍스트 gap 6px" },
            { label: "화살표", value: "16px, 펼침 시 rotate-90" },
            { label: "본문 들여쓰기", value: "22px(화살표 폭에 맞춤), 상단 gap 8px(mt-2)" },
          ]}
        >
          <Collapsible trigger="상세 옵션" className="w-[240px]">
            <span className="text-[13px] leading-[1.5] text-mes-gray-80">
              여기에 추가 필드가 들어갑니다.
            </span>
          </Collapsible>
        </Sample>
      </Section>

      <Section id="card" title="카드" titleEn="Card" badge="임시">
        <Sample
          label="Card · 기본"
          spec={[
            { label: "Figma", value: "전용 노드 없음(판단값)" },
            { label: "배경/테두리", value: "흰색 / 1px Gray-30" },
            { label: "R값", value: "4px(control)" },
            { label: "그림자", value: "없음(Card는 평면 UI)" },
            { label: "Header/Content/Footer", value: "각 padding 16px(p-4)" },
            { label: "Header 하단테두리", value: "1px Gray-30" },
            { label: "Footer 상단테두리", value: "1px Gray-30, gap 8px" },
          ]}
        >
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

      <Section id="textarea" title="텍스트 영역" titleEn="Textarea" badge="임시">
        <Sample
          label="Textarea · Default(placeholder)"
          spec={[
            { label: "텍스트↔좌우 테두리", value: "10px(px-[10px])" },
            { label: "텍스트↔상하 테두리", value: "8px(py-2)" },
            { label: "테두리", value: "1px Gray-30(border-default)" },
            { label: "R값", value: "4px(control)" },
            { label: "최소 높이", value: "80px(min-h-20) — 내용 늘면 늘어남" },
            { label: "너비", value: "100% hug(부모 기준) — 데모는 220px로 제한" },
            { label: "폰트", value: "14px" },
          ]}
        >
          <Textarea placeholder="내용 입력" className="h-20 w-[220px]" />
        </Sample>
        <Sample
          label="Textarea · 입력됨"
          spec={[
            { label: "패딩/테두리/R값", value: "Default와 동일(내용 유무와 무관)" },
            { label: "텍스트 색", value: "Gray-130(mes-text-default)" },
          ]}
        >
          <Textarea defaultValue={"설비 점검 중 이상 소음 발생.\n정지 후 재확인 필요."} className="h-20 w-[220px]" />
        </Sample>
        <Sample
          label="Textarea · readonly"
          spec={[
            { label: "패딩/테두리/R값", value: "Default와 동일" },
            { label: "배경만 변경", value: "Gray-10(bg-subtle) — 다른 상태와 유일한 차이" },
          ]}
        >
          <Textarea readOnly defaultValue="수정 불가 내용" className="h-20 w-[220px]" />
        </Sample>
        <Sample
          label="Textarea · disabled"
          spec={[
            { label: "패딩/R값", value: "Default와 동일" },
            { label: "배경", value: "Gray-bg-disabled" },
            { label: "텍스트", value: "Gray-text-disabled" },
            { label: "테두리", value: "border-default 유지(색만 있고 굵기 변화 없음)" },
            { label: "커서", value: "not-allowed" },
          ]}
        >
          <Textarea disabled defaultValue="비활성" className="h-20 w-[220px]" />
        </Sample>
      </Section>

      <Section id="toggle-button" title="토글 버튼" titleEn="ToggleButton" badge="임시">
        <Sample
          label="ToggleButton · 눌림 상태 토글"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(Button variant 재사용)" },
            { label: "규격(size별)", value: "Button과 동일 height/padding/font" },
            { label: "눌리지 않음", value: "흰배경 / 1px Gray-30 테두리(lineBlacktxt)" },
            { label: "눌림", value: "Primary-20 배경 / Primary-60 텍스트(opacityMain)" },
            { label: "R값", value: "4px(control, small 사이즈 기준)" },
          ]}
        >
          <ToggleButton
            size="small"
            pressed={toggleButtonPressed}
            onPressedChange={setToggleButtonPressed}
          >
            즐겨찾기
          </ToggleButton>
        </Sample>
      </Section>

      <Section id="tooltip" title="툴팁" titleEn="Tooltip" badge="임시">
        <Sample
          label="Tooltip · top(기본)"
          spec={[
            { label: "배경", value: "Gray-130(bg-strong)" },
            { label: "텍스트", value: "흰색 · 12px" },
            { label: "패딩", value: "좌우 8px(px-2) · 상하 4px(py-1)" },
            { label: "R값", value: "2px(control-xs)" },
            { label: "트리거와 간격", value: "6px(mb-1.5)" },
          ]}
        >
          <Tooltip content="위쪽 툴팁">
            <Button size="small" variant="lineBlacktxt">
              hover
            </Button>
          </Tooltip>
        </Sample>
        <Sample
          label="Tooltip · bottom"
          spec={[{ label: "패딩/색상/R값", value: "top과 동일" }, { label: "트리거와 간격", value: "6px(mt-1.5)" }]}
        >
          <Tooltip content="아래쪽 툴팁" side="bottom">
            <Button size="small" variant="lineBlacktxt">
              hover
            </Button>
          </Tooltip>
        </Sample>
        <Sample
          label="Tooltip · IconButton과 조합"
          spec={[{ label: "패딩/색상/R값", value: "top과 동일" }]}
        >
          <Tooltip content="필터 열기">
            <IconButton icon={<IconFilter />} aria-label="필터" size="small" />
          </Tooltip>
        </Sample>
      </Section>

      <Section id="popover" title="팝오버" titleEn="Popover" badge="임시">
        <Sample
          label="Popover · 클릭해서 열기"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(Radix 재사용)" },
            { label: "패딩", value: "16px(p-4)" },
            { label: "테두리/배경", value: "1px Gray-30 / 흰색" },
            { label: "R값", value: "8px(panel)" },
            { label: "그림자", value: "shadow-mes-panel(Combobox 패널과 동일값 재사용)" },
            { label: "트리거 간격", value: "4px(sideOffset)" },
          ]}
        >
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

      <Section id="panel" title="패널" titleEn="Panel" badge="임시">
        <Sample
          label="Panel · 기본"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "R값", value: "8px(panel)" },
            { label: "테두리/배경", value: "1px Gray-30 / 흰색" },
            { label: "그림자", value: "shadow-mes-panel(Combobox/NotificationPanel과 동일)" },
          ]}
        >
          <Panel className="w-[220px] p-4">
            <span className="text-[13px] leading-[1.5] text-mes-text-default">
              그림자가 있는 떠 있는 영역
            </span>
          </Panel>
        </Sample>
      </Section>

      <Section id="pagination" title="페이지네이션" titleEn="Pagination" badge="임시">
        <Sample
          label="Pagination · 10페이지 중 4페이지"
          spec={[
            { label: "Figma", value: "componentKey→node-id 변환 불가, 실측 못함(판단값)" },
            { label: "버튼", value: "정사각24px(IconButton small 규격 재사용), R값2px(control-xs)" },
            { label: "현재 페이지", value: "배경Primary-60, 텍스트흰색(Button fillMain 재사용)" },
            { label: "요소 간 gap", value: "4px" },
          ]}
        >
          <Pagination page={paginationPage} totalPages={10} onPageChange={setPaginationPage} />
        </Sample>
      </Section>

      <Section id="date-picker" title="피커 — 날짜" titleEn="Picker — Date" badge="임시">
        <Sample
          label="DatePicker · 단일 날짜"
          spec={[
            { label: "Figma", value: "node-id 해석 불가, 실측 못함(판단값)" },
            { label: "트리거", value: "Input 스타일 재사용(inputVariants) + IconCalendar(실측 아이콘)" },
            { label: "패널", value: "Popover 재사용" },
            { label: "날짜 계산", value: "외부 라이브러리 없이 순수 Date" },
            { label: "R값", value: "4px(control, Input 트리거 재사용)" },
          ]}
        >
          <DatePicker value={datePickerValue} onValueChange={setDatePickerValue} />
        </Sample>
      </Section>

      <Section id="date-range-picker" title="피커 — 기간" titleEn="Picker — Range" badge="임시">
        <Sample
          label="DateRangePicker · 기간 선택"
          spec={[
            { label: "규격", value: "DatePicker와 동일 트리거/패널" },
            { label: "선택 순서", value: "시작일 클릭 → 종료일 클릭" },
            { label: "사이 날짜", value: "옅은 브랜드 배경(판단값)" },
            { label: "R값", value: "4px(control, DatePicker와 동일)" },
          ]}
        >
          <DateRangePicker value={dateRangeValue} onValueChange={setDateRangeValue} />
        </Sample>
      </Section>

      <Section id="time-picker" title="피커 — 시간" titleEn="Picker — Time" badge="임시">
        <Sample
          label="TimePicker · 30분 간격"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "트리거", value: "Input 스타일 재사용" },
            { label: "목록", value: "Combobox 옵션 hover/선택 규칙 재사용, 스크롤" },
            { label: "R값", value: "4px(control, Input 트리거 재사용)" },
          ]}
        >
          <TimePicker value={timePickerValue} onValueChange={setTimePickerValue} />
        </Sample>
      </Section>

      <Section id="fieldset" title="필드셋" titleEn="Fieldset" badge="임시">
        <Sample
          label="Fieldset · 필드 묶음"
          spec={[
            { label: "Figma", value: "전용 컴포넌트 없음(판단값)" },
            { label: "테두리/R값", value: "1px Gray-30 / 4px(control)" },
            { label: "패딩", value: "16px(p-4)" },
            { label: "필드 간 gap", value: "12px(gap-3)" },
            { label: "legend", value: "13px medium, Gray-130(Label과 동일 톤)" },
          ]}
        >
          <Fieldset legend="거래처 정보" className="w-[260px]">
            <Input placeholder="거래처명" size="small" />
            <Input placeholder="담당자" size="small" />
          </Fieldset>
        </Sample>
      </Section>
      {/* 2026-08-04 — 페이지 분할 도입 후: 이 두 안내 블록은 특정 id에 매인 게 아니라
          "/components 루트(카드 그리드 개요 화면)"에서만 같이 노출 — 특정 항목 페이지
          (/foundations/xxx, /components/xxx)나 홈("/")에서는 숨김. 담당자 리포트("radius
          보는 중인데 이게 같이 뜬다")는 사실 이 블록이 아니라 바로 위 Foundation/Components
          배너가 activeGroup 무관하게 항상 렌더링되던 버그였음(위에서 수정) — 이 블록
          조건은 원래도 맞았지만, 헷갈리지 않도록 이중부정 대신 긍정문으로 다시 씀. */}
      <section
        id="upcoming-tier3"
        className={cn(
          "flex w-full max-w-[960px] scroll-mt-20 flex-col border-b border-mes-gray-30 pb-8",
          (activeGroup !== "components" || Boolean(activeId)) && "hidden"
        )}
      >
        <EmptyState
          icon={<Hammer size={32} />}
          title="티어3 — 아직 착수 전"
          description="화면 패턴 카탈로그 59개(필수 범위). 담당자 우선순위 확정 후 순차 진행 예정."
        />
      </section>
      <section
        id="upcoming-tier4"
        className={cn(
          "flex w-full max-w-[960px] scroll-mt-20 flex-col pb-8",
          (activeGroup !== "components" || Boolean(activeId)) && "hidden"
        )}
      >
        <EmptyState
          icon={<Hammer size={32} />}
          title="티어4 — 아직 착수 전"
          description="포함권장 41개(19개 권장 + 22개 보류). 티어1~3 완료 후 진행 예정."
        />
      </section>
        </main>
        <RightRail activeId={activeId ?? ""} registryRef={sectionRegistryRef} />
      </div>
    </div>
    </ActiveIdContext.Provider>
    </SectionRegistryContext.Provider>
  );
}
