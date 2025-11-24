import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { Building2Icon, CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { SiGoogledocs } from "react-icons/si";
import { Doc } from "../../../convex/_generated/dataModel";
import { DocumentMenu } from "./document-menu";

interface DocumentRowProps {
  document: Doc<"documents">;
  currentUserId: string | undefined;
}

export const DocumentRow = ({ document, currentUserId }: DocumentRowProps) => {
  const router = useRouter();
  const isOwner = currentUserId === document.ownerId;

  const onRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    // Only navigate if clicking on the row itself or its cells
    const target = e.target as HTMLElement;
    if (!target.hasAttribute("data-row-clickable")) {
      return;
    }
    router.push(`/documents/${document._id}`);
  };

  return (
    <TableRow className="cursor-pointer" onClick={onRowClick} data-row-clickable>
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
        <DocumentMenu documentId={document._id} title={document.title} isOwner={isOwner} />
      </TableCell>
    </TableRow>
  );
};
