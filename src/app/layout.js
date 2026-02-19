import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "STASH | Modern Fashion Marketplace",
    description: "C2C High-Fashion Modular Marketplace",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="scroll-smooth">
        <body
            className={`
                    ${geistSans.variable} 
                    ${geistMono.variable} 
                    antialiased 
                    bg-white 
                    text-black 
                    selection:bg-black 
                    selection:text-white
                `}
        >
        <Providers>
            <main className="relative min-h-screen flex flex-col">
                {children}
            </main>
        </Providers>

        <div id="modal-root" />
        </body>
        </html>
    );
}