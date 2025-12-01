import { Id } from "../../../../../convex/_generated/dataModel";

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ExplorerContextMenuProps {
  type: "document" | "folder" | "empty";
  documentId?: Id<"documents">;
  documentTitle?: string;
  folderId?: Id<"folders"> | null;
  folderName?: string;
  children: React.ReactNode;
  onCreateDocument?: (folderId: Id<"folders"> | null) => void;
  onCreateFolder?: (folderId: Id<"folders"> | null) => void;
}

export const ExplorerContextMenu = ({
  type,
  documentId,
  documentTitle,
  folderId,
  folderName,
  children,
  onCreateDocument,
  onCreateFolder,
}: ExplorerContextMenuProps) => {
  const handleCreateDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderId !== undefined && onCreateDocument) {
      onCreateDocument(folderId);
    }
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderId !== undefined && onCreateFolder) {
      onCreateFolder(folderId);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {type === "document" && documentId && documentTitle && (
          <>
            <RenameDialog documentId={documentId} initialTitle={documentTitle}>
              <ContextMenuItem onSelect={e => e.preventDefault()}>Rename</ContextMenuItem>
            </RenameDialog>
            <RemoveDialog documentId={documentId}>
              <ContextMenuItem onSelect={e => e.preventDefault()}>Remove</ContextMenuItem>
            </RemoveDialog>
          </>
        )}
        {type === "folder" && folderId && (
          <>
            <ContextMenuItem onClick={handleCreateDocument}>Create new document</ContextMenuItem>
            <ContextMenuItem onClick={handleCreateFolder}>Create new folder</ContextMenuItem>
            {folderName && (
              <RenameDialog folderId={folderId} initialTitle={folderName}>
                <ContextMenuItem onSelect={e => e.preventDefault()}>Rename</ContextMenuItem>
              </RenameDialog>
            )}
            <RemoveDialog folderId={folderId}>
              <ContextMenuItem onSelect={e => e.preventDefault()}>Remove</ContextMenuItem>
            </RemoveDialog>
          </>
        )}
        {type === "empty" && (
          <>
            <ContextMenuItem onClick={handleCreateDocument}>Create new document</ContextMenuItem>
            <ContextMenuItem onClick={handleCreateFolder}>Create new folder</ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
