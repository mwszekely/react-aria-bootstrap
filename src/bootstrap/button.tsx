import { useAsyncToSync, UseAsyncToSyncParameters } from 'async-to-sync/react';
import { forwardRef, PropsWithChildren, Ref } from 'react';
import { AriaButtonProps, PressEvent, useButton, useObjectRef } from 'react-aria';
import { ButtonStructure, type ButtonStructureProps } from './util/button-structure';

export { ButtonStructure, type ButtonStructureProps };

export interface ActionButtonProps extends
    Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce">,
    Pick<ButtonStructureProps, "themeVariant" | "fillVariant" | "outsetVariant" | "sizeVariant" | "themeSpinnerVariant">,
    Pick<AriaButtonProps, "isDisabled"> {
    onPress?: (e: PressEvent) => (void | undefined | Promise<void | undefined>);
    className?: string;

    /**
     * Allows overriding the label for the button if its contents themselves do not constitute a valid label.
     */
    "aria-label"?: string | null | undefined;
}

export const ActionButton = forwardRef(function ActionButton({ themeVariant, "aria-label": ariaLabel, themeSpinnerVariant, fillVariant, outsetVariant, sizeVariant, onPress: onPressAsync, throttle, debounce, ...props }: PropsWithChildren<ActionButtonProps>, refU: Ref<HTMLButtonElement>) {
    const ref = useObjectRef(refU);

    const {
        asyncDebounce,
        hasError,
        returnValue,
        cancelSyncDebounce,
        error,
        flushSyncDebounce,
        hasResult,
        pending,
        syncDebounce,
        syncOutput
    } = useAsyncToSync({
        asyncInput: onPressAsync,
        debounce: debounce,
        throttle: throttle,
    });

    const isPending = (pending || asyncDebounce || syncDebounce || false);
    const isDisabled = (props.isDisabled || isPending);
    let { buttonProps, isPressed } = useButton({ elementType: 'button', onPress: syncOutput, "aria-label": ariaLabel ?? undefined, ...props }, ref);
    let { children, className } = props;

    themeVariant = (themeVariant ?? "primary");
    themeSpinnerVariant = (themeSpinnerVariant ?? "primary");
    sizeVariant = (sizeVariant ?? "md");
    fillVariant ??= "filled";
    outsetVariant ??= "flat";

    if (hasError)
        themeVariant = 'danger';

    return <ButtonStructure className={className} fillVariant={fillVariant} isSelected={null} themeSpinnerVariant={themeSpinnerVariant} isDisabled={isDisabled} isPending={isPending} isBeingPressed={isPressed} sizeVariant={sizeVariant} outsetVariant={outsetVariant} themeVariant={themeVariant ?? "primary"} {...buttonProps}>{children}</ButtonStructure>
})