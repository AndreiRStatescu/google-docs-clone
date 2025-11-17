"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import styles from "../menubar.module.css";
import { Undo2Icon } from "lucide-react";
import { usePlatform } from "@/hooks/use-platform";
import { useEditorStore } from "@/store/use-editor-store";

export const MenubarEdit = () => {
  const { isMac } = usePlatform();
  const { editor } = useEditorStore();

  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => editor?.chain().focus().undo().run()}>
          <Undo2Icon className={styles.menubarIcon} />
          Undo <MenubarShortcut>{isMac ? "⌘Z" : "Ctrl+Z"}</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onClick={() => editor?.chain().focus().redo().run()}>
          <Undo2Icon className={styles.menubarIcon} style={{ transform: "scaleX(-1)" }} />
          Redo <MenubarShortcut>{isMac ? "⌘⇧Z" : "Ctrl+Y"}</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
