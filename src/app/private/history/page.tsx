"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { sortTrades } from "@/features/history/sortTrades";
import { useAppSelector } from "@/redux/store";
import { Trades } from "@/types";
import { useEffect, useState } from "react";

import { getCapital } from "@/server/actions/user";
import { Expand } from "lucide-react";
import { OpenTradesTable } from "@/components/history/OpenTradesTable";
import { CloseTradesTable } from "@/components/history/CloseTradesTable";


export default function Page() {
    const [sortedTrades, setSortedTrades] = useState<Trades[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [startCapital, setStartCapital] = useState<string | null>(null);
    const [openTradesDialogOpen, setOpenTradesDialogOpen] = useState(false);

    const trades = useAppSelector((state) => state.tradeRecords.listOfTrades);
    const filteredTrades = useAppSelector(
        (state) => state.history.filteredTrades
    );

    const sortBy = useAppSelector((state) => state.history.sortBy);
    const timeframe = useAppSelector((state) => state.history.timeframe);

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



    const closedTrades = sortedTrades.filter((trade): trade is Trades & { closeDate: string; closeTime: string; result: string } =>
        Boolean(trade.closeDate && trade.closeDate !== "" &&
            trade.closeTime && trade.closeTime !== "" &&
            trade.result && trade.result !== "")
    );

    const openTrades = sortedTrades.filter((trade) =>
        Boolean(!trade.closeDate || trade.closeDate === "")
    );

    if (closedTrades.length === 0 && openTrades.length === 0) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-500">
                No trades found - complete some trades to see history
            </div>
        );
    }
    console.log("sortedTrades", sortedTrades);
    console.log("closedTrades", closedTrades);
    console.log("openTrades", openTrades);

    return (
        <>
            <div>

                {openTrades.length > 0 && (
                    <>
                        <div className="flex flex-col items-center justify-center relative">

                            <h1 className="text-xl font-medium text-neutral-500 text-center my-4">Open Trades</h1>
                            <Expand onClick={() => setOpenTradesDialogOpen(true)} className="absolute right-4 top-4 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors" />
                        </div>
                        <OpenTradesTable trades={openTrades} startCapital={startCapital} />
                    </>
                )}
                {closedTrades.length > 0 && (
                    <>
                        <h1 className="text-xl font-medium text-neutral-500 text-center my-4">Closed Trades</h1>
                        <CloseTradesTable trades={closedTrades} startCapital={startCapital} total={total} />
                    </>)}
            </div>

            {/* Full-screen Open Trades Dialog */}
            <Dialog open={openTradesDialogOpen} onOpenChange={setOpenTradesDialogOpen}>
                <DialogTitle className="text-center hidden">Open Trades</DialogTitle>
                <DialogContent className="w-[90%] max-w-none p-0 md:border-0 md:rounded-md py-4 px-8">
                    <div className="flex flex-col h-full">
                        <div className="flex-1">
                            <OpenTradesTable trades={openTrades} startCapital={startCapital} heightClass="h-full" />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    );
}
