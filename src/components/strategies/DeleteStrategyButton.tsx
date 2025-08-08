"use client";

import {
    addStrategyToTheState,
    deleteLocalStrategy,
} from "@/redux/slices/strategySlice";
import { useAppDispatch } from "@/redux/store";
import { deleteStrategyFromDB } from "@/server/actions/strategies";
import { Strategy } from "@/types/strategies.types";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteStrategyButton({
    strategy,
}: {
    strategy: Strategy;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const handleDeleteStrategy = async (e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        const originalStrategy = strategy;

        setIsLoading(true);
        try {
            dispatch(deleteLocalStrategy({ id: strategy.id }));
            await deleteStrategyFromDB(strategy.id);
            toast.success("Strategy deleted successfully!");
        } catch (error) {
            console.error("Failed to delete strategy:", error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unknown error occurred!");
            }
            dispatch(addStrategyToTheState(originalStrategy));
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <button
            disabled={isLoading}
            onClick={handleDeleteStrategy}
            className="p-1 rounded-md md:hover:bg-neutral-200 disabled:hover:bg-transparent disabled:text-neutral-400">
            <Trash2 size={18} />
        </button>
    );
}
