"use client";

import {
  ListTodoIcon,
  MessageSquarePlusIcon,
  RemoveFormattingIcon,
} from "lucide-react";

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

import { ToolbarSimpleButton, type ToolbarSimpleButtonProps } from "./toolbar-button";
import { ToolbarDropdownButton, type ToolbarDropdownButtonProps } from "./toolbar-dropdown-button";

type ToolbarItem = ToolbarSimpleButtonProps | ToolbarDropdownButtonProps;

type ToolbarSection = ToolbarItem[];

const ToolbarSeparator = () => {
  return <div className="h-6 w-px bg-neutral-300 mx-1" />;
};

const toolbarSections: ToolbarSection[] = [
  [
    {
      type: "button",
      label: "Undo",
      icon: Undo2Icon,
      onClick: editor => editor.chain().focus().undo().run(),
    },
    {
      type: "button",
      label: "Redo",
      icon: Redo2Icon,
      onClick: editor => editor.chain().focus().redo().run(),
    },
    {
      type: "button",
      label: "Print",
      icon: PrinterIcon,
      onClick: () => window.print(),
    },
    {
      type: "button",
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
      type: "button",
      label: "Bold",
      icon: BoldIcon,
      isActive: editor => editor.isActive("bold"),
      onClick: editor => editor.chain().focus().toggleBold().run(),
    },
    {
      type: "button",
      label: "Italic",
      icon: ItalicIcon,
      isActive: editor => editor.isActive("italic"),
      onClick: editor => editor.chain().focus().toggleItalic().run(),
    },
    {
      type: "button",
      label: "Underline",
      icon: UnderlineIcon,
      isActive: editor => editor.isActive("underline"),
      onClick: editor => editor.chain().focus().toggleUnderline().run(),
    },
    {
      type: "button",
      label: "Strikethrough",
      icon: StrikethroughIcon,
      isActive: editor => editor.isActive("strike"),
      onClick: editor => editor.chain().focus().toggleStrike().run(),
    },
  ],
  [
    {
      type: "button",
      label: "Comment",
      icon: MessageSquarePlusIcon,
      onClick: () => console.log("Add comment"),
      isActive: () => false,
    },
    {
      type: "button",
      label: "List Todo",
      icon: ListTodoIcon,
      onClick: editor => editor.chain().focus().toggleTaskList().run(),
      isActive: editor => editor.isActive("taskList"),
    },
    {
      type: "button",
      label: "Remove Formatting",
      icon: RemoveFormattingIcon,
      onClick: editor => editor.chain().focus().unsetAllMarks().run(),
    },
  ],
  [
    {
      type: "dropdown",
      width: "120px",
      getCurrentValue: editor =>
        editor.getAttributes("textStyle").fontFamily || "Arial",
      options: [
        { label: "Arial", value: "Arial" },
        { label: "Courier New", value: "Courier New" },
        { label: "Georgia", value: "Georgia" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Verdana", value: "Verdana" },
      ],
      onSelect: (editor, value) =>
        editor.chain().focus().setFontFamily(value).run(),
    },
  ],
];

const renderToolbarItem = (item: ToolbarItem, index: number) => {
  switch (item.type) {
    case "button":
      return <ToolbarSimpleButton key={index} {...item} />;
    case "dropdown":
      return <ToolbarDropdownButton key={index} {...item} />;
    default:
      return null;
  }
};

export const Toolbar = () => {
  return (
    <div className="bg-[#F1F3F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
      {toolbarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="contents">
          {sectionIndex > 0 && <ToolbarSeparator />}
          {section.map((item, itemIndex) => renderToolbarItem(item, itemIndex))}
        </div>
      ))}
    </div>
  );
};
