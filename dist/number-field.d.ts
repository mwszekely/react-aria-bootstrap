import { ValidationError } from "@react-types/shared";
import { ReactNode } from "react";
import { TextFieldProps } from "./text-field";
export interface NumberFieldProps extends Pick<TextFieldProps, "variantSize" | "widthUnit" | "width" | "inline" | "noSpinner" | "minWidth"> {
    value: number | null | undefined;
    min?: number;
    max?: number;
    label?: ReactNode;
    labelPosition?: "before" | "hidden";
    description?: ReactNode;
    errorMessage?: ReactNode;
    readOnly?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    step?: number;
    placeholder?: number | string;
    validate?: (value: number) => (true | ValidationError | null | undefined);
    onChange: (newValue: number | undefined) => void;
    noButtons?: boolean;
    formatOptions?: Intl.NumberFormatOptions;
}
export declare function NumberField({ value, min, max, description, validate, formatOptions, noButtons, disabled, onChange, noSpinner, errorMessage, invalid, inline, minWidth, label, labelPosition, placeholder, readOnly, step, width, widthUnit, variantSize }: NumberFieldProps): import("react").JSX.Element;
