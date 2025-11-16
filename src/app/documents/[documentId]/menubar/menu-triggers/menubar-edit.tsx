"use client";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar";
import styles from "../menubar.module.css";
import { Undo2Icon } from "lucide-react";
import { usePlatform } from "@/hooks/use-platform";

export const MenubarEdit = () => {
  const { isMac } = usePlatform();

  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <Undo2Icon className={styles.menubarIcon} />
          Undo <MenubarShortcut>{isMac ? "⌘Z" : "Ctrl+Z"}</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          <Undo2Icon className={styles.menubarIcon} style={{ transform: "scaleX(-1)" }} />
          Redo <MenubarShortcut>{isMac ? "⌘⇧Z" : "Ctrl+Y"}</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
