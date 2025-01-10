import { SortByType, TimeframeType, Trades } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type documentState = {
    filteredTrades: Trades[] | undefined;
    sortBy: SortByType | undefined;
    timeframe: TimeframeType | undefined;
};

const initialState: documentState = {
    filteredTrades: undefined,
    sortBy: undefined,
    timeframe: undefined,
};

const historyPageSlice = createSlice({
    name: "historyPage",
    initialState,
    reducers: {
        setFilteredTrades: (state, action) => {
            state.filteredTrades = action.payload;
        },
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },
        setTimeframe: (state, action) => {
            state.timeframe = action.payload;
        },
    },
});

export const { setFilteredTrades, setSortBy, setTimeframe } =
    historyPageSlice.actions;

export default historyPageSlice.reducer;
