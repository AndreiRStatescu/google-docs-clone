"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { TOOLBAR_BUTTON_TYPES } from "../toolbar-config";

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
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(editor && checkIsActive ? checkIsActive(editor) : false);
  }, [editor, lastUpdate, checkIsActive]);

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
