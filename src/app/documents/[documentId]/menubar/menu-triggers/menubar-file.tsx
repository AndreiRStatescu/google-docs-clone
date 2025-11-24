"use client";

import { RemoveDialog } from "@/components/remove-dialog";
import { RenameDialog } from "@/components/rename-dialog";
import {
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
import { usePlatform } from "@/hooks/use-platform";
import { useEditorStore } from "@/store/use-editor-store";
import { useMutation } from "convex/react";
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
import { BsFilePdf } from "react-icons/bs";
import { toast } from "sonner";
import { api } from "../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../convex/_generated/dataModel";
import styles from "../menubar.module.css";

interface MenubarFileProps {
  data: Doc<"documents">;
}

export const MenubarFile = ({ data }: MenubarFileProps) => {
  const { isMac } = usePlatform();
  const { editor } = useEditorStore();
  const createDocument = useMutation(api.documents.create);

  const onNewDocument = () => {
    createDocument({
      title: "Untitled Document",
    })
      .then(id => {
        toast.success("Document created");
        window.open(`/documents/${id}`, "_blank");
      })
      .catch(() => toast.error("Failed to create document"));
  };

  const onDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const onSaveJSON = () => {
    if (!editor) return;

    const content = editor.getJSON();
    const blob = new Blob([JSON.stringify(content)], {
      type: "application/json",
    });
    onDownload(blob, `${data.title}.json`);
  };

  const onSaveHTML = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const blob = new Blob([content], {
      type: "text/html",
    });
    onDownload(blob, `${data.title}.html`);
  };

  const onSaveText = () => {
    if (!editor) return;

    const content = editor.getText();
    const blob = new Blob([content], {
      type: "text/plain",
    });
    onDownload(blob, `${data.title}.txt`);
  };

  return (
    <MenubarMenu>
      <MenubarTrigger className={styles.menubarTrigger}>File</MenubarTrigger>
      <MenubarContent className="print:hidden">
        <MenubarSub>
          <MenubarSubTrigger>
            <FileIcon className={styles.menubarIcon} />
            Save
          </MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem onClick={onSaveJSON}>
              <FileJsonIcon className={styles.menubarIcon} />
              JSON
            </MenubarItem>
            <MenubarItem onClick={onSaveHTML}>
              <GlobeIcon className={styles.menubarIcon} />
              HTML
            </MenubarItem>
            <MenubarItem onClick={() => window.print()}>
              <BsFilePdf className={styles.menubarIcon} />
              PDF
            </MenubarItem>
            <MenubarItem onClick={onSaveText}>
              <FileTextIcon className={styles.menubarIcon} />
              TXT
            </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
        <MenubarItem onClick={onNewDocument}>
          <FilePlusIcon className={styles.menubarIcon} />
          New Document
        </MenubarItem>
        <MenubarSeparator />
        <RenameDialog documentId={data._id} initialTitle={data.title}>
          <MenubarItem onClick={e => e.stopPropagation()} onSelect={e => e.preventDefault()}>
            <FilePenIcon className={styles.menubarIcon} />
            Rename
          </MenubarItem>
        </RenameDialog>
        <RemoveDialog documentId={data._id}>
          <MenubarItem onClick={e => e.stopPropagation()} onSelect={e => e.preventDefault()}>
            <TrashIcon className={styles.menubarIcon} />
            Remove
          </MenubarItem>
        </RemoveDialog>
        <MenubarSeparator />
        <MenubarItem onClick={() => window.print()}>
          <PrinterIcon className={styles.menubarIcon} />
          Print <MenubarShortcut>{isMac ? "⌘P" : "Ctrl+P"}</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
