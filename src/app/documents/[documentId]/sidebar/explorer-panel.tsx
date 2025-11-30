"use client";

import { useMutation, useQuery } from "convex/react";
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TEMPLATE_ID_BLANK, templates } from "../../../constants/templates";
import { ExplorerContextMenu } from "./explorer-context-menu";
import { ExplorerPanelToolbar } from "./explorer-panel-toolbar";

interface ExplorerPanelProps {
  sidebarWidth?: number;
}

export const ExplorerPanel = ({ sidebarWidth }: ExplorerPanelProps = {}) => {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;
  const [isCreating, setIsCreating] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [draggedDocumentId, setDraggedDocumentId] = useState<Id<"documents"> | null>(null);
  const [draggedFolderId, setDraggedFolderId] = useState<Id<"folders"> | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const currentDocument = useQuery(api.documents.getById, { id: documentId });
  const parentFolderId = currentDocument?.parentFolderId;
  const parentFolder = useQuery(
    api.folders.getById,
    parentFolderId ? { id: parentFolderId as Id<"folders"> } : "skip"
  );

  const folders = useQuery(api.folders.getByParentFolderId, { parentFolderId });
  const documents = useQuery(api.documents.getByParentFolderId, { parentFolderId });
  const createFolder = useMutation(api.folders.create);
  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.updateById);
  const updateFolder = useMutation(api.folders.updateById);

  const handleCreateFolder = async () => {
    await createFolder({
      name: "New Folder",
      parentFolderId: parentFolderId,
    });
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    const blankTemplate = templates[TEMPLATE_ID_BLANK];
    createDocument({
      title: blankTemplate.label,
      initialContent: blankTemplate.initialContent,
      contentType: blankTemplate.contentType,
    })
      .then(() => {
        toast.success("Document created successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const handleCreateDocumentInFolder = async (folderId: Id<"folders">) => {
    const blankTemplate = templates[TEMPLATE_ID_BLANK];
    createDocument({
      title: blankTemplate.label,
      initialContent: blankTemplate.initialContent,
      contentType: blankTemplate.contentType,
      parentFolderId: folderId,
    })
      .then(() => {
        toast.success("Document created successfully");
        expandFolder(folderId);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handleCreateFolderInFolder = async (parentFolderId: Id<"folders">) => {
    createFolder({
      name: "New Folder",
      parentFolderId: parentFolderId,
    })
      .then(() => {
        toast.success("Folder created successfully");
        expandFolder(parentFolderId);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const expandFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.add(folderId);
      return next;
    });
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, docId: Id<"documents">) => {
    setDraggedDocumentId(docId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", docId);
  };

  const handleFolderDragStart = (e: React.DragEvent, folderId: Id<"folders">) => {
    setDraggedFolderId(folderId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", folderId);
    e.stopPropagation();
  };

  const handleDragEnd = () => {
    setDraggedDocumentId(null);
    setDraggedFolderId(null);
    setDropTargetId(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Don't allow dropping folder into itself
    if (draggedFolderId && targetId === draggedFolderId) {
      e.dataTransfer.dropEffect = "none";
      return;
    }

    setDropTargetId(targetId);
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: Id<"folders"> | undefined) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTargetId(null);

    if (draggedDocumentId) {
      try {
        await updateDocument({
          id: draggedDocumentId,
          parentFolderId: targetFolderId || null,
        });
        toast.success("Document moved successfully");
        if (targetFolderId) {
          expandFolder(targetFolderId);
        }
      } catch (error) {
        toast.error("Failed to move document");
      } finally {
        setDraggedDocumentId(null);
      }
    } else if (draggedFolderId) {
      try {
        await updateFolder({
          id: draggedFolderId,
          parentFolderId: targetFolderId || null,
        });
        toast.success("Folder moved successfully");
        if (targetFolderId) {
          expandFolder(targetFolderId);
        }
      } catch (error: any) {
        if (error?.message?.includes("circular")) {
          toast.error("Cannot move folder into itself or its descendants");
        } else {
          toast.error("Failed to move folder");
        }
      } finally {
        setDraggedFolderId(null);
      }
    }
  };

  const FolderItem = ({ folder, level = 0 }: { folder: any; level?: number }) => {
    const subFolders = useQuery(api.folders.getByParentFolderId, { parentFolderId: folder._id });
    const docs = useQuery(api.documents.getByParentFolderId, { parentFolderId: folder._id });
    const isExpanded = expandedFolders.has(folder._id);

    return (
      <>
        <ExplorerContextMenu
          type="folder"
          folderId={folder._id}
          folderName={folder.name}
          onCreateDocument={handleCreateDocumentInFolder}
          onCreateFolder={handleCreateFolderInFolder}
        >
          <div
            draggable
            onDragStart={e => handleFolderDragStart(e, folder._id)}
            onDragEnd={handleDragEnd}
            onClick={() => toggleFolder(folder._id)}
            onDragOver={e => handleDragOver(e, folder._id)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, folder._id)}
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
              <FolderItem key={subFolder._id} folder={subFolder} level={level + 1} />
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
                  onDragStart={e => handleDragStart(e, doc._id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => window.open(`/documents/${doc._id}`, "_blank")}
                  className={`w-full flex items-center gap-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                    doc._id === documentId ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  } ${draggedDocumentId === doc._id ? "opacity-50" : ""}`}
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

  return (
    <>
      <ExplorerPanelToolbar
        parentFolderId={parentFolderId}
        parentFolderName={parentFolder?.name}
        sidebarWidth={sidebarWidth}
        isCreating={isCreating}
        onCreateDocument={handleCreateDocument}
        onCreateFolder={handleCreateFolder}
        onDragOver={e => handleDragOver(e, "root")}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(e, undefined)}
      />
      <nav className="space-y-1">
        {/* Folders first (alphabetically sorted) */}
        {folders?.map(folder => (
          <FolderItem key={folder._id} folder={folder} />
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
              onClick={() => window.open(`/documents/${doc._id}`, "_blank")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                doc._id === documentId ? "bg-blue-50 text-blue-700" : "text-gray-700"
              } ${draggedDocumentId === doc._id ? "opacity-50" : ""}`}
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
