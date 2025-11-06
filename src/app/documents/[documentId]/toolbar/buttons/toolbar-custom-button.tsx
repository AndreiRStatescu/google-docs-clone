"use client";

import { type ComponentType } from "react";

export interface ToolbarCustomButtonProps {
  type: string;
  component: ComponentType;
}

export const ToolbarCustomButton = ({
  component: Component,
}: ToolbarCustomButtonProps) => {
  return <Component />;
};
