import { useRef, useLayoutEffect } from "react";

interface AutoResizeTextareaProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function AutoResizeTextarea({
    value,
    onChange,
    ...rest
}: AutoResizeTextareaProps) {
    const ref = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = () => {
        if (ref.current) {
            ref.current.style.height = "auto";
            ref.current.style.height = ref.current.scrollHeight + "px";
        }
    };

    useLayoutEffect(adjustHeight, [value]);

    return (
        <textarea
            ref={ref}
            value={value}
            className="w-full p-3 outline-none pr-14 text-wrap bg-transparent resize-none "
            placeholder="Follow up with a question to Claude."
            onChange={(e) => {
                onChange(e);
                adjustHeight();
            }}
            {...rest}
        />
    );
}
