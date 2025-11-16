"use client";

import { MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import styles from "../menubar.module.css";

export const MenubarInsert = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Insert</MenubarTrigger>
    </MenubarMenu>
  );
};
