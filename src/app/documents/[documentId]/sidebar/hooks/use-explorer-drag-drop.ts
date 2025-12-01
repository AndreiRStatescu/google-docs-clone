import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

interface UseExplorerDragDropProps {
  updateDocument: (args: {
    id: Id<"documents">;
    parentFolderId?: Id<"folders"> | null;
  }) => Promise<any>;
  updateFolder: (args: {
    id: Id<"folders">;
    parentFolderId?: Id<"folders"> | null;
  }) => Promise<any>;
  onFolderExpand: (folderId: string) => void;
  getDocument: (docId: Id<"documents">) => { parentFolderId?: Id<"folders"> | null } | undefined;
}

interface UseExplorerDragDropReturn {
  draggedDocumentId: Id<"documents"> | null;
  draggedFolderId: Id<"folders"> | null;
  dropTargetId: string | null;
  handleDragStart: (e: React.DragEvent, docId: Id<"documents">) => void;
  handleFolderDragStart: (e: React.DragEvent, folderId: Id<"folders">) => void;
  handleDragEnd: () => void;
  handleDragOver: (e: React.DragEvent, targetId: string) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent, targetFolderId: Id<"folders"> | null) => Promise<void>;
  handleDropOnDocument: (e: React.DragEvent, targetDocId: Id<"documents">) => Promise<void>;
}

export const useExplorerDragDrop = ({
  updateDocument,
  updateFolder,
  onFolderExpand,
  getDocument,
}: UseExplorerDragDropProps): UseExplorerDragDropReturn => {
  const [draggedDocumentId, setDraggedDocumentId] = useState<Id<"documents"> | null>(null);
  const [draggedFolderId, setDraggedFolderId] = useState<Id<"folders"> | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, docId: Id<"documents">) => {
    setDraggedDocumentId(docId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", docId);
  }, []);

  const handleFolderDragStart = useCallback((e: React.DragEvent, folderId: Id<"folders">) => {
    setDraggedFolderId(folderId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", folderId);
    e.stopPropagation();
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedDocumentId(null);
    setDraggedFolderId(null);
    setDropTargetId(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // Don't allow dropping folder into itself
      if (draggedFolderId && targetId === draggedFolderId) {
        e.dataTransfer.dropEffect = "none";
        return;
      }

      setDropTargetId(targetId);
    },
    [draggedFolderId]
  );

  const handleDragLeave = useCallback(() => {
    setDropTargetId(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetFolderId: Id<"folders"> | null) => {
      e.preventDefault();
      e.stopPropagation();
      setDropTargetId(null);

      if (draggedDocumentId) {
        try {
          await updateDocument({
            id: draggedDocumentId,
            parentFolderId: targetFolderId ?? null,
          });
          toast.success("Document moved successfully");
          if (targetFolderId) {
            onFolderExpand(targetFolderId);
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
            parentFolderId: targetFolderId ?? null,
          });
          toast.success("Folder moved successfully");
          if (targetFolderId) {
            onFolderExpand(targetFolderId);
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
    },
    [draggedDocumentId, draggedFolderId, updateDocument, updateFolder, onFolderExpand]
  );

  const handleDropOnDocument = useCallback(
    async (e: React.DragEvent, targetDocId: Id<"documents">) => {
      e.preventDefault();
      e.stopPropagation();
      setDropTargetId(null);

      // Don't allow dropping on the dragged document itself
      if (draggedDocumentId === targetDocId) {
        return;
      }

      // Get the target document's parent folder
      const targetDoc = getDocument(targetDocId);
      const targetParentFolderId = targetDoc?.parentFolderId ?? null;

      if (draggedDocumentId) {
        try {
          await updateDocument({
            id: draggedDocumentId,
            parentFolderId: targetParentFolderId ?? null,
          });
          toast.success("Document moved successfully");
          if (targetParentFolderId) {
            onFolderExpand(targetParentFolderId);
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
            parentFolderId: targetParentFolderId ?? null,
          });
          toast.success("Folder moved successfully");
          if (targetParentFolderId) {
            onFolderExpand(targetParentFolderId);
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
    },
    [draggedDocumentId, draggedFolderId, updateDocument, updateFolder, onFolderExpand, getDocument]
  );

  return {
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
  };
};
