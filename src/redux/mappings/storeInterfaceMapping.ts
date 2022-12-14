import { QueryResult, ReactiveVar } from "@apollo/client";
import { AnyAction } from "@reduxjs/toolkit";
import { SetStateAction } from "react";
import {
	backgroundColorVar,
	globalQueryCache,
	numberOfFriendsVar,
	usersSettingsLeftVar,
	usersSettingsMiddleVar,
	usersSettingsRightVar,
} from "../../apollo/localState";
import { SettingsParameters } from "../../component/SettingsDialog";
import {
	backgroundColorSelector,
	incrementNumberOfFriendsByAmount,
	numberOfFriendsSelector,
	setBackgroundColor,
	setUsersSettings,
	Sides,
	usersSettingsSelector,
} from "../slices/localStateSlice";
import { addToCache, queryCacheSelector } from "../slices/queryCacheSlice";
import { RootState } from "../store";

export interface ReduxStoreInterface<T> {
	selector: (state: RootState) => T;
	actionCreator: (action: SetStateAction<T>) => AnyAction;
}

const reduxStoreMapping = new Map<ReactiveVar<any>, ReduxStoreInterface<any>>();

function setReduxStoreInterfactMapping<T>(
	variable: ReactiveVar<T>,
	reduxInterface: ReduxStoreInterface<T>
) {
	reduxStoreMapping.set(variable, reduxInterface);
}

export default function getReduxStoreInterfaceFor<T>(
	variable: ReactiveVar<T>
): ReduxStoreInterface<T> {
	const intf = reduxStoreMapping.get(variable);
	if (intf != null) {
		return intf;
	} else {
		throw new Error("Redux interface mapping not found!!");
	}
}

// Background Color
setReduxStoreInterfactMapping(backgroundColorVar, {
	selector: backgroundColorSelector,
	actionCreator(color) {
		return setBackgroundColor(color as string);
	},
});

// Number of Friends
setReduxStoreInterfactMapping(numberOfFriendsVar, {
	selector: numberOfFriendsSelector,
	actionCreator(action) {
		const computeAmount = action as (n: number) => number;
		return incrementNumberOfFriendsByAmount(computeAmount(0));
	},
});

// UsersSettings
function getUsersSettingsInterface(
	side: Sides
): ReduxStoreInterface<SettingsParameters> {
	return {
		selector: usersSettingsSelector(side),
		actionCreator(action) {
			return setUsersSettings({
				side,
				settings: action as SettingsParameters,
			});
		},
	};
}

setReduxStoreInterfactMapping(
	usersSettingsLeftVar,
	getUsersSettingsInterface("left")
);
setReduxStoreInterfactMapping(
	usersSettingsMiddleVar,
	getUsersSettingsInterface("middle")
);
setReduxStoreInterfactMapping(
	usersSettingsRightVar,
	getUsersSettingsInterface("right")
);

// Query Cache
setReduxStoreInterfactMapping(globalQueryCache, {
	selector: queryCacheSelector,
	actionCreator(action) {
		const cacheAdder = action as (
			prevState: Record<string, QueryResult>
		) => Record<string, QueryResult>;
		const [queryId, result] = Object.entries(cacheAdder({}))[0];
		return addToCache({ queryId, result });
	},
});
