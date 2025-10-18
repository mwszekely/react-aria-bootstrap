"use strict";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { mergeProps, useTab, useTabList, useTabPanel } from "react-aria";
import { useTabListState } from "react-stately";
import { Transition } from "./transition";
export function Tabs({ children, items, orientation, defaultTab, ...props }) {
  const [ready, setReady] = useState(false);
  const ref = useRef(null);
  const state = useTabListState({ items, children, defaultSelectedKey: defaultTab ?? items?.[0]?.key });
  orientation ??= "horizontal";
  const { tabListProps } = useTabList({ items }, state, ref);
  if (state.selectedItem && !ready)
    setReady(true);
  const prevSelectedIndex = useRef({ current: null, prev: null, isUpdated: false });
  useEffect(() => {
    prevSelectedIndex.current = { prev: prevSelectedIndex.current?.current ?? null, current: state.selectedItem?.index ?? null, isUpdated: true };
  }, [state.selectedItem?.index]);
  if (state.selectedItem?.index != prevSelectedIndex.current.current)
    prevSelectedIndex.current.isUpdated = false;
  const truePrevIndex = prevSelectedIndex.current.isUpdated ? prevSelectedIndex.current.prev : prevSelectedIndex.current.current;
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: clsx("tabs-container", `tabs-container-${orientation}`), "data-c-index": truePrevIndex ?? "null", "data-prev-index": prevSelectedIndex.current?.prev ?? "null", "data-current-index": prevSelectedIndex.current?.current ?? "null", children: [
    /* @__PURE__ */ jsx("div", { className: "tabs-list", children: /* @__PURE__ */ jsx("ul", { ref, ...mergeProps(tabListProps, props, { className: clsx(`nav nav-tabs`, orientation == "vertical" && "flex-column nav-pills") }), children: [...state.collection].map((item) => /* @__PURE__ */ jsx(Tab, { item, state }, item.key)) }) }),
    /* @__PURE__ */ jsx("div", { className: "tabs-panels", children: [...state.collection].map((item) => {
      let direction = 0;
      if (truePrevIndex == null)
        direction = 0;
      else {
        if (item.key == state.selectedKey)
          direction = Math.sign(item.index - truePrevIndex);
        else if (state.selectedItem?.index != null)
          direction = Math.sign(item.index - state.selectedItem?.index);
        else
          direction = 0;
      }
      return /* @__PURE__ */ jsx(TabPanel, { orientation, item, state, ready, direction: Math.sign(direction) }, item.key);
    }) })
  ] }) });
}
function Tab({ state, item }) {
  const { key, rendered } = item;
  const ref = useRef(null);
  const { isDisabled, isPressed, isSelected, tabProps } = useTab({ key }, state, ref);
  return /* @__PURE__ */ jsx("li", { ref, ...mergeProps(tabProps, { className: "nav-item" }), children: /* @__PURE__ */ jsx("span", { className: clsx("nav-link", isSelected && "active", isPressed && "pressing", isDisabled && "disabled"), children: rendered }) });
}
function TabPanel({ state, item, orientation, ready, direction }) {
  const ref = useRef(null);
  const { tabPanelProps } = useTabPanel({}, state, ref);
  const selected = item.key == state.selectedKey;
  return /* @__PURE__ */ jsx(Transition, { delayMountUntilShown: true, show: !ready ? item.index === 0 : item.key == state.selectedKey, children: /* @__PURE__ */ jsx("div", { ...tabPanelProps, className: `orientation-${orientation} direction-${direction == 0 ? "neutral" : direction < 0 ? "left" : "right"} tab-panel`, ref, children: state.collection.getItem(item.key)?.props.children }) });
}
