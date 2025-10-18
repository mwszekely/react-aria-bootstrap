"use strict";
import { useAsyncToSync } from "async-to-sync/react";
import { forwardRef } from "react";
import { useButton, useObjectRef } from "react-aria";
import { ButtonStructure } from "./util/button-structure";
export const ActionButton = forwardRef(function ActionButton2({ themeVariant, themeSpinnerVariant, fillVariant, outsetVariant, sizeVariant, onPress: onPressAsync, throttle, debounce, ...props }, refU) {
  const ref = useObjectRef(refU);
  const {
    asyncDebounce,
    hasError,
    returnValue,
    cancelSyncDebounce,
    error,
    flushSyncDebounce,
    hasResult,
    pending,
    syncDebounce,
    syncOutput
  } = useAsyncToSync({
    asyncInput: onPressAsync,
    debounce,
    throttle
  });
  const isPending = pending || asyncDebounce || syncDebounce || false;
  const isDisabled = props.isDisabled || isPending;
  let { buttonProps, isPressed } = useButton({ elementType: "div", onPress: syncOutput, ...props }, ref);
  let { children, className } = props;
  themeVariant = themeVariant ?? "primary";
  themeSpinnerVariant = themeSpinnerVariant ?? "primary";
  sizeVariant = sizeVariant ?? "md";
  fillVariant ??= "filled";
  outsetVariant ??= "flat";
  if (hasError)
    themeVariant = "danger";
  return /* @__PURE__ */ React.createElement(ButtonStructure, { className, fillVariant, isSelected: null, themeSpinnerVariant, isDisabled, isPending, isBeingPressed: isPressed, sizeVariant, outsetVariant, themeVariant: themeVariant ?? "primary", ...buttonProps }, children);
});
