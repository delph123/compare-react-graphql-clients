/* eslint-disable react-hooks/rules-of-hooks */
import { useReactiveVar, ReactiveVar } from "@apollo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { USE_STORE_LIBRARY } from "../config/parameters";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import getReduxStoreInterfaceFor from "../redux/mappings/storeInterfaceMapping";

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

function useReactiveVarStore<T>(
	variable: ReactiveVar<T>
): [T, Dispatch<SetStateAction<T>>] {
	const value = useReactiveVar(variable);
	return [value, setReactiveVar(variable)];
}

function useReactStore<T>(
	variable: ReactiveVar<T>
): [T, Dispatch<SetStateAction<T>>] {
	const initialValue = variable();
	return useState(initialValue);
}

function useReduxStore<T>(
	variable: ReactiveVar<T>
): [T, Dispatch<SetStateAction<T>>] {
	const { selector, actionCreator } = getReduxStoreInterfaceFor(variable);
	const dispatch = useAppDispatch();
	const value = useAppSelector(selector);
	const setValue = (setStateAction: SetStateAction<T>) => {
		dispatch(actionCreator(setStateAction));
	};
	return [value, setValue];
}

const useStore = { useReactStore, useReactiveVarStore, useReduxStore }[
	USE_STORE_LIBRARY
];

export default useStore;
