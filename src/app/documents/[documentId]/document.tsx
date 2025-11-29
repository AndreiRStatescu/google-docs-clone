"use client";

import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CONTENT_TYPE_MARKDOWN, CONTENT_TYPE_REGULAR } from "@/app/constants/templates";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";
import { Toolbar } from "./toolbar/toolbar";
import { EditorMarkdown } from "./editor-markdown";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

const Document = ({ preloadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument);
  const currentUserId = useQuery(api.documents.getUserId);
  const canEdit = currentUserId === document.ownerId;

  return (
    <Room>
      <div className="min-h-screen bg-[#FAFBFD]">
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar data={document} canEdit={canEdit} />
          <Toolbar />
        </div>
        <div className="pt-[114px] print:pt-0">
          {document.contentType === CONTENT_TYPE_REGULAR && (
            <Editor initialContent={document.initialContent} documentId={document._id} />
          )}
          {document.contentType === CONTENT_TYPE_MARKDOWN && (
            <EditorMarkdown />
          )}
        </div>
      </div>
    </Room>
  );
};

export default Document;
