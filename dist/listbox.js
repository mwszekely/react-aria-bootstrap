"use strict";
import { jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { mergeProps, useListBox, useListBoxSection } from "react-aria";
import { useListState } from "react-stately";
export function ListboxMulti({ selectedKeys, ...props }) {
  return /* @__PURE__ */ jsx(ListboxImpl, { selectedKeys, selectionMode: "multiple", ...props });
}
export function ListboxSingle({ selectedKey, ...props }) {
  return /* @__PURE__ */ jsx(ListboxImpl, { selectedKeys: selectedKey == null ? [] : [selectedKey], selectionMode: "single", ...props });
}
function ListboxImpl({ selectedKeys, selectionMode, children, items }) {
  const state = useListState({ items, selectionMode, selectedKeys });
  const ref = useRef(null);
  const { labelProps, listBoxProps } = useListBox({ items, selectedKeys, selectionMode }, state, ref);
  return /* @__PURE__ */ jsx("ul", { ...mergeProps(listBoxProps, { ref }), children });
}
export function ListboxSection({ heading }) {
  const { groupProps, headingProps, itemProps } = useListBoxSection({ heading });
}
