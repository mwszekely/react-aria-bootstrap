"use strict";
import { jsx } from "react/jsx-runtime";
import { useAsyncToSync } from "async-to-sync/react";
import { createContext, useContext, useRef } from "react";
import { mergeProps, useToggleButtonGroup, useToggleButtonGroupItem } from "react-aria";
import { useToggleGroupState } from "react-stately";
import { ButtonStructure } from "./util/button-structure";
const ButtonGroupSize = createContext("md");
let ToggleButtonGroupContext = createContext(null);
export function ToggleButtonGroup(props) {
  if (props.selectionMode == "single") {
    return /* @__PURE__ */ jsx(ToggleButtonGroupSingle, { ...props });
  } else if (props.selectionMode == "multiple") {
    return /* @__PURE__ */ jsx(ToggleButtonGroupMulti, { ...props });
  }
}
function ToggleButtonGroupSingle({ disabled: disabledU, sizeVariant: variantSizeU, selectionMode, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children, ...restProps }) {
  const ref = useRef(null);
  const { syncOutput } = useAsyncToSync({
    capture: (k) => [[...k.values()][0]],
    asyncInput: onChangeU
  });
  let isDisabled = disabledU || false;
  let disallowEmptySelection = disallowEmptySelectionU || false;
  let selectedKeys = selected ? [selected] : [];
  const state = useToggleGroupState({ disallowEmptySelection, isDisabled, onSelectionChange: syncOutput, selectedKeys, selectionMode });
  const { groupProps } = useToggleButtonGroup({ isDisabled, disallowEmptySelection, onSelectionChange: syncOutput, orientation: orientationU, selectedKeys, selectionMode }, state, ref);
  return /* @__PURE__ */ jsx(ButtonGroupSize.Provider, { value: variantSizeU ?? "md", children: /* @__PURE__ */ jsx(ToggleButtonGroupContext.Provider, { value: state, children: /* @__PURE__ */ jsx("div", { ...mergeProps(groupProps, restProps, { className: "btn-group" }), ref, children }) }) });
}
function ToggleButtonGroupMulti({ disabled: disabledU, sizeVariant: variantSizeU, selectionMode, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children, ...restProps }) {
  const ref = useRef(null);
  const { syncOutput } = useAsyncToSync({
    asyncInput: onChangeU
  });
  let isDisabled = disabledU || false;
  let disallowEmptySelection = disallowEmptySelectionU || false;
  let selectedKeys = selected ?? [];
  const state = useToggleGroupState({ disallowEmptySelection, isDisabled, onSelectionChange: syncOutput, selectedKeys, selectionMode });
  const { groupProps } = useToggleButtonGroup({ isDisabled, disallowEmptySelection, onSelectionChange: syncOutput, orientation: orientationU, selectedKeys, selectionMode }, state, ref);
  return /* @__PURE__ */ jsx(ButtonGroupSize.Provider, { value: variantSizeU ?? "md", children: /* @__PURE__ */ jsx(ToggleButtonGroupContext.Provider, { value: state, children: /* @__PURE__ */ jsx("div", { ...mergeProps(groupProps, restProps, { className: "btn-group" }), ref, children }) }) });
}
export function ToggleButtonGroupItem({ children, id, disabled: disabledU, fillVariant, themeVariant, outsetVariant, themeSpinnerVariant, ...props }) {
  const ref = useRef(null);
  const state = useContext(ToggleButtonGroupContext);
  const isDisabled = disabledU || false;
  const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem({ id, isDisabled }, state, ref);
  const sizeVariant = useContext(ButtonGroupSize);
  return /* @__PURE__ */ jsx(
    ButtonStructure,
    {
      themeVariant: themeVariant ?? null,
      isBeingPressed: isPressed,
      themeSpinnerVariant: themeSpinnerVariant ?? null,
      fillVariant: fillVariant ?? null,
      sizeVariant,
      isSelected,
      outsetVariant: outsetVariant ?? null,
      isDisabled,
      isPending: false,
      ...mergeProps(buttonProps, props),
      children
    }
  );
}
