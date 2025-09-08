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
    const [openDate, setOpenDate] = useState<Date>();
    const [closeDate, setCloseDate] = useState<Date>();
    const [instrumentLabels, setInstrumentLabels] = useState<string[]>([]);
    const [submittingTrade, setSubmittingTrade] = useState(false);
    const [selectedStrategyId, setSelectedStrategyId] = useState<string>("");
    const [checkedOpenRules, setCheckedOpenRules] = useState<string[]>([]);
    const [checkedCloseRules, setCheckedCloseRules] = useState<string[]>([]);

    const dispatch = useAppDispatch();
    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const { strategies: localStrategies } = useAppSelector((state) => state.strategies);

    const form = useForm<z.infer<typeof newTradeFormSchema>>({
        resolver: zodResolver(newTradeFormSchema),
        defaultValues: editMode && existingTrade ? {
            positionType: existingTrade.positionType || "buy",
            openDate: existingTrade.openDate,
            openTime: existingTrade.openTime || "12:30",
            closeDate: existingTrade.closeDate || "",
            closeTime: existingTrade.closeTime || "",
            isActiveTrade: existingTrade.isActiveTrade ?? true,
            deposit: existingTrade.deposit || "",
            instrumentName: existingTrade.instrumentName || "",
            symbolName: existingTrade.symbolName || "",
            entryPrice: existingTrade.entryPrice || "",
            totalCost: existingTrade.totalCost || "",
            quantity: existingTrade.quantity || "",
            sellPrice: existingTrade.sellPrice || "",
            quantitySold: existingTrade.quantitySold || "",
            profitOrLoss: existingTrade.profitOrLoss || "",
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
            closeDate: "",
            closeTime: "",
            isActiveTrade: true,
            deposit: "",
            instrumentName: "",
            symbolName: "",
            entryPrice: "",
            totalCost: "",
            quantity: "",
            sellPrice: "",
            quantitySold: "",
            profitOrLoss: "",
            strategyName: "",
            strategyId: null,
            appliedOpenRules: [],
            appliedCloseRules: [],
            result: "",
            notes: "",
            rating: 0,
        },
    });

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

        // Auto-set isActiveTrade based on closeDate
        const updatedTradeData = {
            ...tradeData,
            isActiveTrade: !tradeData.closeDate || tradeData.closeDate === ""
        };

        try {
            let result;
            if (editMode && existingTrade) {
                result = await updateTradeRecord(updatedTradeData, existingTrade.id);

                if (result?.error) {
                    toast.error("There was an error updating your trade!");
                    return;
                }

                // Calculate differences for Redux state updates
                const oldResult = Number(existingTrade.result);
                const newResult = Number(updatedTradeData.result);
                const resultDifference = newResult - oldResult;

                // Only update statistics if trade has a closeDate (is closed)
                if (updatedTradeData.closeDate && updatedTradeData.closeDate !== "") {
                    const [stringDay, month, year] = new Date(updatedTradeData.closeDate)
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
                }

                // Update the trade in the list
                dispatch(updateTradeInList({
                    id: existingTrade.id,
                    ...updatedTradeData,
                }));

                toast.success("Trade updated successfully!");
            } else {
                const customId = uuidv4();
                result = await createNewTradeRecord(updatedTradeData, customId);

                if (result?.error) {
                    toast.error("There was an error saving your trade!");
                    return;
                }

                // Only update statistics if trade has a closeDate (is closed)
                if (updatedTradeData.closeDate && updatedTradeData.closeDate !== "") {
                    const [stringDay, month, year] = new Date(updatedTradeData.closeDate)
                        .toLocaleDateString("en-GB")
                        .split("/");
                    const numericMonth = parseInt(month, 10);
                    const convertedMonthView = `${stringDay}-${month}-${year}`;
                    const convertedYearView = `${numericMonth}-${year}`;

                    dispatch(setMonthViewSummary({
                        month: convertedMonthView,
                        value: Number(updatedTradeData.result),
                    }));
                    dispatch(setYearViewSummary({
                        year: convertedYearView,
                        value: Number(updatedTradeData.result),
                    }));
                    dispatch(setTotalOfParticularYearSummary({
                        year: year,
                        value: Number(updatedTradeData.result),
                    }));
                    dispatch(updateTradeDetailsForEachDay({
                        date: convertedMonthView,
                        result: Number(updatedTradeData.result),
                        value: 1,
                    }));
                }

                // Always update the trade list (for both open and closed trades)
                dispatch(updateListOfTrades({
                    id: customId,
                    ...updatedTradeData,
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
            form.setValue("openDate", convertedDate);
            setOpenDate(day.toDate());
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