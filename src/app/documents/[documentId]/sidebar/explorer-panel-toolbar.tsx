"use client";

import { FilePlus, FolderPlus, FolderUp } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ExplorerPanelBreadcrumb } from "./explorer-panel-breadcrumb";

interface ExplorerPanelToolbarProps {
  parentFolderId?: string | null;
  parentFolderName?: string;
  sidebarWidth?: number;
  isCreating: boolean;
  onCreateDocument: () => void;
  onCreateFolder: () => void;
  onNavigateUp?: () => void;
  onNavigate?: (folderId: Id<"folders"> | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ExplorerPanelToolbar = ({
  parentFolderId,
  parentFolderName,
  sidebarWidth,
  isCreating,
  onCreateDocument,
  onCreateFolder,
  onNavigateUp,
  onNavigate,
  onDragOver,
  onDragLeave,
  onDrop,
}: ExplorerPanelToolbarProps) => {
  return (
    <>
      <div className="px-3">
        <ExplorerPanelBreadcrumb
          parentFolderId={parentFolderId}
          availableWidth={sidebarWidth}
          onNavigate={onNavigate}
        />
      </div>
      <div
        className="mb-4 px-3 flex items-center justify-between"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <h2 className="text-lg font-semibold text-gray-800 truncate min-w-0 flex-1 mr-2">
          {parentFolderName || "My Drive"}
        </h2>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onNavigateUp}
            disabled={!parentFolderId}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Navigate up one level"
          >
            <FolderUp style={{ width: "1rem", height: "1rem" }} />
          </button>
          <button
            onClick={onCreateDocument}
            disabled={isCreating}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Create new blank document"
          >
            <FilePlus style={{ width: "1rem", height: "1rem" }} />
          </button>
          <button
            onClick={onCreateFolder}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Create new folder"
          >
            <FolderPlus style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>
      </div>
    </>
  );
};
