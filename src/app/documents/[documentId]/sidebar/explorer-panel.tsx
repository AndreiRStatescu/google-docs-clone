"use client";

import { useMutation, useQuery } from "convex/react";
import { ChevronDown, ChevronRight, File, FilePlus, Folder, FolderPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TEMPLATE_ID_BLANK, templates } from "../../../constants/templates";
import { ExplorerContextMenu } from "./explorer-context-menu";

export const ExplorerPanel = () => {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;
  const [isCreating, setIsCreating] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [draggedDocumentId, setDraggedDocumentId] = useState<Id<"documents"> | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const currentDocument = useQuery(api.documents.getById, { id: documentId });
  const parentFolderId = currentDocument?.parentFolderId;

  const folders = useQuery(api.folders.getByParentFolderId, { parentFolderId });
  const documents = useQuery(api.documents.getByParentFolderId, { parentFolderId });
  const createFolder = useMutation(api.folders.create);
  const createDocument = useMutation(api.documents.create);
  const updateDocument = useMutation(api.documents.updateById);

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

  const handleDragEnd = () => {
    setDraggedDocumentId(null);
    setDropTargetId(null);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropTargetId(targetId);
  };

  const handleDragLeave = () => {
    setDropTargetId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: Id<"folders"> | undefined) => {
    e.preventDefault();
    setDropTargetId(null);

    if (!draggedDocumentId) return;

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
            onClick={() => toggleFolder(folder._id)}
            onDragOver={e => handleDragOver(e, folder._id)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, folder._id)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${
              dropTargetId === folder._id ? "bg-blue-100 ring-2 ring-blue-400" : ""
            }`}
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
      <div
        className="mb-4 px-3 flex items-center justify-between"
        onDragOver={e => handleDragOver(e, "root")}
        onDragLeave={handleDragLeave}
        onDrop={e => handleDrop(e, undefined)}
      >
        <h2 className="text-lg font-semibold text-gray-800">My Drive</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Create new blank document"
          >
            <FilePlus style={{ width: "1rem", height: "1rem" }} />
          </button>
          <button
            onClick={handleCreateFolder}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Create new folder"
          >
            <FolderPlus style={{ width: "1rem", height: "1rem" }} />
          </button>
        </div>
      </div>
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
