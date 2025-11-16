"use client";

import { Menubar } from "@/components/ui/menubar";
import { MenubarEdit } from "./menu-triggers/menubar-edit";
import { MenubarFile } from "./menu-triggers/menubar-file";
import { MenubarFormat } from "./menu-triggers/menubar-format";
import { MenubarInsert } from "./menu-triggers/menubar-insert";

export const MenuBar = () => {
  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
        <MenubarFile />
        <MenubarEdit />
        <MenubarInsert />
        <MenubarFormat />
      </Menubar>
    </div>
  );
};
