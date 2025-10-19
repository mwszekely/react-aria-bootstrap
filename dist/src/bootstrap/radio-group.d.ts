import { CSSProperties, JSX, PropsWithChildren } from "react";
export interface RadioGroupProps {
    label: string | JSX.Element;
    value: string | undefined | null;
    onChange: (newValue: string) => (void | Promise<void>);
    throttle?: number;
    debounce?: number;
    disabled?: boolean;
    orientation?: "horizontal" | "vertical";
    readOnly?: boolean;
    className?: string;
    style?: CSSProperties;
}
export declare function RadioGroup(props: PropsWithChildren<RadioGroupProps>): JSX.Element;
