"use server";

import { db } from "@/drizzle/db";
import { TradeTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { newTradeFormSchema } from "@/zodSchema/schema";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { Trades } from "@/types";

export async function createNewTradeRecord(
    unsafeData: z.infer<typeof newTradeFormSchema>,
    id: string
): Promise<{ error: boolean } | undefined> {
    const { userId } = await auth();
    const { success, data } = newTradeFormSchema.safeParse(unsafeData);
    if (!success || userId == null) {
        return { error: true };
    }

    await db.insert(TradeTable).values({ ...data, userId, id });
}

export async function getAllTradeRecords(): Promise<Trades[]> {
    const { userId } = await auth();
    if (userId == null) {
        throw new Error("User not authenticated");
    }

    const data = await db.query.TradeTable.findMany({
        where: eq(TradeTable.userId, userId),
    });
    const processedData = data.map(
        ({ userId: _userId, ...tradeWithoutUserId }) => ({
            ...tradeWithoutUserId,
            notes: tradeWithoutUserId.notes ?? undefined,
        })
    );

    return [...processedData].reverse();
}

export async function deleteTradeRecord(
    recordId: string
): Promise<{ error: boolean } | undefined> {
    try {
        await db.delete(TradeTable).where(eq(TradeTable.id, recordId));
    } catch (err) {
        console.log(err);
        return { error: true };
    }
    return;
}
