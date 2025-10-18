"use strict";
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { useContext, useId, useRef } from "react";
import { mergeProps, useRadio } from "react-aria";
import { RadioContext } from "./util/radio-context";
export function Radio(props) {
  let { label, labelPosition, value, name, disabled: userDisabled, className } = props;
  labelPosition ??= "before";
  let state = useContext(RadioContext);
  let ref = useRef(null);
  const inputId = useId();
  const labelId = useId();
  let { inputProps, labelProps, isDisabled, isPressed, isSelected } = useRadio({ value, id: inputId, children: label, isDisabled: userDisabled }, state, ref);
  const labelContent = /* @__PURE__ */ jsx("label", { ...mergeProps({ htmlFor: inputId, className: clsx("form-check-label") }, labelProps), children: label });
  const inputContent = /* @__PURE__ */ jsx("input", { ...mergeProps({ id: inputId, "aria-labelledby": labelId, name, checked: isSelected, disabled: isDisabled, type: "radio", className: clsx("form-check-input") }, inputProps), ref });
  return /* @__PURE__ */ jsxs("div", { className: clsx("form-check narrow", className), children: [
    labelPosition == "before" && labelContent,
    inputContent,
    labelPosition == "after" && labelContent
  ] });
}
