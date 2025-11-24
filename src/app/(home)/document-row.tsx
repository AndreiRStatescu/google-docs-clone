import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { DocumentContextMenu } from "./document-context-menu";
import { DocumentKebabMenu } from "./document-kebab-menu";

interface DocumentRowProps {
  document: Doc<"documents">;
  currentUserId: string | undefined;
  isSelected: boolean;
  onToggleSelect: (documentId: Id<"documents">, index: number, shiftKey: boolean) => void;
  index: number;
}

export const DocumentRow = ({
  document,
  currentUserId,
  isSelected,
  onToggleSelect,
  index,
}: DocumentRowProps) => {
  const router = useRouter();
  const isOwner = currentUserId === document.ownerId;

  const onRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    const target = e.target as HTMLElement;
    // Don't toggle selection if clicking on menu buttons
    if (!target.hasAttribute("data-row-clickable")) {
      return;
    }
    // Prevent text selection when shift-clicking
    if (e.shiftKey) {
      e.preventDefault();
    }
    onToggleSelect(document._id, index, e.shiftKey);
  };

  return (
    <DocumentContextMenu documentId={document._id} title={document.title} isOwner={isOwner}>
      <TableRow
        className={`cursor-pointer select-none ${isSelected ? "bg-blue-50 hover:bg-blue-100" : ""}`}
        onClick={onRowClick}
        data-row-clickable
      >
        <TableCell className="w-[50px]" data-row-clickable>
          <SiGoogledocs className="size-6 fill-blue-500" />
        </TableCell>
        <TableCell className="font-medium md:w-[45%]" data-row-clickable>
          {document.title}
        </TableCell>
        <TableCell
          className="text-muted-foreground hidden md:flex items-center gap-2"
          data-row-clickable
        >
          {document.organizationId?.startsWith("org_") ? (
            <Building2Icon className="size-4" />
          ) : (
            <CircleUserIcon className="size-4" />
          )}
          {document.organizationId?.startsWith("org_") ? "Organization" : "Personal"}
        </TableCell>
        <TableCell className="text-muted-foreground hidden md:table-cell" data-row-clickable>
          {formatDateTime(document._creationTime)}
        </TableCell>
        <TableCell className="text-muted-foreground hidden md:table-cell" data-row-clickable>
          {document.updateTime
            ? formatDateTime(document.updateTime)
            : formatDateTime(document._creationTime)}
        </TableCell>
        <TableCell className="flex ml-auto justify-end" data-row-clickable>
          <DocumentKebabMenu documentId={document._id} title={document.title} isOwner={isOwner} />
        </TableCell>
      </TableRow>
    </DocumentContextMenu>
  );
};
