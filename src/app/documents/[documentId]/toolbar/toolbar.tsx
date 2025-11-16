"use client";

import { ToolbarSimpleButton } from "./buttons/toolbar-simple-button";
import { ToolbarDropdownButton } from "./buttons/toolbar-dropdown-button";
import { ToolbarColorPickerButton } from "./buttons/toolbar-color-picker-button";
import { ToolbarCustomButton } from "./buttons/toolbar-custom-button";
import type { ToolbarSimpleButtonProps } from "./buttons/toolbar-simple-button";
import type { ToolbarDropdownButtonProps } from "./buttons/toolbar-dropdown-button";
import type { ToolbarColorPickerButtonProps } from "./buttons/toolbar-color-picker-button";
import type { ToolbarCustomButtonProps } from "./buttons/toolbar-custom-button";
import { TOOLBAR_BUTTON_TYPES, toolbarSections, type ToolbarItem } from "./toolbar-config";

const ToolbarSeparator = () => {
  return <div className="h-6 w-px bg-neutral-300 mx-1" />;
};

const renderToolbarItem = (item: ToolbarItem, index: number) => {
  switch (item.type) {
    case TOOLBAR_BUTTON_TYPES.BUTTON:
      return <ToolbarSimpleButton key={index} {...(item as ToolbarSimpleButtonProps)} />;
    case TOOLBAR_BUTTON_TYPES.DROPDOWN:
      return <ToolbarDropdownButton key={index} {...(item as ToolbarDropdownButtonProps)} />;
    case TOOLBAR_BUTTON_TYPES.COLOR_PICKER:
      return <ToolbarColorPickerButton key={index} {...(item as ToolbarColorPickerButtonProps)} />;
    case TOOLBAR_BUTTON_TYPES.CUSTOM:
      return <ToolbarCustomButton key={index} {...(item as ToolbarCustomButtonProps)} />;
    default:
      return null;
  }
};

export const Toolbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-[#F1F3F9] px-2.5 py-0.5 rounded-3xl min-h-10 flex items-center gap-x-0.5 overflow-x-auto">
      {toolbarSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="contents">
          {sectionIndex > 0 && <ToolbarSeparator />}
          {section.map((item, itemIndex) => renderToolbarItem(item, itemIndex))}
        </div>
      ))}
    </div>
  );
};
