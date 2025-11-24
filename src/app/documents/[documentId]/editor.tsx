"use client";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react/suspense";
import Color from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily, TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import ImageResize from "tiptap-extension-resize-image";

import { DOC_INITIAL_LEFT_MARGIN, DOC_INITIAL_RIGHT_MARGIN } from "@/app/constants/defaults";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { useEditorStore } from "@/store/use-editor-store";
import { Ruler } from "./ruler";
import { Threads } from "./threads";

interface EditorProps {
  initialContent?: string | undefined;
};
  
export const Editor = ({ initialContent }: EditorProps) => {
  const { setEditor, triggerUpdate, setEditorFocused, isEditorFocused } = useEditorStore();
  const liveblocks = useLiveblocksExtension({initialContent});
  const leftMargin = useStorage(store => store.leftMargin) ?? DOC_INITIAL_LEFT_MARGIN;
  const rightMargin = useStorage(store => store.rightMargin) ?? DOC_INITIAL_RIGHT_MARGIN;

  const [dummyCursorPosition, setDummyCursorPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    onCreate: ({ editor }) => {
      setEditor(editor);
    },
    onDestroy: () => {
      setEditor(null);
    },
    onUpdate: ({ editor }) => {
      triggerUpdate();
    },
    onSelectionUpdate: ({ editor }) => {
      triggerUpdate();
    },
    onTransaction: ({ editor }) => {
      triggerUpdate();
    },
    onFocus: ({ editor }) => {
      setEditorFocused(true);
      triggerUpdate();
    },
    onBlur: ({ editor }) => {
      // Store cursor position before losing focus
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      const editorElement = editorRef.current?.querySelector(".ProseMirror");

      if (editorElement && coords) {
        const editorRect = editorElement.getBoundingClientRect();
        setDummyCursorPosition({
          top: coords.top - editorRect.top,
          left: coords.left - editorRect.left,
        });
      }

      setEditorFocused(false);
      triggerUpdate();
    },
    onContentError: ({ editor }) => {
      triggerUpdate();
    },

    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      StarterKit.configure({ undoRedo: false }),
      TableKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      ImageResize,
      FontFamily,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https://",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontSizeExtension,
      LineHeightExtension.configure({
        types: ["paragraph", "heading"],
        defaultLineHeight: "normal",
      }),
      liveblocks,
    ],
    immediatelyRender: false,
  });

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <div ref={editorRef} className="relative">
          <EditorContent editor={editor} />
          <Threads editor={editor} />

          {/* Dummy cursor that appears when editor loses focus */}
          {!isEditorFocused && dummyCursorPosition && (
            <div
              className="absolute w-px h-[1.2em] bg-black pointer-events-none z-10"
              style={{
                top: `${dummyCursorPosition.top}px`,
                left: `${dummyCursorPosition.left}px`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
