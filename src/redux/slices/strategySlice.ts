import { Rule } from "@/types/dbSchema.types";
import { createSlice } from "@reduxjs/toolkit";

type Strategy = {
    id: string;
    userId: string;
    strategyName: string;
    openPositionRules: Rule[];
    closePositionRules: Rule[];
};

type strategyState = {
    strategies: Strategy[] | undefined;
};

const initialState: strategyState = {
    strategies: undefined,
};

const strategiesSlice = createSlice({
    name: "statistics",
    initialState,
    reducers: {
        addStrategyToTheState: (state, action) => {
            state.strategies?.push(action.payload);
        },
    },
});

export const { addStrategyToTheState } = strategiesSlice.actions;

export default strategiesSlice.reducer;
