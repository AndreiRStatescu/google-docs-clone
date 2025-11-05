"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { HighlighterIcon } from "lucide-react";
import { ChromePicker } from "react-color";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ToolbarHighlightButtonProps {
  type: "highlight";
  label: string;
}

export const ToolbarHighlightButton = ({
  label,
}: ToolbarHighlightButtonProps) => {
  const { editor, lastUpdate } = useEditorStore();
  const [isActive, setIsActive] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ffff00");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (editor) {
      setIsActive(editor.isActive("highlight"));
      const color = editor.getAttributes("highlight").color;
      if (color) {
        setCurrentColor(color);
      }
    }
  }, [editor, lastUpdate]);

  const handleColorChange = (color: any) => {
    setCurrentColor(color.hex);
    if (editor) {
      editor.chain().focus().setHighlight({ color: color.hex }).run();
    }
  };

  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 relative",
    isActive && "bg-neutral-200/80"
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <button className={className} title={label}>
          <HighlighterIcon className="size-4" />
          <div
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded"
            style={{ backgroundColor: currentColor }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        side="bottom"
        align="start"
        onInteractOutside={e => {
          e.preventDefault();
        }}
        onPointerDownOutside={e => {
          const target = e.target as HTMLElement;
          if (!target.closest('[role="dialog"]')) {
            setOpen(false);
          }
        }}
      >
        <div onMouseDown={e => e.preventDefault()}>
          <ChromePicker color={currentColor} onChange={handleColorChange} />
        </div>
      </PopoverContent>
    </Popover>
  );
};
