"use client";

import {
  MenubarContent,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import styles from "../menubar.module.css";
import { MenubarInsertTable } from "./menubar-insert-table";

export const MenubarInsert = () => {
  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Insert</MenubarTrigger>
      <MenubarContent className="print:hidden">
        <MenubarSub>
          <MenubarSubTrigger>Table</MenubarSubTrigger>
          <MenubarSubContent className="p-2">
            <MenubarInsertTable />
          </MenubarSubContent>
        </MenubarSub>
      </MenubarContent>
    </MenubarMenu>
  );
};
