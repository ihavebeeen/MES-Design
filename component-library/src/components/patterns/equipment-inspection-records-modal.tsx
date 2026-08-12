"use client";

import * as React from "react";
import { IconCopy, IconDownload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Filter, type FilterCategory } from "@/components/ui/filter";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { SearchInput } from "@/components/ui/search-input";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

interface InspectionRecord {
  form: string;
  equipment: string;
  inspectedAt: string;
  inspector: string;
  values: string[];
}

const INSPECTION_ITEMS = [
  { key: "zjtm", label: "ZJTM", criterion: "O" },
  { key: "contact-1", label: "전자접촉기 상태", criterion: "O" },
  { key: "contact-2", label: "전자접촉기 상태", criterion: "O" },
  { key: "contact-3", label: "전자접촉기 상태", criterion: "O" },
  { key: "contact-4", label: "전자접촉기 상태", criterion: "O" },
  { key: "contact-5", label: "전자접촉기 상태", criterion: "O" },
  { key: "contact-6", label: "전자접촉기 상태", criterion: "O" },
  { key: "contact-7", label: "전자접촉기 상태", criterion: "65이하" },
  { key: "contact-8", label: "전자접촉기 상태", criterion: "65이하" },
  { key: "contact-9", label: "전자접촉기 상태", criterion: "65이하" },
  { key: "contact-10", label: "전자접촉기 상태", criterion: "65이하" },
] as const;

const INITIAL_ROWS: TableRowData<InspectionRecord>[] = Array.from({ length: 12 }, (_, index) => ({
  id: `inspection-${index + 1}`,
  data: {
    form: "냉각기점검표",
    equipment: "A1",
    inspectedAt: index < 6 ? "25.08.01" : "25.07.31",
    inspector: ["김수현", "박지민", "이도윤", "최서연"][index % 4],
    values: ["O", "O", "O", "O", "O", "60", "58", "37", "48", "60", "58"],
  },
}));

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: "form",
    label: "점검양식",
    options: [{ id: "cooler", label: "냉각기점검표" }],
  },
  {
    id: "equipment",
    label: "대상설비",
    options: [{ id: "A1", label: "A1" }],
  },
];

const COLUMNS: TableColumn<InspectionRecord>[] = [
  { key: "form", label: "점검양식", width: 106, align: "center", render: (row) => row.form },
  { key: "equipment", label: "대상설비", width: 106, align: "center", render: (row) => row.equipment },
  { key: "inspectedAt", label: "점검일", width: 106, align: "center", render: (row) => row.inspectedAt },
  { key: "inspector", label: "점검자", width: 106, align: "center", render: (row) => row.inspector },
  ...INSPECTION_ITEMS.map<TableColumn<InspectionRecord>>((item, index) => ({
    key: item.key,
    label: item.label,
    headerDetail: item.criterion,
    width: 80,
    align: "center",
    render: (row) => row.values[index],
  })),
];

function toCsv(rows: TableRowData<InspectionRecord>[]) {
  const header = ["점검양식", "대상설비", "점검일", "점검자", ...INSPECTION_ITEMS.map((item) => item.label)];
  const body = rows.map((row) => [row.data.form, row.data.equipment, row.data.inspectedAt, row.data.inspector, ...row.data.values]);
  return [header, ...body].map((cells) => cells.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n");
}

function EquipmentInspectionRecordsContent() {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(2025, 2, 30));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(2025, 2, 30));
  const [filters, setFilters] = React.useState<Record<string, string[]>>({ form: ["cooler"], equipment: ["A1"] });
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState(INITIAL_ROWS);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState("");

  const visibleRows = React.useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ko-KR");
    return rows.filter((row) => {
      const formFilter = filters.form ?? [];
      const equipmentFilter = filters.equipment ?? [];
      if (formFilter.length > 0 && !formFilter.includes("cooler")) return false;
      if (equipmentFilter.length > 0 && !equipmentFilter.includes(row.data.equipment)) return false;
      if (!query) return true;
      return [row.data.form, row.data.equipment, row.data.inspectedAt, row.data.inspector, ...row.data.values]
        .some((value) => value.toLocaleLowerCase("ko-KR").includes(query));
    });
  }, [filters, rows, search]);

  const copyRows = async () => {
    try {
      await navigator.clipboard.writeText(toCsv(visibleRows));
      setStatus(`${visibleRows.length}건을 복사했습니다.`);
    } catch {
      setStatus("브라우저에서 클립보드 사용을 허용해 주세요.");
    }
  };

  const downloadRows = () => {
    const blob = new Blob([`\uFEFF${toCsv(visibleRows)}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "냉각기-점검기록.csv";
    link.click();
    URL.revokeObjectURL(url);
    setStatus(`${visibleRows.length}건을 다운로드했습니다.`);
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) {
      setStatus("삭제할 점검 결과를 선택해 주세요.");
      return;
    }
    setRows((current) => current.filter((row) => !selectedIds.includes(row.id)));
    setStatus(`${selectedIds.length}건을 삭제했습니다.`);
    setSelectedIds([]);
  };

  const registerResult = () => {
    const selected = rows.find((row) => selectedIds.includes(row.id));
    setStatus(selected
      ? `${selected.data.form} · ${selected.data.equipment} 점검 결과 등록을 요청했습니다.`
      : "점검 결과를 등록할 행을 선택해 주세요.");
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <section className="flex h-[108px] shrink-0 flex-col gap-3 px-5 pt-4" aria-labelledby="inspection-list-heading">
        <div className="flex h-8 items-center justify-between">
          <h3 id="inspection-list-heading" className="text-[16px] font-bold leading-[1.5] text-mes-text-default">점검 리스트</h3>
          <div className="flex items-center gap-[10px]">
            <QueryDateRange start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
            <Button size="small" className="w-[50px] px-0" onClick={() => setStatus(`${visibleRows.length}건을 조회했습니다.`)}>조회</Button>
          </div>
        </div>
        <div className="inspection-record-query-toolbar flex h-12 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3 py-2">
          <Filter
            categories={FILTER_CATEGORIES}
            value={filters}
            onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))}
          />
          <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" />
        </div>
      </section>

      <section className="h-[448px] shrink-0 px-5 pt-4" aria-label="점검 기록 표">
        <Table
          className="equipment-inspection-records-table h-[432px] rounded-none border-x-0 border-t-0"
          columns={COLUMNS}
          rows={visibleRows}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          selectionHeaderLabel="선택"
          selectionColumnWidth={56}
          selectionColor="black"
          unselectedCheckboxAppearance="grayCheck"
          edgePadding={0}
          headerBackground="white"
          columnDividerMode="solid-header"
          horizontalScroll={false}
          showMasterGroupToggles={false}
        />
      </section>

      <footer className="flex h-[72px] shrink-0 items-center justify-between px-5 py-4">
        <div className="flex items-center gap-[10px]">
          <Button size="basic" variant="lineBlacktxt" startIcon={<IconCopy size={16} />} onClick={copyRows}>복사</Button>
          <Button size="basic" variant="lineBlacktxt" startIcon={<IconDownload size={16} />} onClick={downloadRows}>다운로드</Button>
        </div>
        <div className="flex items-center gap-[10px]">
          <Button size="basic" variant="fillGray" className="w-[160px]" onClick={deleteSelected}>삭제</Button>
          <Button size="basic" variant="fillBlack" className="w-[160px]" onClick={registerResult}>점검 결과 등록</Button>
        </div>
        <p className="sr-only" aria-live="polite">{status}</p>
      </footer>
    </div>
  );
}

export { EquipmentInspectionRecordsContent };
