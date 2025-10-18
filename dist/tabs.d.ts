import { CollectionChildren } from "@react-types/shared";
import { Key } from "react-aria";
export interface TabsProps {
    orientation?: "horizontal" | "vertical";
    items?: Array<{
        key: Key;
    }>;
    children?: CollectionChildren<{
        key: Key;
    }> | undefined;
    defaultTab?: Key;
}
export declare function Tabs({ children, items, orientation, defaultTab, ...props }: TabsProps): import("react").JSX.Element;
