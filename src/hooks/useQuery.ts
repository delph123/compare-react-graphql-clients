import {
	OperationVariables,
	QueryHookOptions,
	QueryOptions,
	QueryResult,
	TypedDocumentNode,
	useQuery as useApolloQuery,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { useQuery as useReactQuery, useQueryClient } from "react-query";
import { client as apolloClient } from "../apollo/ApolloWrapper";
import { globalQueryCache } from "../apollo/localState";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { USE_QUERY_LIBRARY, USE_STORE_LIBRARY } from "../config/parameters";
import useLocalState from "./useLocalState";
import { useEffect } from "react";
import fetchApolloQuery from "../queries/fetchApolloQuery";
import getReduxQueryInterfaceFor from "../redux/mappings/queryInterfaceMapping";

function useWrappedRectQuery<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
	const queryClient = useQueryClient();
	const { isLoading, data, error } = useReactQuery(
		[query, options],
		fetchApolloQuery as any,
		{
			staleTime: 30000, // Avoid too much refreshes
		}
	);

	const refetch = () => {
		queryClient.invalidateQueries([query, options]);
	};

	return {
		loading: isLoading,
		data,
		error,
		refetch,
	} as QueryResult<TData, TVariables>;
}

function useReduxQueryAlt<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
	const dispatch = useAppDispatch();

	const [cache, setCache] = useLocalState<
		Record<string, QueryResult<TData, TVariables>>
	>(globalQueryCache as any);

	const queryId =
		(query.definitions[0] as any).name.value +
		":" +
		JSON.stringify(options?.variables);
	let result = cache[queryId];

	if (result == null || result?.called === false) {
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

		result = { loading: true, refetch, called: true } as QueryResult<
			TData,
			TVariables
		>;

		// Launch query
		dispatch(() => {
			apolloClient
				.query({
					...options,
					query,
					// The network-only policy allows to bypass the apollo cache, even though it eventually
					// stores the query result its cache. We use this policy to refresh a query already made
					fetchPolicy: refresh ? "network-only" : "cache-first",
				} as QueryOptions<TVariables, TData>)
				.then((apolloResult) => {
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
		});
	}

	return result;
}

function useReduxQuery<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
	const { selectorCreator, thunkCreator } = getReduxQueryInterfaceFor(query);
	const dispatch = useAppDispatch();

	const refetch = () => {
		dispatch(
			thunkCreator({
				queryKey: [query, options as QueryHookOptions | undefined],
			})
		);
	};

	const queryResponse = useAppSelector(selectorCreator(options?.variables));

	useEffect(
		() => {
			// Fetch only if data is not already in the store
			// (query might be already loading and it may result in
			// a duplicate query but apollo takes care of it)
			if (queryResponse.loading === "idle") {
				refetch();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[query, JSON.stringify(options)]
	);

	return {
		loading:
			queryResponse.loading === "idle" ||
			queryResponse.loading === "pending",
		refetch,
		data: queryResponse.data,
	} as unknown as QueryResult<TData, TVariables>;
}

const useQuery = {
	useApolloQuery,
	useReduxQuery:
		USE_STORE_LIBRARY === "useReduxState"
			? useReduxQuery
			: useReduxQueryAlt,
	useWrappedRectQuery,
}[USE_QUERY_LIBRARY];

export default useQuery;
