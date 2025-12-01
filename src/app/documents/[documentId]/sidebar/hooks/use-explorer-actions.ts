import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { TEMPLATE_ID_BLANK, templates } from "../../../../constants/templates";

interface UseExplorerActionsProps {
  createFolder: (args: {
    name: string;
    parentFolderId: Id<"folders"> | null;
  }) => Promise<Id<"folders">>;
  createDocument: (args: {
    title: string;
    initialContent: string;
    contentType: string;
    parentFolderId?: Id<"folders"> | null;
  }) => Promise<Id<"documents">>;
  onFolderExpand: (folderId: string) => void;
  parentFolderId: Id<"folders"> | null;
}

interface UseExplorerActionsReturn {
  isCreating: boolean;
  handleCreateFolder: () => Promise<void>;
  handleCreateDocument: () => Promise<void>;
  handleCreateDocumentInFolder: (folderId: Id<"folders"> | null) => Promise<void>;
  handleCreateFolderInFolder: (parentFolderId: Id<"folders"> | null) => Promise<void>;
}

export const useExplorerActions = ({
  createFolder,
  createDocument,
  onFolderExpand,
  parentFolderId,
}: UseExplorerActionsProps): UseExplorerActionsReturn => {
  const [isCreating, setIsCreating] = useState(false);

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
      parentFolderId: parentFolderId,
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

  const handleCreateDocumentInFolder = async (folderId: Id<"folders"> | null) => {
    const blankTemplate = templates[TEMPLATE_ID_BLANK];
    createDocument({
      title: blankTemplate.label,
      initialContent: blankTemplate.initialContent,
      contentType: blankTemplate.contentType,
      parentFolderId: folderId,
    })
      .then(() => {
        toast.success("Document created successfully");
        if (folderId) {
          onFolderExpand(folderId);
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  const handleCreateFolderInFolder = async (parentFolderId: Id<"folders"> | null) => {
    createFolder({
      name: "New Folder",
      parentFolderId: parentFolderId,
    })
      .then(() => {
        toast.success("Folder created successfully");
        if (parentFolderId) {
          onFolderExpand(parentFolderId);
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  };

  return {
    isCreating,
    handleCreateFolder,
    handleCreateDocument,
    handleCreateDocumentInFolder,
    handleCreateFolderInFolder,
  };
};
