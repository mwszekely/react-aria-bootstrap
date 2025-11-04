import { ValidationError } from '@react-types/shared';
import { useAsyncToSync } from 'async-to-sync/react';
import clsx from 'clsx';
import { cloneElement, createContext, CSSProperties, forwardRef, isValidElement, PropsWithChildren, ReactNode, Ref, use, useEffect, useRef, useState } from 'react';
import type { AriaTextFieldOptions } from 'react-aria';
import { mergeProps, useTextField } from 'react-aria';
import { PendingSpinner } from './spinner';
import { useEffectEvent } from './util/use-effect-event';

const InputGroupContext = createContext(false);

export function useIsInInputGroup() {
    return use(InputGroupContext);
}

export const InputGroup = forwardRef(function InputGroup({ children, variantSize, ...props }: PropsWithChildren<{ className?: string; variantSize?: "sm" | "md" | "lg" }>, ref: Ref<HTMLDivElement>) {
    variantSize ??= "md"
    return (
        <InputGroupContext.Provider value={true}>
            <div ref={ref} {...mergeProps(props, { className: `input-group input-group-${variantSize}` })}>{children}</div>
        </InputGroupContext.Provider>
    )
})

export function InputGroupText({ children, ...props }: PropsWithChildren<{}>) {
    return <div {...mergeProps(props, { className: "input-group-text" })}>{children}</div>
}

export interface TextFieldProps {
    text: string;
    onChange: (value: string) => (void | Promise<void>)
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
    //inline?: boolean;
    labelPosition?: "before" | "hidden";
    width?: number | "auto";    // if maxLength is provided, "auto" is based off that, otherwise the width is based on the content.
    minWidth?: string;          // A CSS value; recommended if setting width to auto.
    widthUnit?: "ch" | "ic";
    validate?: (input: any) => (true | ValidationError | undefined | null);
    noSpinner?: boolean;
    //independentInputGroup?: boolean;
    inline?: boolean;
    inputGroup?: boolean;
    autoComplete?: string;
    className?: string;
    type?: "text" | "search" | "password" | "email";
}

export function TextField({ type, text, autoComplete, onChange, validate, className, label, width, noSpinner, widthUnit, description, inline, minWidth, inputGroup, placeholder, labelPosition, inputMode, disabled, maxLength, minLength, name, variantSize, readOnly, ...otherProps }: TextFieldProps) {

    const [optimistic, setOptimistic] = useState("");
    let ref = useRef<HTMLInputElement>(null);
    variantSize ??= "md";
    labelPosition ??= "before";
    widthUnit ??= "ch";
    const { syncOutput, pending, syncDebounce, asyncDebounce } = useAsyncToSync<void, [string], [string]>({ asyncInput: (v) => { const ret = onChange(v); return ret; }, capture: (e) => { setOptimistic(e); return [e]; } });

    const valueUsed = (pending ? optimistic : text);
    let {
        labelProps,
        inputProps,
        descriptionProps,
        errorMessageProps,
        isInvalid,
        validationErrors,
        validationDetails
    } = useTextField({ 
        type: type ?? "text", 
        value: valueUsed, 
        onChange: syncOutput, 
        placeholder, 
        label, 
        inputMode, 
        maxLength, 
        minLength, 
        name, 
        isDisabled: disabled, 
        isReadOnly: readOnly, 
        autoComplete,
        validate
    }, ref);

    const inALiteralActualInputGroupAlready = useIsInInputGroup();

    let mode: TextFieldStructureProps["mode"] = inputGroup ? (inline ? "inline-solo-input-group" : "solo-input-group") : (inline ? "inline-separate" : "default-separate");
    if (inALiteralActualInputGroupAlready) {
        if (inline || inputGroup)
            console.warn('A text field embedded in a pre-existing InputGroup will ignore the `inline` or `inputGroup` properties.');
        mode = 'embedded-input-group';
    }

    return (
        <TextFieldStructure
        className={className}
        type={type}
            mode={mode}
            ref={ref}
            isInvalid={isInvalid}
            groupProps={{}}
            label={label}
            descriptionProps={descriptionProps}
            errorMessageProps={errorMessageProps}
            inputProps={inputProps}
            labelProps={labelProps}
            pending={pending}
            valueUsed={valueUsed}
            description={description}
            labelPosition={labelPosition}
            maxLength={maxLength}
            noSpinner={noSpinner}
            validate={validate}
            variantSize={variantSize}
            minWidth={minWidth ?? "0px"}
            width={width}
            widthUnit={widthUnit}
            validationErrors={validationErrors}
        />);

}

export interface TextFieldStructureProps extends Pick<TextFieldProps, "type" | "variantSize" | "className" | "noSpinner" | "description" | "label" | "labelPosition" | "validate" | "maxLength" | "width" | "widthUnit"> {
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

export const TextFieldStructure = forwardRef(function TextFieldStructure({ type, className, childrenPost, minWidth, groupProps, widthTextValueOverride, mode, childrenPre, label, description, noSpinner, descriptionProps, isInvalid, errorMessageProps, validationErrors, variantSize, valueUsed, width, inputProps, labelProps, labelPosition, validate, maxLength, widthUnit, pending }: TextFieldStructureProps, ref: Ref<HTMLInputElement>) {
    //const inInputGroup = useIsInInputGroup();
    let columns = 1;
    if (labelPosition != "hidden")
        ++columns;
    if (description)
        ++columns;
    if (validate)
        ++columns;
    if (childrenPost != null)
        ++columns;
    if (childrenPre != null)
        ++columns;

    // TODO...?
    if (columns == 5)
        ++columns;

    if (width == "auto") {
        if (maxLength)
            width = maxLength;
        else {
            width = "auto";
            widthUnit = 'px' as never;
        }
    }

    const inALiteralActualInputGroupAlready = useIsInInputGroup();
    const inInputGroup2 = (mode == 'solo-input-group' || mode == 'embedded-input-group' || mode == 'inline-solo-input-group' || inALiteralActualInputGroupAlready);

    const [measuredWidth, setMeasuredWidth] = useState("");
    const spinner = noSpinner ? null : (pending || (inInputGroup2)) && <PendingSpinner label={"In progress..."} pending={pending ?? false} variantSize={variantSize == "lg" ? "md" : "sm"} />;


    const updateAutoWidth = useEffectEvent((e: Element) => {
        // Prevent incorrect measurements when the element is invisible
        if (e.scrollWidth || ((widthTextValueOverride ?? valueUsed?.toString() ?? "") == ""))
            setMeasuredWidth((e.scrollWidth).toString() ?? "");
    });

    const ref2 = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref2.current?.scrollWidth && width == "auto")
            updateAutoWidth(ref2.current);
    }, [width, valueUsed]);

    function columnize(input: any, c?: string) { return !c? null :  <div className={clsx("col-auto", c)}>{input}</div>; }
    function textInputize(input: any, c?: string) { return !c? null : isValidElement(input) ? cloneElement(input, mergeProps({ className: "input-group-text" })) : <div className="input-group-text">{input}</div>; }

    let description2 = <div {...mergeProps(descriptionProps, { className: clsx("form-text") })}>{description}</div>;
    let error2 = <div {...mergeProps(errorMessageProps, { className: clsx("invalid-feedback", !isInvalid && "invisible") })}>{validationErrors.join(' ')}</div>;
    const measure2 = <div ref={(element) => { if (element) updateAutoWidth(element); return () => { } }} aria-hidden="true" className={`form-control form-control-measure form-control-${variantSize}`}>{(widthTextValueOverride ?? valueUsed)}</div>;
    const input2 = <input {...mergeProps(inputProps, { type: type ?? "text", style: width ? { "--form-control-explicit-width": (measuredWidth || width)?.toString(), minWidth } as CSSProperties : { minWidth }, className: clsx(mode == "embedded-input-group" && className, "form-control", pending && "pending", width && `form-control-explicit-width form-control-explicit-width-${widthUnit}`, `form-control-${variantSize}`) })} ref={ref} />;
    const label2 = labelPosition == "before" && <label {...mergeProps(labelProps, { className: clsx("form-label", (mode == "inline-solo-input-group" || mode == "inline-separate") && "col-form-label") })}>{label}</label>;


    let noSpinnerPadding = (inALiteralActualInputGroupAlready || noSpinner || mode == 'solo-input-group' || mode == 'inline-solo-input-group' || mode == 'embedded-input-group');

    if (mode == "inline-separate") {
        return (
            <div {...groupProps} className={clsx(className, "form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`, `row form-text-container-inline`, `g-${columns}`)}>
                {columnize(label2)}
                {childrenPre}
                {columnize(<>{spinner}{input2}</>, "position-relative")}
                {width == "auto" && measure2}
                {childrenPost}
                {description && columnize(description2)}
                {validate && columnize(error2)}
            </div>
        );
    }
    else if (mode == 'default-separate') {
        return (
            <div {...groupProps} className={clsx(className, "form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`)}>
                {label2}
                {childrenPre}
                <div className="form-text-container-spinner-container position-relative">{input2}{spinner}</div>
                {width == "auto" && measure2}
                {childrenPost}
                {description && (description2)}
                {validate && (error2)}
            </div>
        );
    }

    else if (mode == "embedded-input-group") {
        return (
            <>
                {textInputize(label2)}
                {childrenPre}
                {input2}
                {width == "auto" && measure2}
                {spinner && textInputize(<div>{spinner}</div>)}
                {childrenPost}
                {description && textInputize(description2)}
                {validate && textInputize(error2)}
            </>
        )
    }
    else if (mode == "solo-input-group") {
        columns = (labelPosition == "hidden" ? 1 : 2);
        return (
            <div className={clsx(className, "form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`, `g-${columns}`)}>
                {label2}
                <InputGroup {...groupProps}>
                    {childrenPre}
                    {input2}
                    {width == "auto" && measure2}
                    {spinner && textInputize(<div>{spinner}</div>)}
                    {childrenPost}
                    {description && textInputize(description2)}
                    {validate && textInputize(error2)}
                </InputGroup>
            </div>
        )
    }
    else if (mode == "inline-solo-input-group") {
        columns = (labelPosition == "hidden" ? 1 : 2);
        return (
            <div className={clsx(className, "form-text-container", `form-text-container-${variantSize}`, noSpinnerPadding && `form-text-container-no-spinner-padding`, `row form-text-container-inline`, `g-${columns}`)}>
                {columnize(label2)}
                {columnize(
                    <InputGroup {...groupProps}>
                        {childrenPre}
                        {input2}
                        {width == "auto" && measure2}
                        {spinner && textInputize(<div>{spinner}</div>)}
                        {childrenPost}
                        {description && textInputize(description2)}
                        {validate && textInputize(error2)}
                    </InputGroup>
                )}
            </div>
        )
    }
})

