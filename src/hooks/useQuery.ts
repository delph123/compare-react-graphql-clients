import { OperationVariables, QueryHookOptions, QueryOptions, QueryResult, TypedDocumentNode, useQuery as useApolloQuery } from "@apollo/client";
import { useState } from "react";
import { client as apolloClient } from "../apollo/ApolloWrapper";

const USE_APOLLO_HOOK = false;

let useQuery =
    
    function useReduxQuery<TData = any, TVariables = OperationVariables>(
        query: TypedDocumentNode<TData, TVariables>,
        options?: QueryHookOptions<TData, TVariables>
    ): QueryResult<TData, TVariables> {

        const [cache, setCache] = useState({} as Record<string, QueryResult<TData, TVariables>>);

        const queryId = (query.definitions[0] as any).name.value + ":" + JSON.stringify(options?.variables);
        const result = cache[queryId];

        console.log("Called useQuery on:", queryId, result);

        if (result == null) {
            console.log("Launching query:", queryId);
            // Launch query
            apolloClient.query({
                ...options,
                query,
            } as QueryOptions<TVariables, TData>).then((result) => {
                console.log("Got result:", result, queryId);
                setCache({
                    ...cache,
                    [queryId]: result as QueryResult<TData, TVariables>,
                });
            }).catch((error) => {
                console.log("Got error:", error, queryId);
                setCache({
                    ...cache,
                    [queryId]: {
                        loading: false,
                        error,
                    } as QueryResult<TData, TVariables>,
                });
            });
            return { loading: true } as QueryResult<TData, TVariables>;
        } else {
            return result;
        }
    }

useQuery = USE_APOLLO_HOOK ? useApolloQuery : useQuery;

export default useQuery;