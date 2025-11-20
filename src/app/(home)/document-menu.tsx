import { Button } from "@/components/ui/button";
import { ExternalLinkIcon, FilePenIcon, MoreVertical, TrashIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentMenuProps {
  documentId: Id<"documents">;
  title: string;
}

export const DocumentMenu = ({ documentId, title }: DocumentMenuProps) => {
  const onNewTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/documents/${documentId}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onNewTabClick}>
          <ExternalLinkIcon className="size-4 mr-2" /> Open in new tab
        </DropdownMenuItem>
        <RemoveDialog documentId={documentId}>
          <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={e => e.stopPropagation()}>
            <TrashIcon className="size-4 mr-2" /> Remove
          </DropdownMenuItem>
        </RemoveDialog>
        <RenameDialog documentId={documentId} initialTitle={title}>
          <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={e => e.stopPropagation()}>
            <FilePenIcon className="size-4 mr-2" /> Rename
          </DropdownMenuItem>
        </RenameDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
