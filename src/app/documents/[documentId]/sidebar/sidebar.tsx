"use client";

import { ACTIVITY_EXPLORER } from "@/app/constants/activities";
import { ACTIVITY_BAR_WIDTH, EXPLORER_SIDEBAR_DEFAULT_WIDTH } from "@/app/constants/defaults";
import { useState } from "react";
import { ActivityBar } from "./activity-bar";
import { ExplorerSidebar } from "./explorer-sidebar";

interface SidebarProps {
  onWidthChange?: (totalWidth: number) => void;
}

export const Sidebar = ({ onWidthChange }: SidebarProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(EXPLORER_SIDEBAR_DEFAULT_WIDTH);
  const [activeActivity, setActiveActivity] = useState(ACTIVITY_EXPLORER);

  const handleWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    onWidthChange?.(ACTIVITY_BAR_WIDTH + newWidth);
  };

  return (
    <>
      <ActivityBar onActivityChange={setActiveActivity} />
      {activeActivity === ACTIVITY_EXPLORER && (
        <ExplorerSidebar width={sidebarWidth} onWidthChange={handleWidthChange} />
      )}
    </>
  );
};

export { type SidebarProps };
