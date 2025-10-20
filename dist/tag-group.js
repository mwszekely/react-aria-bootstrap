"use strict";
import { jsx, jsxs } from "react/jsx-runtime";
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
    return /* @__PURE__ */ jsx(Item, { children: item.content }, item.key);
  } });
  const ref = useRef(null);
  const { gridProps, descriptionProps, errorMessageProps, labelProps } = useTagGroup(RacProps, state, ref);
  return /* @__PURE__ */ jsxs("div", { ...mergeProps(otherProps, { className: "tag-group" }), children: [
    labelPosition == "before" && /* @__PURE__ */ jsx("div", { ...mergeProps(labelProps, { className: "tag-group-label" }), children: label }),
    /* @__PURE__ */ jsx("div", { ...mergeProps(gridProps, { className: "tag-group-tags" }), ref, children: [...state.collection].map((item) => /* @__PURE__ */ jsx(Tag, { item, state, disabledBecauseLast: !!disallowEmptySelection && state.selectionManager.selectedKeys.has(item.key) && state.selectionManager.selectedKeys.size <= 1 }, item.key)) }),
    description && /* @__PURE__ */ jsx("div", { ...descriptionProps, className: "tag-group-description", children: description }),
    errorMessage && /* @__PURE__ */ jsx("div", { ...errorMessageProps, className: "tag-group-error", children: errorMessage })
  ] });
}
function Tag({ state, item, disabledBecauseLast }) {
  const variantTheme = item.value?.variantTheme ?? "primary";
  const ref = useRef(null);
  let { focusProps, isFocusVisible } = useFocusRing({ within: false });
  const { allowsRemoving, allowsSelection, gridCellProps, isDisabled, isFocused, isPressed, isSelected, removeButtonProps, rowProps } = useTag({ item }, state, ref);
  const { onPress: removeButtonOnPress, isDisabled: removeButtonDisabled, ...restRemoveButtonProps } = removeButtonProps;
  let className = clsx(
    `tag badge`,
    allowsSelection && !disabledBecauseLast && "selectable",
    `rounded-pill`
  );
  let style = {};
  if (typeof variantTheme == "object") {
    style["--tag-color-bg"] = variantTheme.bg;
    style["--tag-color-fg"] = variantTheme.fg;
    className = clsx(
      className,
      !allowsSelection || isSelected ? `text-bg-manual` : "text-body",
      `rounded-pill`
    );
  } else {
    className = clsx(
      className,
      !allowsSelection || isSelected ? `text-bg-${variantTheme}` : "text-body",
      `border border-${variantTheme}`,
      `rounded-pill`
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      ...rowProps,
      ...focusProps,
      "data-focus-visible": isFocusVisible,
      children: /* @__PURE__ */ jsxs("div", { ...mergeProps(gridCellProps, { className, style, "data-tag-id": item.key }), children: [
        item.rendered,
        allowsRemoving && /* @__PURE__ */ jsx(ActionButton, { fillVariant: "filled", sizeVariant: "sm", outsetVariant: "inset", themeVariant: "danger", onPress: removeButtonOnPress, isDisabled: removeButtonDisabled, className: "tag-remove", ...restRemoveButtonProps, children: "\u{1F5D9}" })
      ] })
    }
  );
}
