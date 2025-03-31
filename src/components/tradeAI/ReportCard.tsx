import TypingAnimation from "@/features/ai/typingAnimation";
import { dialogWindowType } from "@/types/tradeAI.types";
import { ReactNode, useEffect, useRef } from "react";
import { SiClaude } from "react-icons/si";
import CustomLoading from "../CustomLoading";

export const ReportCard = ({
    items,
    title,
    loading,
}: {
    items: dialogWindowType[];
    title: string;
    loading: boolean;
}) => {
    return (
        <div className="flex-1 max-md:max-h-svh rounded-2xl border border-gray-200 shadow-md overflow-hidden relative pb-6">
            <div className="border-b-[0.5px] border-gray-300 p-4 flex gap-4">
                <SiClaude size={24} className="text-[#da7756]" />
                <h1>{title}</h1>
            </div>

            <AutoScrollDiv height="calc(100% - 50px)">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${
                            item.type === "user" ? "flex justify-end px-4" : ""
                        }`}>
                        {item.type === "user" ? (
                            <div className="flex flex-col gap-6 max-w-full md:max-w-[66%]">
                                <div className="flex gap-2 bg-blue-100 rounded-lg py-3 px-4 items-end">
                                    <div>
                                        {item.content.map((text, textIndex) => (
                                            <p
                                                key={textIndex}
                                                className="mb-2 text-zinc-600 text-[.9rem]">
                                                {text}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                {loading && <CustomLoading />}
                            </div>
                        ) : (
                            <TypingAnimation
                                items={item.content}
                                typingSpeed={25}
                            />
                        )}
                    </div>
                ))}
            </AutoScrollDiv>
        </div>
    );
};

interface AutoScrollDivProps {
    children: ReactNode;
    height: string;
    className?: string;
}

const AutoScrollDiv: React.FC<AutoScrollDivProps> = ({
    children,
    height,
    className = "",
}) => {
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const scrollToBottom = () => {
            if (divRef.current) {
                divRef.current.scrollTop = divRef.current.scrollHeight;
            }
        };

        scrollToBottom();

        const observer = new MutationObserver(scrollToBottom);
        if (divRef.current) {
            observer.observe(divRef.current, {
                childList: true,
                subtree: true,
            });
        }

        return () => observer.disconnect();
    }, [children]);

    return (
        <div
            ref={divRef}
            className={`overflow-y-auto md:p-2.5 rounded-md ${className}`}
            style={{ height }}>
            {children}
        </div>
    );
};
