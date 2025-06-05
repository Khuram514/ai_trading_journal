"use client";

import { Strategy } from "@/types/strategies.types";
import React, { useEffect } from "react";
import StrategyCard from "./Strategy";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setStrategyState } from "@/redux/slices/strategySlice";

export default function StrategyPageClientSideRenderig({
    strategies,
}: {
    strategies: Strategy[];
}) {
    const dispatch = useAppDispatch();

    const { strategies: localStrategies } = useAppSelector(
        (state) => state.strategies
    );

    useEffect(() => {
        dispatch(setStrategyState(strategies));
    }, [dispatch, strategies]);
    return (
        <div className="px-8 py-4 space-y-4 overflow-scroll flex-1 min-h-0">
            {localStrategies.length > 0 ? (
                localStrategies.map((strategy) => (
                    <StrategyCard key={strategy.id} strategy={strategy} />
                ))
            ) : (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-500">
                    No strategies found. Create your first strategy!
                </div>
            )}
        </div>
    );
}
