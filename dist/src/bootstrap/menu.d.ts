import { CollectionChildren } from "@react-types/shared";
import { AriaMenuProps, AriaMenuTriggerProps } from "react-aria";
import { ActionButtonProps } from "./button";
export interface MenuProps extends Pick<AriaMenuProps<HTMLDivElement>, "children" | "selectionMode" | "onSelectionChange" | "items"> {
}
export interface MenuTriggerProps extends Pick<ActionButtonProps, "fillVariant" | "sizeVariant" | "themeVariant" | "outsetVariant" | "isDisabled">, Pick<AriaMenuTriggerProps, "isDisabled"> {
    menuChildren: CollectionChildren<HTMLDivElement>;
}
