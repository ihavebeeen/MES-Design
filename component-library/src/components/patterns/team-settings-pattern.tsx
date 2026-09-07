"use client";

import * as React from "react";
import { IconCopy, IconExclamationCircle } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { Link } from "@/components/ui/link";
import { SearchInput } from "@/components/ui/search-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, type TableColumn, type TableRowData } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface PermissionGroup {
  id: string;
  label: string;
  count?: string;
}

interface TeamMember {
  id: string;
  name: string;
  userId: string;
  currentTeam: string;
}

const permissionGroups: PermissionGroup[] = [
  { id: "accounting", label: "경리팀" },
  { id: "maintenance", label: "공무팀" },
  { id: "admin", label: "관리자", count: "5/6" },
  { id: "purchase", label: "구매팀" },
  { id: "molding", label: "성형현장", count: "3/6" },
  { id: "extrusion", label: "압출현장", count: "2/7" },
  { id: "research", label: "연구소" },
  { id: "sales-1", label: "영업팀" },
  { id: "sales-2", label: "영업팀" },
  { id: "sales-3", label: "영업팀" },
  { id: "sales-4", label: "영업팀" },
  { id: "sales-5", label: "영업팀" },
  { id: "sales-6", label: "영업팀" },
];

const members: TeamMember[] = [
  { id: "member-1", name: "김성형", userId: "asdf01", currentTeam: "C조" },
  { id: "member-2", name: "박성형", userId: "asdf01", currentTeam: "미설정" },
  { id: "member-3", name: "이해빈", userId: "asdf01", currentTeam: "B조" },
  { id: "member-4", name: "이해빈", userId: "asdf01", currentTeam: "A조" },
  { id: "member-5", name: "최성형", userId: "asdf01", currentTeam: "미설정" },
  { id: "member-6", name: "최성형", userId: "asdf01", currentTeam: "미설정" },
];

const initialSelectedIds = ["member-1", "member-2"];
const initialTeamDrafts: Record<string, string> = { "member-1": "A조", "member-2": "B조" };
const teamOptions = ["미설정", "A조", "B조", "C조"];

function createRows(): TableRowData<TeamMember>[] {
  return members.map((member) => ({ id: member.id, data: member }));
}

interface TeamSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TeamSettingsModal({ open, onOpenChange }: TeamSettingsModalProps) {
  const [activeGroup, setActiveGroup] = React.useState("molding");
  const [committedSelectedIds, setCommittedSelectedIds] = React.useState(initialSelectedIds);
  const [selectedIds, setSelectedIds] = React.useState(initialSelectedIds);
  const [committedTeamDrafts, setCommittedTeamDrafts] = React.useState(initialTeamDrafts);
  const [teamDrafts, setTeamDrafts] = React.useState(initialTeamDrafts);
  const [bulkTeam, setBulkTeam] = React.useState("미설정");
  const [search, setSearch] = React.useState("");

  const dismiss = React.useCallback(() => {
    setSelectedIds(committedSelectedIds);
    setTeamDrafts(committedTeamDrafts);
    setBulkTeam("미설정");
    setSearch("");
  }, [committedSelectedIds, committedTeamDrafts]);

  const selectGroup = (groupId: string) => {
    setActiveGroup(groupId);
    setSearch("");
  };

  const changeSelection = (ids: string[]) => {
    setSelectedIds(ids);
    setTeamDrafts((current) => {
      const next = { ...current };
      ids.forEach((id) => {
        if (!next[id]) next[id] = "미설정";
      });
      Object.keys(next).forEach((id) => {
        if (!ids.includes(id)) delete next[id];
      });
      return next;
    });
  };

  const applyBulk = () => {
    setTeamDrafts((current) => ({
      ...current,
      ...Object.fromEntries(selectedIds.map((id) => [id, bulkTeam])),
    }));
  };

  const confirm = () => {
    setCommittedSelectedIds(selectedIds);
    setCommittedTeamDrafts(teamDrafts);
    onOpenChange(false);
  };

  const visibleRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    return createRows().filter((row) => !query || row.data.name.toLowerCase().includes(query) || row.data.userId.toLowerCase().includes(query));
  }, [search]);

  const columns: TableColumn<TeamMember>[] = [
    { key: "name", label: "사용자명", width: 207, align: "center", render: (row) => row.name },
    { key: "userId", label: "사용자 ID", width: 207, align: "center", render: (row) => row.userId },
    { key: "currentTeam", label: "현재 조", width: 207, align: "center", render: (row) => <span className={row.currentTeam === "미설정" ? "text-mes-gray-60" : undefined}>{row.currentTeam}</span> },
    {
      key: "changedTeam",
      label: "변경 조",
      width: 207,
      align: "center",
      render: (row) => selectedIds.includes(row.id) ? (
        <Select value={teamDrafts[row.id] ?? "미설정"} onValueChange={(value) => setTeamDrafts((current) => ({ ...current, [row.id]: value }))}>
          <SelectTrigger size="small" aria-label={`${row.name} 변경 조`} className="mx-auto w-[195px]"><SelectValue /></SelectTrigger>
          <SelectContent>{teamOptions.map((team) => <SelectItem key={team} value={team}>{team}</SelectItem>)}</SelectContent>
        </Select>
      ) : null,
    },
    {
      key: "changed",
      label: "변경 여부",
      width: 100,
      align: "center",
      render: (row) => selectedIds.includes(row.id)
        ? <Badge variant="blueLight" className="h-5 rounded-full px-[10px]">변경</Badge>
        : "-",
    },
  ];

  const isEmpty = activeGroup === "research";

  return (
    <CenterModal
      open={open}
      onOpenChange={onOpenChange}
      onCancel={dismiss}
      onConfirm={confirm}
      title="조 설정"
      exactWidth={1280}
      exactHeight={768}
      maxHeight={768}
      bodyPadding="none"
      bodyAlign="stretch"
      scrollMode="content"
    >
      <div data-testid="team-settings-body" data-pattern="section.master-detail-composition" className="grid h-full min-h-0 grid-cols-[240px_1040px] overflow-hidden">
        <aside data-testid="permission-group-panel" className="min-h-0 border-r border-mes-gray-30 p-5">
          <div className="mb-[10px] flex h-6 items-center gap-[10px]">
            <h2 className="flex-1 text-[16px] font-bold leading-6 text-mes-gray-130">권한 그룹</h2>
            <IconExclamationCircle size={16} className="text-mes-gray-90" />
          </div>
          <div className="flex max-h-[592px] flex-col gap-2 overflow-y-auto">
            {permissionGroups.map((group) => (
              <Button
                key={group.id}
                size="small"
                variant="lineBlacktxt"
                className={cn(
                  "h-8 w-full justify-between px-[10px] text-left",
                  activeGroup === group.id && "border-mes-primary-60 bg-mes-primary-20 text-mes-primary-60 hover:bg-mes-primary-20"
                )}
                onClick={() => selectGroup(group.id)}
              >
                <span className="truncate">{group.label}</span>
                {group.count && <Badge variant="blueLight" className="h-[18px] w-[52px] rounded-full px-0">{group.count}</Badge>}
              </Button>
            ))}
          </div>
        </aside>

        <section data-testid="group-member-panel" className="flex min-h-0 flex-col">
          <div className="flex h-12 shrink-0 items-end justify-between px-5">
            <h2 className="pb-2 text-[16px] font-bold leading-6 text-mes-gray-130">그룹 구성원 리스트</h2>
            <SearchInput value={search} onChange={setSearch} placeholder="검색어 입력.." size="compact" background="white" className="mb-0 !w-[200px]" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-5 px-5 pb-5 pt-4">
            <div data-testid="team-bulk-toolbar" data-pattern="section.bulk-edit-bar" data-target-scope="selected" className="flex h-11 shrink-0 items-center justify-between rounded-mes-control border border-mes-gray-20 bg-mes-gray-20 px-[10px] py-1">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-mes-primary-100"><IconCopy size={14} />조 정보 일괄 변경</span>
              <div className="flex items-center gap-[10px]">
                <Select value={bulkTeam} onValueChange={setBulkTeam}>
                  <SelectTrigger aria-label="일괄 변경 조" className="w-[135px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{teamOptions.map((team) => <SelectItem key={team} value={team}>{team}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="small" className="w-[45px] px-0" onClick={applyBulk} disabled={selectedIds.length === 0}>적용</Button>
              </div>
            </div>

            <div data-testid="team-member-content" className="relative min-h-0 flex-1 overflow-hidden rounded-mes-control border border-mes-gray-30">
              {isEmpty ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[14px] leading-[1.5] text-mes-gray-60">해당 그룹에 구성원이 없습니다.<br />구성원을 먼저 등록해 주세요.</p>
                    <Link href="#group-member-list" className="mt-3 text-[13px]" onClick={(event) => { event.preventDefault(); selectGroup("molding"); }}>구성원 선택 바로가기</Link>
                  </div>
                </div>
              ) : (
                <Table
                  columns={columns}
                  rows={visibleRows}
                  selectedIds={selectedIds}
                  onSelectedIdsChange={changeSelection}
                  selectionColor="black"
                  unselectedCheckboxAppearance="grayCheck"
                  selectionHeaderIndeterminate={false}
                  edgePadding={0}
                  selectionColumnWidth={56}
                  centerSelection
                  headerBackground="white"
                  columnDividerMode="none"
                  horizontalScroll={false}
                  className="h-full border-0"
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </CenterModal>
  );
}

function TeamSettingsVisualFixture() {
  const [open, setOpen] = React.useState(true);
  const [key, setKey] = React.useState(0);
  return (
    <main className="relative h-[960px] w-[1440px] bg-white">
      <Button aria-label="조 설정 다시 열기" size="small" className="absolute left-5 top-5 opacity-0" onClick={() => { setKey((value) => value + 1); setOpen(true); }}>설정 열기</Button>
      <TeamSettingsModal key={key} open={open} onOpenChange={setOpen} />
    </main>
  );
}

export { TeamSettingsModal, TeamSettingsVisualFixture };
