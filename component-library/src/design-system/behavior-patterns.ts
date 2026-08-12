import * as React from "react";

export type StableId = string | number;

export interface SelectionBehaviorOptions<Id extends StableId> {
  initialSelectedIds?: Id[];
}

/** 선택 ID를 단일 진실 공급원으로 두고 숨겨진 행의 선택은 필터 변경 뒤에도 보존한다. */
export function useSelectionBehavior<Id extends StableId>({ initialSelectedIds = [] }: SelectionBehaviorOptions<Id> = {}) {
  const [selectedIds, setSelectedIds] = React.useState<Id[]>(initialSelectedIds);
  const selectedSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  const isSelected = React.useCallback((id: Id) => selectedSet.has(id), [selectedSet]);
  const clear = React.useCallback(() => setSelectedIds([]), []);
  const setVisibleSelection = React.useCallback((visibleIds: Id[], selectedVisibleIds: Id[]) => {
    const visibleSet = new Set(visibleIds);
    setSelectedIds((current) => [...current.filter((id) => !visibleSet.has(id)), ...selectedVisibleIds]);
  }, []);

  return { selectedIds, selectedSet, setSelectedIds, setVisibleSelection, isSelected, clear, selectedCount: selectedIds.length };
}

export interface MasterDetailSelectionOptions<Id extends StableId> {
  ids: Id[];
  initialActiveId?: Id;
  fallback?: "first" | "none";
}

/** 체크박스 선택과 별개의 active master ID를 소유하고 제거된 master의 fallback을 명시한다. */
export function useMasterDetailSelection<Id extends StableId>({ ids, initialActiveId, fallback = "first" }: MasterDetailSelectionOptions<Id>) {
  const fallbackId = fallback === "first" ? ids[0] : undefined;
  const [requestedActiveId, setActiveId] = React.useState<Id | undefined>(initialActiveId ?? fallbackId);
  const activeId = requestedActiveId !== undefined && ids.includes(requestedActiveId) ? requestedActiveId : fallbackId;

  return { activeId, setActiveId, clearActive: () => setActiveId(undefined) };
}

export interface CommittedDraftOptions<T> {
  initialValue: T;
  clone: (value: T) => T;
}

/** 저장된 snapshot과 편집 draft를 분리하고 모든 사용자 dismiss에서 같은 restore를 호출한다. */
export function useCommittedDraft<T>({ initialValue, clone }: CommittedDraftOptions<T>) {
  const [draft, setDraft] = React.useState<T>(() => clone(initialValue));
  const committed = React.useRef<T>(clone(initialValue));
  const commit = React.useCallback(() => {
    committed.current = clone(draft);
    return clone(committed.current);
  }, [clone, draft]);
  const restore = React.useCallback(() => setDraft(clone(committed.current)), [clone]);

  return { draft, setDraft, commit, restore, committed };
}

export interface RowMutationPolicyOptions<Row, Id extends StableId> {
  initialRows: Row[];
  rows?: Row[];
  onRowsChange?: React.Dispatch<React.SetStateAction<Row[]>>;
  getId: (row: Row) => Id;
  createRow: (previousRow: Row | undefined) => Row;
  canAdd?: (rows: Row[]) => boolean;
  minRows?: number;
  insertPosition?: "start" | "end";
}

/** stable ID·추가 guard·삽입 위치·최소 행 수를 한 계약으로 관리한다. */
export function useRowMutationPolicy<Row, Id extends StableId>({
  initialRows,
  rows: controlledRows,
  onRowsChange,
  getId,
  createRow,
  canAdd = () => true,
  minRows = 0,
  insertPosition = "end",
}: RowMutationPolicyOptions<Row, Id>) {
  const [internalRows, setInternalRows] = React.useState<Row[]>(initialRows);
  const rows = controlledRows ?? internalRows;
  const setRows = React.useCallback<React.Dispatch<React.SetStateAction<Row[]>>>((action) => {
    if (onRowsChange) onRowsChange(action);
    else setInternalRows(action);
  }, [onRowsChange]);
  const addAllowed = canAdd(rows);
  const add = React.useCallback(() => {
    if (!canAdd(rows)) return false;
    const next = createRow(rows[rows.length - 1]);
    const nextId = getId(next);
    if (rows.some((row) => getId(row) === nextId)) throw new Error(`Duplicate row id: ${String(nextId)}`);
    setRows((current) => insertPosition === "start" ? [next, ...current] : [...current, next]);
    return true;
  }, [canAdd, createRow, getId, insertPosition, rows, setRows]);
  const remove = React.useCallback((id: Id) => {
    setRows((current) => current.length <= minRows ? current : current.filter((row) => getId(row) !== id));
  }, [getId, minRows, setRows]);

  return { rows, setRows, add, remove, addAllowed, canDelete: rows.length > minRows };
}
