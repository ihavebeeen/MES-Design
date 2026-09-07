"use client";

import * as React from "react";
import { IconDownload, IconPlus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Filter, type FilterCategory } from "@/components/ui/filter";
import { Link } from "@/components/ui/link";
import { QueryDateRange } from "@/components/ui/query-date-range";
import { SearchInput } from "@/components/ui/search-input";
import { SectionFrame } from "@/components/ui/section-frame";
import { SearchTableSection } from "@/components/patterns/section-patterns";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";

interface InputMaterialRecord {
  productionDate: string;
  product: string;
  equipment: string;
  productionQuantity: string;
  productLot: string;
  startedAt: string;
  endedAt: string;
  defectQuantity: string;
  material: string;
  materialLot: string;
  quantityBefore: string;
  inputQuantity: string;
  quantityAfter: string;
}

interface ByproductRecord {
  productionDate: string;
  product: string;
  equipment: string;
  productionQuantity: string;
  productLot: string;
  byproduct: string;
  byproductLot: string;
  byproductQuantity: string;
  unit: string;
}

type ByproductRecordByResultId = {
  [resultId: string]: TableRowData<ByproductRecord>[];
};

const INITIAL_INPUT_ROWS: TableRowData<InputMaterialRecord>[] = [
  { id: "input-f171b", data: { productionDate: "2025.08.25", product: "PP볼 1.3t(3호)", equipment: "A1", productionQuantity: "1,000", productLot: "LOT조회", startedAt: "11:44", endedAt: "12:44", defectQuantity: "0", material: "F171B", materialLot: "250101-VD375-P0710-001", quantityBefore: "995,155", inputQuantity: "1,000", quantityAfter: "994,155" } },
  { id: "input-qb516", data: { productionDate: "2025.08.25", product: "PP볼 1.3t(3호)", equipment: "A1", productionQuantity: "1,000", productLot: "LOT조회", startedAt: "11:44", endedAt: "12:44", defectQuantity: "0", material: "QB516", materialLot: "250101-VD375-P0710-001", quantityBefore: "1,234", inputQuantity: "1,234", quantityAfter: "0" } },
  { id: "input-box", data: { productionDate: "2025.08.25", product: "PP볼 1.3t(3호)", equipment: "A1", productionQuantity: "1,000", productLot: "LOT조회", startedAt: "11:44", endedAt: "12:44", defectQuantity: "0", material: "박스", materialLot: "250101-VD375-P0710-001", quantityBefore: "7,234", inputQuantity: "6,000", quantityAfter: "1,234" } },
];

const BYPRODUCT_ROWS_BY_RESULT_ID: ByproductRecordByResultId = {
  p1: [{ id: "byproduct-ground-pp", data: { productionDate: "2025.10.30", product: "더블비안코뚜껑", equipment: "성형기 1호", productionQuantity: "2,000", productLot: "250825-A1-P0130-001", byproduct: "PP 분쇄재", byproductLot: "250825-A1-GR-001", byproductQuantity: "184", unit: "kg" } }],
  p2: [{ id: "byproduct-granules-1", data: { productionDate: "2025.10.29", product: "더블비안코뚜껑", equipment: "성형기 1호", productionQuantity: "2,000", productLot: "250825-A1-P0131-002", byproduct: "포장재 파우더", byproductLot: "250825-A1-PS-002", byproductQuantity: "23", unit: "kg" } }],
  p4: [{ id: "byproduct-crumbs-1", data: { productionDate: "2025.10.30", product: "비비빅", equipment: "성형기 2호", productionQuantity: "2,000", productLot: "250825-A2-P0130-003", byproduct: "시작부스러기", byproductLot: "250825-A2-BR-003", byproductQuantity: "8", unit: "kg" } }],
  p7: [{ id: "byproduct-box-1", data: { productionDate: "2025.10.27", product: "비비빅", equipment: "성형기 2호", productionQuantity: "2,000", productLot: "250825-A2-P0132-007", byproduct: "박스 잔량", byproductLot: "250825-A2-BX-007", byproductQuantity: "6", unit: "EA" } }],
};

const DEFAULT_BYPRODUCT_ROWS: TableRowData<ByproductRecord>[] = [
  { id: "byproduct-default", data: { productionDate: "2025.08.25", product: "PP볼 1.3t(3호)", equipment: "A1", productionQuantity: "1,000", productLot: "250825-A1-P0130-001", byproduct: "PP 분쇄재", byproductLot: "250825-A1-GR-001", byproductQuantity: "184", unit: "kg" } },
];

const FILTER_CATEGORIES: FilterCategory[] = [
  { id: "product", label: "품목", options: Array.from({ length: 23 }, (_, index) => ({ id: `product-${index + 1}`, label: index === 0 ? "PP볼 1.3t(3호)" : `품목 ${index + 1}` })) },
  { id: "productType", label: "품목구분", options: [
    { id: "all", label: "전체보기" },
    { id: "finished", label: "완제품" },
    { id: "semi-finished", label: "반제품" },
    { id: "material", label: "원재료" },
    { id: "subsidiary", label: "부자재" },
  ] },
];

function TableLink({ children }: { children: React.ReactNode }) {
  return <Link href="#" onClick={(event) => event.preventDefault()} className="text-[13px] font-semibold">{children}</Link>;
}

const INPUT_COLUMNS: TableColumn<InputMaterialRecord>[] = [
  { key: "productionDate", label: "생산일자", width: 112, align: "center", render: (row) => row.productionDate },
  { key: "product", label: "생산품목", width: 112, render: (row) => row.product },
  { key: "equipment", label: "설비", width: 100, align: "center", render: (row) => row.equipment },
  { key: "productionQuantity", label: "생산수량", width: 112, align: "right", render: (row) => row.productionQuantity },
  { key: "productLot", label: "생산품 LOT", width: 100, align: "center", render: () => <TableLink>LOT조회</TableLink> },
  { key: "startedAt", label: "생산시작시간", width: 100, align: "center", render: (row) => row.startedAt },
  { key: "endedAt", label: "생산종료시간", width: 100, align: "center", render: (row) => row.endedAt },
  { key: "defectQuantity", label: "불량수량", width: 100, align: "right", render: (row) => row.defectQuantity },
  { key: "material", label: "투입품", width: 112, render: (row) => row.material },
  { key: "materialLot", label: "투입품 LOT", width: 112, align: "center", render: (row) => <span className="text-[11px]">{row.materialLot}</span> },
  { key: "quantityBefore", label: "투입전 수량", width: 112, align: "right", render: (row) => row.quantityBefore },
  { key: "inputQuantity", label: "투입수량", width: 112, align: "right", render: (row) => row.inputQuantity },
  { key: "quantityAfter", label: "투입 후 잔량", width: 112, align: "right", render: (row) => row.quantityAfter },
  { key: "print", label: "출력", width: 98, align: "center", render: () => <TableLink>출력</TableLink> },
];

const BYPRODUCT_COLUMNS: TableColumn<ByproductRecord>[] = [
  { key: "productionDate", label: "생산일자", width: 120, align: "center", render: (row) => row.productionDate },
  { key: "product", label: "생산품목", width: 180, render: (row) => row.product },
  { key: "equipment", label: "설비", width: 100, align: "center", render: (row) => row.equipment },
  { key: "productionQuantity", label: "생산수량", width: 120, align: "right", render: (row) => row.productionQuantity },
  { key: "productLot", label: "생산품 LOT", width: 218, render: (row) => row.productLot },
  { key: "byproduct", label: "부산물", width: 180, render: (row) => row.byproduct },
  { key: "byproductLot", label: "부산물 LOT", width: 218, render: (row) => row.byproductLot },
  { key: "byproductQuantity", label: "부산물 수량", width: 140, align: "right", render: (row) => row.byproductQuantity },
  { key: "unit", label: "단위", width: 78, align: "center", render: (row) => row.unit },
  { key: "print", label: "출력", width: 100, align: "center", render: () => <TableLink>출력</TableLink> },
];

const formatByproductLabel = (rows: TableRowData<ByproductRecord>[]) => `${rows.length}건`;

function getByproductRows(resultId?: string) {
  if (!resultId) return DEFAULT_BYPRODUCT_ROWS;
  return BYPRODUCT_ROWS_BY_RESULT_ID[resultId] ?? DEFAULT_BYPRODUCT_ROWS;
}

function toCsv(inputRows: TableRowData<InputMaterialRecord>[], byproductRows: TableRowData<ByproductRecord>[]) {
  const header = ["생산일자", "생산품목", "설비", "생산수량", "생산품 LOT", "생산시작시간", "생산종료시간", "불량수량", "투입품", "투입품 LOT", "투입전 수량", "투입수량", "투입 후 잔량"];
  const inputBody = inputRows.map((row) => Object.values(row.data));
  const byproductHeader = ["생산일자", "생산품목", "설비", "생산수량", "생산품 LOT", "부산물", "부산물 LOT", "부산물 수량", "단위"];
  const byproductBody = byproductRows.map((row) => Object.values(row.data));
  return [header, ...inputBody, [], ["부산물 정보"], byproductHeader, ...byproductBody]
    .map((cells) => cells.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

interface MaterialInputInformationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceResultId?: string;
  sourceResultName?: string;
}

function MaterialInputInformationModal({ open, onOpenChange, sourceResultId, sourceResultName }: MaterialInputInformationModalProps) {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date(2025, 2, 30));
  const [endDate, setEndDate] = React.useState<Date | null>(new Date(2025, 2, 30));
  const [filters, setFilters] = React.useState<Record<string, string[]>>({ product: ["product-1", "product-2", "product-3", "product-4", "product-5"], productType: ["all"] });
  const [search, setSearch] = React.useState("");
  const [inputRows, setInputRows] = React.useState(INITIAL_INPUT_ROWS);
  const [status, setStatus] = React.useState("");
  const hasAddedInputRow = inputRows.length > INITIAL_INPUT_ROWS.length;
  const byproductRows = React.useMemo(() => getByproductRows(sourceResultId), [sourceResultId]);

  const visibleRows = React.useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ko-KR");
    if (!query) return inputRows;
    return inputRows.filter((row) => Object.values(row.data).some((value) => value.toLocaleLowerCase("ko-KR").includes(query)));
  }, [inputRows, search]);

  const download = () => {
    const blob = new Blob([`\uFEFF${toCsv(visibleRows, byproductRows)}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "투입정보.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("투입정보와 부산물 정보를 다운로드했습니다.");
  };

  const addInputRow = () => {
    const nextIndex = inputRows.length + 1;
    setInputRows((current) => [...current, { id: `input-added-${nextIndex}`, data: { ...INITIAL_INPUT_ROWS[0].data, material: `추가 투입품 ${nextIndex}`, materialLot: "LOT 미지정", quantityBefore: "0", inputQuantity: "0", quantityAfter: "0" } }]);
    setStatus("투입품목을 추가했습니다.");
  };

  const footer = (
    <footer className="grid h-[72px] shrink-0 grid-cols-3 items-center px-4 py-4">
      <Button size="small" variant="lineBlacktxt" startIcon={<IconDownload size={16} />} className="w-fit" onClick={download}>다운로드</Button>
      <Button size="basic" variant="fillBlack" className="w-[160px] justify-self-center" onClick={() => onOpenChange(false)}>닫기</Button>
      <Button size="small" variant="lineMain" startIcon={<IconPlus size={16} />} className="w-fit justify-self-end" onClick={addInputRow} disabled={inputRows.length > INITIAL_INPUT_ROWS.length}>투입품목 추가</Button>
      <p className="sr-only" aria-live="polite">{status}</p>
    </footer>
  );

  return (
    <CenterModal open={open} onOpenChange={onOpenChange} title={`투입정보${sourceResultName ? ` (${sourceResultName})` : ""}`} exactWidth={1536} maxHeight={680} bodyPadding="none" bodyAlign="stretch" scrollMode="content" footer={footer}>
      <SearchTableSection
        aria-label="투입정보 목록"
        title="투입정보 리스트"
        query={<div className="flex items-center gap-[10px]"><QueryDateRange label="일자" start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} /><Button size="small" className="w-[50px] px-0" onClick={() => setStatus(`${visibleRows.length}건을 조회했습니다.`)}>조회</Button></div>}
        toolbar={<div data-testid="material-input-info-toolbar" className="mt-3 flex h-12 shrink-0 items-center justify-between rounded-mes-control bg-mes-gray-20 px-3 py-2"><Filter categories={FILTER_CATEGORIES} value={filters} onChange={(categoryId, optionIds) => setFilters((current) => ({ ...current, [categoryId]: optionIds }))} /><SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="!w-[200px]" /></div>}
        tableClassName={hasAddedInputRow ? "mt-4 h-[282px] flex-none" : "mt-4 h-[252px] flex-none"}
        className="px-5 pt-4"
        table={<div data-testid="material-input-info-table-region" className={`${hasAddedInputRow ? "h-[282px]" : "h-[252px]"} overflow-hidden rounded-mes-control border border-mes-gray-30 bg-white`}>
          <Table className={`${hasAddedInputRow ? "h-[150px]" : "h-[120px]"} rounded-none border-0`} columns={INPUT_COLUMNS} rows={visibleRows} selectable={false} edgePadding={0} headerBackground="white" columnDividerMode="none" horizontalScroll={false} showMasterGroupToggles={false} />
          <SectionFrame data-candidate-pattern="section.nested-related-table" aria-label="부산물 정보" padding="standard" background="surface" className="border-t border-mes-gray-30" contentClassName="min-h-0">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-semibold leading-[1.5] text-mes-gray-130">부산물 정보</h4>
              <span className="text-[12px] text-mes-gray-70">{formatByproductLabel(byproductRows)}</span>
            </div>
            <Table className="mt-2 h-[60px] bg-white" columns={BYPRODUCT_COLUMNS} rows={byproductRows} selectable={false} edgePadding={0} headerBackground="white" columnDividerMode="none" horizontalScroll={false} showMasterGroupToggles={false} />
          </SectionFrame>
        </div>}
      />
    </CenterModal>
  );
}

function MaterialInputInformationVisualFixture() {
  const [open, setOpen] = React.useState(true);
  return <main data-visual-test="material-input-information" className="flex min-h-screen items-start bg-mes-gray-20 p-5"><Button variant="fillBlack" onClick={() => setOpen(true)}>투입정보 다시 열기</Button><MaterialInputInformationModal open={open} onOpenChange={setOpen} /></main>;
}

export { MaterialInputInformationModal, MaterialInputInformationVisualFixture };
