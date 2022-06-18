import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface LocalState {
	backgroundColor: string;
	numberOfFriends: number;
}

const initialState: LocalState = {
	backgroundColor: "#E6E6FA",
	numberOfFriends: 10,
};

export const localStateSlice = createSlice({
	name: "localState",
	initialState,
	reducers: {
		incrementNumberOfFriendsByAmount(state, action: PayloadAction<number>) {
			state.numberOfFriends += action.payload;
		},
		setBackgroundColor(state, action: PayloadAction<string>) {
			state.backgroundColor = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { incrementNumberOfFriendsByAmount, setBackgroundColor } =
	localStateSlice.actions;

// Selectors
export const numberOfFriendsSelector = (state: RootState) =>
	state.localState.numberOfFriends;
export const backgroundColorSelector = (state: RootState) =>
	state.localState.backgroundColor;

export default localStateSlice.reducer;
