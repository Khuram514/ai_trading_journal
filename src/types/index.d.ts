export type Trades = {
    notes: string | undefined;
    id: string;
    result: string;
    openDate: string;
    closeDate: string;
    positionType: string;
    openTime: string;
    closeTime: string;
    deposit: string;
    instrumentName: string;
};

export type SortByType =
    | "instrumentName"
    | "positionType"
    | "openDate"
    | "closeDate"
    | "result";

export type TimeframeType = "allHistory" | "today" | "thisWeek" | "thisMonth";
export type sortTradesFunctionType = {
    sortBy?: SortByType;
    timeframe?: TimeframeType;
    tradesToSort: Trades[];
};
