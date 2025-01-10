import { index, pgTable, text } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
    id: text("id").notNull().unique(),
    capital: text("capital").notNull(),
});

export const TradeTable = pgTable(
    "trades",
    {
        id: text("id").primaryKey().notNull(),
        userId: text("userId").notNull(),
        positionType: text("positionType").notNull(),
        openDate: text("openDate").notNull(),
        openTime: text("openTime").notNull(),
        closeDate: text("closeDate").notNull(),
        closeTime: text("closeTime").notNull(),
        instrumentName: text("instrumentName").notNull(),
        deposit: text("deposit").notNull(),
        result: text("result").notNull(),
        notes: text("notes"),
    },
    (table) => ({
        userIdCloseDateIndex: index("userIdCloseDateIndex").on(
            table.userId,
            table.closeDate
        ),
    })
);
