"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

import { newTradeFormSchema } from "@/zodSchema/schema";
import { createNewTradeRecord, updateTradeRecord } from "@/server/actions/trades";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
    setMonthViewSummary,
    setTotalOfParticularYearSummary,
    setYearViewSummary,
    updateListOfTrades,
    updateTradeDetailsForEachDay,
    updateTradeInList,
} from "@/redux/slices/tradeRecordsSlice";
import { setIsDialogOpen } from "@/redux/slices/calendarSlice";
import { Trades } from "@/types";

interface UseTradeFormProps {
    editMode?: boolean;
    existingTrade?: Trades;
    day?: dayjs.Dayjs | undefined;
    onRequestClose?: () => void;
}

export const useTradeForm = ({ editMode = false, existingTrade, day, onRequestClose }: UseTradeFormProps) => {
    // State management
    const [openDate, setOpenDate] = useState<Date>();
    const [closeDate, setCloseDate] = useState<Date>();
    const [instrumentLabels, setInstrumentLabels] = useState<string[]>([]);
    const [submittingTrade, setSubmittingTrade] = useState(false);
    const [selectedStrategyId, setSelectedStrategyId] = useState<string>("");
    const [checkedOpenRules, setCheckedOpenRules] = useState<string[]>([]);
    const [checkedCloseRules, setCheckedCloseRules] = useState<string[]>([]);

    // Redux
    const dispatch = useAppDispatch();
    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const { strategies: localStrategies } = useAppSelector((state) => state.strategies);

    // Form setup with dynamic default values
    const form = useForm<z.infer<typeof newTradeFormSchema>>({
        resolver: zodResolver(newTradeFormSchema),
        defaultValues: editMode && existingTrade ? {
            positionType: existingTrade.positionType || "buy",
            openDate: existingTrade.openDate,
            openTime: existingTrade.openTime || "12:30",
            closeDate: existingTrade.closeDate,
            closeTime: existingTrade.closeTime || "12:30",
            deposit: existingTrade.deposit || "",
            instrumentName: existingTrade.instrumentName || "",
            strategyName: existingTrade.strategyName || "",
            strategyId: existingTrade.strategyId || null,
            appliedOpenRules: existingTrade.appliedOpenRules || [],
            appliedCloseRules: existingTrade.appliedCloseRules || [],
            result: existingTrade.result || "",
            notes: existingTrade.notes || "",
            rating: existingTrade.rating || 0,
        } : {
            positionType: "buy",
            openDate: undefined,
            openTime: "12:30",
            closeDate: undefined,
            closeTime: "12:30",
            deposit: "",
            instrumentName: "",
            strategyName: "",
            strategyId: null,
            appliedOpenRules: [],
            appliedCloseRules: [],
            result: "",
            notes: "",
            rating: 0,
        },
    });

    // Helper functions for rule checkbox handling
    const handleOpenRuleToggle = (ruleId: string, rule: unknown) => {
        const updatedCheckedRules = checkedOpenRules.includes(ruleId)
            ? checkedOpenRules.filter(id => id !== ruleId)
            : [...checkedOpenRules, ruleId];

        setCheckedOpenRules(updatedCheckedRules);

        // Mark parameter as intentionally unused
        void rule;

        const selectedStrategy = localStrategies.find(s => s.id === selectedStrategyId);
        if (selectedStrategy) {
            const appliedRules = selectedStrategy.openPositionRules.filter(r =>
                updatedCheckedRules.includes(r.id)
            );
            form.setValue("appliedOpenRules", appliedRules);
        }
    };

    const handleCloseRuleToggle = (ruleId: string, rule: unknown) => {
        const updatedCheckedRules = checkedCloseRules.includes(ruleId)
            ? checkedCloseRules.filter(id => id !== ruleId)
            : [...checkedCloseRules, ruleId];

        setCheckedCloseRules(updatedCheckedRules);

        // Mark parameter as intentionally unused
        void rule;

        const selectedStrategy = localStrategies.find(s => s.id === selectedStrategyId);
        if (selectedStrategy) {
            const appliedRules = selectedStrategy.closePositionRules.filter(r =>
                updatedCheckedRules.includes(r.id)
            );
            form.setValue("appliedCloseRules", appliedRules);
        }
    };

    const handleStrategyChange = (value: string) => {
        form.setValue("strategyName", value);
        const selectedStrategy = localStrategies.find(s => s.strategyName === value);
        const strategyId = selectedStrategy?.id || "";
        setSelectedStrategyId(strategyId);
        form.setValue("strategyId", strategyId || null);
        // Reset checked rules when strategy changes
        setCheckedOpenRules([]);
        setCheckedCloseRules([]);
        form.setValue("appliedOpenRules", []);
        form.setValue("appliedCloseRules", []);
    };

    // Submit handler
    const onSubmit = async (tradeData: z.infer<typeof newTradeFormSchema>) => {
        setSubmittingTrade(true);

        try {
            let result;
            if (editMode && existingTrade) {
                result = await updateTradeRecord(tradeData, existingTrade.id);

                if (result?.error) {
                    toast.error("There was an error updating your trade!");
                    return;
                }

                // Calculate differences for Redux state updates
                const oldResult = Number(existingTrade.result);
                const newResult = Number(tradeData.result);
                const resultDifference = newResult - oldResult;

                // Update Redux state with differences
                const [stringDay, month, year] = new Date(tradeData.closeDate)
                    .toLocaleDateString("en-GB")
                    .split("/");
                const numericMonth = parseInt(month, 10);
                const convertedMonthView = `${stringDay}-${month}-${year}`;
                const convertedYearView = `${numericMonth}-${year}`;

                // Only update summaries if result changed
                if (resultDifference !== 0) {
                    dispatch(setMonthViewSummary({
                        month: convertedMonthView,
                        value: resultDifference,
                    }));
                    dispatch(setYearViewSummary({
                        year: convertedYearView,
                        value: resultDifference,
                    }));
                    dispatch(setTotalOfParticularYearSummary({
                        year: year,
                        value: resultDifference,
                    }));
                }

                // Update the trade in the list
                dispatch(updateTradeInList({
                    id: existingTrade.id,
                    ...tradeData,
                }));

                toast.success("Trade updated successfully!");
            } else {
                const customId = uuidv4();
                result = await createNewTradeRecord(tradeData, customId);

                if (result?.error) {
                    toast.error("There was an error saving your trade!");
                    return;
                }

                // Update Redux state for new trades
                const [stringDay, month, year] = new Date(tradeData.closeDate)
                    .toLocaleDateString("en-GB")
                    .split("/");
                const numericMonth = parseInt(month, 10);
                const convertedMonthView = `${stringDay}-${month}-${year}`;
                const convertedYearView = `${numericMonth}-${year}`;

                dispatch(setMonthViewSummary({
                    month: convertedMonthView,
                    value: Number(tradeData.result),
                }));
                dispatch(setYearViewSummary({
                    year: convertedYearView,
                    value: Number(tradeData.result),
                }));
                dispatch(setTotalOfParticularYearSummary({
                    year: year,
                    value: Number(tradeData.result),
                }));
                dispatch(updateListOfTrades({
                    id: customId,
                    ...tradeData,
                }));
                dispatch(updateTradeDetailsForEachDay({
                    date: convertedMonthView,
                    result: Number(tradeData.result),
                    value: 1,
                }));

                toast.success("A new record has been created!");
            }

            // Close dialog: close calendar dialog via Redux, and optionally parent-controlled dialog via callback
            const dayKey = day !== undefined ? day.format("DD-MM-YYYY") : "any";
            dispatch(setIsDialogOpen({ key: dayKey, value: false }));
            if (onRequestClose) {
                onRequestClose();
            }
        } catch {
            toast.error("An unexpected error occurred!");
        } finally {
            setSubmittingTrade(false);
        }
    };

    // Effects
    useEffect(() => {
        if (day && !editMode) {
            const convertedDate = day.toDate().toISOString();
            form.setValue("closeDate", convertedDate);
        }
        setInstrumentLabels([
            ...new Set(trades?.map((trade) => trade.instrumentName)),
        ]);
    }, [day, trades, editMode, form]);

    // Initialize edit mode data
    useEffect(() => {
        if (editMode && existingTrade) {
            // Set strategy ID and rules if trade has strategy
            if (existingTrade.strategyId) {
                setSelectedStrategyId(existingTrade.strategyId);
                // Set checked rules based on applied rules
                if (existingTrade.appliedOpenRules) {
                    setCheckedOpenRules(existingTrade.appliedOpenRules.map(rule => rule.id));
                }
                if (existingTrade.appliedCloseRules) {
                    setCheckedCloseRules(existingTrade.appliedCloseRules.map(rule => rule.id));
                }
            }

            // Set dates for date pickers
            if (existingTrade.openDate) {
                setOpenDate(new Date(existingTrade.openDate));
            }
            if (existingTrade.closeDate) {
                setCloseDate(new Date(existingTrade.closeDate));
            }
        }
    }, [editMode, existingTrade]);

    return {
        // Form
        form,
        onSubmit,
        submittingTrade,

        // Dates
        openDate,
        setOpenDate,
        closeDate,
        setCloseDate,

        // Instruments
        instrumentLabels,

        // Strategy
        selectedStrategyId,
        localStrategies,
        handleStrategyChange,

        // Rules
        checkedOpenRules,
        checkedCloseRules,
        handleOpenRuleToggle,
        handleCloseRuleToggle,

        // Form values
        rating: form.watch("rating"),

        // Mode
        editMode,
    };
};