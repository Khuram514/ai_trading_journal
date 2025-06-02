import { db } from "@/drizzle/db";
import { StrategyTable } from "@/drizzle/schema";
import { Rule } from "@/types/dbSchema.types";

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
    try {
        const result = await db.insert(StrategyTable).values({
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
