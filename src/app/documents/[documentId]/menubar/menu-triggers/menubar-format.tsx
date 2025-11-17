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
import { useEditorStore } from "@/store/use-editor-store";

export const MenubarFormat = () => {
  const { isMac } = usePlatform();
  const { editor } = useEditorStore();

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
            <MenubarItem onClick={() => editor?.chain().focus().toggleBold().run()}>
              <BoldIcon className={styles.menubarIcon} />
              Bold <MenubarShortcut>{isMac ? "⌘B" : "Ctrl+B"}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().toggleItalic().run()}>
              <ItalicIcon className={styles.menubarIcon} />
              Italic <MenubarShortcut>{isMac ? "⌘I" : "Ctrl+I"}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().toggleUnderline().run()}>
              <UnderlineIcon className={styles.menubarIcon} />
              Underline <MenubarShortcut>{isMac ? "⌘U" : "Ctrl+U"}</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor?.chain().focus().toggleStrike().run()}>
              <StrikethroughIcon className={styles.menubarIcon} />
              Strikethrough <MenubarShortcut>{isMac ? "⌘⇧X" : "Ctrl+Shift+X"}</MenubarShortcut>
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarItem onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
          <RemoveFormattingIcon className={styles.menubarIcon} />
          Clear formatting <MenubarShortcut>{isMac ? "⌘\\ " : "Ctrl+\\"}</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
