"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery } from "convex/react";
import { Home } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface ExplorerPanelBreadcrumbProps {
  parentFolderId?: string | null;
  availableWidth?: number;
}

export const ExplorerPanelBreadcrumb = ({
  parentFolderId,
  availableWidth,
}: ExplorerPanelBreadcrumbProps) => {
  // Get the full folder path from root to current folder
  const folderPath = useQuery(
    api.folders.getPath,
    parentFolderId ? { id: parentFolderId as Id<"folders"> } : "skip"
  );

  // Determine how to render breadcrumb based on path length
  const renderBreadcrumb = () => {
    // Calculate max visible items based on available width
    // Rough estimate: ~80px per folder item, 100px for "My Drive", 40px for ellipsis
    const estimatedItemWidth = 80;
    const myDriveWidth = 100;
    const ellipsisWidth = 40;
    const paddingAndGaps = 48; // Account for padding and gaps

    const usableWidth = (availableWidth ?? 300) - paddingAndGaps;
    const maxFolderItems = Math.floor((usableWidth - myDriveWidth) / estimatedItemWidth);
    const maxVisibleItems = Math.max(1, maxFolderItems); // At least show current folder

    const pathLength = folderPath?.length ?? 0;
    const shouldTruncate = pathLength > maxVisibleItems;

    if (!folderPath || pathLength === 0) {
      // Just show My Drive as the current page
      return (
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1 shrink-0">
            <Home className="w-3 h-3 shrink-0" />
            <span className="text-xs whitespace-nowrap">My Drive</span>
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    if (!shouldTruncate) {
      // Show full path: My Drive > Folder1 > Folder2 > Current
      return (
        <>
          <BreadcrumbItem className="shrink-0">
            <BreadcrumbLink href="#" className="flex items-center gap-1 text-xs whitespace-nowrap">
              <Home className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline">My Drive</span>
              <span className="sm:hidden">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="[&>svg]:size-3 shrink-0" />
          {folderPath.map((folder, index) => {
            const isLast = index === pathLength - 1;
            return (
              <div key={folder._id} className="contents">
                <BreadcrumbItem className="min-w-0">
                  {isLast ? (
                    <BreadcrumbPage className="max-w-[120px] sm:max-w-[180px] truncate text-xs block">
                      {folder.name}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href="#"
                      className="max-w-20 sm:max-w-[120px] truncate text-xs block"
                    >
                      {folder.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="[&>svg]:size-3 shrink-0" />}
              </div>
            );
          })}
        </>
      );
    }

    // Truncate: show My Drive, ellipsis, and last N folders based on available space
    const visibleFolderCount = Math.max(1, maxVisibleItems - 1); // Reserve space for "My Drive"
    const startIndex = pathLength - visibleFolderCount;
    const visibleFolders = folderPath.slice(startIndex);

    return (
      <>
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink href="#" className="flex items-center gap-1 text-xs whitespace-nowrap">
            <Home className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">My Drive</span>
            <span className="sm:hidden">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-3 shrink-0" />
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbEllipsis className="size-6" />
        </BreadcrumbItem>
        <BreadcrumbSeparator className="[&>svg]:size-3 shrink-0" />
        {visibleFolders.map((folder, index) => {
          const isLast = index === visibleFolders.length - 1;
          return (
            <div key={folder._id} className="contents">
              <BreadcrumbItem className="min-w-0">
                {isLast ? (
                  <BreadcrumbPage className="max-w-[120px] sm:max-w-[180px] truncate text-xs block">
                    {folder.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    className="max-w-20 sm:max-w-[120px] truncate text-xs block"
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="[&>svg]:size-3 shrink-0" />}
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Breadcrumb className="mb-3 overflow-hidden">
      <BreadcrumbList className="text-xs gap-1 sm:gap-1.5 flex-nowrap">
        {renderBreadcrumb()}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
