"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import {
  ChevronDownIcon,
  ListTodoIcon,
  MessageSquarePlusIcon,
  RemoveFormattingIcon,
  type LucideIcon,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

interface ToolbarButtonProps {
  label: string;
  icon: LucideIcon;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
}

type ToolbarSection = ToolbarButtonProps[];

const ToolbarButton = ({
  label,
  icon: Icon,
  isActive: checkIsActive,
  onClick: handleClick,
}: ToolbarButtonProps) => {
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

const FontFamilyButton = () => {
  const { editor, lastUpdate } = useEditorStore();
  const [selectedFont, setSelectedFont] = useState("Arial");

  useEffect(() => {
    const currentFont =
      editor?.getAttributes("textStyle").fontFamily || "Arial";
    setSelectedFont(currentFont);
  }, [editor, lastUpdate]);

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <span className="truncate">{selectedFont}</span>
          <ChevronDownIcon className="size-4 ml-2 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <button
            key={value}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.getAttributes("textStyle").fontFamily === value &&
                "bg-neutral-200/80"
            )}
            style={{ fontFamily: value }}
            onClick={() => {
              editor?.chain().focus().setFontFamily(value).run();
            }}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ToolbarSeparator = () => {
  return <div className="h-6 w-px bg-neutral-300 mx-1" />;
};

const toolbarSections: ToolbarSection[] = [
  [
    {
      label: "Undo",
      icon: Undo2Icon,
      onClick: editor => editor.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      icon: Redo2Icon,
      onClick: editor => editor.chain().focus().redo().run(),
    },
    {
      label: "Print",
      icon: PrinterIcon,
      onClick: () => window.print(),
    },
    {
      label: "Spell Check",
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
      label: "Bold",
      icon: BoldIcon,
      isActive: editor => editor.isActive("bold"),
      onClick: editor => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: ItalicIcon,
      isActive: editor => editor.isActive("italic"),
      onClick: editor => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      icon: UnderlineIcon,
      isActive: editor => editor.isActive("underline"),
      onClick: editor => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strikethrough",
      icon: StrikethroughIcon,
      isActive: editor => editor.isActive("strike"),
      onClick: editor => editor.chain().focus().toggleStrike().run(),
    },
  ],
  [
    {
      label: "Comment",
      icon: MessageSquarePlusIcon,
      onClick: () => console.log("Add comment"),
      isActive: () => false,
    },
    {
      label: "List Todo",
      icon: ListTodoIcon,
      onClick: editor => editor.chain().focus().toggleTaskList().run(),
      isActive: editor => editor.isActive("taskList"),
    },
    {
      label: "Remove Formatting",
      icon: RemoveFormattingIcon,
      onClick: editor => editor.chain().focus().unsetAllMarks().run(),
    },
  ],
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
      <FontFamilyButton />
    </div>
  );
};
