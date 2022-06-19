import { OperationVariables } from "@apollo/client";
import {
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from "@reduxjs/toolkit";
import { FetchApolloQueryParams } from "../../queries/fetchApolloQuery";
import {
	fetchFriendsAction,
	fetchUserAction,
	fetchUsersQueryAction,
} from "../apolloQueryAsyncThunk";
import { RootState } from "../store";

interface UsersQueryFilters {
	uuid?: string;
	ageAbove?: number;
	ageBelow?: number;
	types?: string;
	nbFriends?: number;
}

interface UsersQueryResult {
	users?: {
		uuid: string;
	}[];
	latestQuery?: string;
	loading: "idle" | "pending" | "fulfilled" | "rejected";
	filters: UsersQueryFilters;
}

function toUserQueryResult(
	action: PayloadAction<
		{ users?: { uuid: string }[] } | undefined,
		string,
		{
			arg: FetchApolloQueryParams;
			requestId: string;
			requestStatus: "pending" | "fulfilled" | "rejected";
		}
	>,
	getFilters: (variables: OperationVariables | undefined) => UsersQueryFilters
): UsersQueryResult {
	return {
		users: action.payload?.users,
		loading: action.meta.requestStatus,
		filters: getFilters(action.meta.arg.queryKey[1]?.variables),
		latestQuery: action.meta.requestId,
	};
}

const usersQueryAdapter = createEntityAdapter<UsersQueryResult>({
	selectId: (usersQuery) => JSON.stringify(usersQuery.filters),
});

const usersQuerySlice = createSlice({
	name: "usersQuery",
	initialState: usersQueryAdapter.getInitialState(),
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUsersQueryAction.pending, (state, action) => {
			usersQueryAdapter.setOne(
				state,
				toUserQueryResult(action, (variable) => variable?.filters)
			);
		});
		builder.addCase(fetchUsersQueryAction.fulfilled, (state, action) => {
			usersQueryAdapter.setOne(
				state,
				toUserQueryResult(action, (variable) => variable?.filters)
			);
		});
		builder.addCase(fetchUserAction.pending, (state, action) => {
			usersQueryAdapter.setOne(
				state,
				toUserQueryResult(action, (variable) => ({
					uuid: variable?.userId,
				}))
			);
		});
		builder.addCase(fetchUserAction.fulfilled, (state, action) => {
			usersQueryAdapter.setOne(
				state,
				toUserQueryResult(action, (variable) => ({
					uuid: variable?.userId,
				}))
			);
		});
		builder.addCase(fetchFriendsAction.pending, (state, action) => {
			usersQueryAdapter.setOne(
				state,
				toUserQueryResult(action, (variable) => ({
					uuid: variable?.userId,
					nbFriends: variable?.nbFriends,
				}))
			);
		});
		builder.addCase(fetchFriendsAction.fulfilled, (state, action) => {
			usersQueryAdapter.setOne(
				state,
				toUserQueryResult(action, (variable) => ({
					uuid: variable?.userId,
					nbFriends: variable?.nbFriends,
				}))
			);
		});
	},
});

const usersQuerySelectors = usersQueryAdapter.getSelectors(
	(state: RootState) => state.usersQuery
);

export const usersQuerySelector = usersQuerySelectors.selectById;

export default usersQuerySlice.reducer;
