"use client";

import { type ComponentType } from "react";
import { TOOLBAR_BUTTON_TYPES } from "./toolbar-types";

export interface ToolbarCustomButtonProps {
  type: string;
  component: ComponentType;
}

export const ToolbarCustomButton = ({
  component: Component,
}: ToolbarCustomButtonProps) => {
  return <Component />;
};
