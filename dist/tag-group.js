"use strict";
import clsx from "clsx";
import { useRef } from "react";
import { mergeProps, useFocusRing, useTag, useTagGroup } from "react-aria";
import { Item, useListState } from "react-stately";
import { ActionButton } from "./button";
export function TagGroup({ label, description, errorMessage, items, selectionMode, labelPosition, disallowEmptySelection, onRemove, onSelectionChange, ...otherProps }) {
  labelPosition ??= "before";
  const RacProps = { items, selectionMode, errorMessage, description, onRemove, onSelectionChange, disallowEmptySelection };
  if (labelPosition == "hidden")
    RacProps["aria-label"] = label;
  else
    RacProps["label"] = label;
  const state = useListState({ ...RacProps, children: (item) => {
    return /* @__PURE__ */ React.createElement(Item, { key: item.key }, item.content);
  } });
  const ref = useRef(null);
  const { gridProps, descriptionProps, errorMessageProps, labelProps } = useTagGroup(RacProps, state, ref);
  return /* @__PURE__ */ React.createElement("div", { ...mergeProps(otherProps, { className: "tag-group" }) }, labelPosition == "before" && /* @__PURE__ */ React.createElement("div", { ...mergeProps(labelProps, { className: "tag-group-label" }) }, label), /* @__PURE__ */ React.createElement("div", { ...mergeProps(gridProps, { className: "tag-group-tags" }), ref }, [...state.collection].map((item) => /* @__PURE__ */ React.createElement(Tag, { key: item.key, item, state, disabledBecauseLast: !!disallowEmptySelection && state.selectionManager.selectedKeys.has(item.key) && state.selectionManager.selectedKeys.size <= 1 }))), description && /* @__PURE__ */ React.createElement("div", { ...descriptionProps, className: "tag-group-description" }, description), errorMessage && /* @__PURE__ */ React.createElement("div", { ...errorMessageProps, className: "tag-group-error" }, errorMessage));
}
function Tag({ state, item, disabledBecauseLast }) {
  const variantTheme = item.value?.variantTheme ?? "primary";
  const ref = useRef(null);
  let { focusProps, isFocusVisible } = useFocusRing({ within: false });
  const { allowsRemoving, allowsSelection, gridCellProps, isDisabled, isFocused, isPressed, isSelected, removeButtonProps, rowProps } = useTag({ item }, state, ref);
  console.log(removeButtonProps);
  const { onPress: removeButtonOnPress, isDisabled: removeButtonDisabled, ...restRemoveButtonProps } = removeButtonProps;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref,
      ...rowProps,
      ...focusProps,
      "data-focus-visible": isFocusVisible
    },
    /* @__PURE__ */ React.createElement("div", { ...mergeProps(gridCellProps, { className: clsx(`tag badge`, allowsSelection && !disabledBecauseLast && "selectable", !allowsSelection || isSelected ? `text-bg-${variantTheme}` : "text-body", `border border-${variantTheme}`, `rounded-pill`) }) }, item.rendered, allowsRemoving && /* @__PURE__ */ React.createElement(ActionButton, { fillVariant: "filled", sizeVariant: "sm", outsetVariant: "inset", themeVariant: variantTheme, onPress: removeButtonOnPress, isDisabled: removeButtonDisabled, className: "tag-remove", ...restRemoveButtonProps }, "\u{1F5D9}"))
  );
}
