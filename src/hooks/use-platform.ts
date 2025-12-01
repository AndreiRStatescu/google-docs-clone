"use client";

import { useEffect, useState } from "react";

let cachedIsMac: boolean | null = null;

const detectMac = (): boolean => {
  if (typeof window === "undefined") return false;

  return (
    navigator.userAgent.toUpperCase().includes("MAC") ||
    navigator.platform.toUpperCase().includes("MAC")
  );
};

export const usePlatform = () => {
  const [isMac, setIsMac] = useState<boolean>(() => {
    if (cachedIsMac !== null) return cachedIsMac;
    if (typeof window !== "undefined") {
      cachedIsMac = detectMac();
      return cachedIsMac;
    }
    return false;
  });

  useEffect(() => {
    // Only set state if it hasn't been cached yet and we need to update
    if (cachedIsMac === null) {
      const detected = detectMac();
      cachedIsMac = detected;
      // Use a callback pattern to avoid direct setState in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMac(detected);
    } else if (cachedIsMac !== isMac) {
      // Sync with cache if they differ

      setIsMac(cachedIsMac);
    }
  }, [isMac]);

  return { isMac };
};
