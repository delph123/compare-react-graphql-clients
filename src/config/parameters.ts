type UseQueryHook = "useApolloQuery" | "useReduxQuery" | "useWrappedRectQuery";
type UseStateHook = "useReactState" | "useReactiveVarState" | "useReduxState";
type LibraryChoice<T> = {
	id: string;
	label: string;
	hook: T;
};

export const DEFAULT_QUERY_LIBRARY = "redux";
export const DEFAULT_STORE_LIBRARY = "reactive-var";

export const QUERY_LIBRARY_CHOICES: LibraryChoice<UseQueryHook>[] = [
	{ id: "apollo", label: "Apollo", hook: "useApolloQuery" },
	{ id: "redux-thunk", label: "Redux Thunk", hook: "useReduxQuery" },
	{ id: "react-query", label: "React Query", hook: "useWrappedRectQuery" },
];
export const STORE_LIBRARY_CHOICES: LibraryChoice<UseStateHook>[] = [
	{ id: "react-state", label: "React State", hook: "useReactState" },
	{ id: "reactive-var", label: "Reactive Var", hook: "useReactiveVarState" },
	{ id: "redux", label: "Redux", hook: "useReduxState" },
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
	QUERY_LIBRARY_CHOICES.find((c) => c.id === query)?.hook || "useReduxQuery";
export const USE_STORE_LIBRARY =
	STORE_LIBRARY_CHOICES.find((c) => c.id === store)?.hook ||
	"useReactiveVarState";

export const USE_BATCH_HTTP_LINK = false;
