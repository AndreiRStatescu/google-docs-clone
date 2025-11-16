"use client";

import { MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import styles from "../menubar.module.css";

export const MenubarFormat = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Format</MenubarTrigger>
    </MenubarMenu>
  );
};
