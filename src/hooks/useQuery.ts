import {
	OperationVariables,
	QueryHookOptions,
	QueryOptions,
	QueryResult,
	TypedDocumentNode,
	useQuery as useApolloQuery,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { useCallback } from "react";
import { useQuery as useReactQuery } from "react-query";
import { client as apolloClient } from "../apollo/ApolloWrapper";
import { globalQueryCache } from "../apollo/localState";
import useLocalState from "./useLocalState";

const USE_QUERY_LIBRARY = "useWrappedRectQuery";

function fetchGraphQLQuery<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
) {
	// Use apollo client as fetch library for react-query
	// Prevent apollo from caching to simulate a "pure" react-query
	// experience (auto-refresh on focus for example)
	return apolloClient.query({
		...options,
		query,
		fetchPolicy: "no-cache",
	} as QueryOptions<TVariables, TData>);
}

function useWrappedRectQuery<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
	const { isLoading, data, error } = useReactQuery(
		[query, options?.variables],
		() => fetchGraphQLQuery(query, options),
		{
			staleTime: 30000, // Avoid too much refreshes
		}
	);

	const refetch = useCallback(() => {
		console.log([query, options?.variables]);
	}, [query, options?.variables]);

	return {
		loading: isLoading,
		data: data?.data,
		error,
		refetch,
	} as QueryResult<TData, TVariables>;
}

function useReduxQuery<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
	const [cache, setCache] = useLocalState<
		Record<string, QueryResult<TData, TVariables>>
	>(globalQueryCache as any);

	const queryId =
		(query.definitions[0] as any).name.value +
		":" +
		JSON.stringify(options?.variables);
	let result = cache[queryId];

	// console.log("Called useQuery on:", queryId, result);

	if (result == null || result?.called === false) {
		// console.log("Launching query:", queryId);

		const refresh = result?.called === false;

		// The refetch function can be used to trigger a refresh of current query
		// It's both clearing the global cache entry for the current query & also
		// ensuring the apollo query will re-triggered by setting called = false.
		const refetch = () => {
			setCache((prevCache) => ({
				...prevCache,
				[queryId]: { loading: true, called: false } as QueryResult<
					TData,
					TVariables
				>,
			}));
		};

		// Add loading state in the cache to avoid duplicate call to apollo
		result = { loading: true, refetch, called: true } as QueryResult<
			TData,
			TVariables
		>;
		setCache((prevCache) => ({
			...prevCache,
			[queryId]: result,
		}));

		// Launch query
		apolloClient
			.query({
				...options,
				query,
				// The network-only policy allows to bypass the apollo cache, even though it eventually
				// stores the query result its cache. We use this policy to refresh a query already made
				fetchPolicy: refresh ? "network-only" : "cache-first",
			} as QueryOptions<TVariables, TData>)
			.then((apolloResult) => {
				// console.log("Got result:", result, queryId);
				setCache((prevCache) => ({
					...prevCache,
					[queryId]: {
						...apolloResult,
						called: true,
						refetch,
					} as QueryResult<TData, TVariables>,
				}));
			})
			.catch((error) => {
				// console.log("Got error:", error, queryId);
				setCache((prevCache) => ({
					...prevCache,
					[queryId]: {
						called: true,
						loading: false,
						error,
						refetch,
					} as QueryResult<TData, TVariables>,
				}));
			});
	}

	return result;
}

const useQuery = { useApolloQuery, useReduxQuery, useWrappedRectQuery }[
	USE_QUERY_LIBRARY
];

export default useQuery;
