"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
  itemType: string;
  packCount: number;
  startTime: string;
  endTime: string;
  unit: string;
  qty: number;
  defectQty: number;
  packQty: number;
  warehouse: string;
}

const productionColumns: TableColumn<ProductionRow>[] = [
  { key: "date", label: "지시일", width: 106, align: "center" },
  { key: "shift", label: "근무조", width: 57 },
  { key: "equipment", label: "설비", width: 125 },
  { key: "manager", label: "담당기사", width: 65 },
  {
    key: "item",
    label: "품목명",
    width: 148,
    render: (row) => (
      <a href="#" className="text-mes-primary-60 underline">
        {row.item}
      </a>
    ),
  },
  { key: "itemType", label: "품목구분", width: 80 },
  { key: "packCount", label: "포장인원", width: 69, align: "right" },
  { key: "startTime", label: "시작시간", width: 124, align: "center" },
  { key: "endTime", label: "종료시간", width: 124, align: "center" },
  { key: "unit", label: "단위", width: 51, align: "center" },
  { key: "qty", label: "생산수량", width: 104, align: "right" },
  { key: "defectQty", label: "불량수량", width: 104, align: "right" },
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
  { key: "packQty", label: "포장수량", width: 100, align: "right" },
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
  { key: "warehouse", label: "창고명", width: 106 },
];

const productionGroups: TableGroup<ProductionRow>[] = [
  {
    id: "eq1",
    label: "설비 : 성형기 1호",
    summary: { packCount: 15, qty: 6000, defectQty: 30, packQty: 60 },
    rows: [
      { id: "r1", data: { date: "2025-10-30", shift: "주간", equipment: "성형기 1호", manager: "김수현", item: "더블비안코뚜껑", itemType: "완제품", packCount: 5, startTime: "15:00", endTime: "18:00", unit: "kg", qty: 2000, defectQty: 10, packQty: 20, warehouse: "동진창고" } },
      { id: "r2", data: { date: "2025-10-29", shift: "주간", equipment: "성형기 1호", manager: "김수현", item: "더블비안코뚜껑", itemType: "완제품", packCount: 5, startTime: "15:00", endTime: "18:00", unit: "kg", qty: 2000, defectQty: 10, packQty: 20, warehouse: "동진창고" } },
      { id: "r3", data: { date: "2025-10-29", shift: "야간", equipment: "성형기 1호", manager: "김수현", item: "더블비안코뚜껑", itemType: "완제품", packCount: 5, startTime: "15:00", endTime: "18:00", unit: "kg", qty: 2000, defectQty: 10, packQty: 20, warehouse: "동진창고" } },
    ],
  },
  {
    id: "eq2",
    label: "설비 : 성형기 2호",
    summary: { packCount: 15, qty: 12000, defectQty: 0, packQty: 160 },
    rows: [
      { id: "r4", data: { date: "2025-10-30", shift: "주간", equipment: "성형기 2호", manager: "김수현", item: "비비빅", itemType: "반제품", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20, warehouse: "동진창고" } },
      { id: "r5", data: { date: "2025-10-28", shift: "주간", equipment: "성형기 2호", manager: "김수현", item: "비비빅", itemType: "반제품", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20, warehouse: "동진창고" } },
      { id: "r6", data: { date: "2025-10-28", shift: "주간", equipment: "성형기 2호", manager: "김수현", item: "비비빅", itemType: "반제품", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20, warehouse: "동진창고" } },
      { id: "r7", data: { date: "2025-10-27", shift: "주간", equipment: "성형기 2호", manager: "김수현", item: "비비빅", itemType: "반제품", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20, warehouse: "동진창고" }, isNew: true },
      { id: "r8", data: { date: "2025-10-26", shift: "야간", equipment: "성형기 2호", manager: "김수현", item: "비비빅", itemType: "반제품", packCount: 3, startTime: "13:00", endTime: "17:00", unit: "kg", qty: 2000, defectQty: 0, packQty: 20, warehouse: "동진창고" } },
    ],
  },
];

export default function Home() {
  const [comboValue, setComboValue] = useState<string>("");
  const [filterValue, setFilterValue] = useState<Record<string, string[]>>({
    perm: ["normal"],
    group: ["normal", "admin"],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [radioDialogOpen, setRadioDialogOpen] = useState(false);
  const [tableSelectedIds, setTableSelectedIds] = useState<string[]>(["r4"]);

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

      <Section title="Badge (7종 — orange/yellow는 Figma 이름과 실제 색이 다름, 아래 라벨에 실제색 병기)">
        <Sample label="Badge · blue">
          <Badge variant="blue">출하중</Badge>
        </Sample>
        <Sample label="Badge · red">
          <Badge variant="red">취소요청</Badge>
        </Sample>
        <Sample label="Badge · orange(실제=gray)">
          <Badge variant="orange">대기</Badge>
        </Sample>
        <Sample label="Badge · yellow(실제=blue, Figma 오류 추정)">
          <Badge variant="yellow">승인중</Badge>
        </Sample>
        <Sample label="Badge · gray(배경 없음)">
          <Badge variant="gray">완료</Badge>
        </Sample>
        <Sample label="Badge · variant6(용도 미확인)">
          <Badge variant="variant6">완료</Badge>
        </Sample>
        <Sample label="Badge · variant7(용도 미확인)">
          <Badge variant="variant7">완료</Badge>
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

      <Section title="ConfirmDialog (작은 확인/안내 팝업 — 에러 톤 1버튼 형태만 실측됨)">
        <Sample label="ConfirmDialog · 열기">
          <Button size="basic" onClick={() => setDialogOpen(true)}>
            삭제 시도
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

      <section className="flex w-full max-w-[1100px] flex-col gap-4 pb-8">
        <h2 className="text-[14px] font-semibold text-mes-gray-130">
          Table (원본 node 9873:83780 + 수정본 실제화면 node 16938:42501 대조 실측)
        </h2>
        <p className="text-[12px] text-mes-gray-70">
          수정본에서 확인된 변경점 반영: 헤더 배경 Gray-10 추가, 세로 점선 구분선(기본
          Gray-40), 그룹행(핑크 #fde9ea)에 집계값, 선택행(Primary-20 배경)·신규행(빨간 점)은
          구분선이 한 단계 진한 Gray-30으로 바뀜. r7 행에 빨간 점(&quot;이번 세션에서 추가된
          정보&quot;) 표시됨. disable/분할 변형은 아직 미실측(체크리스트 참고).
        </p>
        <Table
          columns={productionColumns}
          groups={productionGroups}
          selectedIds={tableSelectedIds}
          onSelectedIdsChange={setTableSelectedIds}
          totals={{ qty: "18,000", defectQty: 30, packQty: 360 }}
        />
      </section>
    </div>
  );
}
