import { OperationVariables, QueryHookOptions, QueryOptions, QueryResult, TypedDocumentNode, useQuery as useApolloQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { client as apolloClient } from "../apollo/ApolloWrapper";

const USE_APOLLO_HOOK = false;

function useReduxQuery<TData = any, TVariables = OperationVariables>(
    query: TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {

    const [cache, setCache] = useState({ loading: true } as QueryResult<TData, TVariables>);

    const queryId = (query.definitions[0] as any).name.value + ":" + JSON.stringify(options?.variables);

    console.log("Called useQuery on:", queryId, cache);

    useEffect(() => {
        console.log("Launching query:", queryId);
        setCache({ loading: true } as QueryResult<TData, TVariables>);
        // Launch query
        apolloClient.query({
            ...options,
            query,
        } as QueryOptions<TVariables, TData>).then((result) => {
            console.log("Got result:", result, queryId);
            setCache(result as QueryResult<TData, TVariables>);
        }).catch((error) => {
            console.log("Got error:", error, queryId);
            setCache({
                loading: false,
                error,
            } as QueryResult<TData, TVariables>);
        });
    }, [queryId]);

    return cache;
}

const useQuery = USE_APOLLO_HOOK ? useApolloQuery : useReduxQuery;

export default useQuery;