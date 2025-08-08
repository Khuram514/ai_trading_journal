"use server";

import { db } from "@/drizzle/db";
import { StrategyTable } from "@/drizzle/schema";
import { Rule } from "@/types/dbSchema.types";
import {
    DeleteStrategyFromDBResult,
    GetStrategiesResult,
} from "@/types/strategies.types";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function saveStrategy({
    openPositionRules,
    closePositionRules,
    userId,
    id,
    strategyName,
}: {
    openPositionRules: Rule[];
    closePositionRules: Rule[];
    userId: string;
    id: string;
    strategyName: string;
}) {
    const { userId: userIdFromAuth } = await auth();
    if (userIdFromAuth !== userId) return null;

    try {
        await db.insert(StrategyTable).values({
            userId,
            id,
            openPositionRules,
            closePositionRules,
            strategyName,
        });

        return {
            success: true,
            message: "Strategy saved successfully.",
        };
    } catch (error) {
        console.error("Failed to save report:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        } else {
            return { success: false, error: "Unknown error occurred!" };
        }
    }
}

export async function getAllStrategies(
    userId: string | undefined
): Promise<GetStrategiesResult | null> {
    const { userId: userIdFromAuth } = await auth();
    if (userIdFromAuth !== userId) return null;

    try {
        const strategies = await db
            .select({
                id: StrategyTable.id,
                strategyName: StrategyTable.strategyName,
                openPositionRules: StrategyTable.openPositionRules,
                closePositionRules: StrategyTable.closePositionRules,
            })
            .from(StrategyTable)
            .where(eq(StrategyTable.userId, userId))
            .orderBy(desc(StrategyTable.createdAt));

        if (!strategies.length) return null;

        return {
            success: true,
            strategies: strategies,
        };
    } catch (error) {
        console.error("Failed to fetch reports:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Unknown error occurred!" };
    }
}

export async function deleteStrategyFromDB(
    strategyId: string | undefined
): Promise<DeleteStrategyFromDBResult | null> {
    if (!strategyId) return null;

    try {
        await db.delete(StrategyTable).where(eq(StrategyTable.id, strategyId));

        return {
            success: true,
        };
    } catch (error) {
        console.error("Failed to delete strategy:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Unknown error occurred!" };
    }
}

export async function editStrategy({
    openPositionRules,
    closePositionRules,
    userId,
    id,
    strategyName,
}: {
    openPositionRules: Rule[];
    closePositionRules: Rule[];
    userId: string;
    id: string;
    strategyName: string;
}) {
    const { userId: userIdFromAuth } = await auth();
    if (userIdFromAuth !== userId) return null;
    try {
        await db.update(StrategyTable).set({
            openPositionRules,
            closePositionRules,
            strategyName,
        }).where(eq(StrategyTable.id, id));

        return {
            success: true,
            message: "Strategy edited successfully.",
        };
    } catch (error) {
        console.error("Failed to edit strategy:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Unknown error occurred!" };
    }
}