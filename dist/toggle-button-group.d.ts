import { PropsWithChildren } from "react";
import { Key } from "react-stately";
import { ButtonStructureProps } from "./util/button-structure";
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
export interface ToggleButtonGroupItemProps extends Pick<ButtonStructureProps, "themeVariant" | "themeSpinnerVariant" | "fillVariant" | "outsetVariant"> {
    id: Key;
    disabled?: boolean | undefined | null;
}
export declare function ToggleButtonGroup(props: PropsWithChildren<ToggleButtonGroupProps>): import("react").JSX.Element | undefined;
export declare function ToggleButtonGroupItem({ children, id, disabled: disabledU, fillVariant, themeVariant, outsetVariant, themeSpinnerVariant, ...props }: PropsWithChildren<ToggleButtonGroupItemProps>): import("react").JSX.Element;
export {};
