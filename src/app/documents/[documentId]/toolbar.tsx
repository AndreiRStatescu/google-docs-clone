"use client";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  BoldIcon,
  LucideIcon,
  PrinterIcon,
  Redo2Icon,
  SpellCheckIcon,
  Undo2Icon,
} from "lucide-react";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

interface ToolbarSection {
  name: string;
  items: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[];
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
    isActive && "bg-blue-200"
  );

  return (
    <button
      onClick={onClick}
      className={className}
      style={{ backgroundColor: isActive ? "#d4d4d8" : undefined }}
    >
      <Icon className="size-4" />
    </button>
  );
};

const BoldButton = () => {
  const { editor, lastUpdate } = useEditorStore();
  const isActive = editor?.isActive("bold") || false;

  console.log(
    "BoldButton render - isActive:",
    isActive,
    "lastUpdate:",
    lastUpdate
  );

  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
    isActive && "#d4d4d8"
  );

  return (
    <button
      onClick={() => {
        editor?.chain().focus().toggleBold().run();
      }}
      className={className}
      style={{ backgroundColor: isActive ? "#ffd4d8" : undefined }}
    >
      <BoldIcon className="size-4" />
    </button>
  );
};

export const Toolbar = () => {
  const { editor, lastUpdate } = useEditorStore();

  return (
    <div className="bg-[#F1F3F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
      <ToolbarButton
        icon={Undo2Icon}
        onClick={() => editor?.chain().focus().undo().run()}
      />
      <ToolbarButton
        icon={Redo2Icon}
        onClick={() => editor?.chain().focus().redo().run()}
      />
      <ToolbarButton icon={PrinterIcon} onClick={() => window.print()} />
      <ToolbarButton
        icon={SpellCheckIcon}
        onClick={() => {
          const current = editor?.view.dom.getAttribute("spellcheck");
          editor?.view.dom.setAttribute(
            "spellcheck",
            current === "true" ? "false" : "true"
          );
        }}
      />

      <div className="h-6 w-px bg-neutral-300 mx-1" />

      <BoldButton />
    </div>
  );
};
