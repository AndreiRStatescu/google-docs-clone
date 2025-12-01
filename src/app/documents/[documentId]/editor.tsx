"use client";

import { useDebounce } from "@/hooks/use-debouce";
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

import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import ImageResize from "tiptap-extension-resize-image";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

import { DOC_INITIAL_LEFT_MARGIN, DOC_INITIAL_RIGHT_MARGIN } from "@/app/constants/defaults";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { useEditorStore } from "@/store/use-editor-store";
import { Ruler } from "./ruler";
import { Threads } from "./threads";

interface EditorProps {
  initialContent?: string | undefined;
  documentId: Id<"documents">;
}

export const Editor = ({ initialContent, documentId }: EditorProps) => {
  const { setEditor, triggerUpdate, setEditorFocused, isEditorFocused } = useEditorStore();
  const liveblocks = useLiveblocksExtension({ initialContent, offlineSupport_experimental: true });
  const leftMargin = useStorage(store => store.leftMargin) ?? DOC_INITIAL_LEFT_MARGIN;
  const rightMargin = useStorage(store => store.rightMargin) ?? DOC_INITIAL_RIGHT_MARGIN;

  const updateDocument = useMutation(api.documents.updateById);

  const debouncedUpdateTime = useDebounce(() => {
    updateDocument({ id: documentId, updateTime: Date.now() });
  }, 1000);

  const [dummyCursorPosition, setDummyCursorPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    autofocus: true,
    immediatelyRender: false,
    onCreate: ({ editor }) => {
      setEditor(editor);
    },
    onDestroy: () => {
      setEditor(null);
    },
    onUpdate: ({ transaction }) => {
      triggerUpdate();
      // Only update time if the document content actually changed by user action
      // Exclude: sync transactions (initial load, Liveblocks sync)
      const isUserEdit = transaction.docChanged && !transaction.getMeta("y-sync$");

      if (isUserEdit) {
        debouncedUpdateTime();
      }
    },
    onSelectionUpdate: () => {
      triggerUpdate();
    },
    onTransaction: () => {
      triggerUpdate();
    },
    onFocus: () => {
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
    onContentError: () => {
      triggerUpdate();
    },

    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
      handleKeyDown: (view, event) => {
        // Check for Alt/Opt + Space
        if (event.altKey && event.code === "Space") {
          event.preventDefault();

          const { state, dispatch } = view;
          const { tr } = state;

          // Insert a new paragraph with "DUMMY Stuff"
          const paragraph = state.schema.nodes.paragraph.create(
            null,
            state.schema.text("DUMMY Stuff")
          );

          tr.replaceSelectionWith(paragraph);
          dispatch(tr);

          return true;
        }
        return false;
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
