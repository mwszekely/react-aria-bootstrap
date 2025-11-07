import { UseAsyncToSyncParameters } from "async-to-sync/react";
import { PropsWithChildren } from "react";
import { ButtonStructureProps } from "./util/button-structure";
export interface ToggleButtonProps extends Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce">, Partial<Pick<ButtonStructureProps, "outsetVariant" | "fillVariant" | "themeVariant" | "sizeVariant" | "outsetVariant" | "themeSpinnerVariant">> {
    selected: boolean;
    disabled?: boolean | null | undefined;
    readOnly?: boolean | null | undefined;
    onChange: ((pressed: boolean) => (void | Promise<void>)) | null | undefined;
}
export declare function ToggleButton({ debounce, throttle, disabled: disabledU, onChange: onChangeU, outsetVariant, selected: selectedU, readOnly: readOnlyU, children, fillVariant: fillVariantU, themeVariant: themeVariantU, outsetVariant: outsetVariantU, sizeVariant: sizeVariantU, themeSpinnerVariant: themeSpinnerVariantU, ...props }: PropsWithChildren<ToggleButtonProps>): import("react").JSX.Element;
