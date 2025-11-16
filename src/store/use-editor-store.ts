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
    console.log("setEditor called", editor);
    set({ editor });
  },
  triggerUpdate: () => {
    console.log("triggerUpdate called");
    set({ lastUpdate: Date.now() });
  },
}));
