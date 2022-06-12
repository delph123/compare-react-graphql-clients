import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

function useURLSearchParams() {
	const [searchParams, setSearchParams] = useSearchParams();
	return useMemo(() => {
		return {
			store: searchParams.get("store") || "reactive-var",
			query: searchParams.get("query") || "redux",
			setSearchParams,
		};
	}, [searchParams, setSearchParams]);
}

export default useURLSearchParams;
