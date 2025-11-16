import { type Editor } from "@tiptap/react";
import { create } from "zustand";

interface EditorStore {
  editor: Editor | null;
  lastUpdate: number;
  isEditorFocused: boolean;
  setEditor: (editor: Editor | null) => void;
  triggerUpdate: () => void;
  setEditorFocused: (focused: boolean) => void;
}

export const useEditorStore = create<EditorStore>(set => ({
  editor: null,
  lastUpdate: 0,
  isEditorFocused: true,
  setEditor: editor => {
    set({ editor });
  },
  triggerUpdate: () => {
    set({ lastUpdate: Date.now() });
  },
  setEditorFocused: focused => {
    set({ isEditorFocused: focused });
  },
}));
