"use client";

import {
  ACTIVITY_EXPLORER,
  ACTIVITY_RECENT,
  ACTIVITY_SEARCH,
  ACTIVITY_STARRED,
} from "@/app/constants/activities";
import { ACTIVITY_BAR_WIDTH, SIDEBAR_PANEL_DEFAULT_WIDTH } from "@/app/constants/defaults";
import { useState } from "react";
import { ActivityBar } from "./activity-bar";
import { ExplorerPanel } from "./explorer-panel";
import { RecentPanel } from "./recent-panel";
import { SearchPanel } from "./search-panel";
import { SidebarPanel } from "./sidebar-panel";
import { StarredPanel } from "./starred-panel";

interface SidebarProps {
  onWidthChange?: (totalWidth: number) => void;
}

export const Sidebar = ({ onWidthChange }: SidebarProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_PANEL_DEFAULT_WIDTH);
  const [activeActivity, setActiveActivity] = useState<string | null>(ACTIVITY_EXPLORER);

  const handleWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    onWidthChange?.(ACTIVITY_BAR_WIDTH + newWidth);
  };

  const handleActivityChange = (activity: string | null) => {
    setActiveActivity(activity);
    if (activity === null) {
      onWidthChange?.(ACTIVITY_BAR_WIDTH);
    } else {
      onWidthChange?.(ACTIVITY_BAR_WIDTH + sidebarWidth);
    }
  };

  return (
    <>
      <ActivityBar onActivityChange={handleActivityChange} />
      <SidebarPanel
        width={sidebarWidth}
        onWidthChange={handleWidthChange}
        isVisible={activeActivity === ACTIVITY_EXPLORER}
      >
        <ExplorerPanel sidebarWidth={sidebarWidth} />
      </SidebarPanel>
      <SidebarPanel
        width={sidebarWidth}
        onWidthChange={handleWidthChange}
        isVisible={activeActivity === ACTIVITY_SEARCH}
      >
        <SearchPanel />
      </SidebarPanel>
      <SidebarPanel
        width={sidebarWidth}
        onWidthChange={handleWidthChange}
        isVisible={activeActivity === ACTIVITY_RECENT}
      >
        <RecentPanel />
      </SidebarPanel>
      <SidebarPanel
        width={sidebarWidth}
        onWidthChange={handleWidthChange}
        isVisible={activeActivity === ACTIVITY_STARRED}
      >
        <StarredPanel />
      </SidebarPanel>
    </>
  );
};

export { type SidebarProps };
