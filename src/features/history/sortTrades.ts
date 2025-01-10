import { Trades, sortTradesFunctionType } from "@/types";

function timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

export const sortTrades = ({
    sortBy = "closeDate",
    timeframe = "allHistory",
    tradesToSort,
}: sortTradesFunctionType): Trades[] => {
    const now = new Date();
    let filtered: Trades[] = tradesToSort;

    if (timeframe !== "allHistory") {
        filtered = tradesToSort.filter((trade) => {
            const closeDate = new Date(trade.closeDate);

            switch (timeframe) {
                case "today": {
                    return (
                        closeDate.getDate() === now.getDate() &&
                        closeDate.getMonth() === now.getMonth() &&
                        closeDate.getFullYear() === now.getFullYear()
                    );
                }

                case "thisWeek": {
                    const oneWeekAgo = new Date(now);
                    oneWeekAgo.setDate(now.getDate() - 7);
                    return closeDate >= oneWeekAgo && closeDate <= now;
                }

                case "thisMonth": {
                    const startOfMonth = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        1
                    );
                    return closeDate >= startOfMonth && closeDate <= now;
                }
            }
        });
    }
    const sortedTrades = [...filtered].sort((a, b) => {
        switch (sortBy) {
            case "instrumentName":
            case "positionType":
                return a[sortBy].localeCompare(b[sortBy]);

            case "openDate":
            case "closeDate": {
                // First compare the closeDate
                const compareDates =
                    new Date(b[sortBy]).getTime() -
                    new Date(a[sortBy]).getTime();

                // If they differ, return the date comparison
                if (compareDates !== 0) {
                    return compareDates;
                }

                // Otherwise, compare by closeTime
                return (
                    timeStringToMinutes(
                        b[sortBy === "openDate" ? "openTime" : "closeTime"]
                    ) -
                    timeStringToMinutes(
                        a[sortBy === "openDate" ? "openTime" : "closeTime"]
                    )
                );
            }
            case "result":
                return Number(b[sortBy]) - Number(a[sortBy]);

            default:
                return 0;
        }
    });

    return sortedTrades;
};
