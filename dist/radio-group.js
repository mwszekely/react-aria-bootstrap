"use strict";
"use client";
import { useAsyncToSync } from "async-to-sync/react";
import { useCallback, useState } from "react";
import { mergeProps, useRadioGroup } from "react-aria";
import { useRadioGroupState } from "react-stately";
import { RadioContext } from "./util/radio-context";
export function RadioGroup(props) {
  let { children, value: userValue, label, onChange: onChangeAsync, debounce, throttle, disabled, orientation, readOnly, className, style } = props;
  const [optimisticValue, setOptimisticValue] = useState(userValue);
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
    asyncInput: onChangeAsync,
    throttle,
    debounce
  });
  disabled ||= pending ?? false;
  const v = pending ? optimisticValue : userValue;
  const onChange = useCallback((value) => {
    syncOutput(value);
    setOptimisticValue(value);
  }, [syncOutput]);
  const state = useRadioGroupState({
    value: v,
    onChange,
    isDisabled: disabled,
    label,
    orientation,
    isReadOnly: readOnly
  });
  const { labelProps, radioGroupProps, descriptionProps, errorMessageProps, isInvalid, validationDetails, validationErrors } = useRadioGroup({ value: v, label }, state);
  return /* @__PURE__ */ React.createElement("fieldset", { ...mergeProps({ className, style }, { className: "form-radio-group" }, radioGroupProps) }, /* @__PURE__ */ React.createElement("legend", { ...mergeProps({ className: "form-radio-group-label" }, labelProps) }, label), /* @__PURE__ */ React.createElement(RadioContext.Provider, { value: state }, children), isInvalid && /* @__PURE__ */ React.createElement("div", { ...errorMessageProps, style: { color: "red", fontSize: 12 } }, validationErrors.join(" ")));
}
