"use client";


import clsx from "clsx";
import { ReactNode, useContext, useId, useRef } from "react";
import { mergeProps, useRadio } from "react-aria";
import { RadioContext } from "./util/radio-context";

export interface RadioProps {
    labelPosition?: "before" | "after" | "hidden";
    label: string | ReactNode;
    value: string;
    name?: string;
    disabled?: boolean;
    className?: string;
}

export function Radio(props: RadioProps) {
    let { label, labelPosition, value, name, disabled: userDisabled, className } = props;
    labelPosition ??= "before";
    let state = useContext(RadioContext);
    let ref = useRef(null);
    const inputId = useId();
    const labelId = useId();
    let { inputProps, labelProps, isDisabled, isPressed, isSelected } = useRadio({ value, id: inputId, children: label, isDisabled: userDisabled }, state, ref);

    const labelContent = <label {...mergeProps({ htmlFor: inputId, className: clsx("form-check-label") }, labelProps)}>{label}</label>;
    const inputContent = <input {...mergeProps({ id: inputId, "aria-labelledby": labelId, name, checked: isSelected, disabled: isDisabled, type: "radio", className: clsx("form-check-input") }, inputProps)} ref={ref} />;

    return (
        <div className={clsx("form-check narrow", className)}>
            {labelPosition == 'before' && labelContent}
            {inputContent}
            {labelPosition == 'after' && labelContent}
        </div>
    );
}
