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
import {
  ToolbarCustomButton,
  type ToolbarCustomButtonProps,
} from "./toolbar-custom-button";
import { ImageButton } from "./toolbar-image-button";
import { LinkButton } from "./toolbar-link-button";
import { AlignButton } from "./toolbar-align-button";
import { useEditorStore } from "@/store/use-editor-store";
import { TOOLBAR_BUTTON_TYPES } from "./toolbar-types";

type ToolbarItem =
  | ToolbarSimpleButtonProps
  | ToolbarDropdownButtonProps
  | ToolbarColorPickerButtonProps
  | ToolbarCustomButtonProps;

type ToolbarSection = ToolbarItem[];

const ToolbarSeparator = () => {
  return <div className="h-6 w-px bg-neutral-300 mx-1" />;
};

// History buttons
const undoButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Undo",
  icon: Undo2Icon,
  onClick: editor => editor.chain().focus().undo().run(),
};

const redoButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Redo",
  icon: Redo2Icon,
  onClick: editor => editor.chain().focus().redo().run(),
};

const printButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Print",
  icon: PrinterIcon,
  onClick: () => window.print(),
};

const spellCheckButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Spell Check",
  icon: SpellCheckIcon,
  onClick: editor => {
    const current = editor.view.dom.getAttribute("spellcheck");
    editor.view.dom.setAttribute(
      "spellcheck",
      current === "true" ? "false" : "true"
    );
  },
};

// Text formatting buttons
const boldButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Bold",
  icon: BoldIcon,
  isActive: editor => editor.isActive("bold"),
  onClick: editor => editor.chain().focus().toggleBold().run(),
};

const italicButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Italic",
  icon: ItalicIcon,
  isActive: editor => editor.isActive("italic"),
  onClick: editor => editor.chain().focus().toggleItalic().run(),
};

const underlineButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Underline",
  icon: UnderlineIcon,
  isActive: editor => editor.isActive("underline"),
  onClick: editor => editor.chain().focus().toggleUnderline().run(),
};

const strikethroughButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Strikethrough",
  icon: StrikethroughIcon,
  isActive: editor => editor.isActive("strike"),
  onClick: editor => editor.chain().focus().toggleStrike().run(),
};

// Color pickers
const highlightColorPicker: ToolbarColorPickerButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.COLOR_PICKER,
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
};

const textColorPicker: ToolbarColorPickerButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.COLOR_PICKER,
  label: "Text Color",
  icon: PaletteIcon,
  isActive: editor => Boolean(editor.getAttributes("textStyle").color),
  getCurrentColor: editor =>
    (editor.getAttributes("textStyle").color as string | undefined) ||
    "#000000",
  onSelectColor: (editor, hex) => editor.chain().focus().setColor(hex).run(),
  storageKey: "customTextColors",
  fallbackColor: "#000000",
};

// Utility buttons
const commentButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Comment",
  icon: MessageSquarePlusIcon,
  onClick: () => console.log("Add comment"),
  isActive: () => false,
};

const todoListButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "List Todo",
  icon: ListTodoIcon,
  onClick: editor => editor.chain().focus().toggleTaskList().run(),
  isActive: editor => editor.isActive("taskList"),
};

const removeFormattingButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Remove Formatting",
  icon: RemoveFormattingIcon,
  onClick: editor => editor.chain().focus().unsetAllMarks().run(),
};

// Dropdown buttons
const fontFamilyDropdown: ToolbarDropdownButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.DROPDOWN,
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
};

const headingDropdown: ToolbarDropdownButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.DROPDOWN,
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
};

// Custom component buttons
const linkButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: LinkButton,
};

const imageButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ImageButton,
};

const alignButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: AlignButton,
};

// Build toolbar sections from individual button definitions
const toolbarSections: ToolbarSection[] = [
  [undoButton, redoButton, printButton, spellCheckButton],
  [
    boldButton,
    italicButton,
    underlineButton,
    strikethroughButton,
    highlightColorPicker,
    textColorPicker,
  ],
  [commentButton, todoListButton, removeFormattingButton],
  [fontFamilyDropdown, headingDropdown],
  [linkButton, imageButton, alignButton],
];

const renderToolbarItem = (item: ToolbarItem, index: number) => {
  switch (item.type) {
    case TOOLBAR_BUTTON_TYPES.BUTTON:
      return <ToolbarSimpleButton key={index} {...item} />;
    case TOOLBAR_BUTTON_TYPES.DROPDOWN:
      return <ToolbarDropdownButton key={index} {...item} />;
    case TOOLBAR_BUTTON_TYPES.COLOR_PICKER:
      return <ToolbarColorPickerButton key={index} {...item} />;
    case TOOLBAR_BUTTON_TYPES.CUSTOM:
      return <ToolbarCustomButton key={index} {...item} />;
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
