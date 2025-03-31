"use client";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableFooter,
} from "@/components/ui/table";
import { sortTrades } from "@/features/history/sortTrades";
import {
    removeRecordFromListOfTrades,
    setMonthViewSummary,
    setTotalOfParticularYearSummary,
    setYearViewSummary,
} from "@/redux/slices/tradeRecordsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { deleteTradeRecord } from "@/server/actions/trades";
import { Trades } from "@/types";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

export default function Page() {
    const [sortedTrades, setSortedTrades] = useState<Trades[]>([]);
    const [total, setTotal] = useState<number>(0);

    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const filteredTrades = useAppSelector(
        (state) => state.history.filteredTrades
    );

    const sortBy = useAppSelector((state) => state.history.sortBy);
    const timeframe = useAppSelector((state) => state.history.timeframe);

    const dispatch = useAppDispatch();

    const tradesToSort = filteredTrades || trades || [];

    useEffect(() => {
        const result = sortTrades({
            sortBy,
            timeframe,
            tradesToSort,
        });
        const reducedTotal = result.reduce(
            (acc, cur) => acc + Number(cur.result),
            0
        );
        setSortedTrades(result);
        setTotal(reducedTotal);
    }, [tradesToSort, sortBy, timeframe]);

    const handleDeleteTradeRecord = async (
        tradeId: string,
        result: string,
        closeDate: string
    ) => {
        try {
            const [stringDay, month, year] = new Date(closeDate)
                .toLocaleDateString("en-GB")
                .split("/");
            const numericMonth = parseInt(month, 10);
            const convertedMonthView = `${stringDay}-${month}-${year}`;
            const convertedYearView = `${numericMonth}-${year}`;
            await deleteTradeRecord(tradeId);
            dispatch(removeRecordFromListOfTrades(tradeId));
            dispatch(
                setMonthViewSummary({
                    month: convertedMonthView,
                    value: -Number(result),
                })
            );
            dispatch(
                setYearViewSummary({
                    year: convertedYearView,
                    value: -Number(result),
                })
            );
            dispatch(
                setTotalOfParticularYearSummary({
                    year: year,
                    value: -Number(result),
                })
            );
            toast.success("Record has been deleted!");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[10%]">
                            Instrument name
                        </TableHead>
                        <TableHead className="w-[10%] max-md:hidden">
                            Position type
                        </TableHead>
                        <TableHead className="w-[10%]">Open date</TableHead>
                        <TableHead className="w-[10%] max-md:hidden">
                            Open time
                        </TableHead>
                        <TableHead className="w-[10%]">Close date</TableHead>
                        <TableHead className="w-[10%] max-md:hidden">
                            Close time
                        </TableHead>
                        <TableHead className="w-[10%] max-md:hidden">
                            Deposit
                        </TableHead>
                        <TableHead className="w-[10%]">Result</TableHead>
                        <TableHead className="w-[10%] max-md:hidden">
                            Note
                        </TableHead>
                        <TableHead className="text-center w-[10%]">
                            Delete
                        </TableHead>
                    </TableRow>
                </TableHeader>
            </Table>
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableBody>
                        {sortedTrades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell className="font-medium w-[10%]">
                                    {trade.instrumentName}
                                </TableCell>
                                <TableCell className="w-[10%] max-md:hidden">
                                    {trade.positionType}
                                </TableCell>
                                <TableCell className="w-[10%]">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(trade.openDate))}
                                </TableCell>
                                <TableCell className="w-[10%] max-md:hidden">
                                    {trade.openTime}
                                </TableCell>
                                <TableCell className="w-[10%]">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(trade.closeDate))}
                                </TableCell>
                                <TableCell className="w-[10%] max-md:hidden">
                                    {trade.closeTime}
                                </TableCell>
                                <TableCell className="w-[10%] max-md:hidden">
                                    {Number(trade.deposit).toLocaleString(
                                        "de-DE"
                                    )}
                                </TableCell>
                                <TableCell className="w-[10%] max-md:text-end pr-8 md:pr-0">
                                    {Number(trade.result).toLocaleString(
                                        "de-DE"
                                    )}
                                </TableCell>
                                <TableCell className="w-[10%] max-md:hidden">
                                    {trade.notes && (
                                        <HoverCard>
                                            <HoverCardTrigger className="hover:underline cursor-pointer duration-100">
                                                View note
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                {trade.notes}
                                            </HoverCardContent>
                                        </HoverCard>
                                    )}
                                </TableCell>
                                <TableCell className="w-[10%]">
                                    <MdDelete
                                        onClick={() =>
                                            handleDeleteTradeRecord(
                                                trade.id,
                                                trade.result,
                                                trade.closeDate
                                            )
                                        }
                                        className="text-[1.2rem] text-sell cursor-pointer w-full"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Table>
                <TableFooter className="sticky bottom-0 right-0 left-0 bg-white w-full text-[1rem] px-2 py-1 mt-auto">
                    <TableRow className="flex justify-between">
                        <TableCell>Total</TableCell>
                        <TableCell>{total.toLocaleString("de-DE")}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}
