"use client";

import { Checkbox } from "@/bootstrap/checkbox";
import { PropsWithChildren, useLayoutEffect, useRef, useState } from "react";

export function ThemeSelector({ children }: PropsWithChildren<{}>) {
    const [theme, setTheme] = useState("dark" as "light" | "dark");
    const first = useRef(true);

    useLayoutEffect(() => {
        if (!first.current) {
            console.log("Changing themes")
            document.documentElement.dataset["bsTheme"] = theme;
            document.documentElement.classList.add("changing-themes");
            let timeout = setTimeout(() => {
                document.documentElement.classList.remove("changing-themes");
                console.log("Un-changing themes")
            }, 5);

            return () => {
                document.documentElement.classList.remove("changing-themes");
                clearTimeout(timeout);
                console.log("Un-changing themes")
            };
        }
        first.current = false;
    }, [theme]);

    return (
        <div>
            <Checkbox checked={theme == 'dark'} themeVariant="contrasting" onChange={c => setTheme(c ? "dark" : "light")} label="Dark mode" />
            {children}
        </div>
    )
}