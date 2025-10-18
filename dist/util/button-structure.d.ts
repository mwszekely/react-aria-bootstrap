import { ThemeVariant, ThemeVariantExtended } from "./theme-variants";
export interface ButtonStructureProps {
    themeVariant?: ThemeVariantExtended | null | undefined;
    themeSpinnerVariant?: ThemeVariant | null | undefined;
    fillVariant?: "filled" | "outlined" | null | undefined;
    outsetVariant?: "flat" | "inset" | "outset" | null | undefined;
    sizeVariant?: "sm" | "md" | "lg" | null | undefined;
    isPending?: boolean;
    isDisabled?: boolean;
    isBeingPressed?: boolean;
    isSelected?: boolean | null | undefined;
}
export declare const ButtonStructure: import("react").ForwardRefExoticComponent<Required<ButtonStructureProps> & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
