import { getAllTradeRecords } from "@/server/actions/trades";
import { getTradeSummary } from "@/features/calendar/getTradeSummary";
import PrivateLayoutClient from "@/components/private-layout/PrivateLayoutClient";
import { getTradeDetailsForEachDay } from "@/features/calendar/getTradeDetailsForEachDay";

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tradeRecords = await getAllTradeRecords();

    const monthViewTrades = getTradeSummary("day", tradeRecords);
    const yearViewTrades = getTradeSummary("month", tradeRecords);
    const particularYearTrades = getTradeSummary("year", tradeRecords);
    const tradeDetailsForEachDay = getTradeDetailsForEachDay(tradeRecords);

    return (
        <PrivateLayoutClient
            initialTradeRecords={tradeRecords}
            initialMonthViewTrades={monthViewTrades}
            initialYearViewTrades={yearViewTrades}
            initialParticularYearTrades={particularYearTrades}
            initialTradeDetailsForEachDay={tradeDetailsForEachDay}>
            {children}
        </PrivateLayoutClient>
    );
}
