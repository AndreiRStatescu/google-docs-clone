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

interface DocumentKebabMenuProps {
  documentId: Id<"documents">;
  title: string;
  isOwner: boolean;
  onMenuOpen: () => void;
}

export const DocumentKebabMenu = ({
  documentId,
  title,
  isOwner,
  onMenuOpen,
}: DocumentKebabMenuProps) => {
  const onNewTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/documents/${documentId}`, "_blank");
  };

  return (
    <DropdownMenu onOpenChange={open => open && onMenuOpen()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onNewTabClick}>
          <ExternalLinkIcon className="size-4 mr-2" /> Open in new tab
        </DropdownMenuItem>
        {isOwner ? (
          <RenameDialog documentId={documentId} initialTitle={title}>
            <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={e => e.stopPropagation()}>
              <FilePenIcon className="size-4 mr-2" /> Rename
            </DropdownMenuItem>
          </RenameDialog>
        ) : (
          <DropdownMenuItem disabled className="opacity-50">
            <FilePenIcon className="size-4 mr-2" /> Rename
          </DropdownMenuItem>
        )}
        {isOwner ? (
          <RemoveDialog documentId={documentId}>
            <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={e => e.stopPropagation()}>
              <TrashIcon className="size-4 mr-2" /> Remove
            </DropdownMenuItem>
          </RemoveDialog>
        ) : (
          <DropdownMenuItem disabled className="opacity-50">
            <TrashIcon className="size-4 mr-2" /> Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
