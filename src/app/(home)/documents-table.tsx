"use client";

import { useOrganization } from "@clerk/nextjs";
import { PaginationStatus, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
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
import { useState } from "react";
import { DocumentRow } from "./document-row";

interface DocumentsTableProps {
  documents: Doc<"documents">[] | undefined;
  status: PaginationStatus;
  loadMore: (numItems: number) => void;
}

export const DocumentsTable = ({ documents, status, loadMore }: DocumentsTableProps) => {
  const tokenIdentifier = useQuery(api.documents.getUserId);
  const { organization } = useOrganization();
  const [selectedDocuments, setSelectedDocuments] = useState<Set<Id<"documents">>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  const toggleSelection = (documentId: Id<"documents">, index: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null && documents) {
      // Shift-click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const rangeIds = documents.slice(start, end + 1).map(doc => doc._id);

      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        rangeIds.forEach(id => newSet.add(id));
        return newSet;
      });
    } else {
      // Regular click: toggle single item
      setSelectedDocuments(prev => {
        const newSet = new Set(prev);
        if (newSet.has(documentId)) {
          newSet.delete(documentId);
        } else {
          newSet.add(documentId);
        }
        return newSet;
      });
      setLastSelectedIndex(index);
    }
  };

  const selectOnly = (documentId: Id<"documents">) => {
    setSelectedDocuments(new Set([documentId]));
  };

  const handleContextMenu = (documentId: Id<"documents">) => {
    setSelectedDocuments(prev => {
      // If no documents selected or only 1 selected, select only the clicked row
      if (prev.size === 0 || prev.size === 1) {
        return new Set([documentId]);
      }
      // If multiple documents selected, add the clicked row to selection
      const newSet = new Set(prev);
      newSet.add(documentId);
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedDocuments(new Set());
  };

  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5">
      {selectedDocuments.size > 0 && (
        <div className="text-sm text-muted-foreground">{selectedDocuments.size} selected</div>
      )}
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
            <TableRow className="hover:bg-transparent">
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell">Shared</TableHead>
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
            {documents.map((doc, index) => (
              <DocumentRow
                key={doc._id}
                document={doc}
                currentUserId={tokenIdentifier}
                isSelected={selectedDocuments.has(doc._id)}
                onToggleSelect={toggleSelection}
                onSelectOnly={selectOnly}
                onContextMenu={handleContextMenu}
                selectedCount={selectedDocuments.size}
                selectedDocumentIds={Array.from(selectedDocuments)}
                onClearSelection={clearSelection}
                index={index}
              />
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
