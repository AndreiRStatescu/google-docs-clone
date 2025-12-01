"use client";

import { useQuery } from "convex/react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ExplorerContextMenu } from "./explorer-context-menu";

interface FolderItemProps {
  folder: any;
  level?: number;
  documentId: Id<"documents">;
  expandedFolders: Set<string>;
  draggedDocumentId: Id<"documents"> | null;
  draggedFolderId: Id<"folders"> | null;
  dropTargetId: string | null;
  onToggleFolder: (folderId: string) => void;
  onNavigateDown?: (folderId: Id<"folders">) => void;
  onDragStart: (e: React.DragEvent, docId: Id<"documents">) => void;
  onFolderDragStart: (e: React.DragEvent, folderId: Id<"folders">) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, targetId: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetFolderId: Id<"folders"> | null) => Promise<void>;
  onDropOnDocument: (e: React.DragEvent, targetDocId: Id<"documents">) => Promise<void>;
  onCreateDocument: (folderId: Id<"folders">) => Promise<void>;
  onCreateFolder: (parentFolderId: Id<"folders">) => Promise<void>;
}

export const FolderItem = ({
  folder,
  level = 0,
  documentId,
  expandedFolders,
  draggedDocumentId,
  draggedFolderId,
  dropTargetId,
  onToggleFolder,
  onNavigateDown,
  onDragStart,
  onFolderDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onDropOnDocument,
  onCreateDocument,
  onCreateFolder,
}: FolderItemProps) => {
  const subFolders = useQuery(api.folders.getByParentFolderId, { parentFolderId: folder._id });
  const docs = useQuery(api.documents.getByParentFolderId, { parentFolderId: folder._id });
  const isExpanded = expandedFolders.has(folder._id);

  return (
    <>
      <ExplorerContextMenu
        type="folder"
        folderId={folder._id}
        folderName={folder.name}
        onCreateDocument={onCreateDocument}
        onCreateFolder={onCreateFolder}
      >
        <div
          draggable
          onDragStart={e => onFolderDragStart(e, folder._id)}
          onDragEnd={onDragEnd}
          onClick={() => onToggleFolder(folder._id)}
          onDoubleClick={() => onNavigateDown?.(folder._id)}
          onDragOver={e => onDragOver(e, folder._id)}
          onDragLeave={onDragLeave}
          onDrop={e => onDrop(e, folder._id)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${
            dropTargetId === folder._id && draggedFolderId !== folder._id
              ? "bg-blue-100 ring-2 ring-blue-400"
              : ""
          } ${draggedFolderId === folder._id ? "opacity-50" : ""}`}
          style={{ paddingLeft: `${0.75 + level * 1}rem` }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 shrink-0" />
          )}
          <Folder className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="truncate">{folder.name}</span>
        </div>
      </ExplorerContextMenu>

      {isExpanded && (
        <>
          {/* Nested folders */}
          {subFolders?.map(subFolder => (
            <FolderItem
              key={subFolder._id}
              folder={subFolder}
              level={level + 1}
              documentId={documentId}
              expandedFolders={expandedFolders}
              draggedDocumentId={draggedDocumentId}
              draggedFolderId={draggedFolderId}
              dropTargetId={dropTargetId}
              onToggleFolder={onToggleFolder}
              onNavigateDown={onNavigateDown}
              onDragStart={onDragStart}
              onFolderDragStart={onFolderDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onDropOnDocument={onDropOnDocument}
              onCreateDocument={onCreateDocument}
              onCreateFolder={onCreateFolder}
            />
          ))}

          {/* Documents in this folder */}
          {docs?.map(doc => (
            <ExplorerContextMenu
              key={doc._id}
              type="document"
              documentId={doc._id}
              documentTitle={doc.title}
            >
              <button
                draggable
                onDragStart={e => onDragStart(e, doc._id)}
                onDragEnd={onDragEnd}
                onDragOver={e => onDragOver(e, doc._id)}
                onDragLeave={onDragLeave}
                onDrop={e => onDropOnDocument(e, doc._id)}
                onClick={() => window.open(`/documents/${doc._id}`, "_blank")}
                className={`w-full flex items-center gap-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                  doc._id === documentId ? "bg-blue-50 text-blue-700" : "text-gray-700"
                } ${draggedDocumentId === doc._id ? "opacity-50" : ""} ${
                  dropTargetId === doc._id ? "bg-blue-100 ring-2 ring-blue-400" : ""
                }`}
                style={{
                  paddingLeft: `${0.75 + (level + 1) * 1 + 1.5}rem`,
                  paddingRight: "0.75rem",
                }}
              >
                <File className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{doc.title}</span>
              </button>
            </ExplorerContextMenu>
          ))}
        </>
      )}
    </>
  );
};
