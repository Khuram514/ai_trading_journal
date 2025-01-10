import { z } from "zod";

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

    notes: z.string().optional(),
});

export const addCapitalFormSchema = z.object({
    capital: z
        .string()
        .min(1, { message: "Deposit is required." })
        .regex(/^[0-9]+$/, { message: "Only positive numbers are allowed." }),
});
