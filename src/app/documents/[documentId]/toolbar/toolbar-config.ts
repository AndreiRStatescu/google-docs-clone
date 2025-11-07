import {
  ListTodoIcon,
  MessageSquarePlusIcon,
  RemoveFormattingIcon,
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

import type { ToolbarSimpleButtonProps } from "./buttons/toolbar-simple-button";
import type { ToolbarDropdownButtonProps } from "./buttons/toolbar-dropdown-button";
import type { ToolbarColorPickerButtonProps } from "./buttons/toolbar-color-picker-button";
import type { ToolbarCustomButtonProps } from "./buttons/toolbar-custom-button";
import { ToolbarImageButton } from "./buttons/toolbar-image-button";
import { ToolbarLinkButton } from "./buttons/toolbar-link-button";
import { ToolbarAlignButton } from "./buttons/toolbar-align-button";
import { ToolbarListButton } from "./buttons/toolbar-list-button";
import { ToolbarFontSizeButton } from "./buttons/toolbar-font-size-button";
import { ToolbarLineHeightButton } from "./buttons/toolbar-line-height-button";

export const TOOLBAR_BUTTON_TYPES: Record<string, string> = {
  BUTTON: "button",
  DROPDOWN: "dropdown",
  COLOR_PICKER: "color-picker",
  CUSTOM: "custom",
};

export type ToolbarItem =
  | ToolbarSimpleButtonProps
  | ToolbarDropdownButtonProps
  | ToolbarColorPickerButtonProps
  | ToolbarCustomButtonProps;

export type ToolbarSection = ToolbarItem[];

// History buttons
export const undoButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Undo",
  icon: Undo2Icon,
  onClick: editor => editor.chain().focus().undo().run(),
};

export const redoButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Redo",
  icon: Redo2Icon,
  onClick: editor => editor.chain().focus().redo().run(),
};

export const printButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Print",
  icon: PrinterIcon,
  onClick: () => window.print(),
};

export const spellCheckButton: ToolbarSimpleButtonProps = {
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
export const boldButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Bold",
  icon: BoldIcon,
  isActive: editor => editor.isActive("bold"),
  onClick: editor => editor.chain().focus().toggleBold().run(),
};

export const italicButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Italic",
  icon: ItalicIcon,
  isActive: editor => editor.isActive("italic"),
  onClick: editor => editor.chain().focus().toggleItalic().run(),
};

export const underlineButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Underline",
  icon: UnderlineIcon,
  isActive: editor => editor.isActive("underline"),
  onClick: editor => editor.chain().focus().toggleUnderline().run(),
};

export const strikethroughButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Strikethrough",
  icon: StrikethroughIcon,
  isActive: editor => editor.isActive("strike"),
  onClick: editor => editor.chain().focus().toggleStrike().run(),
};

// Color pickers
export const highlightColorPicker: ToolbarColorPickerButtonProps = {
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

export const textColorPicker: ToolbarColorPickerButtonProps = {
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
export const commentButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Comment",
  icon: MessageSquarePlusIcon,
  onClick: () => console.log("Add comment"),
  isActive: () => false,
};

export const todoListButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "List Todo",
  icon: ListTodoIcon,
  onClick: editor => editor.chain().focus().toggleTaskList().run(),
  isActive: editor => editor.isActive("taskList"),
};

export const removeFormattingButton: ToolbarSimpleButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.BUTTON,
  label: "Remove Formatting",
  icon: RemoveFormattingIcon,
  onClick: editor => editor.chain().focus().unsetAllMarks().run(),
};

// Dropdown buttons
export const fontFamilyDropdown: ToolbarDropdownButtonProps = {
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

export const headingDropdown: ToolbarDropdownButtonProps = {
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
export const linkButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ToolbarLinkButton,
};

export const imageButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ToolbarImageButton,
};

export const alignButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ToolbarAlignButton,
};

export const listButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ToolbarListButton,
};

export const lineHeightButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ToolbarLineHeightButton,
};

export const fontSizeButton: ToolbarCustomButtonProps = {
  type: TOOLBAR_BUTTON_TYPES.CUSTOM,
  component: ToolbarFontSizeButton,
};

// Build toolbar sections from individual button definitions
// Organized to match Google Docs toolbar layout
export const toolbarSections: ToolbarSection[] = [
  // History and document actions
  [undoButton, redoButton, printButton, spellCheckButton],
  // Text style and formatting
  [fontSizeButton, fontFamilyDropdown, headingDropdown],
  // Basic text formatting
  [boldButton, italicButton, underlineButton, strikethroughButton],
  // Colors
  [textColorPicker, highlightColorPicker],
  // Insert and collaborate
  [linkButton, commentButton, imageButton],
  // Paragraph formatting and lists
  [alignButton, listButton, lineHeightButton, todoListButton],
  // Additional formatting
  [removeFormattingButton],
];
