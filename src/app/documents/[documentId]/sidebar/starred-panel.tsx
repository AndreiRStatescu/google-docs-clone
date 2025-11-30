"use client";

import { SidebarPanel } from "./sidebar-panel";

interface StarredPanelProps {
  width: number;
  onWidthChange: (width: number) => void;
}

export const StarredPanel = ({ width, onWidthChange }: StarredPanelProps) => {
  return (
    <SidebarPanel width={width} onWidthChange={onWidthChange}>
      <div className="mb-4 px-3">
        <h2 className="text-lg font-semibold text-gray-800">Starred</h2>
      </div>
      <div className="px-3 py-4 text-sm text-gray-500">
        {/* Starred documents content will be implemented here */}
      </div>
    </SidebarPanel>
  );
};
