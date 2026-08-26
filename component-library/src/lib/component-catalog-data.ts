import catalogData from "@/design-system/registry/component-catalog.json";

export interface ComponentCatalogGroup {
  id: string;
  label: string;
  labelEn: string;
  description: string;
  itemIds: string[];
}

export const COMPONENT_CATALOG_GROUPS = catalogData.groups as ComponentCatalogGroup[];

const registryAliases = catalogData.registryAliases as Record<string, string>;

export function getCatalogRegistryId(id: string) {
  return registryAliases[id] ?? id;
}

export const COMPONENT_CATALOG_ID_SET = new Set(COMPONENT_CATALOG_GROUPS.flatMap((group) => group.itemIds));
