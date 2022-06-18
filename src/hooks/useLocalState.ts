/* eslint-disable react-hooks/rules-of-hooks */
import { useReactiveVar, ReactiveVar } from "@apollo/client";
import { Dispatch, SetStateAction, useState } from "react";
import { backgroundColorVar, numberOfFriendsVar } from "../apollo/localState";
import { USE_STORE_LIBRARY } from "../config/parameters";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
	backgroundColorSelector,
	incrementNumberOfFriendsByAmount,
	numberOfFriendsSelector,
	setBackgroundColor,
} from "../redux/slices/localStateSlice";

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

function useReduxState<T>(
	variable: ReactiveVar<T>
): [T, Dispatch<SetStateAction<T>>] {
	switch (variable) {
		// @ts-ignore
		case backgroundColorVar:
			const bgColor = useAppSelector(backgroundColorSelector);
			const dispatchBgColor = useAppDispatch();
			const setBgColor = (action: string) => {
				dispatchBgColor(setBackgroundColor(action));
			};
			// @ts-ignore
			return [bgColor, setBgColor];
		// @ts-ignore
		case numberOfFriendsVar:
			const nbFriends = useAppSelector(numberOfFriendsSelector);
			const dispatchNbFriends = useAppDispatch();
			const setNbFriends = (computeAmount: (n: number) => number) => {
				dispatchNbFriends(
					incrementNumberOfFriendsByAmount(computeAmount(0))
				);
			};
			// @ts-ignore
			return [nbFriends, setNbFriends];
		default:
			return useReactiveVarState(variable);
	}
}

const useLocalState = { useReactState, useReactiveVarState, useReduxState }[
	USE_STORE_LIBRARY
];

export default useLocalState;
