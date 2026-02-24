import { UseAsyncToSyncParameters } from 'async-to-sync/react';
import { AriaButtonProps, PressEvent } from 'react-aria';
import { ButtonStructure, type ButtonStructureProps } from './util/button-structure';
export { ButtonStructure, type ButtonStructureProps };
export interface ActionButtonProps extends Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce">, Pick<ButtonStructureProps, "themeVariant" | "fillVariant" | "outsetVariant" | "sizeVariant" | "themeSpinnerVariant">, Pick<AriaButtonProps, "isDisabled"> {
    onPress?: (e: PressEvent) => (void | undefined | Promise<void | undefined>);
    className?: string;
    /**
     * Allows overriding the label for the button if its contents themselves do not constitute a valid label.
     */
    "aria-label"?: string | null | undefined;
}
export declare const ActionButton: import("react").ForwardRefExoticComponent<ActionButtonProps & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLButtonElement>>;
