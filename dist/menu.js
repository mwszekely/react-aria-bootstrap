"use strict";
import { useRef } from "react";
import { DismissButton, mergeProps, Overlay, usePopover } from "react-aria";
function Popover({ children, state, ...props }) {
  let popoverRef = useRef(null);
  let { popoverProps, underlayProps } = usePopover({ ...props, popoverRef }, state);
  return /* @__PURE__ */ React.createElement(Overlay, null, /* @__PURE__ */ React.createElement("div", { ...underlayProps, style: { position: "fixed", inset: 0 } }), /* @__PURE__ */ React.createElement("div", { ...mergeProps(popoverProps, { className: "popover" }), ref: popoverRef }, /* @__PURE__ */ React.createElement(DismissButton, { onDismiss: state.close }), children, /* @__PURE__ */ React.createElement(DismissButton, { onDismiss: state.close })));
}
