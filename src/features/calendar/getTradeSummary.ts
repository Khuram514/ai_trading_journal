import { Trades } from "@/types";

export function getTradeSummary(
    groupBy: "day" | "month" | "year" | "total",
    data: Trades[]
): { [key: string]: number } {
    return data.reduce((acc: { [key: string]: number }, trade) => {
        const closeDate = new Date(trade.closeDate);
        let dateKey: string;
        if (groupBy === "year") {
            dateKey = closeDate.getFullYear().toString();
        } else if (groupBy === "month") {
            const month = (closeDate.getMonth() + 1).toString();
            const year = closeDate.getFullYear().toString();
            dateKey = `${month}-${year}`;
        } else if (groupBy === "day") {
            dateKey = closeDate
                .toLocaleDateString("en-GB")
                .split("/")
                .join("-");
        } else {
            dateKey = "total";
        }

        const result = parseFloat(trade.result);

        if (acc[dateKey]) {
            acc[dateKey] += result;
        } else {
            acc[dateKey] = result;
        }

        return acc;
    }, {});
}
