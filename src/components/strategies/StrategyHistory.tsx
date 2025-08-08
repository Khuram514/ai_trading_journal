"use client";
import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Strategy } from "@/types/strategies.types";
import { useAppSelector } from "@/redux/store";
import { MdStar } from "react-icons/md";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { LiaHandPointer } from "react-icons/lia";
import { PiCalendarDotsThin } from "react-icons/pi";
import { Moon, Sun } from "lucide-react";
import { isInMorningRange } from "@/features/history/isInMorningRange";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { getCapital } from "@/server/actions/user";
import { useDeleteTrade } from "@/hooks/useDeleteTrade";
import EditTrade from "@/components/history/EditTrade";
import { MdDelete } from "react-icons/md";

interface StrategyHistoryProps {
    strategy: Strategy;
}

export default function StrategyHistory({ strategy }: StrategyHistoryProps) {
    const [startCapital, setStartCapital] = useState<string | null>(null);

    // Get trades from Redux and filter by strategy
    const allTrades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const strategyTrades = allTrades?.filter(trade => trade.strategyId === strategy.id) || [];

    // Get delete function from hook
    const { handleDeleteTradeRecord } = useDeleteTrade();

    // Fetch capital for percentage calculation
    useEffect(() => {
        async function fetchData() {
            const response = await getCapital();
            if (response && typeof response === "string") {
                setStartCapital(response);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="w-full">
            <h1 className="py-4 text-neutral-500">
                Trades using {strategy.strategyName} ({strategyTrades.length} trades):
            </h1>
            {strategyTrades.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[12%]">Instrument</TableHead>
                            <TableHead className="w-[8%]">Type</TableHead>
                            <TableHead className="w-[12%]">Open date</TableHead>
                            <TableHead className="w-[10%]">Open time</TableHead>
                            <TableHead className="w-[12%]">Close date</TableHead>
                            <TableHead className="w-[10%]">Close time</TableHead>
                            <TableHead className="w-[12%]">Deposit
                                <p className="text-[.75rem]">(% of capital)</p>
                            </TableHead>
                            <TableHead className="w-[10%]">Result</TableHead>
                            <TableHead className="w-[5%]">Note</TableHead>
                            <TableHead className="text-center w-[6%]">Rating</TableHead>
                            <TableHead className="text-center w-[4%]">Edit</TableHead>
                            <TableHead className="text-center w-[4%]">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {strategyTrades.map((trade) => (
                            <TableRow key={trade.id}>
                                <TableCell className="font-medium w-[12%]">
                                    {trade.instrumentName}
                                </TableCell>
                                <TableCell className="w-[8%]">
                                    <p
                                        className={`bg-${trade.positionType === "sell"
                                            ? "sell"
                                            : "buy"
                                            } w-fit px-2 rounded-md text-white text-[.8rem]`}>
                                        {trade.positionType}
                                    </p>
                                </TableCell>
                                <TableCell className="w-[12%] text-neutral-500">
                                    <div className="flex gap-2 items-center">
                                        <PiCalendarDotsThin />
                                        {new Intl.DateTimeFormat("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }).format(new Date(trade.openDate))}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[10%] text-neutral-500">
                                    <div className="flex gap-2 items-center">
                                        {isInMorningRange(trade.openTime) ? (
                                            <Sun className="h-3" />
                                        ) : (
                                            <Moon className="h-3" />
                                        )}
                                        {trade.openTime}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[12%] text-neutral-500">
                                    <div className="flex gap-2 items-center">
                                        <PiCalendarDotsThin />
                                        {new Intl.DateTimeFormat("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }).format(new Date(trade.closeDate))}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[10%] text-neutral-500">
                                    <div className="flex gap-2 items-center">
                                        {isInMorningRange(trade.closeTime) ? (
                                            <Sun className="h-3" />
                                        ) : (
                                            <Moon className="h-3" />
                                        )}
                                        {trade.closeTime}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[12%]">
                                    <div className="flex gap-2 items-center">
                                        {Number(trade.deposit).toLocaleString(
                                            "de-DE"
                                        )}
                                        <div className="text-xs text-neutral-400">
                                            (
                                            {startCapital && +startCapital !== 0
                                                ? `${Math.round(
                                                    (Number(trade.deposit) /
                                                        Number(
                                                            startCapital
                                                        )) *
                                                    100
                                                )}%`
                                                : "no capital"}
                                            )
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={`w-[10%] ${Number(trade.result) >= 0
                                        ? "text-buy"
                                        : "text-sell"
                                        }`}>
                                    <div className="flex gap-2 items-center">
                                        {Number(trade.result) >= 0 ? (
                                            <FaArrowTrendUp className="text-[1rem]" />
                                        ) : (
                                            <FaArrowTrendDown />
                                        )}
                                        {Number(trade.result).toLocaleString(
                                            "de-DE"
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[5%]">
                                    {trade.notes && (
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <div className="w-fit flex gap-1 items-center bg-blue-400 cursor-pointer rounded-full p-2 text-[0.75rem] text-white">
                                                    <LiaHandPointer className="text-[1rem]" />
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Image
                                                            src="/logo.svg"
                                                            height={20}
                                                            width={20}
                                                            alt="logo"
                                                        />
                                                        <h1 className="text-neutral-400">
                                                            @tradejournal.one
                                                        </h1>
                                                    </div>
                                                    <div className="py-2">
                                                        {trade.notes}
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    )}
                                </TableCell>
                                <TableCell className="w-[6%]">
                                    <div className="w-full flex-center">
                                        {[...Array(5)].map((_, i) => (
                                            <MdStar
                                                key={i}
                                                className={`${trade.rating && trade.rating > i
                                                    ? "text-yellow-500"
                                                    : "text-neutral-400"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="w-[4%] text-center">
                                    <EditTrade trade={trade} />
                                </TableCell>
                                <TableCell className="w-[4%] text-center">
                                    <MdDelete
                                        onClick={() =>
                                            handleDeleteTradeRecord(
                                                trade.id,
                                                trade.result,
                                                trade.closeDate
                                            )
                                        }
                                        className="text-[1.2rem] text-sell cursor-pointer mx-auto"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    No trades found using this strategy
                </div>
            )}
        </div>
    );
}