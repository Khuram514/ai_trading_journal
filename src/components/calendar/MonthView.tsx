"use client";
import { getMonth } from "@/features/calendar/getTime";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import dayjs from "dayjs";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import CustomDialogContent from "./CustomDialogContent";

import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { setIsDialogOpen } from "@/redux/slices/calendarSlice";

export default function MonthView() {
    const { month, year } = useAppSelector((state) => state.calendar.monthView);
    const trades = useAppSelector(
        (state) => state.tradeRecords.monthViewSummary
    );
    const isDialogOpen = useAppSelector((state) => state.calendar.isDialogOpen);

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
                                        className={`relative border-[0.5px] ${
                                            trades[day.format("DD-MM-YYYY")] !==
                                            undefined
                                                ? "border-white"
                                                : "border-zinc-200"
                                        }  flex flex-col items-center ${
                                            trades[day.format("DD-MM-YYYY")] !==
                                            undefined
                                                ? trades[
                                                      day.format("DD-MM-YYYY")
                                                  ] > 0
                                                    ? "bg-buyWithOpacity"
                                                    : "bg-sellWithOpacity"
                                                : ""
                                        }`}>
                                        {i === 0 && <p>{day.format("ddd")}</p>}

                                        <p
                                            className={`${
                                                day.format("DD-MM-YY") ===
                                                dayjs().format("DD-MM-YY")
                                                    ? "w-8 h-8 flex-center rounded-full bg-[var(--customBlue)]"
                                                    : "pt-[4px]"
                                            }`}>
                                            {day.date() === 1
                                                ? day.format("MMM D")
                                                : day.format("D")}
                                        </p>
                                        {trades[day.format("DD-MM-YYYY")] !==
                                            undefined && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 items-center">
                                                {trades[
                                                    day.format("DD-MM-YYYY")
                                                ] >= 0 ? (
                                                    <FaArrowTrendUp className="text-buy max-md:hidden" />
                                                ) : (
                                                    <FaArrowTrendDown className="text-sell max-md:hidden" />
                                                )}
                                                <p
                                                    className={`md:text-[1rem] pt-4 md:pt-0 ${
                                                        trades[
                                                            day.format(
                                                                "DD-MM-YYYY"
                                                            )
                                                        ] >= 0
                                                            ? "text-buy"
                                                            : "text-sell"
                                                    }`}>
                                                    {trades[
                                                        day.format("DD-MM-YYYY")
                                                    ].toLocaleString("de-DE")}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-md:h-full">
                                    <CustomDialogContent day={day} />
                                </DialogContent>
                            </Dialog>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
