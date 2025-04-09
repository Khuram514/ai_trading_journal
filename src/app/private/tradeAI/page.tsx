"use client";
import { CustomButton } from "@/components/CustomButton";
import GeneratedReport from "@/components/tradeAI/GeneratedReport";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getAIReport } from "@/features/ai/getAiReport";
import { getPlural } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { saveReport } from "@/server/actions/archive";
import { checkIfUserHasTokens } from "@/server/actions/user";
import {
    ApiResponse,
    dialogWindowType,
    ReportType,
} from "@/types/tradeAI.types";
import { useUser } from "@clerk/nextjs";
import { Coins, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SiClaude } from "react-icons/si";
import { toast } from "sonner";

export default function Page() {
    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const { user } = useUser();

    const [isReportGenerated, setIsReportGenerated] = useState(false);
    const [tokens, setTokens] = useState<number | undefined>();
    const [report, setReport] = useState<ReportType | null>(null);

    const filteredDataForAICall = trades?.map(
        ({ result, instrumentName, openTime }) => ({
            result,
            instrumentName,
            openTime,
        })
    );

    const handleGetReport = async () => {
        if (!trades || trades.length < 3) {
            toast.error(
                "You don’t have enough trades. You must have at least 3 trades to get the report!"
            );
            return;
        }
        let checkTokens: {
            success: boolean;
            message?: string;
            tokens?: number | null;
        };
        try {
            checkTokens = await checkIfUserHasTokens();

            if (checkTokens.success && checkTokens.tokens) {
                const report = getAIReport(trades);

                const newMoneyManagementData: dialogWindowType = {
                    type: "system",
                    content: report.moneyManagement,
                };

                const newInstrumentData: dialogWindowType = {
                    type: "system",
                    content: report.instruments,
                };

                setReport({
                    moneyManagement: [newMoneyManagementData],
                    instruments: [newInstrumentData],
                    timeManagement: null,
                });

                setIsReportGenerated(true);
                setTokens(checkTokens.tokens - 1);

                const res = await fetch("/api/claude", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        trades: filteredDataForAICall,
                    }),
                });

                if (!res.ok) {
                    const errorMessage = await res.json();
                    throw new Error(errorMessage.error);
                }

                const data = await res.json();
                const claudeReport: ApiResponse = JSON.parse(
                    data.content[0].text
                );
                setReport((prevReport) => {
                    if (!prevReport) {
                        return null;
                    }
                    return {
                        ...prevReport,
                        timeManagement: [
                            {
                                type: "system",
                                content: [
                                    ...claudeReport.claudeComments
                                        .generalObservations,
                                    ...claudeReport.claudeComments
                                        .recommendations,
                                ],
                            },
                        ],
                    };
                });
                toast.success("You've spent 1 token!");
            } else if (checkTokens.success && !checkTokens.tokens) {
                toast.error(
                    "You don't have enough tokens for this operation. Go to the tokens page to check your balance."
                );
            } else {
                toast.error(checkTokens.message);
            }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
                console.log(err.message);
            }
            toast.error("Error occured! Try again later!");
            console.log(err);
        }
    };

    const handleSaveReport = async () => {
        if (user && report) {
            const response = await saveReport(report, user.id);
            toast.success("The report has been saved successfully!");
            console.log(response);
        } else {
            toast.error("Try again later!");
        }
    };

    return (
        <div className="flex flex-col justify-between h-full">
            <div
                className={`relative flex flex-col items-center duration-500 ${
                    isReportGenerated &&
                    "-translate-y-[100px] lg:-translate-y-[250px]"
                }`}>
                <div
                    className="h-[100px] lg:h-[250px] overflow-hidden   
                   ">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/before_tradeAi_video_is_loaded.png"
                        className="scale-[2.5] xl:scale-[1.7] 2xl:xl:scale-[1.3]">
                        <source src="/tradeAi-video.mov" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <h1 className="relative text-4xl md:text-5xl text-center mb-12 mt-8 text-[#3D3929]">
                    Get your AI report
                </h1>

                <h2
                    className={`${
                        isReportGenerated && "hidden"
                    } md:text-xl text-center text-[#3D3929] px-8 md:px-0`}>
                    Get a personalized report based on your trading activity.
                </h2>
                <h2
                    className={`${
                        isReportGenerated && "hidden"
                    } md:text-xl text-center mb-12 text-[#3D3929] px-8 md:px-0`}>
                    Use all power of AI to fix mistakes and improve your
                    results.
                </h2>
                {isReportGenerated && (
                    <div className="max-md:hidden top-[298px] absolute right-12 flex gap-6">
                        <CustomButton
                            onClick={handleSaveReport}
                            isBlack={false}>
                            Save report
                        </CustomButton>
                        <HoverCard>
                            <HoverCardTrigger className="cursor-pointer duration-100 text-[.9rem] flex gap-1 items-center">
                                <div className="p-2 flex items-center gap-2 cursor-pointer relative">
                                    <Coins className="text-[#da7756]" />
                                    {tokens}{" "}
                                    {getPlural(tokens ?? 0, "Token", "Tokens")}
                                    <div className="absolute border border-gray-500 w-[14px] h-[14px] text-[.6rem] rounded-full flex items-center justify-center top-1 -right-2">
                                        i
                                    </div>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="">
                                <div className="border-b border-gray-300 flex justify-between items-center py-3">
                                    <p>Report</p>
                                    <p>1 token</p>
                                </div>
                                <div className="border-b border-gray-300 flex justify-between items-center py-3">
                                    <p>Follow up question</p>
                                    <p>2 tokens</p>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <p>
                                        Every new user receives 5 free tokens to
                                        test all AI features.
                                    </p>
                                </div>
                                <Link
                                    href="/private/tokens"
                                    className="flex justify-center">
                                    <CustomButton isBlack={false}>
                                        Buy Tokens
                                    </CustomButton>
                                </Link>
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                )}
                {!isReportGenerated && (
                    <div className="flex gap-8 md:gap-12">
                        <div
                            className="flex justify-center cursor-pointer"
                            onClick={handleGetReport}>
                            <div className="relative group inline-block">
                                <div className="flex gap-2 mb-2 text-[#3D3929]">
                                    Get report{" "}
                                    <MoveUpRight className="w-[1rem]" />
                                </div>
                                <span className="absolute left-0 bottom-0 block h-[0.3px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                            </div>
                        </div>
                        <Link
                            href="/private/reports-history"
                            className="flex justify-center cursor-pointer">
                            <div className="relative group inline-block">
                                <div className="flex gap-2 mb-2 text-[#3D3929]">
                                    Report Archive{" "}
                                    <MoveUpRight className="w-[1rem]" />
                                </div>
                                <span className="absolute left-0 bottom-0 block h-[0.3px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                            </div>
                        </Link>
                    </div>
                )}
                {report && (
                    <GeneratedReport
                        report={report}
                        trades={trades}
                        setReport={setReport}
                        setTokens={setTokens}
                    />
                )}
            </div>
            {!isReportGenerated && (
                <div className="w-full flex gap-2 items-center justify-center pb-8 md:pb-12">
                    <h2 className="md:text-xl text-[#3D3929]">
                        Powered by Claude
                    </h2>
                    <SiClaude size={24} className="text-[#da7756]" />
                </div>
            )}
        </div>
    );
}
