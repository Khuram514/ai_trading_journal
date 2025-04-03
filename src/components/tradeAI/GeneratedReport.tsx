import React, { Dispatch, SetStateAction, useState } from "react";
import { ReportCard } from "./ReportCard";
import { SiClaude } from "react-icons/si";
import { ArrowUp } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category, ReportType } from "@/types/tradeAI.types";
import { toast } from "sonner";
import { Trades } from "@/types/index";
import CustomLoading from "../CustomLoading";

type GeneratedReportType = {
    report: ReportType;
    trades: Trades[] | null;
    setReport: Dispatch<SetStateAction<ReportType | null>>;
    setTokens: Dispatch<SetStateAction<number | undefined>>;
};

export default function GeneratedReport({
    report,
    trades,
    setReport,
    setTokens,
}: GeneratedReportType) {
    const [selectCategory, setSelectCategory] = useState<Category | "">("");
    const [followUpQuestionInput, setFollowUpQuestionInput] = useState("");

    const [loading, setLoading] = useState({
        moneyManagement: false,
        instruments: false,
        timeManagement: false,
    });

    const filteredDataForAICall = trades?.map(
        ({ result, instrumentName, openTime }) => ({
            result,
            instrumentName,
            openTime,
        })
    );

    const prevResponse: Record<Category, string> = {
        moneyManagement: JSON.stringify(report?.moneyManagement),
        instruments: JSON.stringify(report?.instruments),
        timeManagement: JSON.stringify(report?.timeManagement),
    };

    const handleFollowUpWithAQuestion = async () => {
        if (selectCategory && report) {
            setLoading((prev) => {
                return {
                    ...prev,
                    [selectCategory]: true,
                };
            });
            const tempQuestionStorage = followUpQuestionInput;
            setFollowUpQuestionInput("");
            try {
                setReport((prevReport) => {
                    if (
                        prevReport === null ||
                        prevReport[selectCategory] === null
                    ) {
                        return null;
                    }

                    return {
                        ...prevReport,
                        [selectCategory]: [
                            ...prevReport[selectCategory],
                            { type: "user", content: [tempQuestionStorage] },
                        ],
                    };
                });
                const res = await fetch("/api/follow-up-claude", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        trades: filteredDataForAICall,
                        followUpQuestion: tempQuestionStorage,
                        prevResponse: prevResponse[selectCategory],
                    }),
                });

                if (!res.ok) {
                    const errorMessage = await res.json();
                    throw new Error(errorMessage.error);
                }

                const data = await res.json();

                const claudeReport = JSON.parse(data.content[0].text);

                setReport((prevReport) => {
                    if (
                        prevReport === null ||
                        prevReport[selectCategory] === null
                    ) {
                        return null;
                    }

                    return {
                        ...prevReport,
                        [selectCategory]: [
                            ...prevReport[selectCategory],
                            {
                                type: "system",
                                content: [...claudeReport.answer],
                            },
                        ],
                    };
                });

                setTokens((prev) => (prev ?? 0) - 2);
                toast.success("You've spent 2 tokens!");
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message);
                    console.log(err.message);
                } else {
                    toast.error("Error occured! Try again later!");
                    console.log(err);
                }
            } finally {
                setSelectCategory("");
                setLoading((prev) => {
                    return {
                        ...prev,
                        [selectCategory]: false,
                    };
                });
            }
        }
    };
    return (
        <>
            <div className="2xl:max-h-[500px] flex max-2xl:flex-col gap-4 p-4">
                <ReportCard
                    title="Money Management"
                    items={report?.moneyManagement}
                    loading={loading.moneyManagement}
                />
                <ReportCard
                    title="Instruments"
                    items={report?.instruments}
                    loading={loading.instruments}
                />
                {report.timeManagement ? (
                    <ReportCard
                        title="Time Management"
                        items={report.timeManagement}
                        loading={loading.timeManagement}
                    />
                ) : (
                    <div className="flex-1 rounded-2xl border border-gray-200 shadow-md">
                        <div className="border-b-[0.5px] border-gray-300 p-4 flex gap-4">
                            <SiClaude size={24} className="text-[#da7756]" />
                            <h1>Time Management</h1>
                        </div>
                        <div className="min-h-[100px] h-[calc(100%-62px)] flex flex-col gap-2 items-center justify-center">
                            <CustomLoading />
                            <p className="text-center">
                                This part might take longer, since it uses
                                advanced reasoning.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full flex flex-col items-center justify-center mt-4 px-4 xl:px-0">
                <div className="flex gap-4 mb-8">
                    <SiClaude size={42} className="text-[#da7756]" />
                    <h1 className="text-[1.75rem] text-[#3D3929]">
                        More questions ?
                    </h1>
                </div>
                <div className="rounded-2xl border border-gray-200 shadow-sm w-full xl:w-1/2 overflow-hidden relative mb-12 md:mb-0">
                    <input
                        type="text"
                        className="w-full p-3 outline-none pr-14 text-wrap"
                        placeholder="Follow up with a question to Claude."
                        value={followUpQuestionInput}
                        onChange={(e) =>
                            setFollowUpQuestionInput(e.target.value)
                        }
                    />
                    {selectCategory && followUpQuestionInput.length > 0 && (
                        <button
                            onClick={handleFollowUpWithAQuestion}
                            className="absolute top-3 right-3 bg-[#da7756] p-2 rounded-xl">
                            <ArrowUp className="h-[18px] w-[18px] text-white" />
                        </button>
                    )}
                    <div className="flex gap-2 items-center">
                        <p className="p-3">
                            Claude{" "}
                            <span className="text-zinc-500">3.7 sonnet</span>
                        </p>
                        <Select
                            value={selectCategory}
                            onValueChange={(value: Category) =>
                                setSelectCategory(value)
                            }>
                            <SelectTrigger className="w-[180px] hover:bg-[#f1efe8] rounded-lg duration-300 text-zinc-500">
                                <SelectValue placeholder="Choose category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="moneyManagement">
                                        Money management
                                    </SelectItem>
                                    <SelectItem value="instruments">
                                        Instruments
                                    </SelectItem>
                                    <SelectItem value="timeManagement">
                                        Time management
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="hidden md:flex items-end gap-2 md:w-[calc(80%-16px)] xl:w-[calc(50%-16px)] h-[80px] bg-[#ebe9e1] rounded-b-2xl p-2">
                    <div className="flex-1 border border-gray-300 text-[.85rem] p-2 rounded-lg text-zinc-600 bg-gray-400/5 h-[50px] flex items-center">
                        Pick 1 of 3 categories
                    </div>
                    <div className="flex-1 border border-gray-300 text-[.85rem] p-2 rounded-lg text-zinc-600 bg-gray-400/5 h-[50px] flex items-center">
                        Ask question related to this category.
                    </div>
                    <div className="flex-1 border border-gray-300 text-[.85rem] p-2 rounded-lg text-zinc-600 bg-gray-400/5 h-[50px] flex items-center">
                        And/or trading data history
                    </div>
                </div>
            </div>
        </>
    );
}
