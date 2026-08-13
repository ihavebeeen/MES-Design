"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CenterModal } from "@/components/ui/center-modal";
import { CavityContent } from "./original-mes-screen-assets";

function CavitySettingsVisualFixture() {
  const [open, setOpen] = React.useState(true);
  const [key, setKey] = React.useState(0);

  return (
    <main className="relative h-[960px] w-[1440px] bg-white">
      <Button aria-label="캐비티 배열 설정 다시 열기" size="small" className="absolute left-5 top-5 opacity-0" onClick={() => { setKey((value) => value + 1); setOpen(true); }}>설정 열기</Button>
      <CenterModal
        key={key}
        open={open}
        onOpenChange={setOpen}
        onCancel={() => undefined}
        onConfirm={() => setOpen(false)}
        title="캐비티 배열 설정"
        exactWidth={960}
        exactHeight={760}
        maxHeight={760}
        bodyPadding="none"
        bodyAlign="stretch"
        scrollMode="content"
      >
        <CavityContent />
      </CenterModal>
    </main>
  );
}

export { CavitySettingsVisualFixture };
