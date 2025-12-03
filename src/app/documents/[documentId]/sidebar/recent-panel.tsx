"use client";

import { usePaginatedQuery } from "convex/react";
import { File } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { formatDateTime } from "@/lib/utils";

export const RecentPanel = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.getRecent,
    {},
    { initialNumItems: 10 }
  );

  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent</h2>
      </div>
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {status === "LoadingFirstPage" ? (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">Loading...</div>
        ) : results.length === 0 ? (
          <div className="px-3 py-4 text-sm text-gray-500 text-center">No recent documents</div>
        ) : (
          <>
            {results.map(doc => (
              <button
                key={doc._id}
                onClick={() => window.open(`/documents/${doc._id}`, "_blank")}
                className="w-full flex items-start gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                <File className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1 text-left min-w-0">
                  <div className="truncate font-medium">{doc.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {formatDateTime(doc.updateTime ?? doc._creationTime)}
                  </div>
                </div>
              </button>
            ))}
            <div className="px-3 py-2">
              {status === "CanLoadMore" ? (
                <button
                  onClick={() => loadMore(10)}
                  disabled={status !== "CanLoadMore"}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Load More
                </button>
              ) : status === "LoadingMore" ? (
                <div className="text-sm text-gray-500 text-center py-2">Loading...</div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-2">No More Documents</div>
              )}
            </div>
          </>
        )}
      </nav>
    </>
  );
};
