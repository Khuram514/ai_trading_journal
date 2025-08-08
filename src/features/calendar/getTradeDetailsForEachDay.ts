import { Trades } from "@/types";

export function getTradeDetailsForEachDay(data: Trades[]): {
    [key: string]: { result: number; win: number; lost: number };
} {
    return data.reduce(
        (
            acc: {
                [key: string]: { result: number; win: number; lost: number };
            },
            trade
        ) => {
            const closeDate = new Date(trade.closeDate);
            const dateKey = closeDate
                .toLocaleDateString("en-GB")
                .split("/")
                .join("-");
            const result = parseFloat(trade.result);

            if (acc[dateKey]) {
                acc[dateKey] = {
                    result: (acc[dateKey].result += 1),
                    win:
                        result >= 0
                            ? (acc[dateKey].win += 1)
                            : acc[dateKey].win,
                    lost:
                        result < 0
                            ? (acc[dateKey].lost += 1)
                            : acc[dateKey].lost,
                };
            } else {
                acc[dateKey] = {
                    result: 1,
                    win: result >= 0 ? 1 : 0,
                    lost: result < 0 ? 1 : 0,
                };
            }

            return acc;
        },
        {}
    );
}
