import { QueryResult, ReactiveVar } from "@apollo/client";
import { AnyAction } from "@reduxjs/toolkit";
import { SetStateAction } from "react";
import {
	backgroundColorVar,
	globalQueryCache,
	numberOfFriendsVar,
} from "../apollo/localState";
import {
	backgroundColorSelector,
	incrementNumberOfFriendsByAmount,
	numberOfFriendsSelector,
	setBackgroundColor,
} from "./slices/localStateSlice";
import { addToCache, queryCacheSelector } from "./slices/queryCacheSlice";
import { RootState } from "./store";

export interface ReduxInterface<T> {
	selector: (state: RootState) => T;
	actionCreator: (action: SetStateAction<T>) => AnyAction;
}

const reduxMapping = new Map<ReactiveVar<any>, ReduxInterface<any>>();

function setReduxInterfactMapping<T>(
	variable: ReactiveVar<T>,
	reduxInterface: ReduxInterface<T>
) {
	reduxMapping.set(variable, reduxInterface);
}

export default function getReduxInterfaceFor<T>(
	variable: ReactiveVar<T>
): ReduxInterface<T> {
	const intf = reduxMapping.get(variable);
	if (intf != null) {
		return intf;
	} else {
		throw new Error("Redux interface mapping not found!!");
	}
}

// Background Color
setReduxInterfactMapping(backgroundColorVar, {
	selector: backgroundColorSelector,
	actionCreator(color) {
		return setBackgroundColor(color as string);
	},
});

// Number of Friends
setReduxInterfactMapping(numberOfFriendsVar, {
	selector: numberOfFriendsSelector,
	actionCreator(action) {
		const computeAmount = action as (n: number) => number;
		return incrementNumberOfFriendsByAmount(computeAmount(0));
	},
});

// Query Cache
setReduxInterfactMapping(globalQueryCache, {
	selector: queryCacheSelector,
	actionCreator(action) {
		const cacheAdder = action as (
			prevState: Record<string, QueryResult>
		) => Record<string, QueryResult>;
		const [queryId, result] = Object.entries(cacheAdder({}))[0];
		return addToCache({ queryId, result });
	},
});
