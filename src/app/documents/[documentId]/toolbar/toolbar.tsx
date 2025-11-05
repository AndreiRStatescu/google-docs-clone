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
  PaletteIcon,
  HighlighterIcon,
} from "lucide-react";

import {
  ToolbarSimpleButton,
  type ToolbarSimpleButtonProps,
} from "./toolbar-simple-button";
import {
  ToolbarDropdownButton,
  type ToolbarDropdownButtonProps,
} from "./toolbar-dropdown-button";
import {
  ToolbarColorPickerButton,
  type ToolbarColorPickerButtonProps,
} from "./toolbar-color-picker-button";

type ToolbarItem =
  | ToolbarSimpleButtonProps
  | ToolbarDropdownButtonProps
  | ToolbarColorPickerButtonProps;

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
    {
      type: "color-picker",
      label: "Text Highlight",
      icon: HighlighterIcon,
      isActive: editor => editor.isActive("highlight"),
      getCurrentColor: editor =>
        (editor.getAttributes("highlight").color as string | undefined) ||
        "#ffff00",
      onSelectColor: (editor, hex) =>
        editor.chain().focus().setHighlight({ color: hex }).run(),
      storageKey: "customHighlightColors",
      fallbackColor: "#ffff00",
    },
    {
      type: "color-picker",
      label: "Text Color",
      icon: PaletteIcon,
      isActive: editor => Boolean(editor.getAttributes("textStyle").color),
      getCurrentColor: editor =>
        (editor.getAttributes("textStyle").color as string | undefined) ||
        "#000000",
      onSelectColor: (editor, hex) =>
        editor.chain().focus().setColor(hex).run(),
      storageKey: "customTextColors",
      fallbackColor: "#000000",
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
      label: "Font Family",
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
    {
      type: "dropdown",
      label: "Heading",
      width: "120px",
      getCurrentValue: editor => {
        if (editor.isActive("heading", { level: 1 })) return "heading1";
        if (editor.isActive("heading", { level: 2 })) return "heading2";
        if (editor.isActive("heading", { level: 3 })) return "heading3";
        if (editor.isActive("heading", { level: 4 })) return "heading4";
        if (editor.isActive("heading", { level: 5 })) return "heading5";
        if (editor.isActive("heading", { level: 6 })) return "heading6";
        return "normal";
      },
      options: [
        { label: "Normal", value: "normal" },
        { label: "Heading 1", value: "heading1", fontSize: "18px" },
        { label: "Heading 2", value: "heading2", fontSize: "17px" },
        { label: "Heading 3", value: "heading3", fontSize: "16px" },
        { label: "Heading 4", value: "heading4", fontSize: "15px" },
        { label: "Heading 5", value: "heading5", fontSize: "14px" },
        { label: "Heading 6", value: "heading6", fontSize: "13px" },
      ],
      onSelect: (editor, value) => {
        if (value === "normal") {
          editor.chain().focus().setParagraph().run();
        } else {
          const level = parseInt(value.replace("heading", "")) as
            | 1
            | 2
            | 3
            | 4
            | 5
            | 6;
          editor.chain().focus().setHeading({ level }).run();
        }
      },
    },
  ],
];

const renderToolbarItem = (item: ToolbarItem, index: number) => {
  switch (item.type) {
    case "button":
      return <ToolbarSimpleButton key={index} {...item} />;
    case "dropdown":
      return <ToolbarDropdownButton key={index} {...item} />;
    case "color-picker":
      return <ToolbarColorPickerButton key={index} {...item} />;
    default:
      return null;
  }
};

export const Toolbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-[#F1F3F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
      {toolbarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="contents">
          {sectionIndex > 0 && <ToolbarSeparator />}
          {section.map((item, itemIndex) => renderToolbarItem(item, itemIndex))}
        </div>
      ))}
    </div>
  );
};
