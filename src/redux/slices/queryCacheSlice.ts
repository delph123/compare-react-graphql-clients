import { QueryResult } from "@apollo/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type QueryCacheState = Record<string, QueryResult>;

interface CacheResult {
	queryId: string;
	result: QueryResult;
}

const initialState: QueryCacheState = {};

export const queryCacheSlice = createSlice({
	name: "queryCache",
	initialState,
	reducers: {
		addToCache(
			state,
			{ payload: { queryId, result } }: PayloadAction<CacheResult>
		) {
			state[queryId] = result as any;
		},
	},
});

// Action creators are generated for each case reducer function
export const { addToCache } = queryCacheSlice.actions;

// Selectors
export const queryCacheSelector = (state: RootState) => state.queryCache;

export default queryCacheSlice.reducer;
