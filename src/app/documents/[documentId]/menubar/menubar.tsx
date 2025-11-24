"use client";

import { Menubar } from "@/components/ui/menubar";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { MenubarEdit } from "./menu-triggers/menubar-edit";
import { MenubarFile } from "./menu-triggers/menubar-file";
import { MenubarFormat } from "./menu-triggers/menubar-format";
import { MenubarInsert } from "./menu-triggers/menubar-insert";

interface MenuBarProps {
  data: Doc<"documents">;
}

export const MenuBar = ({ data }: MenuBarProps) => {
  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
        <MenubarFile data={data} />
        <MenubarEdit />
        <MenubarInsert />
        <MenubarFormat />
      </Menubar>
    </div>
  );
};
