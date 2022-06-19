import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
	fetchFriendsAction,
	fetchUserAction,
	fetchUsersQueryAction,
} from "../apolloQueryAsyncThunk";
import { RootState } from "../store";

interface User {
	uuid: string;
	firstName: string;
	lastName: string;
	age: number;
	type: string;
}

const userAdapter = createEntityAdapter<User>({
	selectId: (user) => user.uuid,
});

const userSlice = createSlice({
	name: "user",
	initialState: userAdapter.getInitialState(),
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUsersQueryAction.fulfilled, (state, action) => {
			// Users
			userAdapter.upsertMany(state, action.payload?.users || []);
			// Friends of Users
			userAdapter.upsertMany(
				state,
				action.payload.users.map((user: any) => user.friends).flat()
			);
		});
		builder.addCase(fetchUserAction.fulfilled, (state, action) => {
			userAdapter.upsertOne(state, action.payload.users[0]);
		});
		builder.addCase(fetchFriendsAction.fulfilled, (state, action) => {
			userAdapter.upsertMany(state, action.payload?.user?.friends || []);
		});
	},
});

const userSelectors = userAdapter.getSelectors(
	(state: RootState) => state.user
);

export const userByIdSelector = userSelectors.selectById;

export default userSlice.reducer;
