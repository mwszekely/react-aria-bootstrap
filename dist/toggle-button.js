"use strict";
import { useAsyncToSync } from "async-to-sync/react";
import { useRef } from "react";
import { mergeProps, useToggleButton } from "react-aria";
import { useToggleState } from "react-stately";
import { ButtonStructure } from "./util/button-structure";
export function ToggleButton({ debounce, throttle, disabled: disabledU, onChange: onChangeU, pressed: pressedU, readOnly: readOnlyU, children, fillVariant: fillVariantU, themeVariant: themeVariantU, outsetVariant: outsetVariantU, sizeVariant: sizeVariantU, themeSpinnerVariant: themeSpinnerVariantU, ...props }) {
  const ref = useRef(null);
  const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync({
    asyncInput: onChangeU,
    throttle,
    debounce
  });
  let isPending = pending || syncDebounce || asyncDebounce || false;
  let isReadOnly = readOnlyU || false;
  let isDisabled = disabledU || false;
  const state = useToggleState({ isDisabled, isReadOnly, isSelected: pressedU, onChange: syncOutput });
  const { buttonProps, isPressed } = useToggleButton({ isDisabled }, state, ref);
  return /* @__PURE__ */ React.createElement(
    ButtonStructure,
    {
      fillVariant: fillVariantU ?? "filled",
      outsetVariant: state.isSelected ? "inset" : "outset",
      isDisabled,
      isPending,
      isBeingPressed: isPressed,
      isSelected: state.isSelected,
      sizeVariant: sizeVariantU ?? "md",
      themeSpinnerVariant: themeSpinnerVariantU ?? "primary",
      themeVariant: themeVariantU ?? "primary",
      ...mergeProps(buttonProps, props, { className: "btn-toggle" })
    },
    children
  );
}
