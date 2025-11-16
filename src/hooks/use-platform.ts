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
    if (cachedIsMac === null) {
      cachedIsMac = detectMac();
      setIsMac(cachedIsMac);
    }
  }, []);

  return { isMac };
};
