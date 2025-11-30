"use client";

import {
  ACTIVITY_BAR_WIDTH,
  SIDEBAR_PANEL_MAX_WIDTH,
  SIDEBAR_PANEL_MIN_WIDTH,
} from "@/app/constants/defaults";
import { ReactNode, useEffect, useState } from "react";

interface SidebarPanelProps {
  width: number;
  onWidthChange: (width: number) => void;
  children: ReactNode;
}

export const SidebarPanel = ({ width, onWidthChange, children }: SidebarPanelProps) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    const newWidth = Math.max(
      SIDEBAR_PANEL_MIN_WIDTH,
      Math.min(SIDEBAR_PANEL_MAX_WIDTH, e.clientX - ACTIVITY_BAR_WIDTH)
    );
    onWidthChange(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing]);

  return (
    <aside
      style={{ width: `${width}px`, left: `${ACTIVITY_BAR_WIDTH}px` }}
      className="bg-white border-r border-gray-200 h-screen fixed top-[102px] pt-4 px-3 print:hidden overflow-y-auto"
    >
      {children}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
      />
    </aside>
  );
};
