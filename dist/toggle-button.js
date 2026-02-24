"use strict";
import { jsx } from "react/jsx-runtime";
import { useAsyncToSync } from "async-to-sync/react";
import { useRef } from "react";
import { mergeProps, useToggleButton } from "react-aria";
import { useToggleState } from "react-stately";
import { ButtonStructure } from "./util/button-structure";
export function ToggleButton({ debounce, throttle, disabled: disabledU, onChange: onChangeU, selected: selectedU, readOnly: readOnlyU, children, fillVariant: fillVariantU, themeVariant: themeVariantU, outsetVariant: outsetVariantU, sizeVariant: sizeVariantU, flush: flushU, themeSpinnerVariant: themeSpinnerVariantU, ...props }) {
  const ref = useRef(null);
  const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync({
    asyncInput: onChangeU,
    throttle,
    debounce
  });
  let isPending = pending || syncDebounce || asyncDebounce || false;
  let isReadOnly = readOnlyU || false;
  let isDisabled = disabledU || false;
  const state = useToggleState({ isDisabled, isReadOnly, isSelected: selectedU, onChange: syncOutput });
  const { buttonProps, isPressed } = useToggleButton({ isDisabled }, state, ref);
  return /* @__PURE__ */ jsx(
    ButtonStructure,
    {
      fillVariant: fillVariantU ?? "filled",
      outsetVariant: outsetVariantU ?? null,
      isDisabled,
      isPending,
      isBeingPressed: isPressed,
      isSelected: state.isSelected,
      sizeVariant: sizeVariantU ?? "md",
      flush: flushU ?? false,
      themeSpinnerVariant: themeSpinnerVariantU ?? "primary",
      themeVariant: themeVariantU ?? "primary",
      ...mergeProps(buttonProps, props, { className: "btn-toggle" }),
      children
    }
  );
}
