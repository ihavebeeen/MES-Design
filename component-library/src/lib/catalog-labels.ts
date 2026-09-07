export const ASSET_SCOPE_LABELS: Record<number, string> = {
  1: "기본",
  2: "보조",
  3: "확장",
  4: "특수",
  5: "안내",
};

export function getAssetScopeLabel(tier?: number) {
  return tier ? ASSET_SCOPE_LABELS[tier] ?? "기타" : "공통";
}

export function getAssetStatusLabel(status?: string) {
  return status === "stable" ? "기준 확정" : "검토 필요";
}
