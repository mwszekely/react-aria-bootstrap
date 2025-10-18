import { PropsWithChildren, ReactNode, useRef } from "react";
import { Key, mergeProps, useListBox, useListBoxSection } from "react-aria";
import { useListState } from "react-stately";


interface ListboxBaseProps {
    items?: { key: Key }[];
}

interface ListboxSharedProps extends ListboxBaseProps {
    selectedKeys: Iterable<Key>;
    selectionMode: "single" | "multiple";
}

export interface ListboxMultiProps extends ListboxBaseProps {
    selectedKeys: Iterable<Key>;
}
export interface ListboxSingleProps extends ListboxBaseProps {
    items?: { key: Key }[];
    selectedKey: Key | null;
}


export function ListboxMulti({ selectedKeys, ...props }: PropsWithChildren<ListboxMultiProps>) {
    return (<ListboxImpl selectedKeys={selectedKeys} selectionMode="multiple" {...props} />)
}

export function ListboxSingle({ selectedKey, ...props }: PropsWithChildren<ListboxSingleProps>) {
    return (<ListboxImpl selectedKeys={selectedKey == null ? [] : [selectedKey]} selectionMode="single" {...props} />)
}

function ListboxImpl({ selectedKeys, selectionMode, children, items }: PropsWithChildren<ListboxSharedProps>) {
    
    const state = useListState({ items, selectionMode, selectedKeys })
    const ref = useRef<HTMLOListElement>(null);
    const { labelProps, listBoxProps } = useListBox({ items, selectedKeys, selectionMode }, state, ref);

    return (
        <ul {...mergeProps(listBoxProps, { ref })}>{children}</ul>
    )
}

export function ListboxSection({ heading } : { heading?: ReactNode }) {
    const { groupProps, headingProps, itemProps } = useListBoxSection({ heading });
}
