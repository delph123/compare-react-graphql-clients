type UseQueryHook = "useApolloQuery" | "useReduxQuery" | "useWrappedRectQuery";
type UseStoreHook = "useReactStore" | "useReactiveVarStore" | "useReduxStore";
type LibraryChoice<T> = {
	id: string;
	label: string;
	hook: T;
};

export const DEFAULT_QUERY_LIBRARY = "apollo";
export const DEFAULT_STORE_LIBRARY = "reactive-var";

export const QUERY_LIBRARY_CHOICES: LibraryChoice<UseQueryHook>[] = [
	{ id: "apollo", label: "Apollo", hook: "useApolloQuery" },
	{ id: "redux-thunk", label: "Redux Thunk", hook: "useReduxQuery" },
	{ id: "react-query", label: "React Query", hook: "useWrappedRectQuery" },
];
export const STORE_LIBRARY_CHOICES: LibraryChoice<UseStoreHook>[] = [
	{ id: "react-state", label: "React State", hook: "useReactStore" },
	{ id: "reactive-var", label: "Reactive Var", hook: "useReactiveVarStore" },
	{ id: "redux", label: "Redux", hook: "useReduxStore" },
];

export function getConfigFromSearchParams(searchParams: URLSearchParams) {
	return {
		store: searchParams.get("store") || DEFAULT_STORE_LIBRARY,
		query: searchParams.get("query") || DEFAULT_QUERY_LIBRARY,
	};
}

export const { query, store } = getConfigFromSearchParams(
	new URLSearchParams(window.location.search)
);

export const USE_QUERY_LIBRARY =
	QUERY_LIBRARY_CHOICES.find((c) => c.id === query)?.hook || "useApolloQuery";
export const USE_STORE_LIBRARY =
	STORE_LIBRARY_CHOICES.find((c) => c.id === store)?.hook ||
	"useReactiveVarStore";

export const USE_BATCH_HTTP_LINK = false;
