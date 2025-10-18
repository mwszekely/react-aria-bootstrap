import { forwardRef, PropsWithChildren, Ref, useRef } from "react";
import { mergeProps } from "react-aria";
import { useTransition } from "./transition2";

export interface TransitionProps {
    show: boolean | null;
    delayMountUntilShown?: boolean;
    exitVisibility?: "removed" | "hidden" | "visible" | "inert";
}

export const Transition = forwardRef(function Transition({ show, delayMountUntilShown, children }: PropsWithChildren<TransitionProps>, ref2: Ref<HTMLDivElement>) {

    const ref3 = useRef<HTMLDivElement>(null);
    const {ref} = mergeProps({ ref: ref2 }, { ref: ref3 });
    const { mount, props } = useTransition<HTMLDivElement>({ show: show, delayMountUntilShown, measure: false, propsIncoming: { children } as any, elementRef: ref3, exitVisibility: "removed" });

    return (
        mount && <div {...props} ref={ref} />
    )
})