"use strict";
import { jsx, jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { forwardRef, useId } from "react";
import { mergeProps } from "react-aria";
import { PendingSpinner } from "../spinner";
export const ButtonStructure = forwardRef(function ButtonStructure2({ themeSpinnerVariant, sizeVariant, fillVariant, themeVariant, outsetVariant, isPending, isSelected, isDisabled, isBeingPressed, children, ...props }, ref) {
  const labelId = useId();
  sizeVariant ??= "md";
  outsetVariant ??= "inset";
  fillVariant ??= "filled";
  themeSpinnerVariant ??= "info";
  themeVariant ??= "primary";
  if (isSelected != null) {
    if (isSelected)
      outsetVariant = isBeingPressed ? "inset" : "inset";
    else if (isSelected === false)
      outsetVariant = isBeingPressed ? "inset" : "outset";
  }
  const className = clsx(
    `btn`,
    `btn-${sizeVariant}`,
    outsetVariant == "flat" ? "" : "tactile",
    outsetVariant != "flat" && `btn-tactile-${outsetVariant}`,
    isSelected && "pressed",
    `btn-${fillVariant == "outlined" ? "outline" : "fill"}`,
    `btn-${fillVariant == "outlined" ? "outline-" : ""}${themeVariant}`,
    `btn-theme-${themeVariant}`,
    isPending && "pending",
    isDisabled && "disabled",
    isBeingPressed && "pressing"
  );
  return /* @__PURE__ */ jsxs("button", { ...mergeProps(props, { tabIndex: 0, className }), ref, children: [
    /* @__PURE__ */ jsx("span", { id: labelId, className: "btn-label", children }),
    /* @__PURE__ */ jsx(PendingSpinner, { labelId, pending: isPending ?? false })
  ] });
});
