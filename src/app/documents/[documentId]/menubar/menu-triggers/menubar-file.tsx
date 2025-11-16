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

export const MenubarFile = () => {
  const { isMac } = usePlatform();
  
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
            <MenubarItem>
              <FileJsonIcon className={styles.menubarIcon} />
              JSON
            </MenubarItem>
            <MenubarItem>
              <GlobeIcon className={styles.menubarIcon} />
              HTML
            </MenubarItem>
            <MenubarItem>
              <BsFilePdf className={styles.menubarIcon} />
              PDF
            </MenubarItem>
            <MenubarItem>
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
