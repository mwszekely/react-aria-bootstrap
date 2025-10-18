"use strict";
import { jsx } from "react/jsx-runtime";
import { announce } from "@react-aria/live-announcer";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { mergeProps, useProgressBar } from "react-aria";
export function PendingSpinner({ pending, variantStyle, variantSize, timeout, labelId, ...props }) {
  const [showingSpinner, setShowingSpinner] = useState(false);
  const { labelProps, progressBarProps } = useProgressBar({ isIndeterminate: true, "aria-labelledby": labelId, ...props });
  variantSize ??= "md";
  timeout ??= 250;
  const s = variantStyle == "spin" || !variantStyle ? "border" : "grow";
  useEffect(() => {
    if (pending) {
      const handle = setTimeout(() => {
        setShowingSpinner(true);
      }, timeout);
      return () => clearTimeout(handle);
    } else {
      setShowingSpinner(false);
    }
  }, [pending, timeout]);
  useEffect(() => {
    if (pending && showingSpinner) {
      announce({ "aria-labelledby": labelId }, "assertive");
    }
  }, [pending, showingSpinner, labelId]);
  const p = mergeProps(progressBarProps, { className: clsx(`spinner-${s}`, `spinner-${s}-${variantSize}`) });
  return /* @__PURE__ */ jsx("div", { "aria-hidden": pending ? void 0 : "true", className: clsx("spinner", showingSpinner ? "opacity-100" : "opacity-0"), children: /* @__PURE__ */ jsx("div", { ...p, children: /* @__PURE__ */ jsx("span", { className: "visually-hidden", children: "In progress..." }) }) });
}
