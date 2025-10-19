import { UseAsyncToSyncParameters } from "async-to-sync/react";
import { JSX } from "react";
import { type CheckboxProps as CheckboxPropsRAC } from "react-aria-components";
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
export declare function Checkbox(props: CheckboxProps): JSX.Element;
