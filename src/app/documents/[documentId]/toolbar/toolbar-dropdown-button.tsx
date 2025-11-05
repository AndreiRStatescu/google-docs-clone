"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

export interface ToolbarDropdownOption {
  label: string;
  value: string;
}

export interface ToolbarDropdownButtonProps {
  type: "dropdown";
  width?: string;
  getCurrentValue: (editor: Editor) => string;
  options: ToolbarDropdownOption[];
  onSelect: (editor: Editor, value: string) => void;
}

export const ToolbarDropdownButton = ({
  width = "120px",
  getCurrentValue,
  options,
  onSelect,
}: ToolbarDropdownButtonProps) => {
  const { editor, lastUpdate } = useEditorStore();
  const [currentValue, setCurrentValue] = useState("");

  useEffect(() => {
    if (editor) {
      setCurrentValue(getCurrentValue(editor));
    }
  }, [editor, lastUpdate, getCurrentValue]);

  const currentLabel =
    options.find(opt => opt.value === currentValue)?.label || currentValue;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-7 shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm"
          style={{ width }}
        >
          <span className="truncate">{currentLabel}</span>
          <ChevronDownIcon className="size-4 ml-2 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {options.map(({ label, value }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              currentValue === value && "bg-neutral-200/80"
            )}
            style={{ fontFamily: value }}
            onClick={() => {
              if (editor) {
                onSelect(editor, value);
              }
            }}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
