import { TypedDocumentNode } from "@apollo/client";
import { AsyncThunk, createSelector } from "@reduxjs/toolkit";
import { DocumentNode } from "graphql";
import { FetchApolloQueryParams } from "../../queries/fetchApolloQuery";
import { GetFriends, GetUser, GetUsers } from "../../queries/users";
import {
	fetchFriendsAction,
	fetchUserAction,
	fetchUsersQueryAction,
} from "../apolloQueryAsyncThunk";
import { friendsByIdSelector } from "../slices/friendsSlice";
import { userByIdSelector } from "../slices/userSlice";
import { usersQuerySelector } from "../slices/usersQuerySlice";
import { RootState } from "../store";

type GqlQuery = DocumentNode | TypedDocumentNode;

export interface ReduxQueryInterface<T> {
	selectorCreator: (variables: any) => (state: RootState) => {
		loading: "idle" | "pending" | "fulfilled" | "rejected";
		data?: T;
	};
	thunkCreator: AsyncThunk<any, FetchApolloQueryParams, {}>;
}

const reduxMapping = new Map<GqlQuery, ReduxQueryInterface<any>>();

function setReduxQueryInterfactMapping<T>(
	query: GqlQuery,
	reduxInterface: ReduxQueryInterface<T>
) {
	reduxMapping.set(query, reduxInterface);
}

export default function getReduxQueryInterfaceFor<T>(
	query: GqlQuery
): ReduxQueryInterface<T> {
	const intf = reduxMapping.get(query);
	if (intf != null) {
		return intf;
	} else {
		throw new Error("Redux interface mapping not found!!");
	}
}

// Get Users
setReduxQueryInterfactMapping(GetUsers, {
	selectorCreator: (variables) =>
		createSelector(
			(state: RootState) =>
				usersQuerySelector(state, JSON.stringify(variables.filters)),
			(usersQuery) => ({
				loading:
					usersQuery?.loading == null ? "idle" : usersQuery.loading,
				data:
					usersQuery?.users != null
						? {
								users: usersQuery?.users,
						  }
						: undefined,
			})
		),
	thunkCreator: fetchUsersQueryAction,
});

// Get single User
setReduxQueryInterfactMapping(GetUser, {
	selectorCreator: (variables) =>
		createSelector(
			(state: RootState) => userByIdSelector(state, variables.userId),
			(user) => ({
				loading: user == null ? "idle" : "fulfilled",
				data:
					user != null
						? {
								users: [user],
						  }
						: undefined,
			})
		),
	thunkCreator: fetchUserAction,
});

// Get Friends
setReduxQueryInterfactMapping(GetFriends, {
	selectorCreator: (variables) =>
		createSelector(
			(state: RootState) =>
				friendsByIdSelector(
					state,
					variables.userId + ":" + variables.nbFriends
				),
			(friends) => ({
				loading: friends == null ? "idle" : "fulfilled",
				data:
					friends != null
						? {
								user: friends,
						  }
						: undefined,
			})
		),
	thunkCreator: fetchFriendsAction,
});
