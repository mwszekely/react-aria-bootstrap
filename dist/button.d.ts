import { UseAsyncToSyncParameters } from 'async-to-sync/react';
import { AriaButtonProps, PressEvent } from 'react-aria';
import { ButtonStructureProps } from './util/button-structure';
export interface ActionButtonProps extends Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce">, Pick<ButtonStructureProps, "themeVariant" | "fillVariant" | "outsetVariant" | "sizeVariant" | "themeSpinnerVariant">, Pick<AriaButtonProps, "isDisabled"> {
    onPress?: (e: PressEvent) => (void | undefined | Promise<void | undefined>);
    className?: string;
}
export declare const ActionButton: import("react").ForwardRefExoticComponent<ActionButtonProps & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLButtonElement>>;
