"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  FileIcon,
  FileJsonIcon,
  FilePenIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  PrinterIcon,
  TrashIcon,
} from "lucide-react";
import { BsFilePdf } from "react-icons/bs";
import styles from "../menubar.module.css";
import { usePlatform } from "@/hooks/use-platform";
import { useEditorStore } from "@/store/use-editor-store";

export const MenubarFile = () => {
  const { isMac } = usePlatform();
  const { editor } = useEditorStore();

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  };

  const onSaveJSON = () => {
    if (!editor) return;

    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json"
    });
    onDownload(blob, `document.json`) // TODO use document name
  };
  
  const onSaveHTML = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html"
    });
    onDownload(blob, `document.html`) // TODO use document name
  };

  const onSaveText = () => {
    if (!editor) return;

    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain"
    });
    onDownload(blob, `document.txt`) // TODO use document name
  };

  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>File</MenubarTrigger>
      <MenubarContent className="print:hidden">
        <MenubarSub>
          <MenubarSubTrigger>
            <FileIcon className={styles.menubarIcon} />
            Save
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem onClick={onSaveJSON}>
              <FileJsonIcon className={styles.menubarIcon} />
              JSON
            </MenubarItem>
            <MenubarItem onClick={onSaveHTML}>
              <GlobeIcon className={styles.menubarIcon} />
              HTML
            </MenubarItem>
            <MenubarItem onClick={() => window.print()}>
              <BsFilePdf className={styles.menubarIcon} />
              PDF
            </MenubarItem>
            <MenubarItem onClick={onSaveText}>
              <FileTextIcon className={styles.menubarIcon} />
              TXT
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarItem>
          <FilePlusIcon className={styles.menubarIcon} />
          New Document
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <FilePenIcon className={styles.menubarIcon} />
          Rename
        </MenubarItem>
        <MenubarItem>
          <TrashIcon className={styles.menubarIcon} />
          Remove
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onClick={() => window.print()}>
          <PrinterIcon className={styles.menubarIcon} />
          Print <MenubarShortcut>{isMac ? "⌘P" : "Ctrl+P"}</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
