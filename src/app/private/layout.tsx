"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import Image from "next/image";

import { getAllTradeRecords } from "@/server/actions/trades";
import { getTradeSummary } from "@/features/calendar/getTradeSummary";
import { useAppDispatch } from "@/redux/store";
import {
    setInitialMonthViewSummary,
    setInitialTotalOfParticularYearSummary,
    setInitialYearViewSummary,
    setListOfTrades,
} from "@/redux/slices/tradeRecordsSlice";
import { useEffect } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function fetchData() {
            const response = await getAllTradeRecords();
            dispatch(setListOfTrades(response));

            let monthViewTrades = getTradeSummary("day", response);

            dispatch(setInitialMonthViewSummary(monthViewTrades));
            let yearViewTrades = getTradeSummary("month", response);

            dispatch(setInitialYearViewSummary(yearViewTrades));
            let particularYearTrades = getTradeSummary("year", response);
            console.log("particular-year-view", particularYearTrades);

            dispatch(
                setInitialTotalOfParticularYearSummary(particularYearTrades)
            );
        }
        fetchData();
    }, []);

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="flex flex-col h-screen bg-primary p-2">
                <header className="px-3 md:px-6 py-3 flex items-center justify-between bg-white rounded-t-3xl border border-zinc-200">
                    <div className="flex gap-2 items-center">
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={30}
                            height={30}
                        />
                        <p className="font-semibold text-[1rem] max-md:hidden">
                            Journal
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex gap-1 nav-link items-center">
                            {/* <CalendarDays /> */}
                            <Link href="/private/calendar">
                                <p className="leading-none">Calendar</p>
                            </Link>
                        </div>
                        <div className="flex gap-1 nav-link items-center">
                            {/* <History /> */}
                            <Link href="/private/history">
                                <p className="leading-none">History</p>
                            </Link>
                        </div>
                        <div className="flex gap-1 nav-link items-center">
                            {/* <ChartLine /> */}
                            <Link href="/private/statistics">
                                <p className="leading-none">Statistics</p>
                            </Link>
                        </div>
                        {/* <div className="flex gap-1 nav-link items-center">
                       
                            <Link href="/private/tradeAI">
                                <p className="leading-none">TradeAI</p>
                            </Link>
                        </div> */}
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="max-md:hidden">
                            Hi,{" "}
                            {user
                                ? user.firstName ??
                                  (user.username ?? "")
                                      .charAt(0)
                                      .toLocaleUpperCase() +
                                      (user.username ?? "").slice(1)
                                : ""}
                        </p>
                        <UserButton />
                    </div>
                </header>
                <div className="flex-1 bg-white rounded-b-3xl border border-zinc-200 border-t-0 md:overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}
