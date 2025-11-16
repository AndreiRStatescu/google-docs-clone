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
  const editor = useEditorStore(state => state.editor);
  const lastUpdate = useEditorStore(state => state.lastUpdate);

  // This re-evaluates on every render triggered by lastUpdate changes
  const isNowActive =
    lastUpdate && editor && checkIsActive ? checkIsActive(editor) : false;

  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
    isNowActive && "bg-[#ffd4d8]/80"
  );

  return (
    <button
      onClick={() => {
        if (editor) {
          handleClick(editor);
        }
      }}
      className={className}
      title={label}
    >
      <Icon className="size-4" />
    </button>
  );
};
