import { ValidationError } from '@react-types/shared';
import { PropsWithChildren, ReactNode } from 'react';
import type { AriaTextFieldOptions } from 'react-aria';
export declare function useIsInInputGroup(): boolean;
export declare const InputGroup: import("react").ForwardRefExoticComponent<{
    className?: string;
} & {
    children?: ReactNode | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
export declare function InputGroupText({ children, ...props }: PropsWithChildren<{}>): import("react").JSX.Element;
export interface TextFieldProps {
    text: string;
    onChange: (value: string) => (void | Promise<void>);
    label: ReactNode;
    description?: ReactNode;
    placeholder?: string;
    inputMode?: AriaTextFieldOptions<any>["inputMode"];
    maxLength?: number;
    minLength?: number;
    name?: string;
    disabled?: boolean;
    readOnly?: boolean;
    variantSize?: "sm" | "md" | "lg";
    labelPosition?: "before" | "hidden";
    width?: number | "auto";
    minWidth?: string;
    widthUnit?: "ch" | "ic";
    validate?: (input: any) => (true | ValidationError | undefined | null);
    noSpinner?: boolean;
    inline?: boolean;
    inputGroup?: boolean;
    autoComplete?: string;
}
export declare function TextField({ text, autoComplete, onChange, validate, label, width, noSpinner, widthUnit, description, inline, minWidth, inputGroup, placeholder, labelPosition, inputMode, disabled, maxLength, minLength, name, variantSize, readOnly, ...otherProps }: TextFieldProps): import("react").JSX.Element;
export interface TextFieldStructureProps extends Pick<TextFieldProps, "variantSize" | "noSpinner" | "description" | "label" | "labelPosition" | "validate" | "maxLength" | "width" | "widthUnit"> {
    labelProps: any;
    inputProps: any;
    descriptionProps: any;
    errorMessageProps: any;
    groupProps: any;
    pending: boolean | null | undefined;
    valueUsed: string | number | null;
    isInvalid: boolean;
    validationErrors: ValidationError[];
    childrenPre?: ReactNode;
    childrenPost?: ReactNode;
    minWidth: string;
    mode: "solo-input-group" | "embedded-input-group" | "inline-separate" | "default-separate" | "inline-solo-input-group";
    widthTextValueOverride?: string;
}
export declare const TextFieldStructure: import("react").ForwardRefExoticComponent<TextFieldStructureProps & import("react").RefAttributes<HTMLInputElement>>;
