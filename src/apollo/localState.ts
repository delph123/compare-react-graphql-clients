import { makeVar, QueryResult } from "@apollo/client";

export const backgroundColorVar = makeVar('#E6E6FA');
export const numberOfFriendsVar = makeVar(10);

export const globalQueryCache = makeVar({} as Record<string, QueryResult>);