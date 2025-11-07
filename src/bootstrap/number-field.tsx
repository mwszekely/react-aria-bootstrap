import { ValidationError } from "@react-types/shared";
import { useAsyncToSync } from "async-to-sync/react";
import { ReactNode, useMemo, useRef, useState } from "react";
import { useLocale, useNumberField, useNumberFormatter } from "react-aria";
import { NumberFieldStateOptions, useNumberFieldState } from "react-stately";
import { ActionButton } from "./button";
import { TextFieldProps, TextFieldStructure, useIsInInputGroup } from "./text-field";

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
    onChange: (newValue: number | null | undefined) => void;
    noButtons?: boolean;
    formatOptions?: Intl.NumberFormatOptions
}

export function NumberField({ value, min, max, description, validate, formatOptions, noButtons, disabled, onChange, noSpinner, errorMessage, invalid, inline, minWidth, label, labelPosition, placeholder, readOnly, step, width, widthUnit, variantSize }: NumberFieldProps) {
    const locale = useLocale();

    const [optimistic, setOptimistic] = useState(value);
    variantSize ??= "md";
    labelPosition ??= "before";
    widthUnit ??= "ch";
    const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync<void, [number | undefined], [number | undefined]>({
        asyncInput: (v) => {
            if (v == null || !isFinite(v))
                v = undefined;
            const ret = onChange(v);
            return ret;
        },
        capture: (e) => {
            setOptimistic(e);
            return [e];
        }
    });

    const valueUsed = (pending ? optimistic : value);


    const Opts: NumberFieldStateOptions = {
        value: valueUsed ?? undefined,
        minValue: min,
        maxValue: max,
        locale: locale.locale,
        description,
        errorMessage,
        formatOptions: undefined,
        isRequired: undefined,
        label,
        isReadOnly: readOnly,
        isInvalid: invalid,
        isDisabled: disabled,
        step,
        placeholder: placeholder?.toString(),
        validate,
        onChange: syncOutput
    };

    const ref = useRef<HTMLInputElement>(null);
    const state = useNumberFieldState(Opts)
    const {
        decrementButtonProps,
        descriptionProps,
        errorMessageProps,
        groupProps,
        incrementButtonProps,
        inputProps,
        isInvalid,
        labelProps,
        validationDetails,
        validationErrors
    } = useNumberField(Opts, state, ref);

    const isInInputGroup = useIsInInputGroup();
    const buttons = noButtons ? null : <div className="number-field-buttons btn-group-vertical">
        <ActionButton outsetVariant="inset" fillVariant="outlined" themeVariant="secondary" {...incrementButtonProps}>+</ActionButton>
        <ActionButton outsetVariant="inset" fillVariant="outlined" themeVariant="secondary" {...decrementButtonProps}>-</ActionButton>
    </div>
    
    const inputGroup = true;


    // This is the same as React ARIA's version, so if that changes this needs to too.
    let textValueFormatter = useNumberFormatter({ ...formatOptions, currencySign: undefined });
    let textValue = useMemo(() => (valueUsed == null || isNaN(valueUsed)) ? '' : textValueFormatter.format(valueUsed), [textValueFormatter, valueUsed]);

    let ret = (
        <TextFieldStructure
            mode={isInInputGroup ? "embedded-input-group" : inputGroup ? (inline ? "inline-solo-input-group" : "solo-input-group") : (inline ? "inline-separate" : "default-separate")}
            ref={ref}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
            inputProps={inputProps}
            isInvalid={isInvalid}
            minWidth={minWidth ?? "0px"}
            label={label}
            labelProps={labelProps}
            groupProps={groupProps}
            pending={pending}
            validationErrors={validationErrors}
            valueUsed={valueUsed ?? null}
            description={description}
            labelPosition={labelPosition}
            // maxLength={maxLength}
            noSpinner={noSpinner}
            validate={validate}
            childrenPost={buttons}
            variantSize={variantSize}
            width={width}
            widthUnit={widthUnit}
            widthTextValueOverride={textValue}
        />
    )


    return ret;
}
