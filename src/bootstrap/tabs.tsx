import { CollectionChildren } from "@react-types/shared";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Key, mergeProps, useTab, useTabList, useTabPanel } from "react-aria";
import { Node, TabListState, useTabListState } from "react-stately";
import { Transition } from "./transition";

export interface TabsProps {
    orientation?: "horizontal" | "vertical";
    items?: Array<{ key: Key }>;
    children?: CollectionChildren<{ key: Key; }> | undefined;
    defaultTab?: Key;
}

export function Tabs({ children, items, orientation, defaultTab, ...props }: TabsProps) {
    // During prerendering, we don't have access to the default selected item
    // if we're just going based on the children prop.
    // So until we actually get a selected item, we use this to default to 0.
    const [ready, setReady] = useState(false);


    const ref = useRef<HTMLUListElement>(null);
    const state = useTabListState({ items, children, defaultSelectedKey: defaultTab ?? items?.[0]?.key })

    orientation ??= "horizontal";
    const { tabListProps } = useTabList({ items }, state, ref);
    if (state.selectedItem && !ready)
        setReady(true);

    // This song and dance is to guarantee we have a "prevIndex" value
    // that's the same value on the first render as after it.
    // Used when transitioning into visibility, but not away from it. 
    const prevSelectedIndex = useRef<{ current: number | null, prev: number | null, isUpdated: boolean }>({ current: null, prev: null, isUpdated: false });
    useEffect(() => {
        prevSelectedIndex.current = { prev: prevSelectedIndex.current?.current ?? null, current: state.selectedItem?.index ?? null, isUpdated: true };
    }, [state.selectedItem?.index]);

    if (state.selectedItem?.index != prevSelectedIndex.current.current)
        prevSelectedIndex.current.isUpdated = false;
    const truePrevIndex = (prevSelectedIndex.current.isUpdated ? prevSelectedIndex.current.prev : prevSelectedIndex.current.current);


    return (
        <>
            <div className={clsx("tabs-container", `tabs-container-${orientation}`)} data-c-index={truePrevIndex ?? "null"} data-prev-index={prevSelectedIndex.current?.prev ?? "null"} data-current-index={prevSelectedIndex.current?.current ?? "null"}>
                <div className="tabs-list">
                    <ul ref={ref} {...mergeProps(tabListProps, props, { className: clsx(`nav nav-tabs`, orientation == 'vertical' && "flex-column nav-pills") })}>{[...state.collection].map(item => <Tab key={item.key} item={item} state={state} />)}</ul>
                </div>
                <div className="tabs-panels">
                    {[...state.collection].map(item => {
                        let direction: number = 0;
                        if (truePrevIndex == null)
                            direction = 0;
                        else {
                            if (item.key == state.selectedKey)
                                direction = Math.sign(item.index - truePrevIndex);
                            else
                                if (state.selectedItem?.index != null)
                                    direction = Math.sign(item.index - state.selectedItem?.index);
                                else
                                    direction = 0;
                        }

                        return (<TabPanel orientation={orientation} key={item.key} item={item} state={state} ready={ready} direction={Math.sign(direction) as 0} />)
                    })}
                </div>
            </div>
        </>
    )
}

interface TabProps {
    item: Node<{}>;
    state: TabListState<{}>;
}

function Tab({ state, item }: TabProps) {
    const { key, rendered } = item;
    const ref = useRef<HTMLLIElement>(null);
    const { isDisabled, isPressed, isSelected, tabProps } = useTab({ key }, state, ref)
    return (
        <li ref={ref} {...mergeProps(tabProps, { className: "nav-item" })}><span className={clsx("nav-link", isSelected && "active", isPressed && "pressing", isDisabled && "disabled")}>{rendered}</span></li>
    )
}

interface TabPanelProps {
    item: Node<{}>;
    state: TabListState<{}>;
    orientation: "horizontal" | "vertical";
    ready: boolean;
    direction: -1 | 1 | 0;
}

function TabPanel({ state, item, orientation, ready, direction }: TabPanelProps) {
    //const [prevIndex, setPrevIndex] = useState(state.selectedItem?.index);
    const ref = useRef<HTMLDivElement>(null);

    const { tabPanelProps } = useTabPanel({}, state, ref);

    /*useEffect(() => {
        const h = setTimeout(() => {

            setPrevIndex( state.selectedItem?.index);
        }, 250);
        return () => clearTimeout(h);
    }, [state.selectedItem?.index]);*/

    //const direction = state.selectedItem?.index == null? 0 : (item.index - state.selectedItem?.index);

    const selected = (item.key == state.selectedKey);
    /*let direction: number = 0;
    if (selected) {
        if (prevIndex == null)
            direction = 0;
        else
            direction = (item.index - prevIndex);
    }
    else {
        if (state.selectedItem?.index != null) {
            direction = (item.index - state.selectedItem.index);
        }
        else {
            direction = 0;
        }
    }*/


    return (
        <Transition delayMountUntilShown={true} show={!ready ? (item.index === 0) : item.key == state.selectedKey}>
            <div {...tabPanelProps} className={`orientation-${orientation} direction-${direction == 0 ? "neutral" : direction < 0 ? "left" : "right"} tab-panel`} ref={ref}>{state.collection.getItem(item.key)?.props.children}</div>
        </Transition>
    )
}
