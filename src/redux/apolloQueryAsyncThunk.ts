import { createAsyncThunk } from "@reduxjs/toolkit";
import fetchApolloQuery, {
	FetchApolloQueryParams,
} from "../queries/fetchApolloQuery";

export const fetchUsersQueryAction = createAsyncThunk<
	any,
	FetchApolloQueryParams
>("query/users", fetchApolloQuery);

export const fetchUserAction = createAsyncThunk<any, FetchApolloQueryParams>(
	"query/user",
	fetchApolloQuery
);

export const fetchFriendsAction = createAsyncThunk<any, FetchApolloQueryParams>(
	"query/friends",
	fetchApolloQuery
);
