"use client";

import { type Editor } from "@tiptap/react";
import { HighlighterIcon, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ChromePicker, type ColorResult } from "react-color";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";

export interface ToolbarColorPickerButtonProps {
  type: string;
  label: string;
  icon?: LucideIcon;
  // Compute whether the button is active (e.g., a color/mark is applied)
  isActive?: (editor: Editor) => boolean;
  // Resolve the current color from the editor state
  getCurrentColor?: (editor: Editor) => string | undefined;
  // Apply a color to the editor (e.g., highlight or text color)
  onSelectColor?: (editor: Editor, hex: string) => void;
  // Key for persisting custom colors separately per action
  storageKey?: string;
  // Fallback color when no color is currently set
  fallbackColor?: string;
}

export const ToolbarColorPickerButton = ({
  label,
  icon: Icon = HighlighterIcon,
  isActive: checkIsActive,
  getCurrentColor,
  onSelectColor,
  storageKey,
  fallbackColor,
}: ToolbarColorPickerButtonProps) => {
  const { editor, lastUpdate } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Initialize customColors from localStorage using lazy initializer
  const [customColors, setCustomColors] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const key = storageKey || `customColors:${label}`;
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as string[];
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const STANDARD_COLORS = useMemo(
    () => [
      // Grayscale
      "#000000",
      "#434343",
      "#666666",
      "#999999",
      "#B7B7B7",
      "#CCCCCC",
      "#D9D9D9",
      "#EFEFEF",
      "#F3F3F3",
      "#FFFFFF",
      // Reds
      "#F28B82",
      "#EA4335",
      "#C5221F",
      // Oranges
      "#FBBC04",
      "#F29900",
      "#C27803",
      // Yellows
      "#FFF475",
      "#FDD663",
      "#E6C229",
      // Greens
      "#CCFF90",
      "#34A853",
      "#0B8043",
      // Teals
      "#A7FFEB",
      "#00C4B3",
      "#00796B",
      // Blues
      "#CBF0F8",
      "#4285F4",
      "#1967D2",
      // Purples
      "#D7AEFB",
      "#A142F4",
      "#5E35B1",
      // Pinks
      "#FDCFE8",
      "#E91E63",
      "#AD1457",
    ],
    []
  );

  // Derive isActive and currentColor directly from editor state
  const isActive = editor
    ? checkIsActive
      ? checkIsActive(editor)
      : editor.isActive("highlight")
    : false;

  const currentColor = (() => {
    if (!editor) return fallbackColor || "#ffff00";

    const resolved = getCurrentColor
      ? getCurrentColor(editor)
      : (editor.getAttributes("highlight").color as string | undefined);

    return resolved || fallbackColor || "#ffff00";
  })();

  // Trigger re-render when editor state changes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _forceUpdate = lastUpdate;

  // Persist custom colors
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const key = storageKey || `customColors:${label}`;
      window.localStorage.setItem(
        key,
        JSON.stringify(customColors.slice(0, 18))
      );
    } catch {}
  }, [customColors, label, storageKey]);

  const applyColor = (hex: string) => {
    if (!editor) return;
    if (onSelectColor) {
      onSelectColor(editor, hex);
    } else {
      // Default behavior: apply highlight color
      editor.chain().focus().setHighlight({ color: hex }).run();
    }
  };

  const handleColorChange = (color: ColorResult) => {
    applyColor(color.hex);
  };

  const handleColorChangeComplete = (color: ColorResult) => {
    const hex = color.hex as string;
    setCustomColors(prev => {
      if (prev.includes(hex)) return prev;
      return [...prev, hex].slice(0, 18);
    });
    setShowPicker(false);
  };

  const className = cn(
    "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 relative",
    isActive && "bg-neutral-200/80"
  );

  return (
    <Popover
      open={open}
      onOpenChange={v => {
        setOpen(v);
        if (!v) setShowPicker(false);
      }}
      // Keep modal=false so the editor can retain focus and keep selection visible
      modal={false}
    >
      <PopoverTrigger asChild>
        <button
          className={className}
          title={label}
          // Prevent the trigger from stealing focus from the editor so the selection stays visible
          onMouseDown={e => e.preventDefault()}
          onPointerDown={e => e.preventDefault()}
        >
          <Icon className="size-4" />
          <div
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded"
            style={{ backgroundColor: currentColor }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        side="bottom"
        align="start"
        onInteractOutside={e => {
          e.preventDefault();
        }}
        onPointerDownOutside={e => {
          const target = e.target as HTMLElement;
          if (!target.closest('[role="dialog"]')) {
            setOpen(false);
          }
        }}
      >
        <div
          className="p-2"
          onMouseDown={e => e.preventDefault()}
          onClick={e => e.stopPropagation()}
        >
          {/* Standard colors */}
          <div className="mb-2">
            <div className="text-[11px] text-neutral-500 mb-1 px-0.5">
              Standard colors
            </div>
            <div className="grid grid-cols-8 gap-1 w-52">
              {STANDARD_COLORS.map(hex => (
                <button
                  key={hex}
                  className="h-5 w-5 rounded border border-black/10 hover:scale-105 transition-transform"
                  style={{ backgroundColor: hex }}
                  onClick={() => applyColor(hex)}
                  title={hex}
                >
                  {currentColor.toLowerCase() === hex.toLowerCase() && (
                    <span className="block h-full w-full rounded ring-2 ring-offset-1 ring-offset-white ring-black/30" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom colors */}
          <div className="mb-2">
            <div className="text-[11px] text-neutral-500 mb-1 px-0.5">
              Custom colors
            </div>
            <div className="grid grid-cols-8 gap-1 w-52">
              {customColors.map(hex => (
                <button
                  key={hex}
                  className="h-5 w-5 rounded border border-black/10 hover:scale-105 transition-transform"
                  style={{ backgroundColor: hex }}
                  onClick={() => applyColor(hex)}
                  title={hex}
                >
                  {currentColor.toLowerCase() === hex.toLowerCase() && (
                    <span className="block h-full w-full rounded ring-2 ring-offset-1 ring-offset-white ring-black/30" />
                  )}
                </button>
              ))}
              <button
                className="h-5 w-5 rounded border border-dashed border-neutral-400 text-[9px] flex items-center justify-center hover:bg-neutral-100"
                onClick={() => setShowPicker(true)}
                title="Add a custom colour"
              >
                +
              </button>
            </div>
          </div>

          {/* Color picker - shown only when adding a custom colour */}
          {showPicker && (
            <div
              className="mt-2"
              onMouseDown={e => e.preventDefault()}
              onClick={e => e.stopPropagation()}
            >
              <ChromePicker
                color={currentColor}
                onChange={handleColorChange}
                onChangeComplete={handleColorChangeComplete}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
