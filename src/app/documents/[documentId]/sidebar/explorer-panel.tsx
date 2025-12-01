"use client";

import { useMutation, useQuery } from "convex/react";
import { File } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { ExplorerContextMenu } from "./explorer-context-menu";
import { ExplorerPanelToolbar } from "./explorer-panel-toolbar";
import { FolderItem } from "./folder-item";
import { useExplorerActions } from "./hooks/use-explorer-actions";
import { useExplorerDragDrop } from "./hooks/use-explorer-drag-drop";
import { useFolderExpansion } from "./hooks/use-folder-expansion";

interface ExplorerPanelProps {
  sidebarWidth?: number;
}

export const ExplorerPanel = ({ sidebarWidth }: ExplorerPanelProps = {}) => {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;

  const currentDocument = useQuery(api.documents.getById, { id: documentId });

  // Pin the parent folder ID on initial load to prevent Explorer from changing
  // when the current document is moved to a different folder
  const [pinnedParentFolderId, setPinnedParentFolderId] = useState<
    Id<"folders"> | null | undefined
  >(undefined);

  // Initialize the pinned folder ID once when the document loads
  const parentFolderId =
    pinnedParentFolderId === undefined
      ? (currentDocument?.parentFolderId ?? null)
      : pinnedParentFolderId;

  const parentFolder = useQuery(
    api.folders.getById,
    parentFolderId ? { id: parentFolderId } : "skip"
  );

  const handleNavigateUp = () => {
    if (parentFolder) {
      setPinnedParentFolderId(parentFolder.parentFolderId ?? null);
    }
  };

  const handleNavigateDown = (folderId: Id<"folders">) => {
    setPinnedParentFolderId(folderId);
  };

  const folders = useQuery(api.folders.getByParentFolderId, { parentFolderId });
  const documents = useQuery(api.documents.getByParentFolderId, { parentFolderId });
  const allDocuments = useQuery(api.documents.get, {
    paginationOpts: { numItems: 1000, cursor: null },
  });

  // Mutations
  const createFolder = useMutation(api.folders.create);
  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.updateById);
  const updateFolder = useMutation(api.folders.updateById);

  // Custom hooks
  const { expandedFolders, expandFolder, toggleFolder } = useFolderExpansion();

  const {
    isCreating,
    handleCreateFolder,
    handleCreateDocument,
    handleCreateDocumentInFolder,
    handleCreateFolderInFolder,
  } = useExplorerActions({
    createFolder,
    createDocument,
    onFolderExpand: expandFolder,
    parentFolderId: parentFolderId,
  });

  const {
    draggedDocumentId,
    draggedFolderId,
    dropTargetId,
    handleDragStart,
    handleFolderDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDropOnDocument,
  } = useExplorerDragDrop({
    updateDocument,
    updateFolder,
    onFolderExpand: expandFolder,
    getDocument: docId => allDocuments?.page.find(d => d._id === docId),
  });

  return (
    <>
      <ExplorerPanelToolbar
        parentFolderId={parentFolderId}
        parentFolderName={parentFolder?.name}
        sidebarWidth={sidebarWidth}
        isCreating={isCreating}
        onCreateDocument={handleCreateDocument}
        onCreateFolder={handleCreateFolder}
        onNavigateUp={handleNavigateUp}
        onDragOver={e => handleDragOver(e, "root")}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(e, null)}
      />
      <nav className="space-y-1">
        {/* Folders first (alphabetically sorted) */}
        {folders?.map(folder => (
          <FolderItem
            key={folder._id}
            folder={folder}
            documentId={documentId}
            expandedFolders={expandedFolders}
            draggedDocumentId={draggedDocumentId}
            draggedFolderId={draggedFolderId}
            dropTargetId={dropTargetId}
            onToggleFolder={toggleFolder}
            onNavigateDown={handleNavigateDown}
            onDragStart={handleDragStart}
            onFolderDragStart={handleFolderDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDropOnDocument={handleDropOnDocument}
            onCreateDocument={handleCreateDocumentInFolder}
            onCreateFolder={handleCreateFolderInFolder}
          />
        ))}

        {/* Documents next (alphabetically sorted) */}
        {documents?.map(doc => (
          <ExplorerContextMenu
            key={doc._id}
            type="document"
            documentId={doc._id}
            documentTitle={doc.title}
          >
            <button
              draggable
              onDragStart={e => handleDragStart(e, doc._id)}
              onDragEnd={handleDragEnd}
              onDragOver={e => handleDragOver(e, doc._id)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDropOnDocument(e, doc._id)}
              onClick={() => window.open(`/documents/${doc._id}`, "_blank")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                doc._id === documentId ? "bg-blue-50 text-blue-700" : "text-gray-700"
              } ${draggedDocumentId === doc._id ? "opacity-50" : ""} ${
                dropTargetId === doc._id ? "bg-blue-100 ring-2 ring-blue-400" : ""
              }`}
            >
              <File className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{doc.title}</span>
            </button>
          </ExplorerContextMenu>
        ))}

        {folders?.length === 0 && documents?.length === 0 && (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">No items in this folder</div>
        )}
      </nav>
      <ExplorerContextMenu type="empty">
        <div className="flex-1 min-h-6"></div>
      </ExplorerContextMenu>
    </>
  );
};
