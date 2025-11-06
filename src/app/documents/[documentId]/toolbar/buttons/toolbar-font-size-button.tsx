"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";

export const ToolbarFontSizeButton = () => {
  const { editor, lastUpdate } = useEditorStore();

  // Trigger re-render when editor state changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _forceUpdate = lastUpdate;

  const [inputValue, setInputValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Use ref to track manually set font size (doesn't trigger re-render)
  const manualFontSizeRef = useRef<string | null>(null);
  const lastSelectionRef = useRef<{ from: number; to: number } | null>(null);

  // Get font size from editor state
  let currentFontSize = "16";

  if (editor) {
    const attrs = editor.getAttributes("textStyle");
    const { from, to } = editor.state.selection;

    // If we have fontSize in attributes, use it
    if (attrs?.fontSize) {
      currentFontSize = attrs.fontSize.replace("px", "");
      // Clear manual tracking when we find actual fontSize
      manualFontSizeRef.current = null;
    } else {
      // Check stored marks for cursor position
      const storedMarks = editor.state.storedMarks;
      const textStyleMark = storedMarks?.find(
        mark => mark.type.name === "textStyle"
      );

      if (textStyleMark?.attrs?.fontSize) {
        currentFontSize = textStyleMark.attrs.fontSize.replace("px", "");
        manualFontSizeRef.current = null;
      } else {
        // Check if cursor is on text with fontSize mark
        const $from = editor.state.doc.resolve(from);
        const node = $from.parent;
        const mark = node.marks.find(m => m.type.name === "textStyle");

        if (mark?.attrs?.fontSize) {
          currentFontSize = mark.attrs.fontSize.replace("px", "");
          manualFontSizeRef.current = null;
        } else {
          // Check if selection position changed
          const selectionChanged =
            !lastSelectionRef.current ||
            lastSelectionRef.current.from !== from ||
            lastSelectionRef.current.to !== to;

          if (selectionChanged) {
            lastSelectionRef.current = { from, to };
            // Clear manual font size when moving to new position
            manualFontSizeRef.current = null;
          } else if (manualFontSizeRef.current) {
            // Use manually set font size if cursor hasn't moved
            currentFontSize = manualFontSizeRef.current;
          }
        }
      }
    }
  }

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0 && editor) {
      // Apply font size
      editor.chain().focus().setFonttSize(`${size}px`).run();
      // Track manually set font size
      manualFontSizeRef.current = size.toString();
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
    editor?.chain().focus().run();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.chain().focus().run();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
      editor?.chain().focus().run();
    }
  };

  const increment = () => {
    const newSize = parseInt(currentFontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(currentFontSize) - 1;
    if (newSize <= 0) return;
    updateFontSize(newSize.toString());
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button
        onMouseDown={e => e.preventDefault()}
        onClick={decrement}
        className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
      >
        <MinusIcon className="size-4" />
      </button>

      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            setIsEditing(true);
            setInputValue(currentFontSize);
          }}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent cursor-text"
        >
          {currentFontSize}
        </button>
      )}

      <button
        onMouseDown={e => e.preventDefault()}
        onClick={increment}
        className="h-7 w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};
