"use client";

import { CustomButton } from "@/components/CustomButton";
import CustomLoading from "@/components/CustomLoading";
import GeneratedReport from "@/components/tradeAI/GeneratedReport";
import { getPlural } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { getReportById, saveReport } from "@/server/actions/archive";
import { checkIfUserHasTokens } from "@/server/actions/user";
import { ReportType } from "@/types/tradeAI.types";
import { useUser } from "@clerk/nextjs";
import { ArrowUpLeft, Coins } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const reportId = params.reportId;

    const router = useRouter();

    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);

    const { user } = useUser();

    const [tokens, setTokens] = useState<number | undefined>();
    const [report, setReport] = useState<ReportType | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getReportById(reportId as string);
                if (data?.success) {
                    setReport(data.report);
                }
                const checkTokens = await checkIfUserHasTokens();
                if (checkTokens.success && checkTokens.tokens) {
                    setTokens(checkTokens.tokens);
                } else {
                    setTokens(0);
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const handleSaveReport = async () => {
        if (user && report) {
            const response = await saveReport(report, user.id);
            toast.success("The report has been saved successfully!");
            console.log(response);
        } else {
            toast.error("Try again later!");
        }
    };

    const goToPrevPage = () => {
        router.back();
    };

    if (report) {
        return (
            <div className="flex flex-col justify-between h-full pb-4">
                <div className="relative flex max-md:flex-col md:items-center justify-between p-4 md:p-8">
                    <div
                        className="relative group inline-block cursor-pointer"
                        onClick={goToPrevPage}>
                        <div className="flex items-center gap-2 mb-2 text-[#3D3929]">
                            <ArrowUpLeft size={16} />
                            Archive
                        </div>
                        <span className="absolute left-0 bottom-0 block h-[0.3px] w-0 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                    </div>
                    <h1 className="md:absolute md:left-1/2 md:-translate-x-1/2 text-4xl md:text-5xl text-center my-8 text-[#3D3929]">
                        Your saved report
                    </h1>
                    <div className="max-md:hidden flex gap-6">
                        <CustomButton
                            onClick={handleSaveReport}
                            isBlack={false}>
                            Save report
                        </CustomButton>
                        <div className="p-2 flex items-center gap-2 cursor-pointer">
                            <Coins className="text-[#da7756]" />
                            {tokens} {getPlural(tokens ?? 0, "Token", "Tokens")}
                        </div>
                    </div>
                </div>
                <GeneratedReport
                    report={report}
                    trades={trades}
                    setReport={setReport}
                    setTokens={setTokens}
                />
            </div>
        );
    } else {
        return (
            <div className="h-screen flex items-center justify-center">
                <CustomLoading />
            </div>
        );
    }
}
