"use client";

import { Clock, FileText, FolderOpen, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarEntry {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
}

const sidebarEntries: SidebarEntry[] = [
  {
    id: "recent",
    label: "Recent Documents",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "starred",
    label: "Starred",
    icon: <Star className="w-5 h-5" />,
  },
  {
    id: "my-documents",
    label: "My Documents",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: "shared",
    label: "Shared with Me",
    icon: <FolderOpen className="w-5 h-5" />,
  },
  {
    id: "trash",
    label: "Trash",
    icon: <Trash2 className="w-5 h-5" />,
  },
];

interface SidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
}

export const Sidebar = ({ width, onWidthChange }: SidebarProps) => {
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    const newWidth = Math.max(200, Math.min(400, e.clientX));
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
      style={{ width: `${width}px` }}
      className="bg-white border-r border-gray-200 h-screen fixed left-0 top-[102px] pt-4 px-3 print:hidden"
    >
      <div className="mb-6 px-3">
        <h2 className="text-lg font-semibold text-gray-800">Documents</h2>
      </div>
      <nav className="space-y-1">
        {sidebarEntries.map(entry => (
          <button
            key={entry.id}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-500">{entry.icon}</span>
            <span>{entry.label}</span>
          </button>
        ))}
      </nav>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
      />
    </aside>
  );
};
