import { Strategy } from "@/types/strategies.types";
import { createSlice } from "@reduxjs/toolkit";

type strategyState = {
    strategies: Strategy[];
};

const initialState: strategyState = {
    strategies: [],
};

const strategiesSlice = createSlice({
    name: "strategies",
    initialState,
    reducers: {
        setStrategyState: (state, action) => {
            state.strategies = action.payload;
        },
        addStrategyToTheState: (state, action) => {
            state.strategies.push(action.payload);
        },
        deleteLocalStrategy: (state, action) => {
            const { id } = action.payload;

            state.strategies = state.strategies.filter(
                (strategy) => strategy.id !== id
            );
        },
    },
});

export const { setStrategyState, addStrategyToTheState, deleteLocalStrategy } =
    strategiesSlice.actions;

export default strategiesSlice.reducer;
