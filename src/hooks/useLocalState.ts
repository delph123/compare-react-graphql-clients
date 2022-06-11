import { useReactiveVar, ReactiveVar } from "@apollo/client";
import { Dispatch, SetStateAction, useState } from "react";

const USE_REACT_STATE = false;

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

const useLocalState = USE_REACT_STATE ? useReactState : useReactiveVarState;

export default useLocalState;
