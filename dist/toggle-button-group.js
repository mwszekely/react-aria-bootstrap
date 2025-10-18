"use strict";
import { useAsyncToSync } from "async-to-sync/react";
import { createContext, useContext, useRef } from "react";
import { mergeProps, useToggleButtonGroup, useToggleButtonGroupItem } from "react-aria";
import { useToggleGroupState } from "react-stately";
import { ButtonStructure } from "./util/button-structure";
const ButtonGroupSize = createContext("md");
let ToggleButtonGroupContext = createContext(null);
export function ToggleButtonGroup({ disabled: disabledU, variantSize: variantSizeU, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children }) {
  const ref = useRef(null);
  const { syncOutput } = useAsyncToSync({
    asyncInput: onChangeU
  });
  let isDisabled = disabledU || false;
  let disallowEmptySelection = disallowEmptySelectionU || false;
  let selectedKeys = selected ? [selected] : [];
  const state = useToggleGroupState({ disallowEmptySelection, isDisabled, onSelectionChange: syncOutput, selectedKeys, selectionMode: "single" });
  const { groupProps } = useToggleButtonGroup({ isDisabled, disallowEmptySelection, onSelectionChange: syncOutput, orientation: orientationU, selectedKeys, selectionMode: "single" }, state, ref);
  return /* @__PURE__ */ React.createElement(ButtonGroupSize.Provider, { value: variantSizeU ?? "md" }, /* @__PURE__ */ React.createElement(ToggleButtonGroupContext.Provider, { value: state }, /* @__PURE__ */ React.createElement("div", { ...mergeProps(groupProps, { className: "btn-group" }), ref }, children)));
}
export function ToggleButtonGroupItem({ children, id, disabled: disabledU, fillVariant, themeVariant, themeSpinnerVariant, ...props }) {
  const ref = useRef(null);
  const state = useContext(ToggleButtonGroupContext);
  const isDisabled = disabledU || false;
  const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem({ id, isDisabled }, state, ref);
  const sizeVariant = useContext(ButtonGroupSize);
  return /* @__PURE__ */ React.createElement(ButtonStructure, { themeVariant: themeVariant ?? null, isBeingPressed: isPressed, themeSpinnerVariant: themeSpinnerVariant ?? null, fillVariant: fillVariant ?? null, sizeVariant, isSelected, outsetVariant: isPressed ? "inset" : "outset", isDisabled, isPending: false, ...mergeProps(buttonProps, props) }, children);
}
