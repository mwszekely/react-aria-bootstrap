import { PropsWithChildren } from "react";
import { Key } from "react-stately";
import { ButtonStructureProps } from "./util/button-structure";
export interface ToggleButtonGroupProps {
    disallowEmptySelection?: boolean | null | undefined;
    disabled?: boolean | null | undefined;
    onChange: ((a: Set<Key>) => (void | Promise<void>)) | null | undefined;
    selected: Key | null;
    orientation?: "vertical" | "horizontal";
    variantSize?: "sm" | "md" | "lg";
}
export interface ToggleButtonGroupItemProps extends Pick<ButtonStructureProps, "themeVariant" | "themeSpinnerVariant" | "fillVariant"> {
    id: Key;
    disabled?: boolean | undefined | null;
}
export declare function ToggleButtonGroup({ disabled: disabledU, variantSize: variantSizeU, disallowEmptySelection: disallowEmptySelectionU, orientation: orientationU, onChange: onChangeU, selected, children }: PropsWithChildren<ToggleButtonGroupProps>): import("react").JSX.Element;
export declare function ToggleButtonGroupItem({ children, id, disabled: disabledU, fillVariant, themeVariant, themeSpinnerVariant, ...props }: PropsWithChildren<ToggleButtonGroupItemProps>): import("react").JSX.Element;
