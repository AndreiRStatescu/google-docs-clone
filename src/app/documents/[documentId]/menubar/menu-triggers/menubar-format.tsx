"use client";

import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import styles from "../menubar.module.css";
import {
  BoldIcon,
  ItalicIcon,
  Menu,
  RemoveFormattingIcon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon,
} from "lucide-react";
import { usePlatform } from "@/hooks/use-platform";

export const MenubarFormat = () => {
  const { isMac } = usePlatform();

  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>Format</MenubarTrigger>
      <MenubarContent>
        <MenubarSub>
          <MenubarSubTrigger>
            <TextIcon className={styles.menubarIcon} />
            Text
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem>
              <BoldIcon className={styles.menubarIcon} />
              Bold <MenubarShortcut>{isMac ? "⌘B" : "Ctrl+B"}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ItalicIcon className={styles.menubarIcon} />
              Italic <MenubarShortcut>{isMac ? "⌘I" : "Ctrl+I"}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <UnderlineIcon className={styles.menubarIcon} />
              Underline <MenubarShortcut>{isMac ? "⌘U" : "Ctrl+U"}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <StrikethroughIcon className={styles.menubarIcon} />
              Strikethrough <MenubarShortcut>{isMac ? "⌘⇧X" : "Ctrl+Shift+X"}</MenubarShortcut>
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarItem>
          <RemoveFormattingIcon className={styles.menubarIcon} />
          Clear formatting <MenubarShortcut>{isMac ? "⌘\\ " : "Ctrl+\\"}</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
