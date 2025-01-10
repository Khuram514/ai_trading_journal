import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

type CustomButtonType = {
    isBlack: boolean;
    children: ReactNode;
} & DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
>;

export function CustomButton({
    isBlack,
    children,
    ...props
}: CustomButtonType) {
    return (
        <button
            {...props}
            className={`px-4 py-2 ${
                isBlack ? "button-shadow" : "button-shadow-white"
            } rounded-lg`}>
            <div
                className={`text-[0.9rem] ${
                    isBlack ? "text-primary" : "text-[#4a4340]"
                }`}>
                {children}
            </div>
        </button>
    );
}
