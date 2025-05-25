"use client";

import { useEffect, useRef } from "react";

export default function SearchStrategy() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            console.log(
                "Key pressed:",
                e.key,
                "Meta:",
                e.metaKey,
                "Ctrl:",
                e.ctrlKey
            );
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative w-full max-w-md">
            <input
                ref={inputRef}
                type="text"
                placeholder="Search"
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-4 pr-14 text-sm shadow-sm focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-3/4 flex items-center gap-0.5 text-xs text-gray-500  ">
                <kbd className="rounded border border-gray-300 px-1.5 py-0.5">
                    ⌘
                </kbd>
                <kbd className="rounded border border-gray-300 px-1.5 py-0.5">
                    K
                </kbd>
            </div>
        </div>
    );
}
