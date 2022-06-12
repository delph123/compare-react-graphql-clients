import { useReactiveVar, ReactiveVar } from "@apollo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { USE_STORE_LIBRARY } from "../config/parameters";

function setReactiveVar<T>(variable: ReactiveVar<T>) {
	return function (value: SetStateAction<T>) {
		if (typeof value === "function") {
			const computeValue = value as (prevState: T) => T;
			variable(computeValue(variable()));
		} else {
			variable(value);
		}
	};
}

function useReactiveVarState<T>(
	variable: ReactiveVar<T>
): [T, Dispatch<SetStateAction<T>>] {
	const value = useReactiveVar(variable);
	return [value, setReactiveVar(variable)];
}

function useReactState<T>(
	variable: ReactiveVar<T>
): [T, Dispatch<SetStateAction<T>>] {
	const initialValue = variable();
	return useState(initialValue);
}

const useLocalState = { useReactState, useReactiveVarState }[USE_STORE_LIBRARY];

export default useLocalState;
