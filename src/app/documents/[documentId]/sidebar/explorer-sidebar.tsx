"use client";

import { useMutation, useQuery } from "convex/react";
import { File, FilePlus, Folder, FolderPlus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TEMPLATE_ID_BLANK, templates } from "../../../constants/templates";

interface ExplorerSidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
}

export const ExplorerSidebar = ({ width, onWidthChange }: ExplorerSidebarProps) => {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;
  const [isResizing, setIsResizing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const currentDocument = useQuery(api.documents.getById, { id: documentId });
  const parentFolderId = currentDocument?.parentFolderId;

  const folders = useQuery(api.folders.getByParentFolderId, { parentFolderId });
  const documents = useQuery(api.documents.getByParentFolderId, { parentFolderId });
  const createFolder = useMutation(api.folders.create);
  const createDocument = useMutation(api.documents.create);

  const handleCreateFolder = async () => {
    await createFolder({
      name: "New Folder",
      parentFolderId: parentFolderId,
    });
  };

  const handleCreateDocument = async () => {
    setIsCreating(true);
    const blankTemplate = templates[TEMPLATE_ID_BLANK];
    createDocument({
      title: blankTemplate.label,
      initialContent: blankTemplate.initialContent,
      contentType: blankTemplate.contentType,
    })
      .then(() => {
        toast.success("Document created successfully");
      })
      .catch(() => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    e.preventDefault();
    const newWidth = Math.max(200, Math.min(400, e.clientX));
    onWidthChange(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing]);

  return (
    <aside
      style={{ width: `${width}px` }}
      className="bg-white border-r border-gray-200 h-screen fixed left-0 top-[102px] pt-4 px-3 print:hidden overflow-y-auto"
    >
      <div className="mb-4 px-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">My Drive</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Create new blank document"
          >
            <FilePlus className="w-5 h-5" />
          </button>
          <button
            onClick={handleCreateFolder}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="Create new folder"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
      <nav className="space-y-1">
        {/* Folders first (alphabetically sorted) */}
        {folders?.map(folder => (
          <div
            key={folder._id}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{folder.name}</span>
          </div>
        ))}

        {/* Documents next (alphabetically sorted) */}
        {documents?.map(doc => (
          <Link
            key={doc._id}
            href={`/documents/${doc._id}`}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
              doc._id === documentId ? "bg-blue-50 text-blue-700" : "text-gray-700"
            }`}
          >
            <File className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{doc.title}</span>
          </Link>
        ))}

        {folders?.length === 0 && documents?.length === 0 && (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">No items in this folder</div>
        )}
      </nav>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors"
        onMouseDown={handleMouseDown}
      />
    </aside>
  );
};
