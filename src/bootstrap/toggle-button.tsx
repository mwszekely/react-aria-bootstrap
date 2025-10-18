import { useAsyncToSync, UseAsyncToSyncParameters } from "async-to-sync/react";
import { PropsWithChildren, useRef } from "react";
import { mergeProps, useToggleButton } from "react-aria";
import { useToggleState } from "react-stately";
import { ButtonStructure, ButtonStructureProps } from "./util/button-structure";

export interface ToggleButtonProps extends Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce">, Partial<Pick<ButtonStructureProps, "fillVariant" | "themeVariant">> {
    pressed: boolean;
    disabled?: boolean | null | undefined;
    readOnly?: boolean | null | undefined;
    onChange: ((pressed: boolean | null) => (void | Promise<void>)) | null | undefined;
}

export function ToggleButton({ debounce, throttle, disabled: disabledU, onChange: onChangeU, pressed: pressedU, readOnly: readOnlyU, children, fillVariant: fillVariantU, themeVariant: themeVariantU, ...props}: PropsWithChildren<ToggleButtonProps>) {
    const ref = useRef<HTMLDivElement>(null);
    const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync({
        asyncInput: onChangeU,
        throttle,
        debounce
    });
    let isPending = (pending || syncDebounce || asyncDebounce || false);
    let isReadOnly = (readOnlyU || false);
    let isDisabled = (disabledU || false);
    const state = useToggleState({ isDisabled, isReadOnly, isSelected: pressedU, onChange: syncOutput });
    const { buttonProps, isPressed } = useToggleButton({ isDisabled }, state, ref);


    return (<ButtonStructure 
        fillVariant={fillVariantU ?? "filled"} 
        outsetVariant={state.isSelected? "inset" : "outset"} 
        isDisabled={isDisabled} 
        isPending={isPending} 
        isBeingPressed={isPressed} 
        isSelected={state.isSelected} 
        themeVariant={themeVariantU ?? "primary"} {...mergeProps(buttonProps, props, { className: "btn-toggle" })}>{children}</ButtonStructure>)
}