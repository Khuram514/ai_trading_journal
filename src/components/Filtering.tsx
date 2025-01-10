"use client";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import {
    setFilteredTrades,
    setSortBy,
    setTimeframe,
} from "@/redux/slices/historyPageSlice";
import { CustomButton } from "./CustomButton";

export default function Filtering({
    isStatisticsPage,
}: {
    isStatisticsPage: boolean;
}) {
    const [instrumentLabels, setInstrumentLabels] = useState<string[]>([]);
    const [removedItems, setRemovedItems] = useState<string[]>([]);

    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const sortBy = useAppSelector((state) => state.history.sortBy);
    const timeframe = useAppSelector((state) => state.history.timeframe);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setInstrumentLabels([
            ...new Set(trades?.map((trade) => trade.instrumentName)),
        ]);
        dispatch(setFilteredTrades(trades));
    }, [trades]);

    const removeInstrumentFromList = (instrument: string) => {
        const updatedLabels = instrumentLabels.filter(
            (item) => item !== instrument
        );
        setInstrumentLabels(updatedLabels);
        setRemovedItems((prev) => [...prev, instrument]);
        dispatch(
            setFilteredTrades(
                trades?.filter((trade) =>
                    updatedLabels.includes(trade.instrumentName)
                )
            )
        );
    };

    const addInstrumentToTheList = (instrument: string) => {
        const updatedLabels = [...instrumentLabels, instrument];
        setInstrumentLabels(updatedLabels);
        setRemovedItems((prev) => prev.filter((item) => item !== instrument));
        dispatch(
            setFilteredTrades(
                trades?.filter((trade) =>
                    updatedLabels.includes(trade.instrumentName)
                )
            )
        );
    };
    return (
        <div className="px-3 md:px-6 flex max-md:flex-col max-md:gap-3 items-center justify-between py-3 md:py-2 border-b border-zinc-200">
            <div className="flex gap-2 md:w-1/2 flex-wrap">
                {removedItems.length > 0 && (
                    <Select
                        onValueChange={(value) =>
                            addInstrumentToTheList(value)
                        }>
                        <SelectTrigger className="md:w-[160px]">
                            <SelectValue placeholder="Add instrument" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {removedItems.map((item) => (
                                    <SelectItem key={item} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
                {instrumentLabels.map((instrument) => (
                    <CustomButton key={instrument} isBlack>
                        <div
                            onClick={() => removeInstrumentFromList(instrument)}
                            className="flex gap-1 items-center text-[.75rem]">
                            {instrument}
                            <IoClose className="text-[1rem]" />
                        </div>
                    </CustomButton>
                ))}
            </div>
            {!isStatisticsPage && (
                <div className="flex items-center max-md:justify-between max-md:w-full md:gap-4">
                    <Select
                        value={sortBy}
                        onValueChange={(value) => dispatch(setSortBy(value))}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="instrumentName">
                                    Instrument
                                </SelectItem>
                                <SelectItem value="positionType">
                                    Position type
                                </SelectItem>
                                <SelectItem value="closeDate">
                                    Close date
                                </SelectItem>
                                <SelectItem value="openDate">
                                    Open date
                                </SelectItem>
                                <SelectItem value="result">Result</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select
                        value={timeframe}
                        onValueChange={(value) =>
                            dispatch(setTimeframe(value))
                        }>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="All history" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="thisWeek">
                                    Last 7 days
                                </SelectItem>
                                <SelectItem value="thisMonth">
                                    This month
                                </SelectItem>
                                <SelectItem value="allHistory">
                                    All history
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
}
