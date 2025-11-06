"use client";

import { type Editor } from "@tiptap/react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export interface ToolbarSimpleButtonProps {
  type: string;
  label: string;
  icon: LucideIcon;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
}

export const ToolbarSimpleButton = ({
  label,
  icon: Icon,
  isActive: checkIsActive,
  onClick: handleClick,
}: ToolbarSimpleButtonProps) => {
  const { editor, lastUpdate } = useEditorStore();

  // Derive isActive directly from editor state
  const isActive = editor && checkIsActive ? checkIsActive(editor) : false;

  // Trigger re-render when editor state changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _forceUpdate = lastUpdate;

  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
    isActive && "#d4d4d8"
  );

  return (
    <button
      onClick={() => {
        if (editor) {
          handleClick(editor);
        }
      }}
      className={className}
      style={{ backgroundColor: isActive ? "#ffd4d8" : undefined }}
      title={label}
    >
      <Icon className="size-4" />
    </button>
  );
};
