import { OperationVariables, QueryHookOptions, QueryOptions, QueryResult, TypedDocumentNode, useQuery as useApolloQuery } from "@apollo/client";
import { client as apolloClient } from "../apollo/ApolloWrapper";
import { globalQueryCache } from "../apollo/localState";
import useLocalState from "./useLocalState";

const USE_APOLLO_HOOK = false;

function useReduxQuery<TData = any, TVariables = OperationVariables>(
    query: TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {

    const [cache, setCache] = useLocalState<Record<string, QueryResult<TData, TVariables>>>(globalQueryCache as any);

    const queryId = (query.definitions[0] as any).name.value + ":" + JSON.stringify(options?.variables);
    let result = cache[queryId];

    // console.log("Called useQuery on:", queryId, result);

    if (result == null) {

        console.log("Launching query:", queryId);

        // Add loading state in the cache to avoid duplicate call to apollo
        result = { loading: true } as QueryResult<TData, TVariables>;
        setCache((prevCache) => ({
            ...prevCache,
            [queryId]: result,
        }));

        // Launch query
        apolloClient.query({
            ...options,
            query,
        } as QueryOptions<TVariables, TData>).then((result) => {
            // console.log("Got result:", result, queryId);
            setCache((prevCache) => ({
                ...prevCache,
                [queryId]: result as QueryResult<TData, TVariables>,
            }));
        }).catch((error) => {
            // console.log("Got error:", error, queryId);
            setCache((prevCache) => ({
                ...prevCache,
                [queryId]: {
                    loading: false,
                    error,
                } as QueryResult<TData, TVariables>,
            }));
        });

    }

    return result;
    
}

const useQuery = USE_APOLLO_HOOK ? useApolloQuery : useReduxQuery;

export default useQuery;