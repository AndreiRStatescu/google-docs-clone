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
  folderId?: Id<"folders">;
  folderName?: string;
  children: React.ReactNode;
  onCreateDocument?: (folderId: Id<"folders">) => void;
  onCreateFolder?: (folderId: Id<"folders">) => void;
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
  const handleDocumentC = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option C for documents
    console.log("Document Option C", documentId);
  };

  const handleCreateDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderId && onCreateDocument) {
      onCreateDocument(folderId);
    }
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (folderId && onCreateFolder) {
      onCreateFolder(folderId);
    }
  };

  const handleFolderE = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option E for folders
    console.log("Folder Option E", folderId);
  };

  const handleEmptyF = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option F for empty area
    console.log("Empty Option F");
  };

  const handleEmptyG = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option G for empty area
    console.log("Empty Option G");
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
            <ContextMenuItem onClick={handleDocumentC}>Option C</ContextMenuItem>
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
            <ContextMenuItem onClick={handleFolderE}>Option E</ContextMenuItem>
          </>
        )}
        {type === "empty" && (
          <>
            <ContextMenuItem onClick={handleEmptyF}>Option F</ContextMenuItem>
            <ContextMenuItem onClick={handleEmptyG}>Option G</ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
