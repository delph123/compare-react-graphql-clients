import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getConfigFromSearchParams } from "../config/parameters";

function useURLSearchParams() {
	const [searchParams, setSearchParams] = useSearchParams();
	return useMemo(() => {
		return {
			...getConfigFromSearchParams(searchParams),
			setSearchParams,
		};
	}, [searchParams, setSearchParams]);
}

export default useURLSearchParams;
