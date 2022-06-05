import { makeVar, QueryResult } from "@apollo/client";
import { client } from "./ApolloWrapper";

export const backgroundColorVar = makeVar('#E6E6FA');
export const numberOfFriendsVar = makeVar(10);

export const globalQueryCache = makeVar({} as Record<string, QueryResult>);

export function clearGlobalQueryCache() {
    globalQueryCache({});
}

export function resetApolloCache() {
    client.resetStore();
}

export function clearApolloCache() {
    client.clearStore();
}

export function refresh(userId?: string) {
    clearApolloCache();
    clearGlobalQueryCache();
}