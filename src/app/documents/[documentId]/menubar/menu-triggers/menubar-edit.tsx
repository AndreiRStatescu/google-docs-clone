"use client";

import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import styles from "../menubar.module.css";
import { Undo2Icon } from "lucide-react";

export const MenubarEdit = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Edit</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <Undo2Icon className={styles.menubarIcon} />
          Undo
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
