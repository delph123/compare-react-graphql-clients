import { makeVar, QueryResult } from "@apollo/client";
import { clearQueryCache } from "../redux/slices/queryCacheSlice";
import { AppDispatch } from "../redux/store";
import { client } from "./ApolloWrapper";

export const backgroundColorVar = makeVar("#E6E6FA");
export const numberOfFriendsVar = makeVar(10);

export const globalQueryCache = makeVar({} as Record<string, QueryResult>);

export function clearGlobalQueryCache(dispatch: AppDispatch) {
	globalQueryCache({});
	dispatch(clearQueryCache());
}

export function resetApolloCache() {
	client.resetStore();
}

export function clearApolloCache() {
	client.clearStore();
}

export function refresh(dispatch: AppDispatch, userId?: string) {
	if (userId) {
		evictApolloCache("user-" + userId);
		clearGlobalQueryCache(dispatch);
	} else {
		// Evict GetUsers from ROOT_QUERY
		client.cache.evict({
			fieldName: "users",
		});
		clearGlobalQueryCache(dispatch);
	}
}

export function evictApolloCache(userId: string) {
	client.cache.evict({
		id: client.cache.identify({
			uuid: userId,
			__typename: "User",
		}),
	});
	// Evicting records from cache causes some unreachable
	// cache entry, we can remove them with a call to the
	// garbage collector  (usually removes a few old friends)
	console.log(client.cache.gc());
}
