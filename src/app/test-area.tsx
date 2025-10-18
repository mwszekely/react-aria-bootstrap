"use client";

import { ActionButton } from "@/bootstrap/button";
import { Checkbox } from "@/bootstrap/checkbox";
import { NumberField } from "@/bootstrap/number-field";
import { Tabs } from "@/bootstrap/tabs";
import { TagData, TagGroup } from "@/bootstrap/tag-group";
import { InputGroup, TextField } from "@/bootstrap/text-field";
import { ToggleButton } from "@/bootstrap/toggle-button";
import { ToggleButtonGroup, ToggleButtonGroupItem } from "@/bootstrap/toggle-button-group";
import { useState } from "react";
import { Key } from "react-aria";
import { Item, useListData } from "react-stately";

const ThemeVariants = ["primary", "secondary", "danger", "warning", "info", "light", "dark", "subtle", "contrasting"] as const;

export default function TestArea() {
    const [checked, setChecked] = useState(false);

    return (
        <>
            <Tabs items={[{ key: "checkboxes" }, { key: "buttons" }, { key: "text" }, { key: "tags" }]}>
                <Item key="checkboxes" title="Checkboxes">
                    <div>
                        <Checkbox checked={checked} onChange={setChecked} label="Sync checkbox" />
                        <Checkbox checked={checked} onChange={async (c) => { await new Promise(r => setTimeout(r, 1000)); setChecked(c); }} label="Async checkbox" />
                    </div>
                    <div>
                        {ThemeVariants.map(v => <Checkbox key={v} checked={checked} themeVariant={v} onChange={setChecked} label={`Checkbox (${v})`} />)}
                    </div>
                </Item>
                <Item key="buttons" title="Buttons">
                    <>
                        <div>
                            {ThemeVariants.map(v => <ActionButton key={v} themeVariant={v} fillVariant="filled" outsetVariant="inset" onPress={() => new Promise(r => setTimeout(r, 1000))}>{v}</ActionButton>)}
                        </div>
                        <div>
                            {ThemeVariants.map(v => <ActionButton key={v} fillVariant="outlined" outsetVariant="inset" themeVariant={v} onPress={() => new Promise(r => setTimeout(r, 1000))}>{v}</ActionButton>)}
                        </div>
                        <div>
                            {(["async", "sync"] as const).map(s => {
                                const func = () => {
                                    if (s == 'async')
                                        return new Promise<void>(r => setTimeout(r, 1000));
                                };
                                return ((["flat", "inset", "outset"] as const).toReversed().map(i =>
                                    <div key={`${s};${i}`}>{((["filled", "outlined"] as const).map(f =>
                                        <div key={`${s};${i};${f}`}>{ThemeVariants.map(t => (<ActionButton key={`${s};${i};${f};${t}`} fillVariant={f} outsetVariant={i} themeVariant={t} onPress={func}>{s.substring(0, 1)}{i.substring(0, 1)}{f.substring(0, 1)}{t.substring(0, 1)}</ActionButton>))}</div>
                                    ))}
                                    </div>))
                            })}
                        </div>
                        <div><TB /></div>
                        <div><TBG /></div>
                    </>
                </Item>
                <Item key="text" title="Text fields">
                    <TextFieldDemo />
                </Item>
                <Item key="tags" title="Tags, D&D">
                    <TagsDemo />
                </Item>
            </Tabs>

        </>
    )
}

function TextFieldDemo() {
    const [text1, setText1] = useState("Test");
    const [text2, setText2] = useState("Initial text for auto-sizing");
    const [text3, setText3] = useState("Larger text box");
    const [text4, setText4] = useState("Type 1");
    const [text5, setText5] = useState("Type 2");
    const [text6, setText6] = useState("Type 3");
    const [text7, setText7] = useState("Type 4");
    const [num1, setNum1] = useState<number | null>(1);
    const [num2, setNum2] = useState<number | null>(2);
    const [num3, setNum3] = useState<number | null>(3);
    const [num4, setNum4] = useState<number | null>(4);
    
    return (
        <div>
            <TextField label="Example text" inline variantSize="sm" width={5} text={text1} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 100)); setText1(t); }} />
            <TextField label="Example text" inline variantSize="md" width="auto" text={text2} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setText2(t); }} />
            <TextField label="Example text" inline variantSize="lg" text={text3} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 10000)); setText3(t); }} />
            <TextField label="Type 1 (default)" variantSize="md" text={text4} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setText4(t); }} />
            <TextField label="Type 2 (inline)" inline variantSize="md" text={text5} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setText5(t); }} />
            <TextField label="Type 3 (input group, solo)" inputGroup variantSize="md" text={text6} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setText6(t); }} />
            <TextField label="Type 4 (input group, inline)" inputGroup inline variantSize="md" text={text7} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setText7(t); }} />
            <InputGroup><TextField label="Type 5 (input group, combined)" variantSize="md" text={text7} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setText7(t); }} /></InputGroup>
            
            
            <NumberField label="Type 1 (default)" variantSize="md" value={num1} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setNum1(t); }} />
            <NumberField label="Type 2 (inline)" width="auto" inline variantSize="md" value={num2} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setNum2(t); }} />
            <InputGroup><NumberField label="Type 3 (input group)" variantSize="md" value={num3} onChange={async (t) => { await new Promise(resolve => setTimeout(resolve, 1000)); setNum3(t); }} /></InputGroup>
            
        </div>
    )
}

function TagsDemo() {
    const tags = useListData<TagData>({
        initialItems: [
            { key: "triangle", content: "Triangle", variantTheme: "primary" },
            { key: "square", content: "Square", variantTheme: "secondary" },
            { key: "circle", content: "Circle", variantTheme: "danger" },
            { key: "octagon", content: "Octagon", variantTheme: "warning" },
            { key: "line", content: "Line", variantTheme: "contrasting" },
            { key: "point", content: "Point", variantTheme: "subtle" },
        ],
        getKey: i => i.key
    })
    return (
        <div>

            <TagGroup label="Tags" selectionMode="multiple" disallowEmptySelection onRemove={keys => tags.remove(...keys)} items={tags.items} />
        </div>
    )

}

function TB() {
    const [pressed, setPressed] = useState<boolean | null>(false);

    return (
        <ToggleButton onChange={setPressed} pressed={pressed ?? false} themeVariant="info" fillVariant="filled">Toggle</ToggleButton>
    )
}

function TBG() {
    const [pressed, setPressed] = useState<Key | null>(null);

    return (
        <ToggleButtonGroup selected={pressed} onChange={s => setPressed([...s.values()][0])}>
            {ThemeVariants.map(v => <TBGC key={v} themeVariant={v} />)}
        </ToggleButtonGroup>
    )
}

function TBGC({ themeVariant }: { themeVariant: string }) {

    return (
        <ToggleButtonGroupItem id={themeVariant} themeVariant={themeVariant as never} fillVariant="filled">{themeVariant}</ToggleButtonGroupItem>
    )
}