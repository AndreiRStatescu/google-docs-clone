"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface RemoveDialogProps {
  documentId?: Id<"documents">;
  folderId?: Id<"folders">;
  children: React.ReactNode;
  documentIds?: Id<"documents">[];
  onSuccess?: () => void;
}

export const RemoveDialog = ({
  documentId,
  folderId,
  children,
  documentIds,
  onSuccess,
}: RemoveDialogProps) => {
  const removeDocument = useMutation(api.documents.removeById);
  const removeDocuments = useMutation(api.documents.removeByIds);
  const removeFolder = useMutation(api.folders.removeById);
  const [isRemoving, setIsRemoving] = useState(false);

  const isFolder = !!folderId;
  const idsToRemove =
    documentIds && documentIds.length > 0 ? documentIds : documentId ? [documentId] : [];
  const isMultiple = idsToRemove.length > 1;

  const onRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);

    try {
      if (isFolder) {
        await removeFolder({ id: folderId });
      } else if (isMultiple) {
        await removeDocuments({ ids: idsToRemove as Id<"documents">[] });
      } else {
        await removeDocument({ id: documentId! });
      }
      toast.success(
        isFolder
          ? "Folder deleted successfully"
          : isMultiple
            ? `${idsToRemove.length} documents deleted successfully`
            : "Document deleted successfully"
      );
      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent onClick={e => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete{" "}
            {isFolder
              ? "this folder and all its contents"
              : isMultiple
                ? `these ${idsToRemove.length} documents`
                : "this document"}
            ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
            {isFolder && " All nested files and folders will also be permanently deleted."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isRemoving}
            onClick={onRemove}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
