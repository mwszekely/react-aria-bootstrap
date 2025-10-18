import { UseAsyncToSyncParameters } from "async-to-sync/react";
import { PropsWithChildren } from "react";
import { ButtonStructureProps } from "./util/button-structure";
export interface ToggleButtonProps extends Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce">, Partial<Pick<ButtonStructureProps, "fillVariant" | "themeVariant" | "sizeVariant" | "outsetVariant" | "themeSpinnerVariant">> {
    pressed: boolean;
    disabled?: boolean | null | undefined;
    readOnly?: boolean | null | undefined;
    onChange: ((pressed: boolean | null) => (void | Promise<void>)) | null | undefined;
}
export declare function ToggleButton({ debounce, throttle, disabled: disabledU, onChange: onChangeU, pressed: pressedU, readOnly: readOnlyU, children, fillVariant: fillVariantU, themeVariant: themeVariantU, outsetVariant: outsetVariantU, sizeVariant: sizeVariantU, themeSpinnerVariant: themeSpinnerVariantU, ...props }: PropsWithChildren<ToggleButtonProps>): import("react").JSX.Element;
