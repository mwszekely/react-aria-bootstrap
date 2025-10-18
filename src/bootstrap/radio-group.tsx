"use client";
import { useAsyncToSync } from "async-to-sync/react";
import { CSSProperties, JSX, PropsWithChildren, useCallback, useState } from "react";
import { mergeProps, useRadioGroup } from "react-aria";
import { useRadioGroupState } from "react-stately";
import { RadioContext } from "./util/radio-context";

export interface RadioGroupProps /*extends RadioGroupState*/ {
    label: string | JSX.Element;
    value: string | undefined | null;
    //labelPosition?: "before" | "after" | "hidden";
    onChange: (newValue: string) => (void | Promise<void>);
    throttle?: number;
    debounce?: number;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    readOnly?: boolean;
    className?: string;
    style?: CSSProperties;
}

export function RadioGroup(props: PropsWithChildren<RadioGroupProps>) {
    let { children, value: userValue, label, onChange: onChangeAsync, debounce, throttle, disabled, orientation, readOnly, className, style } = props;


    const [optimisticValue, setOptimisticValue] = useState(userValue);

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
    } = useAsyncToSync<void, [string], [string]>({
        asyncInput: onChangeAsync,
        throttle,
        debounce
    });


    disabled ||= (pending ?? false);
    const v = (pending ? optimisticValue : userValue);

    const onChange = useCallback((value: string) => {
        syncOutput(value);
        setOptimisticValue(value);
    }, [syncOutput]);

    const state = useRadioGroupState({
        value: v,
        onChange: onChange,
        isDisabled: disabled,
        label: label,
        orientation,
        isReadOnly: readOnly
    });


    const { labelProps, radioGroupProps, descriptionProps, errorMessageProps, isInvalid, validationDetails, validationErrors } = useRadioGroup({ value: v, label }, state);

    return (
        <fieldset {...mergeProps({ className, style }, { className: 'form-radio-group' }, radioGroupProps)}>
            <legend {...mergeProps({ className: 'form-radio-group-label' }, labelProps)}>{label}</legend>
            <RadioContext.Provider value={state}>
                {children}
            </RadioContext.Provider>
            {/*description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>{description}</div>
      )*/}
            {isInvalid &&
                (
                    <div {...errorMessageProps} style={{ color: 'red', fontSize: 12 }}>
                        {validationErrors.join(' ')}
                    </div>
                )}
        </fieldset>
    );
}
