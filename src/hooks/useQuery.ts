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
import { USE_QUERY_LIBRARY } from "../config/parameters";
import { useAppDispatch } from "../redux/hooks";
import useLocalState from "./useLocalState";

async function fetchGraphQLQuery<TData = any, TVariables = OperationVariables>({
	queryKey: [query, options],
}: {
	queryKey: [
		query: DocumentNode | TypedDocumentNode<TData, TVariables>,
		options?: QueryHookOptions<TData, TVariables>
	];
}) {
	// Use apollo client as fetch library for react-query
	// Prevent apollo from caching to simulate a "pure" react-query
	// experience (auto-refresh on focus for example)
	const result = await apolloClient.query({
		...options,
		query,
		fetchPolicy: "no-cache",
	});

	return result.data;
}

function useWrappedRectQuery<TData = any, TVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
	const queryClient = useQueryClient();
	const { isLoading, data, error } = useReactQuery(
		[query, options],
		fetchGraphQLQuery as any,
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

function useReduxQuery<TData = any, TVariables = OperationVariables>(
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

const useQuery = { useApolloQuery, useReduxQuery, useWrappedRectQuery }[
	USE_QUERY_LIBRARY
];

export default useQuery;
