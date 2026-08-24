import { notFound } from "next/navigation";
import {
  MobilePopupSourceScreen,
  MobileSourceScreen,
  type MobilePopupScreenId,
  type MobileSourceScreenId,
} from "@/components/mobile/mobile-source-screens";
import { MobileRemainingMainScreen, type MobileRemainingMainScreenId } from "@/components/mobile/mobile-remaining-main-screens";
import { MobileRemainingPopupScreen, type MobileRemainingPopupScreenId } from "@/components/mobile/mobile-remaining-popup-screens";

const sourceIds: MobileSourceScreenId[] = ["home", "receiving-list", "production-entry", "all-menu", "appearance-inspection", "day-log"];
const popupIds: Record<string, MobilePopupScreenId> = {
  "memo-popup": "memo",
  "numeric-popup": "numeric",
  "personnel-popup": "personnel",
};
const remainingMainIds: MobileRemainingMainScreenId[] = [
  "receiving-result", "maintenance-form", "weight-inspection", "special-notes", "user-settings", "login-placeholder", "report-basic-info",
  "hourly-notes", "incoming-inspection-list", "shipping-inspection-list", "incoming-inspection-basic", "incoming-inspection-appearance", "equipment-inspection-list",
];
const remainingPopupIds: MobileRemainingPopupScreenId[] = [
  "bom-select-popup", "alarm-history-popup", "receiving-quantity-popup", "result-history-popup", "label-confirm-popup", "item-detail-popup", "lot-split-popup",
  "input-error-popup", "scan-item-popup", "work-time-popup", "production-quantity-mode-popup", "shipping-quantity-popup", "defect-entry-popup",
];

export function generateStaticParams() {
  return [...sourceIds, ...Object.keys(popupIds), ...remainingMainIds, ...remainingPopupIds].map((asset) => ({ asset }));
}

export default async function MobileSourceVisualPage({ params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const testChrome = <style>{`nextjs-portal { display: none !important; }`}</style>;
  if (sourceIds.includes(asset as MobileSourceScreenId)) return <>{testChrome}<MobileSourceScreen id={asset as MobileSourceScreenId} /></>;
  if (popupIds[asset]) return <>{testChrome}<MobilePopupSourceScreen id={popupIds[asset]} /></>;
  if (remainingMainIds.includes(asset as MobileRemainingMainScreenId)) return <>{testChrome}<MobileRemainingMainScreen id={asset as MobileRemainingMainScreenId} /></>;
  if (remainingPopupIds.includes(asset as MobileRemainingPopupScreenId)) return <>{testChrome}<MobileRemainingPopupScreen id={asset as MobileRemainingPopupScreenId} /></>;
  notFound();
}
