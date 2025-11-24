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
  documentId: Id<"documents">;
  children: React.ReactNode;
  documentIds?: Id<"documents">[];
  onSuccess?: () => void;
}

export const RemoveDialog = ({ documentId, children, documentIds, onSuccess }: RemoveDialogProps) => {
  const remove = useMutation(api.documents.removeById);
  const removeBulk = useMutation(api.documents.removeByIds);
  const [isRemoving, setIsRemoving] = useState(false);

  const idsToRemove = documentIds && documentIds.length > 0 ? documentIds : [documentId];
  const isMultiple = idsToRemove.length > 1;

  const onRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRemoving(true);

    try {
      if (isMultiple) {
        await removeBulk({ ids: idsToRemove });
      } else {
        await remove({ id: documentId });
      }
      toast.success(
        isMultiple
          ? `${idsToRemove.length} documents deleted successfully`
          : "Document deleted successfully"
      );
      onSuccess?.();
    } catch (error) {
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
            {isMultiple ? `these ${idsToRemove.length} documents` : "this document"}?
          </AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
