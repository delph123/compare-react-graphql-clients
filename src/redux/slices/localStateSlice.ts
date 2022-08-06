import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsParameters } from "../../component/SettingsDialog";
import { RootState } from "../store";

export type Sides = "left" | "middle" | "right";

export interface LocalState {
	backgroundColor: string;
	numberOfFriends: number;
	usersSettings: {
		left: SettingsParameters;
		middle: SettingsParameters;
		right: SettingsParameters;
	};
}

const initialState: LocalState = {
	backgroundColor: "#E6E6FA",
	numberOfFriends: 10,
	usersSettings: {
		left: {
			ageBelow: 34,
			categories: ["HUMAN"],
		},
		middle: {
			categories: ["ADMIN", "COMPUTER"],
		},
		right: {
			ageAbove: 30,
		},
	},
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
		setUsersSettings(
			state,
			{
				payload: { side, settings },
			}: PayloadAction<{ side: Sides; settings: SettingsParameters }>
		) {
			state.usersSettings[side] = settings;
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	incrementNumberOfFriendsByAmount,
	setBackgroundColor,
	setUsersSettings,
} = localStateSlice.actions;

// Selectors
const localStateSelector = (state: RootState) => state.localState;
export const numberOfFriendsSelector = createSelector(
	localStateSelector,
	(localState) => localState.numberOfFriends
);
export const backgroundColorSelector = createSelector(
	localStateSelector,
	(localState) => localState.backgroundColor
);
const allUsersSettingsSelector = createSelector(
	localStateSelector,
	(localState) => localState.usersSettings
);
export const usersSettingsSelector = (side: Sides) =>
	createSelector(
		allUsersSettingsSelector,
		(usersSettings) => usersSettings[side]
	);

export default localStateSlice.reducer;
