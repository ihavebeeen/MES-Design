"use client";

import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
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
import { Tag } from "@/components/ui/tag";
import { Toast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NoticeBanner } from "@/components/ui/notice-banner";
import { PageTopTabItem } from "@/components/ui/page-top-tab-item";
import { Sidebar, SidebarSettingsIcon, type SidebarNavItem } from "@/components/ui/sidebar";
import { AlarmListItem } from "@/components/ui/alarm-list-item";
import { RadioChoiceDialog } from "@/components/ui/radio-choice-dialog";
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

function Sample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="font-mono text-[11px] leading-none text-mes-gray-70">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
      <h2 className="text-[14px] font-semibold text-mes-gray-130">{title}</h2>
      <div className="grid grid-cols-4 items-end gap-x-6 gap-y-6">{children}</div>
    </section>
  );
}

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

export default function Home() {
  const [comboValue, setComboValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState<Record<string, string[]>>({
    perm: ["normal"],
    group: ["normal", "admin"],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  // 2026-07-29: ConfirmDialog 톤 확장(경고/알림) + 확인·취소 2버튼 + 안내 배너 데모용
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [radioDialogOpen, setRadioDialogOpen] = useState(false);
  const [sidebarExpandedKey, setSidebarExpandedKey] = useState<string | undefined>(
    "mes-setting"
  );
  const [sidebarActiveSubKey, setSidebarActiveSubKey] = useState<string | undefined>(
    "user-setting"
  );
  const [tableSelectedIds, setTableSelectedIds] = useState<string[]>(["r4"]);
  // 2026-07-28 8차: "테이블이 시선강탈"이라는 지적 반영 — 합본 Table 데모(15컬럼, 화면
  // 전체 폭)는 페이지에서 눈에 가장 많이 띄는 블록이라 기본은 접어두고, 필요할 때만
  // 펼쳐보도록 토글 추가. 미니 데모 4개(헤더만/그룹화만/컬럼2개+/총계행만)는 원래도
  // 작아서 접을 필요가 없다고 판단해 그대로 둠.
  const [productionTableOpen, setProductionTableOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-mes-gray-10 p-16">
      <h1 className="text-xl font-semibold text-mes-gray-130">
        MES 컴포넌트 라이브러리 — 스캐폴딩 확인용
      </h1>

      <Section title="Button — 사이즈">
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

      <Section title="Button — 아이콘">
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

      <Section title="Button — 컬러 variant (7종)">
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

      <Section title="Input">
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

      <Section title="Select (Selectbox)">
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

      <Section title="Badge (7종 — 2026-07-29 실제 색 기준으로 variant명 개명, 값 변경 없음)">
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

      <Section title="Radio">
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

      <Section title="Checkbox (Figma에 disabled 상태 자체가 없음 — 판단값으로 구현)">
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

      <Section title="Progress Bar">
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

      <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          Filter (트리거 + 플라이아웃 + 활성 태그, 통합 컴포넌트)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          &ldquo;필터 추가&rdquo; 클릭 → 카테고리 선택 → 체크박스 선택 → 트리거 옆에
          선택 개수가 적힌 태그가 자동 표시(예: &ldquo;그룹명 2&rdquo;) → 태그의 X로
          선택 해제. 선택된 필터가 없으면 트리거 박스만 노출되고, 있으면 그 태그들을
          hug하는 별도의 흰색/회색 테두리 박스가 옆에 나타남.
        </p>
        <Filter
          categories={filterCategories}
          value={filterValue}
          onChange={(categoryId, optionIds) =>
            setFilterValue((prev) => ({ ...prev, [categoryId]: optionIds }))
          }
        />
      </section>

      <Section title="Tag (범용 3색 — 실사용 빈도 낮음, Badge를 우선 사용)">
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

      <Section title="Combobox (검색 내장 셀렉트)">
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

      <Section title="Toast (RED/BLUE — 서로 다른 개별 프레임이라 gap/아이콘크기/색 실측값이 다름)">
        <Sample label="Toast · red">
          <Toast variant="red" message="필수 항목을 입력해주세요." onClose={() => {}} />
        </Sample>
        <Sample label="Toast · blue">
          <Toast variant="blue" message="선택한 n건이 합격 처리되었습니다." onClose={() => {}} />
        </Sample>
      </Section>

      <Section title="ConfirmDialog (작은 확인/안내 팝업 — 2026-07-29 톤 3종/2버튼/안내배너로 확장)">
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

      <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          NoticeBanner (안내 배너, 링크 포함 — 2026-07-29 신규, ConfirmDialog와 별개로도 사용 가능)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          ConfirmDialog 안에 끼워 넣을 수도 있고(위 &quot;안내 배너&quot; 예시 참고), 이렇게 독립적으로도
          쓸 수 있음. 배경/테두리/아이콘 색은 실측(Yellow-10/20/50), padding·아이콘 벡터는
          판단값(체크리스트 참고).
        </p>
        <NoticeBanner
          message="담당자의 조가 설정되지 않았습니다. 조를 설정하면 LOT 일련번호에 반영됩니다."
          linkLabel="조설정 바로가기"
          className="max-w-[420px]"
        />
      </section>

      <Section title="RadioChoiceDialog (라디오 2택 + 경고배너 팝업 — node 18840:61182 실측, 원래 문구는 &quot;투입품목 추가&quot;)">
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

      <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          PageTopTabItem (열린 화면 상단 탭 1개 — node 157:18051 실측, default/hover/active 3종 전부)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          2026-07-30 재검증: default/hover/active 3종 전부 실측 완료(이전엔 default만
          찾아서 active를 판단값으로 뒀었음 — active는 배경 Gray-110 + 제목 SemiBold로 정정).
        </p>
        <div className="flex">
          <PageTopTabItem label="생산계획(일) 리스트" active />
          <PageTopTabItem label="판매관리 리스트" />
          <PageTopTabItem label="품질검사 이력" bookmarked />
        </div>
      </section>

      <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          Sidebar / SNB (좌측 전역 내비게이션 — node 133:1976 실측, MES 설정만 2-depth 예시 포함)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          &quot;MES 설정&quot; 아이콘은 실제 export된 톱니바퀴 벡터가 없어 lucide-react
          placeholder 사용 — 확인 필요.
        </p>
        <div className="h-[600px] w-[260px] overflow-hidden rounded-lg border border-mes-gray-30">
          <Sidebar
            items={SIDEBAR_NAV_ITEMS}
            logo={
              <span className="text-[15px] font-bold text-white">moncat factory</span>
            }
            expandedKey={sidebarExpandedKey}
            onExpandedKeyChange={setSidebarExpandedKey}
            activeSubKey={sidebarActiveSubKey}
            onSubItemClick={(_, subKey) => setSidebarActiveSubKey(subKey)}
          />
        </div>
      </section>

      <section className="flex w-full max-w-[960px] flex-col gap-4 border-b border-mes-gray-30 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          AlarmListItem (알람/경보 리스트 항목 — node 163:3039 실측, 2026-07-30 신규 발견)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          담당자 새 링크 없이 기존 Figma 파일을 metadata로 훑다가 발견한 컴포넌트. tone 4색은
          기존 팔레트와 무관한 별도 alarm 색상군. `read` prop 의미(읽음/강조 여부)와 &quot;두줄&quot;
          용도는 확인 필요.
        </p>
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
            read={false}
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
            read={false}
          />
        </div>
      </section>

      <section className="flex w-full max-w-[960px] flex-col gap-4 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          아이콘 라이브러리 (담당자가 Figma에서 직접 SVG export해 전달 — 대체 아님, 실측 벡터)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          출처: fileKey F4n5Zr04PAbiRjfIFQAo6v, node 20150:103713(&quot;Section 3&quot;) 하위.
          색상 variant는 대부분 currentColor로 일반화(className으로 색 지정), flat-* 4종만
          2톤 고정색이라 원본 hex 그대로 유지.
        </p>
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

      {/* 2026-07-28 8차 후속: 담당자가 (1) 데모 페이지에 라운드별 수정 이력을 문단으로
          길게 적어둔 게 "주절주절"하다고 지적해 삭제(이력은 AGENTS.md/Table_수정_
          대기목록.md에 이미 기록돼 있으니 그쪽 참고), (2) 접기/펼치기 헤더 줄의 폭이
          다른 섹션들과 안 맞는다고 지적 → 섹션 자체는 다른 데모들과 같은
          max-w-[960px]로 맞추고, 실제 테이블(컬럼 합 1600px대)만 그 안에서 별도
          `overflow-x-auto` 박스로 가로 스크롤 처리(대기목록 17번). */}
      <section className="flex w-full max-w-[960px] flex-col gap-4 pb-8">
        <button
          type="button"
          onClick={() => setProductionTableOpen((prev) => !prev)}
          className="flex items-center gap-1.5 text-left text-[14px] font-semibold text-mes-gray-130"
        >
          <ChevronRight
            size={16}
            className={cn(
              "shrink-0 text-mes-gray-70 transition-transform",
              productionTableOpen && "rotate-90"
            )}
          />
          Table · 합본 데모 (원본 node 9873:83780 + 수정본 실제화면 node 16938:42501 대조
          실측) — 클릭해서 접기/펼치기
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

      <section className="flex w-full max-w-[960px] flex-col gap-6 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          Table — 구조 요소별 분리 데모
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          위 합본 데모는 그대로 유지하고, 담당자 요청으로 헤더/그룹화/컬럼 2개 이상(그룹
          없는 평범한 플랫 테이블)/총계행을 각각 독립적으로 볼 수 있게 아래에 나눠서
          배치함. 전부 같은 <code>Table</code> 컴포넌트 하나를 재사용하되, 어떤 prop을
          채우고 비우는지로 요소를 하나씩 분리함. 위 합본과 달리 15개 컬럼짜리 실제
          데이터 대신 3컬럼짜리 단순 데이터를 씀(다시 넓어지는 것을 피하기 위함).
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
          <Table columns={flatColumns} groups={miniGroups} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 컬럼 2개 이상 + 그룹화 없음 (평범한 플랫 테이블)
          </span>
          <Table columns={flatColumns} rows={flatRows} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] leading-none text-mes-gray-70">
            Table · 총계행만
          </span>
          <Table
            columns={flatColumns}
            rows={flatRows}
            totals={{ qty: (1200 + 980 + 2000).toLocaleString("ko-KR") }}
          />
        </div>
      </section>
    </div>
  );
}
