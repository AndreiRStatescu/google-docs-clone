import { create } from "zustand";
import { type Editor } from "@tiptap/react";

interface EditorStore {
  editor: Editor | null;
  lastUpdate: number;
  setEditor: (editor: Editor | null) => void;
}

export const useEditorStore = create<EditorStore>(set => ({
  editor: null,
  lastUpdate: 0,
  setEditor: editor => set({ editor, lastUpdate: Date.now() }),
}));
