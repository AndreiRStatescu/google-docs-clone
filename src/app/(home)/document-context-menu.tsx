import { ExternalLinkIcon, FilePenIcon, TrashIcon } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface DocumentContextMenuProps {
  documentId: Id<"documents">;
  title: string;
  isOwner: boolean;
  children: React.ReactNode;
  onContextMenu: () => void;
  selectedCount: number;
}

export const DocumentContextMenu = ({
  documentId,
  title,
  isOwner,
  children,
  onContextMenu,
  selectedCount,
}: DocumentContextMenuProps) => {
  const onNewTabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/documents/${documentId}`, "_blank");
  };

  return (
    <ContextMenu onOpenChange={open => open && onContextMenu()}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {selectedCount <= 1 && (
          <ContextMenuItem onClick={onNewTabClick}>
            <ExternalLinkIcon className="size-4 mr-2" /> Open in new tab
          </ContextMenuItem>
        )}
        {selectedCount <= 1 &&
          (isOwner ? (
            <RenameDialog documentId={documentId} initialTitle={title}>
              <ContextMenuItem
                onSelect={e => e.preventDefault()}
                onClick={e => e.stopPropagation()}
              >
                <FilePenIcon className="size-4 mr-2" /> Rename
              </ContextMenuItem>
            </RenameDialog>
          ) : (
            <ContextMenuItem disabled className="opacity-50">
              <FilePenIcon className="size-4 mr-2" /> Rename
            </ContextMenuItem>
          ))}
        {isOwner ? (
          <RemoveDialog documentId={documentId}>
            <ContextMenuItem onSelect={e => e.preventDefault()} onClick={e => e.stopPropagation()}>
              <TrashIcon className="size-4 mr-2" /> Remove
            </ContextMenuItem>
          </RemoveDialog>
        ) : (
          <ContextMenuItem disabled className="opacity-50">
            <TrashIcon className="size-4 mr-2" /> Remove
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};
