import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { FileIcon } from "lucide-react";

export const MenuBar = () => {
  const triggerClass = "text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-muted h-auto";

  return (
    <div className="flex">
      <Menubar className="border-none bg-transparent shadow-none h-auto p-0">
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <FileIcon className="size-4 mr-2" />
              Save
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className={triggerClass}>Edit</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};
