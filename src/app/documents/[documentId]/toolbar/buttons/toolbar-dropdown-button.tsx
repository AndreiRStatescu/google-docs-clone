"use client";

import { type Editor } from "@tiptap/react";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export interface ToolbarDropdownOption {
  label: string;
  value: string;
  fontSize?: string;
}

export interface ToolbarDropdownButtonProps {
  type: string;
  label: string;
  width?: string;
  getCurrentValue: (editor: Editor) => string;
  options: ToolbarDropdownOption[];
  onSelect: (editor: Editor, value: string) => void;
}

export const ToolbarDropdownButton = ({
  label,
  width = "120px",
  getCurrentValue,
  options,
  onSelect,
}: ToolbarDropdownButtonProps) => {
  const { editor, lastUpdate } = useEditorStore();

  // Trigger re-render when editor state changes
  const currentValue = lastUpdate && editor ? getCurrentValue(editor) : "";
  const currentLabel =
    options.find(opt => opt.value === currentValue)?.label || currentValue;

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="h-7 shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
          style={{ width }}
          title={label}
          // Keep editor selection visible and toggle menu manually
          onMouseDown={e => {
            e.preventDefault();
            setOpen(prev => !prev);
          }}
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDownIcon className="size-4 ml-2 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {options.map(({ label, value, fontSize }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              currentValue === value && "bg-neutral-200/80"
            )}
            style={{ fontFamily: value }}
            // Keep editor selection visible by avoiding focus shift
            onMouseDown={e => e.preventDefault()}
            onClick={() => {
              if (editor) {
                onSelect(editor, value);
              }
              setOpen(false);
            }}
          >
            <span className={cn(!fontSize && "text-sm")} style={{ fontSize }}>
              {label}
            </span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
