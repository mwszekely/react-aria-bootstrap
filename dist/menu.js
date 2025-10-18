"use strict";
import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { DismissButton, mergeProps, Overlay, usePopover } from "react-aria";
function Popover({ children, state, ...props }) {
  let popoverRef = useRef(null);
  let { popoverProps, underlayProps } = usePopover({ ...props, popoverRef }, state);
  return /* @__PURE__ */ jsxs(Overlay, { children: [
    /* @__PURE__ */ jsx("div", { ...underlayProps, style: { position: "fixed", inset: 0 } }),
    /* @__PURE__ */ jsxs("div", { ...mergeProps(popoverProps, { className: "popover" }), ref: popoverRef, children: [
      /* @__PURE__ */ jsx(DismissButton, { onDismiss: state.close }),
      children,
      /* @__PURE__ */ jsx(DismissButton, { onDismiss: state.close })
    ] })
  ] });
}
