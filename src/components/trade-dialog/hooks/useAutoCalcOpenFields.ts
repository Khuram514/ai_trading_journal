"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { newTradeFormSchema } from "@/zodSchema/schema";

type FormType = z.infer<typeof newTradeFormSchema>;

function toNum(value?: string): number | undefined {
    if (value == null) return undefined;
    const trimmed = value.trim();
    if (trimmed === "") return undefined;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : undefined;
}

export function useAutoCalcOpenFields(form: UseFormReturn<FormType>) {
    const { watch, setValue } = form;

    const entryPrice = watch("entryPrice"); // string
    const quantity = watch("quantity"); // string
    const deposit = watch("deposit"); // string

    // Track previous values to know which field changed this tick
    const prevEntryRef = useRef(entryPrice);
    const prevQtyRef = useRef(quantity);
    const prevDepRef = useRef(deposit);

    useEffect(() => {
        const e = toNum(entryPrice);
        const q = toNum(quantity);
        const d = toNum(deposit);

        const prevE = prevEntryRef.current;
        const prevQ = prevQtyRef.current;
        const prevD = prevDepRef.current;

        const changedE = entryPrice !== prevE;
        const changedQ = quantity !== prevQ;
        const changedD = deposit !== prevD;

        // Helper to conditionally set a field only if empty and changed
        const setIfEmptyAndChanged = (
            name: keyof Pick<FormType, "entryPrice" | "quantity" | "deposit">,
            value: number,
            decimals: number
        ) => {
            const current = watch(name);
            if (current && current.trim() !== "") return; // user already entered something
            const next = value.toFixed(decimals);
            if (current !== next) {
                setValue(name as any, next, { shouldDirty: true, shouldValidate: true });
            }
        };

        // Compute missing third value when exactly two are present.
        // Only suggest when one of the source fields changed (not when user just cleared the target).
        if (e != null && q != null && (deposit == null || deposit.trim() === "")) {
            if (!(changedD && (deposit == null || deposit.trim() === "")) && (changedE || changedQ)) {
                setIfEmptyAndChanged("deposit", e * q, 2);
            }
            return;
        }

        if (d != null && q != null && (entryPrice == null || entryPrice.trim() === "")) {
            if (!(changedE && (entryPrice == null || entryPrice.trim() === "")) && (changedD || changedQ)) {
                if (q !== 0) setIfEmptyAndChanged("entryPrice", d / q, 2);
            }
            return;
        }

        if (d != null && e != null && (quantity == null || quantity.trim() === "")) {
            if (!(changedQ && (quantity == null || quantity.trim() === "")) && (changedD || changedE)) {
                if (e !== 0) setIfEmptyAndChanged("quantity", d / e, 6);
            }
            return;
        }
        // Update previous refs at the end of processing
        prevEntryRef.current = entryPrice;
        prevQtyRef.current = quantity;
        prevDepRef.current = deposit;
    }, [entryPrice, quantity, deposit, setValue, watch]);
}

export default useAutoCalcOpenFields;


