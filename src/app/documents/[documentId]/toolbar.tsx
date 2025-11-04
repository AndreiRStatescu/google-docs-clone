"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  Undo2Icon,
  Redo2Icon,
  PrinterIcon,
  SpellCheckIcon,
} from "lucide-react";

interface ToolbarButtonProps {
  icon: LucideIcon;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
}

type ToolbarSection = ToolbarButtonProps[];

const ToolbarButton = ({
  icon: Icon,
  isActive: checkIsActive,
  onClick: handleClick,
}: ToolbarButtonProps) => {
  const editor = useEditorStore(state => state.editor);
  const lastUpdate = useEditorStore(state => state.lastUpdate);
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
    >
      <Icon className="size-4" />
    </button>
  );
};

const ToolbarSeparator = () => {
  return <div className="h-6 w-px bg-neutral-300 mx-1" />;
};

const toolbarSections: ToolbarSection[] = [
  [
    {
      icon: Undo2Icon,
      onClick: editor => editor.chain().focus().undo().run(),
    },
    {
      icon: Redo2Icon,
      onClick: editor => editor.chain().focus().redo().run(),
    },
    {
      icon: PrinterIcon,
      onClick: () => window.print(),
    },
    {
      icon: SpellCheckIcon,
      onClick: editor => {
        const current = editor.view.dom.getAttribute("spellcheck");
        editor.view.dom.setAttribute(
          "spellcheck",
          current === "true" ? "false" : "true"
        );
      },
    },
  ],
  [
    {
      icon: BoldIcon,
      isActive: editor => editor.isActive("bold"),
      onClick: editor => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: ItalicIcon,
      isActive: editor => editor.isActive("italic"),
      onClick: editor => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: UnderlineIcon,
      isActive: editor => editor.isActive("underline"),
      onClick: editor => editor.chain().focus().toggleUnderline().run(),
    },
    {
      icon: StrikethroughIcon,
      isActive: editor => editor.isActive("strike"),
      onClick: editor => editor.chain().focus().toggleStrike().run(),
    },
  ],
  [],
];

export const Toolbar = () => {
  return (
    <div className="bg-[#F1F3F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
      {toolbarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="contents">
          {sectionIndex > 0 && <ToolbarSeparator />}
          {section.map((button, buttonIndex) => (
            <ToolbarButton key={buttonIndex} {...button} />
          ))}
        </div>
      ))}
    </div>
  );
};
