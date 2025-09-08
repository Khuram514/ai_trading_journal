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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { sortTrades } from "@/features/history/sortTrades";
import { useAppSelector } from "@/redux/store";
import { Trades } from "@/types";
import { useEffect, useState } from "react";

import { MdDelete, MdStar } from "react-icons/md";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { PiCalendarDotsThin } from "react-icons/pi";

import { getCapital } from "@/server/actions/user";
import { BookOpen, Moon, Sun } from "lucide-react";
import { isInMorningRange } from "@/features/history/isInMorningRange";
import Image from "next/image";
import { FollowedStrategyPie } from "@/components/history/FollowedStrategyPie";
import EditTrade from "@/components/history/EditTrade";
import { useDeleteTrade } from "@/hooks/useDeleteTrade";
import { StrategyRules } from "@/components/trade-dialog/StrategyRules";
import { CustomButton } from "@/components/CustomButton";

const INSTRUMENT_LABELS = [{ name: "Crypto", shortcut: "CRY" }, { name: "Forex", shortcut: "FX" }, { name: "Stock", shortcut: "STO" }, { name: "Index", shortcut: "IDX" }, { name: "Commodity", shortcut: "CMD" }, { name: "Bond", shortcut: "BND" }, { name: "ETF", shortcut: "ETF" }, { name: "Option", shortcut: "OPT" }, { name: "Other", shortcut: "OTHER" }];

export default function Page() {
    const [sortedTrades, setSortedTrades] = useState<Trades[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [startCapital, setStartCapital] = useState<string | null>(null);
    const [strategyDialogOpen, setStrategyDialogOpen] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<Trades | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tradeToDelete, setTradeToDelete] = useState<Trades | null>(null);

    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const filteredTrades = useAppSelector(
        (state) => state.history.filteredTrades
    );

    const sortBy = useAppSelector((state) => state.history.sortBy);
    const timeframe = useAppSelector((state) => state.history.timeframe);
    const { strategies: localStrategies } = useAppSelector(
        (state) => state.strategies
    );

    const { handleDeleteTradeRecord } = useDeleteTrade();

    const tradesToSort = filteredTrades || trades || [];

    useEffect(() => {
        async function fetchData() {
            const response = await getCapital();
            if (response && typeof response === "string") {
                setStartCapital(response);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const result = sortTrades({
            sortBy,
            timeframe,
            tradesToSort,
        });
        // Only calculate total for closed trades (with closeDate)
        const closedTrades = result.filter((trade) => trade.closeDate && trade.closeDate !== "");
        const reducedTotal = closedTrades.reduce(
            (acc, cur) => acc + Number(cur.result || 0),
            0
        );
        setSortedTrades(result);
        setTotal(reducedTotal);
    }, [sortBy, timeframe, trades, filteredTrades]);



    const handleCountPercentage = (trade: Trades) => {
        const appliedCloseRules = trade.appliedCloseRules || [];
        const appliedOpenRules = trade.appliedOpenRules || [];
        const strategy = localStrategies.find(s => s.id === trade.strategyId);
        const totalCloseRulesOverall = strategy?.closePositionRules.length || 0;
        const totalOpenRulesOverall = strategy?.openPositionRules.length || 0;
        const totalRulesOverall = totalCloseRulesOverall + totalOpenRulesOverall;
        const totalRulesFollowed = appliedCloseRules.length + appliedOpenRules.length;
        const percentage = (totalRulesFollowed / totalRulesOverall) * 100;
        return percentage;
    };

    const getInstrumentLabel = (instrument: string | undefined) => {
        if (!instrument) return "OTHER";
        return INSTRUMENT_LABELS.find(label => label.name === instrument)?.shortcut;
    };

    const handleStrategyClick = (trade: Trades) => {
        setSelectedTrade(trade);
        setStrategyDialogOpen(true);
    };

    const closedTrades = sortedTrades.filter((trade): trade is Trades & { closeDate: string; closeTime: string; result: string } =>
        Boolean(trade.closeDate && trade.closeDate !== "" &&
            trade.closeTime && trade.closeTime !== "" &&
            trade.result && trade.result !== "")
    );

    if (closedTrades.length === 0) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-500">
                No closed trades found - complete some trades to see history
            </div>
        );
    }

    return (
        <div className="flex flex-col md:h-full">
            {/* Grid Header */}
            <div className="grid grid-cols-40 max-md:grid-cols-20 gap-1 p-4 border-b bg-muted/50 font-medium text-sm">
                <div className="col-span-2 text-left">Symbol</div>
                <div className="col-span-2 max-md:hidden text-center">Instrument</div>
                <div className="col-span-2 max-md:hidden text-center">Type</div>
                <div className="col-span-4 max-md:col-span-5 text-center">Open date</div>
                <div className="col-span-2 max-md:hidden text-center">Open time</div>
                <div className="col-span-4 max-md:col-span-5 text-center">Close date</div>
                <div className="col-span-2 max-md:hidden text-center">Close time</div>
                <div className="col-span-4 max-md:hidden text-center">Open/Close price</div>
                <div className="col-span-2 max-md:hidden text-center">Quantity</div>
                <div className="col-span-3 max-md:hidden text-center">
                    Deposit{" "}
                    <p className="text-[.75rem]">(% of capital)</p>
                </div>
                <div className="col-span-2 max-md:col-span-3 text-center">Result</div>
                <div className="col-span-2 max-md:col-span-3 text-center">Cost</div>
                <div className="col-span-2 max-md:col-span-2 text-center">Strategy</div>
                <div className="col-span-4 max-md:col-span-4 text-center">Rating</div>
                <div className="col-span-1 max-md:hidden text-center">Note</div>
                <div className="col-span-1 max-md:col-span-1 text-center">Edit</div>
                <div className="col-span-1 max-md:col-span-1 text-center">Delete</div>
            </div>
            {/* Grid Body */}
            <div className="flex-1 overflow-auto">
                {closedTrades.map((trade) => (
                    <div key={trade.id}
                        className="grid grid-cols-40 max-md:grid-cols-20 gap-1 p-4 border-b hover:bg-muted/30 transition-colors items-center">

                        {/* Symbol */}
                        <div className="col-span-2 truncate">
                            {trade.instrumentName}
                        </div>

                        {/* Instrument */}
                        <div className="col-span-2 max-md:hidden text-center">
                            <div className="border border-zinc-300 rounded-md px-2 py-1 text-xs inline-block">
                                {getInstrumentLabel(trade.symbolName)}
                            </div>
                        </div>

                        {/* Type */}
                        <div className="col-span-2 max-md:hidden text-center">
                            <p className={`bg-${trade.positionType === "sell" ? "sell" : "buy"} 
                                         w-fit px-2 py-1 rounded-md text-white text-xs mx-auto`}>
                                {trade.positionType}
                            </p>
                        </div>

                        {/* Open Date */}
                        <div className="col-span-4 max-md:col-span-5 text-center text-neutral-500">
                            <div className="flex gap-1 items-center justify-center">
                                <PiCalendarDotsThin className="max-md:hidden" />
                                <span className="text-xs">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(trade.openDate))}
                                </span>
                            </div>
                        </div>

                        {/* Open Time */}
                        <div className="col-span-2 max-md:hidden text-center text-neutral-500">
                            <div className="flex gap-1 items-center justify-center">
                                {isInMorningRange(trade.openTime) ? (
                                    <Sun className="h-3 w-3" />
                                ) : (
                                    <Moon className="h-3 w-3" />
                                )}
                                <span className="text-xs">{trade.openTime}</span>
                            </div>
                        </div>

                        {/* Close Date */}
                        <div className="col-span-4 max-md:col-span-5 text-center text-neutral-500">
                            <div className="flex gap-1 items-center justify-center">
                                <PiCalendarDotsThin className="max-md:hidden" />
                                <span className="text-xs">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(trade.closeDate))}
                                </span>
                            </div>
                        </div>

                        {/* Close Time */}
                        <div className="col-span-2 max-md:hidden text-center text-neutral-500">
                            <div className="flex gap-1 items-center justify-center">
                                {isInMorningRange(trade.closeTime) ? (
                                    <Sun className="h-3 w-3" />
                                ) : (
                                    <Moon className="h-3 w-3" />
                                )}
                                <span className="text-xs">{trade.closeTime}</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-4 max-md:hidden text-center text-sm">
                            {trade.entryPrice} / {trade.sellPrice}
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 max-md:hidden text-center text-sm">
                            {trade.quantity}
                        </div>

                        {/* Deposit */}
                        <div className="col-span-3 max-md:hidden">
                            <div className="flex flex-col gap-1 text-center">
                                <span className="text-sm font-medium">
                                    {Number(trade.deposit).toLocaleString("de-DE")}
                                </span>
                                <span className="text-sm text-neutral-400">
                                    ({startCapital && +startCapital !== 0
                                        ? `${Math.round((Number(trade.deposit) / Number(startCapital)) * 100)}%`
                                        : "no capital"})
                                </span>
                            </div>
                        </div>

                        {/* Result */}
                        <div className={`col-span-2 max-md:col-span-3 text-center ${Number(trade.result) >= 0 ? "text-buy" : "text-sell"}`}>
                            <div className="flex gap-1 items-center justify-center">
                                {Number(trade.result) >= 0 ? (
                                    <FaArrowTrendUp className="text-sm" />
                                ) : (
                                    <FaArrowTrendDown className="text-sm" />
                                )}
                                <span className="text-sm font-medium">
                                    {Number(trade.result).toLocaleString("de-DE")}
                                </span>
                            </div>
                        </div>

                        {/* Cost */}
                        <div className="col-span-2 max-md:col-span-3 text-center text-xs">
                            {trade.totalCost}
                        </div>

                        {/* Strategy */}
                        <div className="col-span-2 max-md:col-span-2 text-center">
                            {(startCapital &&
                                ((trade.appliedCloseRules && trade.appliedCloseRules.length > 0) ||
                                    (trade.appliedOpenRules && trade.appliedOpenRules.length > 0))) && (
                                    <div onClick={() => handleStrategyClick(trade)} className="cursor-pointer">
                                        <FollowedStrategyPie percentage={handleCountPercentage(trade)} />
                                    </div>
                                )}
                        </div>

                        {/* Rating */}
                        <div className="col-span-4 max-md:col-span-4 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <MdStar
                                        key={i}
                                        className={`text-sm ${trade.rating && trade.rating > i
                                            ? "text-yellow-500"
                                            : "text-neutral-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <div className="col-span-1 max-md:hidden text-center">
                            {trade.notes && (
                                <HoverCard>
                                    <HoverCardTrigger className="flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-gray-600 hover:text-gray-800 cursor-pointer" />
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
                        </div>

                        {/* Edit */}
                        <div className="col-span-1 max-md:col-span-1 text-center">
                            <EditTrade trade={trade} />
                        </div>

                        {/* Delete */}
                        <div className="col-span-1 max-md:col-span-1 text-center">
                            <MdDelete
                                onClick={() => {
                                    setTradeToDelete(trade);
                                    setDeleteDialogOpen(true);
                                }}
                                className="text-lg text-sell cursor-pointer hover:text-red-600 transition-colors mx-auto"
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/* Grid Footer */}
            <div className="sticky bottom-0 right-0 left-0 bg-white w-full border-t p-4 mt-auto">
                <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>{total.toLocaleString("de-DE")}</span>
                </div>
            </div>

            {/* Strategy Rules Dialog */}
            <Dialog open={strategyDialogOpen} onOpenChange={setStrategyDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Applied Strategy Rules - {selectedTrade && localStrategies.find(s => s.id === selectedTrade.strategyId)?.strategyName}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedTrade && selectedTrade.strategyId && (
                        <StrategyRules
                            strategy={localStrategies.find(s => s.id === selectedTrade.strategyId)!}
                            checkedOpenRules={selectedTrade.appliedOpenRules?.map(rule => rule.id) || []}
                            checkedCloseRules={selectedTrade.appliedCloseRules?.map(rule => rule.id) || []}
                            onOpenRuleToggle={() => { }} // Disabled for display-only
                            onCloseRuleToggle={() => { }} // Disabled for display-only
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Trade Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-sm">
                    <div className="sm:max-w-[380px] flex flex-col justify-between min-h-[120px]">
                        <DialogHeader className="mb-2">
                            <DialogTitle className="text-lg">
                                Delete Trade
                            </DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-zinc-600">
                            Do you want to delete this trade{tradeToDelete ? ` "${tradeToDelete.instrumentName}"` : ""}?
                        </p>
                        <div className="flex gap-6 justify-end mt-6">
                            <DialogClose asChild>
                                <CustomButton isBlack={false}>
                                    Cancel
                                </CustomButton>
                            </DialogClose>
                            <CustomButton
                                isBlack
                                onClick={async () => {
                                    if (tradeToDelete && tradeToDelete.result && tradeToDelete.closeDate) {
                                        await handleDeleteTradeRecord(
                                            tradeToDelete.id,
                                            tradeToDelete.result,
                                            tradeToDelete.closeDate
                                        );
                                    }
                                    setDeleteDialogOpen(false);
                                    setTradeToDelete(null);
                                }}
                            >
                                Delete
                            </CustomButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
