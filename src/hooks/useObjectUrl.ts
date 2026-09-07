"use client";

import * as React from "react";
import { createObjectURL, revokeObjectURL } from "@/lib/engines/file";

export function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!blob) { setUrl(null); return; }
    const nextUrl = createObjectURL(blob); setUrl(nextUrl);
    return () => revokeObjectURL(nextUrl);
  }, [blob]);
  return url;
}
