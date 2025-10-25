import { announce } from "@react-aria/live-announcer";
import clsx from "clsx";
import { ReactNode, useEffect, useId, useState } from "react";
import { mergeProps, useProgressBar } from "react-aria";

export interface PendingSpinnerProps {
    pending: boolean;
    timeout?: number;
    label: ReactNode;
    variantSize?: "sm" | "md" | "lg";
    variantStyle?: "spin" | "grow";
}

export function PendingSpinner({ pending, variantStyle, variantSize, timeout, label, ...props }: PendingSpinnerProps) {
    const [showingSpinner, setShowingSpinner] = useState(false);
    const labelId = useId();
    const { labelProps, progressBarProps } = useProgressBar({ isIndeterminate: true, "aria-labelledby": labelId, ...props });
    variantSize ??= "md"
    timeout ??= 250;
    const s = (variantStyle == 'spin' || !variantStyle? "border" : "grow");
    useEffect(() => {
        if (pending) {
            const handle = setTimeout(() => { setShowingSpinner(true); }, timeout);
            return () => clearTimeout(handle);
        }
        else {
            setShowingSpinner(false);
        }
    }, [pending, timeout]);

    useEffect(() => {
        if (pending && showingSpinner) {
            announce({ "aria-labelledby": labelId }, "assertive");
        }
    }, [pending, showingSpinner, labelId])

    const p = mergeProps(progressBarProps, { className: clsx(`spinner-${s}`, `spinner-${s}-${variantSize}`) });


    //if (!pending)
    //    return null;

    return (
        <div aria-hidden={pending? undefined : "true"} className={clsx("spinner", showingSpinner ? "opacity-100" : "opacity-0")}>
            <div {...p}>
                <span id={labelId} className="visually-hidden">{label}</span>
            </div>
        </div>
    )
}