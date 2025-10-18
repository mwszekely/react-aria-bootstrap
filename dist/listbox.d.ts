import { PropsWithChildren, ReactNode } from "react";
import { Key } from "react-aria";
interface ListboxBaseProps {
    items?: {
        key: Key;
    }[];
}
export interface ListboxMultiProps extends ListboxBaseProps {
    selectedKeys: Iterable<Key>;
}
export interface ListboxSingleProps extends ListboxBaseProps {
    items?: {
        key: Key;
    }[];
    selectedKey: Key | null;
}
export declare function ListboxMulti({ selectedKeys, ...props }: PropsWithChildren<ListboxMultiProps>): import("react").JSX.Element;
export declare function ListboxSingle({ selectedKey, ...props }: PropsWithChildren<ListboxSingleProps>): import("react").JSX.Element;
export declare function ListboxSection({ heading }: {
    heading?: ReactNode;
}): void;
export {};
