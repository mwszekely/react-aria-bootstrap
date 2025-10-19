export interface PendingSpinnerProps {
    pending: boolean;
    timeout?: number;
    labelId: string;
    variantSize?: "sm" | "md" | "lg";
    variantStyle?: "spin" | "grow";
}
export declare function PendingSpinner({ pending, variantStyle, variantSize, timeout, labelId, ...props }: PendingSpinnerProps): import("react").JSX.Element;
