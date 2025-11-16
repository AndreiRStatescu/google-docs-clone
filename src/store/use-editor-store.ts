import { type Editor } from "@tiptap/react";
import { create } from "zustand";

interface EditorStore {
  editor: Editor | null;
  lastUpdate: number;
  setEditor: (editor: Editor | null) => void;
  triggerUpdate: () => void;
}

export const useEditorStore = create<EditorStore>(set => ({
  editor: null,
  lastUpdate: 0,
  setEditor: editor => {
    set({ editor });
  },
  triggerUpdate: () => {
    set({ lastUpdate: Date.now() });
  },
}));
