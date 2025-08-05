import { getAllTradeRecords } from "@/server/actions/trades";
import { getAllStrategies } from "@/server/actions/strategies";
import { getTradeSummary } from "@/features/calendar/getTradeSummary";
import PrivateLayoutClient from "@/components/private-layout/PrivateLayoutClient";
import { getTradeDetailsForEachDay } from "@/features/calendar/getTradeDetailsForEachDay";
import { auth } from "@clerk/nextjs/server";
import { Strategy } from "@/types/strategies.types";

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    const tradeRecords = await getAllTradeRecords();

    // Load strategies alongside trades
    let strategies: Strategy[] = [];
    if (userId) {
        const strategiesResult = await getAllStrategies(userId);
        if (strategiesResult && "strategies" in strategiesResult) {
            strategies = strategiesResult.strategies;
        }
    }

    const monthViewTrades = getTradeSummary("day", tradeRecords);
    const yearViewTrades = getTradeSummary("month", tradeRecords);
    const particularYearTrades = getTradeSummary("year", tradeRecords);
    const tradeDetailsForEachDay = getTradeDetailsForEachDay(tradeRecords);

    return (
        <PrivateLayoutClient
            initialTradeRecords={tradeRecords}
            initialStrategies={strategies}
            initialMonthViewTrades={monthViewTrades}
            initialYearViewTrades={yearViewTrades}
            initialParticularYearTrades={particularYearTrades}
            initialTradeDetailsForEachDay={tradeDetailsForEachDay}>
            {children}
        </PrivateLayoutClient>
    );
}