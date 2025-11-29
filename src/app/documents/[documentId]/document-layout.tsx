"use client";

import { Preloaded } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import Document from "./document";
import { Sidebar } from "./sidebar/sidebar";

interface DocumentLayoutProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export const DocumentLayout = ({ preloadedDocument }: DocumentLayoutProps) => {
  const [sidebarWidth, setSidebarWidth] = useState(256);

  return (
    <div className="flex">
      <Sidebar width={sidebarWidth} onWidthChange={setSidebarWidth} />
      <div style={{ marginLeft: `${sidebarWidth}px` }} className="flex-1 bg-[#FAFBFD]">
        <Document preloadedDocument={preloadedDocument} />
      </div>
    </div>
  );
};
