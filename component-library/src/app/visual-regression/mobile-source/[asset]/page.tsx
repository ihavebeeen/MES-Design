import { notFound } from "next/navigation";
import {
  MobilePopupSourceScreen,
  MobileSourceScreen,
  type MobilePopupScreenId,
  type MobileSourceScreenId,
} from "@/components/mobile/mobile-source-screens";

const sourceIds: MobileSourceScreenId[] = ["home", "receiving-list", "production-entry"];
const popupIds: Record<string, MobilePopupScreenId> = {
  "memo-popup": "memo",
  "numeric-popup": "numeric",
  "personnel-popup": "personnel",
};

export function generateStaticParams() {
  return [...sourceIds, ...Object.keys(popupIds)].map((asset) => ({ asset }));
}

export default async function MobileSourceVisualPage({ params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  const testChrome = <style>{`nextjs-portal { display: none !important; }`}</style>;
  if (sourceIds.includes(asset as MobileSourceScreenId)) return <>{testChrome}<MobileSourceScreen id={asset as MobileSourceScreenId} /></>;
  if (popupIds[asset]) return <>{testChrome}<MobilePopupSourceScreen id={popupIds[asset]} /></>;
  notFound();
}
