import { useAsyncToSync } from "async-to-sync/react";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { mergeProps, useToggleButtonGroup, useToggleButtonGroupItem } from "react-aria";
import { Key, ToggleGroupState, useToggleGroupState } from "react-stately";
import { ButtonStructure, ButtonStructureProps } from "./util/button-structure";


export interface ToggleButtonGroupProps {
    disallowEmptySelection?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    onChange: ((a: Set<Key>) => (void | Promise<void>)) | null | undefined;
    selected: Key | null;
    orientation?: "vertical" | "horizontal";
    variantSize?: "sm" | "md" | "lg";
    className?: string;
}

const ButtonGroupSize = createContext<Required<ToggleButtonGroupProps>["variantSize"]>("md");

export interface ToggleButtonGroupItemProps extends Pick<ButtonStructureProps, "themeVariant" | "themeSpinnerVariant" | "fillVariant"> {
    id: Key;
    disabled?: boolean | undefined | null;
}

let ToggleButtonGroupContext = createContext<ToggleGroupState>(null!);

export function ToggleButtonGroup({ disabled: disabledU, variantSize: variantSizeU, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children, ...restProps }: PropsWithChildren<ToggleButtonGroupProps>) {
    const ref = useRef<HTMLDivElement>(null);

    const { syncOutput } = useAsyncToSync({
        asyncInput: onChangeU
    });
    let isDisabled = disabledU || false;
    let disallowEmptySelection = disallowEmptySelectionU || false;
    let selectedKeys = selected? [selected] : [];
    const state = useToggleGroupState({ disallowEmptySelection, isDisabled, onSelectionChange: syncOutput, selectedKeys, selectionMode: "single" });
    const { groupProps } = useToggleButtonGroup({ isDisabled, disallowEmptySelection, onSelectionChange: syncOutput, orientation: orientationU, selectedKeys, selectionMode: "single" }, state, ref);

    return (
        <ButtonGroupSize.Provider value={variantSizeU ?? "md"}>
            <ToggleButtonGroupContext.Provider value={state}>
                <div {...mergeProps(groupProps, restProps, { className: "btn-group" })} ref={ref}>{children}</div>
            </ToggleButtonGroupContext.Provider>
        </ButtonGroupSize.Provider>
    )
}

export function ToggleButtonGroupItem({ children, id, disabled: disabledU, fillVariant, themeVariant, themeSpinnerVariant, ...props }: PropsWithChildren<ToggleButtonGroupItemProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const state = useContext(ToggleButtonGroupContext);
    const isDisabled = (disabledU || false);
    const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem({ id, isDisabled }, state, ref);
    const sizeVariant = useContext(ButtonGroupSize);

    return <ButtonStructure themeVariant={themeVariant ?? null} isBeingPressed={isPressed} themeSpinnerVariant={themeSpinnerVariant ?? null} fillVariant={fillVariant ?? null} sizeVariant={sizeVariant} isSelected={isSelected} outsetVariant={isPressed? "inset" : "outset"} isDisabled={isDisabled} isPending={false} {...mergeProps(buttonProps, props)}>{children}</ButtonStructure>
}