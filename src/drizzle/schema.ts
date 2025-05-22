import {
    boolean,
    index,
    integer,
    jsonb,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
    id: text("id").notNull().unique(),
    capital: text("capital").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    tokens: integer("tokens"),
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
        rating: integer("rating").default(0),
    },
    (table) => ({
        userIdCloseDateIndex: index("userIdCloseDateIndex").on(
            table.userId,
            table.closeDate
        ),
    })
);

export const ReportsTable = pgTable("reports", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    reportData: jsonb("report_data").notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
});

export const TransactionsTable = pgTable("transactions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    plan: text("plan").notNull(),
});
