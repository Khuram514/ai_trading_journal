import { getAllTradeRecords } from "@/server/actions/trades";
import { getTradeSummary } from "@/features/calendar/getTradeSummary";
import PrivateLayoutClient from "@/components/private-layout/PrivateLayoutClient";

export default async function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const tradeRecords = await getAllTradeRecords();

    const monthViewTrades = getTradeSummary("day", tradeRecords);
    const yearViewTrades = getTradeSummary("month", tradeRecords);
    const particularYearTrades = getTradeSummary("year", tradeRecords);

    return (
        <PrivateLayoutClient
            initialTradeRecords={tradeRecords}
            initialMonthViewTrades={monthViewTrades}
            initialYearViewTrades={yearViewTrades}
            initialParticularYearTrades={particularYearTrades}>
            {children}
        </PrivateLayoutClient>
    );
}
