import { useQuery as useApolloQuery } from "@apollo/client";

type useQueryType = typeof useApolloQuery;

const useQuery: useQueryType = function (query, options?) {
    return useApolloQuery(query, options);
}

export default useQuery;