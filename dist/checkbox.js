"use strict";
"use client";
import { jsx, jsxs } from "react/jsx-runtime";
import { useAsyncToSync } from "async-to-sync/react";
import clsx from "clsx";
import { useCallback, useId, useRef, useState } from "react";
import { mergeProps, useCheckbox } from "react-aria";
import { useToggleState } from "react-stately";
export function Checkbox(props) {
  let labelPosition = props.labelPosition ?? "after";
  let disabled = props.disabled ?? false;
  const [optimisticChecked2, setOptimisticChecked] = useState(false);
  const {
    asyncDebounce,
    cancelSyncDebounce,
    error,
    flushSyncDebounce,
    hasError,
    hasResult,
    pending,
    returnValue,
    syncDebounce,
    syncOutput
  } = useAsyncToSync({
    asyncInput: props.onChange,
    throttle: props.throttle,
    debounce: props.debounce
  });
  disabled ||= pending || false;
  const onChange = useCallback((checked) => {
    syncOutput(checked);
    setOptimisticChecked(checked);
  }, [syncOutput]);
  let c = pending ? optimisticChecked2 : props.checked;
  const id = useId();
  const ref = useRef(null);
  const state = useToggleState({ isDisabled: disabled, isReadOnly: props.readOnly, isSelected: c === true, onChange });
  const checkbox = useCheckbox({
    isSelected: c === true,
    isIndeterminate: c === "indeterminate",
    isReadOnly: props.readOnly,
    isDisabled: disabled,
    name: props.name,
    id,
    children: props.label
  }, state, ref);
  const { inputProps, labelProps, isDisabled, isInvalid, isPressed, isReadOnly, isSelected, validationDetails, validationErrors } = checkbox;
  const labelContent = /* @__PURE__ */ jsx("label", { ...mergeProps(labelProps, { children: props.label, className: "form-check-label", htmlFor: id }) });
  const inputContent = /* @__PURE__ */ jsx("input", { ...mergeProps(inputProps, { className: clsx("form-check-input", props.themeVariant && `form-check-input-${props.themeVariant}`), type: "checkbox", value: "", id, "aria-label": labelPosition == "hidden" ? props.label : null }) });
  return /* @__PURE__ */ jsxs("div", { className: clsx("form-check narrow", labelPosition == "before" && "form-check-reverse", props.inline && "form-check-inline"), children: [
    labelPosition == "before" && labelContent,
    inputContent,
    labelPosition == "after" && labelContent
  ] });
}
