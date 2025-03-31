import { Trades } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type documentState = {
    listOfTrades: Trades[] | undefined;
    monthViewSummary: { [key: string]: number };
    yearViewSummary: { [key: string]: number };
    totalOfParticularYearSummary: { [key: string]: number };
};

const initialState: documentState = {
    listOfTrades: undefined,
    monthViewSummary: {},
    yearViewSummary: {},
    totalOfParticularYearSummary: {},
};

const tradeRecordsSlice = createSlice({
    name: "tradeRecords",
    initialState,
    reducers: {
        setListOfTrades: (state, action) => {
            state.listOfTrades = action.payload;
        },
        updateListOfTrades: (state, action) => {
            if (state.listOfTrades !== undefined) {
                const newRecord = action.payload;
                const newRecordTime = new Date(newRecord.closeDate).getTime();

                let left = 0;
                let right = state.listOfTrades.length - 1;
                let insertionIndex = state.listOfTrades.length;

                while (left <= right) {
                    const mid = Math.floor((left + right) / 2);
                    const midTime = new Date(
                        state.listOfTrades[mid].closeDate
                    ).getTime();

                    if (midTime < newRecordTime) {
                        left = mid + 1;
                    } else {
                        insertionIndex = mid;
                        right = mid - 1;
                    }
                }
                state.listOfTrades.splice(insertionIndex, 0, newRecord);
            }
        },
        removeRecordFromListOfTrades: (state, action) => {
            if (state.listOfTrades !== undefined) {
                state.listOfTrades = state.listOfTrades.filter(
                    (trade) => trade.id !== action.payload
                );
            }
        },
        setInitialMonthViewSummary: (state, action) => {
            state.monthViewSummary = action.payload;
        },
        setMonthViewSummary: (state, action) => {
            const { month, value } = action.payload;
            if (state.monthViewSummary[month] !== undefined) {
                state.monthViewSummary[month] += value;
            } else {
                state.monthViewSummary[month] = value;
            }
            if (state.monthViewSummary[month] === 0) {
                delete state.monthViewSummary[month];
            }
        },
        setInitialYearViewSummary: (state, action) => {
            state.yearViewSummary = action.payload;
        },
        setYearViewSummary: (state, action) => {
            const { year, value } = action.payload;
            if (state.yearViewSummary[year] !== undefined) {
                state.yearViewSummary[year] += value;
            } else {
                state.yearViewSummary[year] = value;
            }
            if (state.yearViewSummary[year] === 0) {
                delete state.yearViewSummary[year];
            }
        },
        setInitialTotalOfParticularYearSummary: (state, action) => {
            state.totalOfParticularYearSummary = action.payload;
        },
        setTotalOfParticularYearSummary: (state, action) => {
            const { year, value } = action.payload;
            if (state.totalOfParticularYearSummary[year] !== undefined) {
                state.totalOfParticularYearSummary[year] += value;
            } else {
                state.totalOfParticularYearSummary[year] = value;
            }
            if (state.totalOfParticularYearSummary[year] === 0) {
                delete state.totalOfParticularYearSummary[year];
            }
        },
    },
});

export const {
    setListOfTrades,
    updateListOfTrades,
    removeRecordFromListOfTrades,
    setInitialMonthViewSummary,
    setMonthViewSummary,
    setInitialYearViewSummary,
    setYearViewSummary,
    setInitialTotalOfParticularYearSummary,
    setTotalOfParticularYearSummary,
} = tradeRecordsSlice.actions;

export default tradeRecordsSlice.reducer;
