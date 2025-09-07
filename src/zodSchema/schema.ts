import { z } from "zod";

const ruleSchema = z.object({
    id: z.string(),
    rule: z.string(),
    satisfied: z.boolean(),
    priority: z.enum(["low", "medium", "high"]),
});

export const newTradeFormSchema = z.object({
    positionType: z.string().min(1, { message: "Position Type is required." }),
    openDate: z.string(),
    openTime: z.string().min(1, { message: "Open time is required." }),
    closeDate: z.string(),
    closeTime: z.string().min(1, { message: "Close time is required." }),
    deposit: z
        .string()
        .min(1, { message: "Deposit is required." })
        .regex(/^[0-9]+$/, { message: "Only positive numbers are allowed." }),

    result: z
        .string()
        .min(1, { message: "Result is required." })
        .regex(/^-?[0-9]+$/, {
            message: "Only numbers are allowed.",
        }),
    instrumentName: z
        .string()
        .min(1, { message: "Instrument name is required." }),
    symbolName: z.string().optional(),
    entryPrice: z.string().optional(),
    totalCost: z.string().optional(),
    quantity: z.string().optional(),
    sellPrice: z.string().optional(),
    quantitySold: z.string().optional(),
    profitOrLoss: z.string().optional(),

    strategyName: z.string().optional(),
    strategyId: z.string().optional().nullable(),
    appliedOpenRules: z.array(ruleSchema).optional().default([]),
    appliedCloseRules: z.array(ruleSchema).optional().default([]),
    notes: z.string().optional(),
    rating: z
        .number()
        .max(5, { message: "Rating cannot be more than 5" })
        .default(0),
});

export const addCapitalFormSchema = z.object({
    capital: z
        .string()
        .min(1, { message: "Deposit is required." })
        .regex(/^[0-9]+$/, { message: "Only positive numbers are allowed." }),
});
