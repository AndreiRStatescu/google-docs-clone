"use client";

import {
  ImageIcon,
  Link2Icon,
  ListTodoIcon,
  MessageSquarePlusIcon,
  RemoveFormattingIcon,
  UploadIcon,
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
import { useEditorStore } from "@/store/use-editor-store";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ToolbarItem =
  | ToolbarSimpleButtonProps
  | ToolbarDropdownButtonProps
  | ToolbarColorPickerButtonProps;

type ToolbarSection = ToolbarItem[];

const ToolbarSeparator = () => {
  return <div className="h-6 w-px bg-neutral-300 mx-1" />;
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
    setImageUrl("");
    setIsDialogOpen(false);
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };
    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5">
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="size-4 mr-2" /> Upload
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <ImageIcon className="size-4 mr-2" /> Paste Image URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image URL</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key == "Enter") {
                handleImageUrlSubmit();
              }
            }}
          />
          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");

  const onChange = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setValue("");
  };

  return (
    <DropdownMenu
      onOpenChange={open => {
        if (open) setValue(editor?.getAttributes("link").href || "");
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
      <LinkButton />
      <ImageButton />
    </div>
  );
};
