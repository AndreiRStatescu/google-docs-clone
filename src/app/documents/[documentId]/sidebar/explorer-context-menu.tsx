import { Id } from "../../../../../convex/_generated/dataModel";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ExplorerContextMenuProps {
  type: "document" | "folder" | "empty";
  documentId?: Id<"documents">;
  folderId?: Id<"folders">;
  children: React.ReactNode;
  onCreateDocument?: (folderId: Id<"folders">) => void;
  onCreateFolder?: (folderId: Id<"folders">) => void;
}

export const ExplorerContextMenu = ({
  type,
  documentId,
  folderId,
  children,
  onCreateDocument,
  onCreateFolder,
}: ExplorerContextMenuProps) => {
  const handleDocumentA = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option A for documents
    console.log("Document Option A", documentId);
  };

  const handleDocumentB = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option B for documents
    console.log("Document Option B", documentId);
  };

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

  const handleFolderD = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement Option D for folders
    console.log("Folder Option D", folderId);
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
        {type === "document" && (
          <>
            <ContextMenuItem onClick={handleDocumentA}>Option A</ContextMenuItem>
            <ContextMenuItem onClick={handleDocumentB}>Option B</ContextMenuItem>
            <ContextMenuItem onClick={handleDocumentC}>Option C</ContextMenuItem>
          </>
        )}
        {type === "folder" && (
          <>
            <ContextMenuItem onClick={handleCreateDocument}>Create new document</ContextMenuItem>
            <ContextMenuItem onClick={handleCreateFolder}>Create new folder</ContextMenuItem>
            <ContextMenuItem onClick={handleFolderD}>Option D</ContextMenuItem>
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
