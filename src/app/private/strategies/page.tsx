"use client";

import { CustomButton } from "@/components/CustomButton";
import CustomLoading from "@/components/CustomLoading";
import AddStrategyDialog from "@/components/strategies/AddStrategyDialog";
import SearchStrategy from "@/components/strategies/SearchStrategy";
import SlidingTabs from "@/components/strategies/SlidingTabs";
import StrategyPageClientSideRenderig from "@/components/strategies/StrategyPageClientSideRenderig";
import { getAllStrategies } from "@/server/actions/strategies";
import {
    GetStrategiesError,
    GetStrategiesResult,
    GetStrategiesSuccess,
} from "@/types/strategies.types";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import React, { useState, useEffect } from "react";

function isGetStrategiesSuccess(
    result: GetStrategiesResult
): result is GetStrategiesSuccess {
    return result.success === true && "strategies" in result;
}

function isGetStrategiesError(
    result: GetStrategiesResult
): result is GetStrategiesError {
    return result.success === false && "error" in result;
}

export default function StrategiesPage() {
    const { userId } = useAuth();
    const [strategies, setStrategies] = useState<GetStrategiesResult | null>(null);
    const [hideAll, setHideAll] = useState(false);

    useEffect(() => {
        if (userId) {
            getAllStrategies(userId).then(setStrategies);
        }
    }, [userId]);

    if (!userId) return <div>Please sign in</div>;
    if (!strategies) return <div className="flex h-full items-center justify-center">
        <CustomLoading />
    </div>

    if (isGetStrategiesError(strategies)) {
        return <div>Error loading strategies: {strategies.error}</div>;
    }

    if (!isGetStrategiesSuccess(strategies)) {
        return <div>Unexpected response format.</div>;
    }
    return (
        <div className="flex flex-col h-full">
            <div className="px-8 pt-6 pb-0 border-b border-neutral-200 space-y-4 2xl:space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/main-logo.png"
                            width={60}
                            height={60}
                            alt="Logo"
                        />
                        <h1 className="text-4xl">Your Strategies</h1>
                    </div>
                    <AddStrategyDialog />
                </div>
                <div className="flex justify-between">
                    <SlidingTabs />

                    <div className="flex items-center gap-4">
                        <SearchStrategy />
                        <CustomButton isBlack={false} onClick={() => setHideAll(!hideAll)}>
                            {hideAll ? "Show all" : "Hide all"}
                        </CustomButton>
                    </div>

                </div>
            </div>
            <StrategyPageClientSideRenderig
                strategies={strategies.strategies}
                hideAll={hideAll}
            />
        </div >
    );
}
