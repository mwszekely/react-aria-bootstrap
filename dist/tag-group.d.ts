import { Key, Selection, SelectionMode } from "@react-types/shared";
import { ReactNode } from "react";
import { ThemeVariantExtended } from "./util/theme-variants";
export interface TagData {
    key: Key;
    content: ReactNode;
    variantTheme?: ThemeVariantExtended | {
        bg: string;
        fg: "black" | "white";
    };
}
export interface TagGroupProps {
    label: ReactNode;
    description?: ReactNode;
    errorMessage?: ReactNode;
    items: Array<TagData>;
    selectionMode?: SelectionMode;
    onRemove?: (removed: Set<Key>) => void;
    onSelectionChange?: (keys: Selection) => void;
    labelPosition?: "before" | "hidden";
    disallowEmptySelection?: boolean;
}
export declare function TagGroup({ label, description, errorMessage, items, selectionMode, labelPosition, disallowEmptySelection, onRemove, onSelectionChange, ...otherProps }: TagGroupProps): import("react").JSX.Element;
