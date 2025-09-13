"use client";
import { getMonth } from "@/features/calendar/getTime";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

import { setIsDialogOpen } from "@/redux/slices/calendarSlice";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { TradeDialog } from "../trade-dialog";
import { LiaHandPointer } from "react-icons/lia";

export default function MonthView() {
    const { month, year } = useAppSelector((state) => state.calendar.monthView);
    const trades = useAppSelector(
        (state) => state.tradeRecords.monthViewSummary
    );
    const isDialogOpen = useAppSelector((state) => state.calendar.isDialogOpen);

    const tradeDetailsForEachDay = useAppSelector(
        (state) => state.tradeRecords.tradeDetailsForEachDay
    );
    const allTrades = useAppSelector((state) => state.tradeRecords.listOfTrades) ?? [];

    const currentMonth = getMonth(month, year);

    const dispatch = useAppDispatch();

    const toggleDialog = (dayKey: string, open: boolean) => {
        dispatch(setIsDialogOpen({ key: dayKey, value: open }));
    };

    console.log(trades);

    return (
        <div
            className={`grid grid-cols-7 grid-rows-${currentMonth.length} h-full w-full`}>
            {currentMonth.map((week, i) => (
                <div key={i} className="grid grid-cols-7 col-span-7 row-span-1">
                    {week.map((day, j) => {
                        const dayKey = day.format("DD-MM-YYYY");
                        return (
                            <Dialog
                                key={j}
                                open={!!isDialogOpen[dayKey]}
                                onOpenChange={(open) =>
                                    toggleDialog(dayKey, open)
                                }>
                                <DialogTrigger asChild>
                                    <div
                                        className={`relative cursor-pointer border-[0.5px] ${
                                            // Check if there are trades for this day
                                            tradeDetailsForEachDay[day.format("DD-MM-YYYY")] !== undefined
                                                ? "border-white"
                                                : "border-zinc-200"
                                            }  flex flex-col items-center ${
                                            // Show styling only if trades exist for this day
                                            tradeDetailsForEachDay[day.format("DD-MM-YYYY")] !== undefined
                                                ? trades[day.format("DD-MM-YYYY")] !== undefined
                                                    ? trades[day.format("DD-MM-YYYY")] > 0
                                                        ? "bg-buyWithOpacity"
                                                        : trades[day.format("DD-MM-YYYY")] < 0
                                                            ? "bg-sellWithOpacity"
                                                            : "bg-neutral-100"
                                                    : "bg-neutral-100" // trades sum to 0 but trades exist
                                                : "" // no trades at all
                                            }`}>
                                        {i === 0 && <p>{day.format("ddd")}</p>}

                                        <p
                                            className={`${day.format("DD-MM-YY") ===
                                                dayjs().format("DD-MM-YY")
                                                ? "w-8 h-8 flex-center rounded-full bg-[var(--customBlue)]"
                                                : "pt-[4px]"
                                                }`}>
                                            {day.date() === 1
                                                ? day.format("MMM D")
                                                : day.format("D")}
                                        </p>
                                        {tradeDetailsForEachDay[day.format("DD-MM-YYYY")] !== undefined && (
                                            <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex md:hidden gap-2 items-center">
                                                <p
                                                    className={`md:text-[1rem] pt-4 md:pt-0 ${trades[day.format("DD-MM-YYYY")] !== undefined
                                                        ? trades[day.format("DD-MM-YYYY")] > 0
                                                            ? "text-buy"
                                                            : trades[day.format("DD-MM-YYYY")] < 0
                                                                ? "text-sell"
                                                                : "text-neutral-600"
                                                        : "text-neutral-600" // fallback when trades sum to 0
                                                        }`}>
                                                    {trades[day.format("DD-MM-YYYY")] !== undefined
                                                        ? trades[day.format("DD-MM-YYYY")].toLocaleString("de-DE")
                                                        : "0"
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {tradeDetailsForEachDay[
                                            day.format("DD-MM-YYYY")
                                        ] !== undefined && (
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <div
                                                            className={`absolute bottom-2 left-1/2 -translate-x-1/2 hidden md:flex gap-4 items-center justify-start py-1 px-3 2xl:px-6 rounded-full calendar-banner-shadow bg-white/70`}
                                                        >
                                                            <LiaHandPointer className="text-[.9rem]" />
                                                            <div className="text-[.8rem] flex items-center gap-2">
                                                                <DollarSign size={12} className="text-zinc-500" />
                                                                {trades[day.format("DD-MM-YYYY")] !== undefined
                                                                    ? trades[day.format("DD-MM-YYYY")].toLocaleString("de-DE")
                                                                    : "0"}
                                                            </div>
                                                            <div className="text-[.8rem] flex items-center gap-2">
                                                                <ArrowUp size={12} className="text-zinc-500" />
                                                                {tradeDetailsForEachDay[day.format("DD-MM-YYYY")].win}
                                                            </div>
                                                            <div className="text-[.8rem] flex items-center gap-2">
                                                                <ArrowDown size={12} className="text-zinc-500" />
                                                                {tradeDetailsForEachDay[day.format("DD-MM-YYYY")].lost}
                                                            </div>
                                                        </div>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-[420px]">
                                                        <div className="mb-2 text-xs text-zinc-500">
                                                            Trades on {day.format("ddd, DD MMM YYYY")}
                                                        </div>
                                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                                            {allTrades.filter(t => dayjs(t.closeDate).format("DD-MM-YYYY") === day.format("DD-MM-YYYY")).map((t) => (
                                                                <div key={t.id} className="flex items-center justify-between px-3 py-2 [&:not(:first-child)]:border-t border-zinc-200">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className={`text-xs px-2 py-0.5 rounded-md text-white ${t.positionType === "sell" ? "bg-sell" : "bg-buy"}`}>{t.positionType}</span>
                                                                        <span className="text-sm text-zinc-700">{t.symbolName}</span>
                                                                    </div>
                                                                    <div className="text-sm">
                                                                        <span className="text-zinc-500 text-xs mr-1">Deposit:</span>
                                                                        {Number(t.deposit).toLocaleString("de-DE")}
                                                                    </div>
                                                                    <div className={`text-sm ${Number(t.result) >= 0 ? "text-buy" : "text-sell"}`}>
                                                                        <span className="text-zinc-500 text-xs mr-1">Result:</span>
                                                                        {Number(t.result ?? 0).toLocaleString("de-DE")}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            )}
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-md:h-full">
                                    <TradeDialog day={day} />
                                </DialogContent>
                            </Dialog>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
