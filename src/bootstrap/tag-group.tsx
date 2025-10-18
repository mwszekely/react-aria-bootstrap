import { Key, Selection, SelectionMode } from "@react-types/shared";
import clsx from "clsx";
import { ReactNode, useRef } from "react";
import { AriaTagProps, mergeProps, useFocusRing, useTag, useTagGroup } from "react-aria";
import { Item, ListState, useListState } from "react-stately";
import { ActionButton } from "./button";
import { ThemeVariantExtended } from "./util/theme-variants";

export interface TagData {
    key: Key;
    content: ReactNode;
    variantTheme?: ThemeVariantExtended;
}

export interface TagGroupProps {
    label: ReactNode;
    //children?: CollectionChildren<object>;
    description?: ReactNode;
    errorMessage?: ReactNode;
    items: Array<TagData>;
    selectionMode?: SelectionMode;
    onRemove?: (removed: Set<Key>) => void;
    onSelectionChange?: (keys: Selection) => void;
    labelPosition?: "before" | "hidden";
    disallowEmptySelection?: boolean;
}

type AriaTagGroupOptions = Parameters<(typeof useTagGroup<TagData>)>[0];
export function TagGroup({ label, description, errorMessage, items, selectionMode, labelPosition, disallowEmptySelection, onRemove, onSelectionChange, ...otherProps }: TagGroupProps) {
    labelPosition ??= "before";
    const RacProps: AriaTagGroupOptions = { items, selectionMode, errorMessage, description, onRemove, onSelectionChange, disallowEmptySelection };
    if (labelPosition == 'hidden')
        RacProps["aria-label"] = label as string;
    else
        RacProps["label"] = label;

    const state = useListState<TagData>({ ...RacProps, children: (item) => { return <Item key={item.key}>{item.content}</Item> } });

    const ref = useRef<HTMLDivElement>(null);
    const { gridProps, descriptionProps, errorMessageProps, labelProps } = useTagGroup(RacProps, state, ref);

    return (
        <div {...mergeProps(otherProps, { className: "tag-group" })}>
            {labelPosition == "before" && <div {...mergeProps(labelProps, { className: "tag-group-label" })}>{label}</div>}
            <div {...mergeProps(gridProps, { className: "tag-group-tags" })} ref={ref}>{[...state.collection].map(item => <Tag key={item.key} item={item} state={state} disabledBecauseLast={!!disallowEmptySelection && state.selectionManager.selectedKeys.has(item.key) && state.selectionManager.selectedKeys.size <= 1} />)}</div>
            {description && (
                <div {...descriptionProps} className="tag-group-description">
                    {description}
                </div>
            )}
            {errorMessage && (
                <div {...errorMessageProps} className="tag-group-error">
                    {errorMessage}
                </div>
            )}
        </div>
    )
}

interface TagProps {
    state: ListState<TagData>;
    item: AriaTagProps<TagData>["item"];
    disabledBecauseLast: boolean;
}

function Tag({ state, item, disabledBecauseLast }: TagProps) {
    const variantTheme = (item.value?.variantTheme ?? "primary");
    const ref = useRef<HTMLDivElement>(null);
    let { focusProps, isFocusVisible } = useFocusRing({ within: false });
    const { allowsRemoving, allowsSelection, gridCellProps, isDisabled, isFocused, isPressed, isSelected, removeButtonProps, rowProps } = useTag<TagData>({ item }, state, ref);

    console.log(removeButtonProps);
    const { onPress: removeButtonOnPress, isDisabled: removeButtonDisabled, ...restRemoveButtonProps } = removeButtonProps;

    return (
        <div
            ref={ref}
            {...rowProps}
            {...focusProps}
            data-focus-visible={isFocusVisible}
        >
            <div {...mergeProps(gridCellProps, { className: clsx(`tag badge`, allowsSelection && !disabledBecauseLast && "selectable", (!allowsSelection || isSelected) ? `text-bg-${variantTheme}` : "text-body", `border border-${variantTheme}`, `rounded-pill`) })}>
                {item.rendered}
                {allowsRemoving && <ActionButton fillVariant="filled" sizeVariant="sm" outsetVariant="inset" themeVariant={variantTheme} onPress={removeButtonOnPress} isDisabled={removeButtonDisabled} className="tag-remove" {...restRemoveButtonProps as {}}>🗙</ActionButton>}
            </div>
        </div>
    );
}
