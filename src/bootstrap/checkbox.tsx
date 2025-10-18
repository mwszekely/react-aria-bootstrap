"use client";

import { useAsyncToSync, UseAsyncToSyncParameters } from "async-to-sync/react";
import clsx from "clsx";
import { JSX, useCallback, useId, useRef, useState } from "react";
import { mergeProps, useCheckbox } from "react-aria";
import { type CheckboxProps as CheckboxPropsRAC } from "react-aria-components";
import { useToggleState } from "react-stately";
import { ThemeVariant } from "./util/theme-variants";

export interface CheckboxProps extends Pick<CheckboxPropsRAC, "name" | "className">, Pick<UseAsyncToSyncParameters<[], [], never>, "throttle" | "debounce"> {
    checked: boolean | "indeterminate";
    onChange: (checked: boolean) => (void | Promise<void>);
    disabled?: boolean;
    readOnly?: boolean;
    label: string | JSX.Element | null | undefined;
    labelPosition?: "hidden" | "after" | "before";
    inline?: boolean;
    themeVariant?: ThemeVariant | "subtle" | "contrasting";
}

export function Checkbox(props: CheckboxProps) {

    let labelPosition = props.labelPosition ?? "after";
    let disabled = props.disabled ?? false;

    const [optimisticChecked2, setOptimisticChecked] = useState(false);

    const {
        asyncDebounce,
        cancelSyncDebounce,
        error,
        flushSyncDebounce,
        hasError,
        hasResult,
        pending,
        returnValue,
        syncDebounce,
        syncOutput
    } = useAsyncToSync<void, [boolean], [boolean]>({
        asyncInput: props.onChange,
        throttle: props.throttle,
        debounce: props.debounce
    });


    disabled ||= (pending || false);

    const onChange = useCallback((checked: boolean) => {
        syncOutput(checked);
        setOptimisticChecked(checked);
    }, [syncOutput]);

    let c = (pending? optimisticChecked2 : props.checked);

    const id = useId();
    const ref = useRef<HTMLInputElement>(null);
    const state = useToggleState({ isDisabled: disabled, isReadOnly: props.readOnly, isSelected: c === true, onChange });
    const checkbox = useCheckbox({
        isSelected: c === true,
        isIndeterminate: c === 'indeterminate',
        isReadOnly: props.readOnly,
        isDisabled: disabled,
        name: props.name,
        id,
        children: props.label
    }, state, ref);

    const { inputProps, labelProps, isDisabled, isInvalid, isPressed, isReadOnly, isSelected, validationDetails, validationErrors } = checkbox;

    const labelContent = <label {...mergeProps(labelProps, { children: props.label, className: "form-check-label", htmlFor: id })} />;
    const inputContent = <input {...mergeProps(inputProps, { className: clsx("form-check-input", props.themeVariant && `form-check-input-${props.themeVariant}`), type: "checkbox", value: "", id, "aria-label": (labelPosition == 'hidden' ? props.label : null) })} />
    return (
        <div className={clsx("form-check narrow", labelPosition == "before" && "form-check-reverse", props.inline && "form-check-inline")}>
            {labelPosition == 'before' && labelContent}
            {inputContent}
            {labelPosition == 'after' && labelContent}
        </div>
    );
}
