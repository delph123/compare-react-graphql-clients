import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { query, store } from "../config/parameters";

function useURLSearchParams() {
	const [, setSearchParams] = useSearchParams();
	return useMemo(() => {
		return {
			query,
			store,
			setSearchParams,
		};
	}, [setSearchParams]);
}

export default useURLSearchParams;
