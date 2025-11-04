"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { BoldIcon } from "lucide-react";


const BoldButton = () => {
  const editor = useEditorStore(state => state.editor);
  const lastUpdate = useEditorStore(state => state.lastUpdate);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(editor?.isActive("bold") || false);
  }, [editor, lastUpdate]);

  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
    isActive && "#d4d4d8"
  );

  return (
    <button
      onClick={() => {
        editor?.chain().focus().toggleBold().run();
      }}
      className={className}
      style={{ backgroundColor: isActive ? "#ffd4d8" : undefined }}
    >
      <BoldIcon className="size-4" />
    </button>
  );
};

export const Toolbar = () => {
  return (
    <div className="bg-[#F1F3F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
      <BoldButton />
    </div>
  );
};
