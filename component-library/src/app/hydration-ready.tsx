"use client";

import * as React from "react";

export function HydrationReady() {
  React.useEffect(() => {
    document.documentElement.dataset.mesHydrated = "true";
    return () => {
      delete document.documentElement.dataset.mesHydrated;
    };
  }, []);

  return null;
}
