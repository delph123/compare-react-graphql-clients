import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsParameters } from "../../component/SettingsDialog";
import {
	DEFAULT_BACKGROUND_COLOR,
	DEFAULT_NUMBER_OF_FRIENDS,
	DEFAULT_USERS_SETTINGS_LEFT,
	DEFAULT_USERS_SETTINGS_MIDDLE,
	DEFAULT_USERS_SETTINGS_RIGHT,
} from "../../config/defaults";
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
	backgroundColor: DEFAULT_BACKGROUND_COLOR,
	numberOfFriends: DEFAULT_NUMBER_OF_FRIENDS,
	usersSettings: {
		left: DEFAULT_USERS_SETTINGS_LEFT,
		middle: DEFAULT_USERS_SETTINGS_MIDDLE,
		right: DEFAULT_USERS_SETTINGS_RIGHT,
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
export const numberOfFriendsSelector = (state: RootState) =>
	state.localState.numberOfFriends;
export const backgroundColorSelector = (state: RootState) =>
	state.localState.backgroundColor;
export const usersSettingsSelector = (side: Sides) => (state: RootState) =>
	state.localState.usersSettings[side];

export default localStateSlice.reducer;
