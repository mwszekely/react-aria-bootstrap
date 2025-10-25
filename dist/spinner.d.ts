import { ReactNode } from "react";
export interface PendingSpinnerProps {
    pending: boolean;
    timeout?: number;
    label: ReactNode;
    variantSize?: "sm" | "md" | "lg";
    variantStyle?: "spin" | "grow";
}
export declare function PendingSpinner({ pending, variantStyle, variantSize, timeout, label, ...props }: PendingSpinnerProps): import("react").JSX.Element;
