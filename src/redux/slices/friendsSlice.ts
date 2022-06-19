import {
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from "@reduxjs/toolkit";
import { FetchApolloQueryParams } from "../../queries/fetchApolloQuery";
import {
	fetchFriendsAction,
	fetchUsersQueryAction,
} from "../apolloQueryAsyncThunk";
import { RootState } from "../store";

interface Friend {
	uuid: string;
}

interface Friends {
	userId: string;
	nbFriends: number;
	friends?: Friend[];
}

function toFriends(
	action: PayloadAction<
		| {
				user?: {
					friends: Friend[];
				};
		  }
		| undefined,
		string,
		{
			arg: FetchApolloQueryParams;
			requestId: string;
			requestStatus: "pending" | "fulfilled" | "rejected";
		}
	>
): Friends {
	return {
		userId: action.meta.arg.queryKey[1]?.variables?.userId as string,
		nbFriends: action.meta.arg.queryKey[1]?.variables?.nbFriends as number,
		friends: action.payload?.user?.friends,
	};
}

const friendAdapter = createEntityAdapter<Friends>({
	selectId: (friend) => friend.userId + ":" + friend.nbFriends,
});

const friendsSlice = createSlice({
	name: "friends",
	initialState: friendAdapter.getInitialState(),
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUsersQueryAction.fulfilled, (state, action) => {
			friendAdapter.upsertMany(
				state,
				action.payload.users.map((user: any) => ({
					userId: user.uuid,
					nbFriends: user.friends.length,
					friends: user.friends,
				}))
			);
		});
		builder.addCase(fetchFriendsAction.fulfilled, (state, action) => {
			friendAdapter.upsertOne(state, toFriends(action));
		});
	},
});

const firendsSelectors = friendAdapter.getSelectors(
	(state: RootState) => state.friends
);

export const friendsByIdSelector = firendsSelectors.selectById;

export default friendsSlice.reducer;
