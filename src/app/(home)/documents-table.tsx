"use client";

import { useOrganization } from "@clerk/nextjs";
import { PaginationStatus, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { HOME_DOCUMENTS_PER_PAGE } from "../constants/defaults";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderIcon } from "lucide-react";
import { DocumentRow } from "./document-row";

interface DocumentsTableProps {
  documents: Doc<"documents">[] | undefined;
  status: PaginationStatus;
  loadMore: (numItems: number) => void;
}

export const DocumentsTable = ({ documents, status, loadMore }: DocumentsTableProps) => {
  const tokenIdentifier = useQuery(api.documents.getUserId);
  const { organization } = useOrganization();

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {(tokenIdentifier || organization !== undefined) && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg space-y-2">
          {tokenIdentifier && (
            <p className="text-sm font-medium text-gray-700">
              User ID: <span className="font-mono text-gray-900">{tokenIdentifier}</span>
            </p>
          )}
          <p className="text-sm font-medium text-gray-700">
            Organization ID:{" "}
            <span className="font-mono text-gray-900">{organization?.id || "None"}</span>
          </p>
        </div>
      )}
      {documents === undefined ? (
        <div>
          <LoaderIcon className="animate-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>Name</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:flex">Shared</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead className="hidden md:table-cell">Updated at</TableHead>
            </TableRow>
          </TableHeader>
          {documents.length === 0 && (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No documents found.
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          <TableBody>
            {documents.map(doc => (
              <DocumentRow key={doc._id} document={doc} currentUserId={tokenIdentifier} />
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadMore(HOME_DOCUMENTS_PER_PAGE)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "CanLoadMore" ? "Load More" : "No More Documents"}
        </Button>
      </div>
    </div>
  );
};
