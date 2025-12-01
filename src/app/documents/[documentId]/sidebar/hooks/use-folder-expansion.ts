import { useCallback, useState } from "react";

interface UseFolderExpansionReturn {
  expandedFolders: Set<string>;
  expandFolder: (folderId: string) => void;
  toggleFolder: (folderId: string) => void;
}

export const useFolderExpansion = (): UseFolderExpansionReturn => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const expandFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.add(folderId);
      return next;
    });
  }, []);

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  return {
    expandedFolders,
    expandFolder,
    toggleFolder,
  };
};
