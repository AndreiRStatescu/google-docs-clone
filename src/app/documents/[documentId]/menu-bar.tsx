"use client";

import {
  Menubar,
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
import { useEffect, useRef, useState } from "react";
import { BsFilePdf } from "react-icons/bs";

export const MenuBar = () => {
  const isMac =
    typeof window !== "undefined" &&
    (navigator.userAgent.toUpperCase().includes("MAC") ||
      navigator.platform.toUpperCase().includes("MAC"));

  const triggerClass = "text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto";

  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>File</MenubarTrigger>
          <MenubarContent className="print:hidden">
            <MenubarSub>
              <MenubarSubTrigger>
                <FileIcon className="size-4 mr-2" />
                Save
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>
                  <FileJsonIcon className="size-4 mr-2" />
                  JSON
                </MenubarItem>
                <MenubarItem>
                  <GlobeIcon className="size-4 mr-2" />
                  HTML
                </MenubarItem>
                <MenubarItem>
                  <BsFilePdf className="size-4 mr-2" />
                  PDF
                </MenubarItem>
                <MenubarItem>
                  <FileTextIcon className="size-4 mr-2" />
                  TXT
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <FilePlusIcon className="size-4 mr-2" />
              New Document
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <FilePenIcon className="size-4 mr-2" />
              Rename
            </MenubarItem>
            <MenubarItem>
              <TrashIcon className="size-4 mr-2" />
              Remove
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <PrinterIcon className="size-4 mr-2" />
              Print <MenubarShortcut>{isMac ? "Cmd+P" : "Ctrl+P"}</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>Edit</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>Insert</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>Format</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
