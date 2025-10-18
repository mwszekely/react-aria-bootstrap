import { ReactNode } from "react";
export interface RadioProps {
    labelPosition?: "before" | "after" | "hidden";
    label: string | ReactNode;
    value: string;
    name?: string;
    disabled?: boolean;
    className?: string;
}
export declare function Radio(props: RadioProps): import("react").JSX.Element;
