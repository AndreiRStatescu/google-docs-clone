"use client";

import { SidebarPanel } from "./sidebar-panel";

interface RecentPanelProps {
  width: number;
  onWidthChange: (width: number) => void;
}

export const RecentPanel = ({ width, onWidthChange }: RecentPanelProps) => {
  return (
    <SidebarPanel width={width} onWidthChange={onWidthChange}>
      <div className="mb-4 px-3">
        <h2 className="text-lg font-semibold text-gray-800">Recent</h2>
      </div>
      <div className="px-3 py-4 text-sm text-gray-500">
        {/* Recent documents content will be implemented here */}
      </div>
    </SidebarPanel>
  );
};
