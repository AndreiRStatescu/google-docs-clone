"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface RenameDialogProps {
  documentId?: Id<"documents">;
  folderId?: Id<"folders">;
  initialTitle: string;
  children: React.ReactNode;
}

export const RenameDialog = ({
  documentId,
  folderId,
  initialTitle,
  children,
}: RenameDialogProps) => {
  const updateDocument = useMutation(api.documents.updateById);
  const updateFolder = useMutation(api.folders.updateById);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newTitle, setNewTitle] = useState(initialTitle);
  const [open, setOpen] = useState(false);

  const isFolder = !!folderId;
  const itemType = isFolder ? "Folder" : "Document";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    const updatePromise = isFolder
      ? updateFolder({ id: folderId, name: newTitle.trim() || "Untitled" })
      : updateDocument({ id: documentId!, title: newTitle.trim() || "Untitled" });

    updatePromise
      .catch(() => {
        toast.error("Something went wrong");
      })
      .then(() => {
        toast.success(`${itemType} renamed successfully`);
      })
      .finally(() => {
        setOpen(false);
        setIsUpdating(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onClick={e => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Rename {itemType.toLowerCase()}</DialogTitle>
            <DialogDescription>
              Enter a new name for this {itemType.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder={`${itemType} name`}
              onClick={e => e.stopPropagation()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                setOpen(false);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating} onClick={e => e.stopPropagation()}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
