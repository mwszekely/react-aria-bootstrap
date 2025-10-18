"use strict";
import { forwardRef, useRef } from "react";
import { mergeProps } from "react-aria";
import { useTransition } from "./transition2";
export const Transition = forwardRef(function Transition2({ show, delayMountUntilShown, children }, ref2) {
  const ref3 = useRef(null);
  const { ref } = mergeProps({ ref: ref2 }, { ref: ref3 });
  const { mount, props } = useTransition({ show, delayMountUntilShown, measure: false, propsIncoming: { children }, elementRef: ref3, exitVisibility: "removed" });
  return mount && /* @__PURE__ */ React.createElement("div", { ...props, ref });
});
