"use strict";
import { jsx } from "react/jsx-runtime";
import { useAsyncToSync } from "async-to-sync/react";
import { forwardRef } from "react";
import { ButtonStructure } from "./util/button-structure";
import { Button as RACButton } from "react-aria-components";
export { ButtonStructure };
export const ActionButton = forwardRef(function ActionButton2({ themeVariant, "aria-label": ariaLabel, themeSpinnerVariant, fillVariant, outsetVariant, sizeVariant, flush, onPress: onPressAsync, throttle, debounce, ...restProps }, refU) {
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
    syncOutput: onPress
  } = useAsyncToSync({
    asyncInput: onPressAsync,
    debounce,
    throttle
  });
  const isPending = pending || asyncDebounce || syncDebounce || false;
  themeVariant = themeVariant ?? "primary";
  themeSpinnerVariant = themeSpinnerVariant ?? "primary";
  sizeVariant = sizeVariant ?? "md";
  fillVariant ??= "filled";
  outsetVariant ??= "flat";
  return /* @__PURE__ */ jsx(RACButton, { onPress, isPending, ...restProps, ref: refU, render: (props, { isDisabled, isFocusVisible, isFocused, isHovered, isPending: isPending2, isPressed }) => {
    return /* @__PURE__ */ jsx(
      ButtonStructure,
      {
        fillVariant,
        isSelected: null,
        themeSpinnerVariant,
        isDisabled: isDisabled || isPending2,
        isPending: isPending2,
        isBeingPressed: isPressed,
        flush: flush || false,
        sizeVariant,
        outsetVariant,
        themeVariant: themeVariant ?? "primary",
        ...props
      }
    );
  } });
});
