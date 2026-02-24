import { useAsyncToSync } from "async-to-sync/react";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { mergeProps, useToggleButtonGroup, useToggleButtonGroupItem } from "react-aria";
import { Key, ToggleGroupState, useToggleGroupState } from "react-stately";
import { ButtonStructure, ButtonStructureProps } from "./util/button-structure";


export type ToggleButtonGroupProps = ToggleButtonGroupSingleProps | ToggleButtonGroupMultiProps;

interface ToggleButtonGroupSharedProps extends Pick<ButtonStructureProps, 'sizeVariant'> {
    disallowEmptySelection?: boolean | null | undefined;
    orientation?: "vertical" | "horizontal";
    className?: string;
    disabled?: boolean;
}

interface ToggleButtonGroupSingleProps extends ToggleButtonGroupSharedProps {
    onChange: ((a: Key) => (void | Promise<void>)) | null | undefined;
    selected: Key | null;
    selectionMode: "single";
}

interface ToggleButtonGroupMultiProps extends ToggleButtonGroupSharedProps {
    onChange: ((a: Set<Key>) => (void | Promise<void>)) | null | undefined;
    selected: Set<Key> | null;
    selectionMode: "multiple";
}

const ButtonGroupSize = createContext<Required<ToggleButtonGroupProps>['sizeVariant']>("md");

export interface ToggleButtonGroupItemProps extends Pick<ButtonStructureProps, "themeVariant" | "themeSpinnerVariant" | "fillVariant" | "outsetVariant"> {
    id: Key;
    disabled?: boolean | undefined | null;
}

let ToggleButtonGroupContext = createContext<ToggleGroupState>(null!);

export function ToggleButtonGroup(props: PropsWithChildren<ToggleButtonGroupProps>) {
    if (props.selectionMode == 'single') {
        return <ToggleButtonGroupSingle {...props} />

    }
    else if (props.selectionMode == 'multiple') {
        return <ToggleButtonGroupMulti {...props} />
    }
}



function ToggleButtonGroupSingle({ disabled: disabledU, sizeVariant: variantSizeU, selectionMode, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children, ...restProps }: PropsWithChildren<ToggleButtonGroupSingleProps>) {
    const ref = useRef<HTMLDivElement>(null);

    const { syncOutput } = useAsyncToSync<void, [a: Key], [a: Set<Key>]>({
        capture: k => ([[...k.values()][0]]),
        asyncInput: onChangeU
    });
    let isDisabled = disabledU || false;
    let disallowEmptySelection = disallowEmptySelectionU || false;
    let selectedKeys = selected ? [selected] : [];
    const state = useToggleGroupState({ disallowEmptySelection, isDisabled, onSelectionChange: syncOutput, selectedKeys, selectionMode });
    const { groupProps } = useToggleButtonGroup({ isDisabled, disallowEmptySelection, onSelectionChange: syncOutput, orientation: orientationU, selectedKeys, selectionMode }, state, ref);

    return (
        <ButtonGroupSize.Provider value={variantSizeU ?? "md"}>
            <ToggleButtonGroupContext.Provider value={state}>
                <div {...mergeProps(groupProps, restProps, { className: "btn-group" })} ref={ref}>{children}</div>
            </ToggleButtonGroupContext.Provider>
        </ButtonGroupSize.Provider>
    )
}

function ToggleButtonGroupMulti({ disabled: disabledU, sizeVariant: variantSizeU, selectionMode, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children, ...restProps }: PropsWithChildren<ToggleButtonGroupMultiProps>) {
    const ref = useRef<HTMLDivElement>(null);

    const { syncOutput } = useAsyncToSync({
        asyncInput: onChangeU
    });
    let isDisabled = disabledU || false;
    let disallowEmptySelection = disallowEmptySelectionU || false;
    let selectedKeys = selected ?? [];
    const state = useToggleGroupState({ disallowEmptySelection, isDisabled, onSelectionChange: syncOutput, selectedKeys, selectionMode });
    const { groupProps } = useToggleButtonGroup({ isDisabled, disallowEmptySelection, onSelectionChange: syncOutput, orientation: orientationU, selectedKeys, selectionMode }, state, ref);

    return (
        <ButtonGroupSize.Provider value={variantSizeU ?? "md"}>
            <ToggleButtonGroupContext.Provider value={state}>
                <div {...mergeProps(groupProps, restProps, { className: "btn-group" })} ref={ref}>{children}</div>
            </ToggleButtonGroupContext.Provider>
        </ButtonGroupSize.Provider>
    )
}

export function ToggleButtonGroupItem({ children, id, disabled: disabledU, fillVariant, themeVariant, outsetVariant, themeSpinnerVariant,  ...props }: PropsWithChildren<ToggleButtonGroupItemProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const state = useContext(ToggleButtonGroupContext);
    const isDisabled = (disabledU || false);
    const { buttonProps, isPressed, isSelected } = useToggleButtonGroupItem({ id, isDisabled }, state, ref);
    const sizeVariant = useContext(ButtonGroupSize);

    return (
        <ButtonStructure
            themeVariant={themeVariant ?? null}
            isBeingPressed={isPressed}
            themeSpinnerVariant={themeSpinnerVariant ?? null}
            fillVariant={fillVariant ?? null}
            sizeVariant={sizeVariant}
            isSelected={isSelected}
            outsetVariant={outsetVariant ?? null}
            isDisabled={isDisabled}
            isPending={false}
            flush={false}
            {...mergeProps(buttonProps, props)}>{children}
        </ButtonStructure>
    );
}