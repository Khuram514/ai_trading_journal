"use server";

import { db } from "@/drizzle/db";
import { TradeTable, UserTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function addCapitalOrUpdate(
    capital: string
): Promise<{ error: boolean } | undefined> {
    const { userId } = await auth();

    if (userId == null) {
        return { error: true };
    }

    try {
        const user = await db.query.UserTable.findFirst({
            where: eq(TradeTable.id, userId),
        });

        if (user == null) {
            await db.insert(UserTable).values({ capital, id: userId });
        } else {
            await db
                .update(UserTable)
                .set({ capital })
                .where(eq(UserTable.id, userId));
        }
    } catch (err) {
        return { error: true };
    }
}

export async function getCapital(): Promise<
    string | undefined | { error: boolean }
> {
    const { userId } = await auth();

    if (userId == null) {
        return { error: true };
    }

    try {
        const data = await db.query.UserTable.findFirst({
            where: eq(TradeTable.id, userId),
        });

        return data?.capital;
    } catch (err) {
        return { error: true };
    }
}
