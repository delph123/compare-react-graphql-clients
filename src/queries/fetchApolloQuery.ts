import {
	OperationVariables,
	QueryHookOptions,
	TypedDocumentNode,
} from "@apollo/client";
import { DocumentNode } from "graphql";
import { client as apolloClient } from "../apollo/ApolloWrapper";

export interface FetchApolloQueryParams<
	TData = any,
	TVariables = OperationVariables
> {
	queryKey: [
		query: DocumentNode | TypedDocumentNode<TData, TVariables>,
		options?: QueryHookOptions<TData, TVariables>
	];
}

async function fetchApolloQuery<TData = any, TVariables = OperationVariables>({
	queryKey: [query, options],
}: FetchApolloQueryParams<TData, TVariables>) {
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

export default fetchApolloQuery;
