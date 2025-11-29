"use client";

import { CONTENT_TYPE_MARKDOWN, CONTENT_TYPE_REGULAR } from "@/app/constants/templates";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Editor } from "./editor";
import { EditorMarkdown } from "./editor-markdown";
import { Navbar } from "./navbar/navbar";
import { Room } from "./room";
import { Sidebar } from "./sidebar/sidebar";
import { Toolbar } from "./toolbar/toolbar";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

const Document = ({ preloadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument);
  const currentUserId = useQuery(api.documents.getUserId);
  const canEdit = currentUserId === document.ownerId;
  const [sidebarWidth, setSidebarWidth] = useState(256);

  return (
    <Room>
      <Sidebar width={sidebarWidth} onWidthChange={setSidebarWidth} />
      <div className="min-h-screen bg-[#FAFBFD]" style={{ marginLeft: `${sidebarWidth}px` }}>
        <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden">
          <Navbar data={document} canEdit={canEdit} />
          <Toolbar />
        </div>
        <div className="pt-[114px] print:pt-0">
          {document.contentType === CONTENT_TYPE_REGULAR && (
            <Editor initialContent={document.initialContent} documentId={document._id} />
          )}
          {document.contentType === CONTENT_TYPE_MARKDOWN && <EditorMarkdown />}
        </div>
      </div>
    </Room>
  );
};

export default Document;
