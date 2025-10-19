import type { Metadata } from "next";
import "../../node_modules/bootstrap/scss/_reboot.scss";
import "../../node_modules/bootstrap/scss/_root.scss";
import "../bootstrap/all.scss";
import "./globals.css";
export declare const metadata: Metadata;
export default function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>): import("react").JSX.Element;
