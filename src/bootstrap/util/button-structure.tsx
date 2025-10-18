import clsx from "clsx";
import { ForwardedRef, forwardRef, PropsWithChildren, useId } from "react";
import { mergeProps } from "react-aria";
import { PendingSpinner } from "../spinner";
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

export const ButtonStructure = forwardRef(function ButtonStructure({ themeSpinnerVariant, sizeVariant, fillVariant, themeVariant, outsetVariant, isPending, isSelected, isDisabled, isBeingPressed, children, ...props }: PropsWithChildren<Required<ButtonStructureProps>>, ref: ForwardedRef<HTMLButtonElement>) {

    const labelId = useId();
    sizeVariant ??= "md";
    outsetVariant ??= "inset";
    fillVariant ??= "filled";
    themeSpinnerVariant ??= "info";
    themeVariant ??= "primary";


    if (isSelected != null) {
        if (isSelected)
            outsetVariant = (isBeingPressed? 'inset' : 'inset');
        else if (isSelected === false)
            outsetVariant = (isBeingPressed? 'inset' : 'outset');
    }
    const className = clsx(
        `btn`,
        `btn-${sizeVariant}`,
        outsetVariant == "flat" ? "" : "tactile",
        outsetVariant != "flat" && `btn-tactile-${outsetVariant}`,
        isSelected && "pressed",
        `btn-${fillVariant == "outlined" ? "outline" : "fill"}`,
        `btn-${fillVariant == "outlined" ? "outline-" : ""}${themeVariant}`,
        `btn-theme-${themeVariant}`,
        isPending && "pending",
        isDisabled && "disabled",
        (isBeingPressed) && "pressing"
    );

    return (
        <button {...mergeProps(props, { tabIndex: 0, className })} ref={ref}>
            <span id={labelId} className="btn-label">{children}</span>
            <PendingSpinner labelId={labelId} pending={isPending ?? false}  />
        </button>
    );
})