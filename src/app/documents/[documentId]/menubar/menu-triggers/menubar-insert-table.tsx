"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { useState } from "react";

export const MenubarInsertTable = () => {
  const { editor } = useEditorStore();
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [lastHoveredCell, setLastHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const insertTable = (rows: number, cols: number) => {
    editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: false }).run();
  };

  return (
    <div className="flex flex-col gap-1">
      <div
        className="grid grid-cols-5 gap-1"
        onMouseLeave={() => {
          setHoveredCell(null);
          setLastHoveredCell(null);
        }}
      >
        {Array.from({ length: 5 }).map((_, rowIndex) =>
          Array.from({ length: 5 }).map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-6 h-6 border-2 transition-colors cursor-pointer ${
                hoveredCell && rowIndex <= hoveredCell.row && colIndex <= hoveredCell.col
                  ? "bg-blue-500 border-blue-600"
                  : "bg-white border-gray-300 hover:border-gray-400"
              }`}
              onMouseEnter={() => {
                setHoveredCell({ row: rowIndex, col: colIndex });
                setLastHoveredCell({ row: rowIndex, col: colIndex });
              }}
              onClick={() => {
                insertTable(rowIndex + 1, colIndex + 1);
                setHoveredCell(null);
              }}
            />
          ))
        )}
      </div>
      <div className="text-center text-sm text-gray-600 mt-1">
        {hoveredCell
          ? `${hoveredCell.row + 1} x ${hoveredCell.col + 1}`
          : lastHoveredCell
            ? `${lastHoveredCell.row + 1} x ${lastHoveredCell.col + 1}`
            : "Select table size"}
      </div>
    </div>
  );
};
