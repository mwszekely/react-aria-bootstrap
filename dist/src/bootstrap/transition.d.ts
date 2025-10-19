export interface TransitionProps {
    show: boolean | null;
    delayMountUntilShown?: boolean;
    exitVisibility?: "removed" | "hidden" | "visible" | "inert";
}
export declare const Transition: import("react").ForwardRefExoticComponent<TransitionProps & {
    children?: import("react").ReactNode | undefined;
} & import("react").RefAttributes<HTMLDivElement>>;
