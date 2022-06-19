import React, { FC, PropsWithChildren } from "react";
import { useParams } from "react-router-dom";
import {
	clearGlobalQueryCache,
	refresh,
	resetApolloCache,
} from "../apollo/localState";
import {
	QUERY_LIBRARY_CHOICES,
	STORE_LIBRARY_CHOICES,
} from "../config/parameters";
import useRenderCounter from "../hooks/useRenderCounter";
import useURLSearchParams from "../hooks/useURLSearchParams";
import { useAppDispatch } from "../redux/hooks";
import RadioSet from "./RadioSet";

type HeaderProps = PropsWithChildren<{
	color: string;
	onColorChanged: (value: string) => void;
}>;

function getRefreshLabel(userId: string | undefined | null) {
	if (userId != null) {
		return `Refresh (usr ${
			userId.length > 5
				? userId.substring(0, 2) +
				  "..." +
				  userId.substring(userId.length - 3)
				: userId
		})`;
	} else {
		return "Refresh (users)";
	}
}

// Header is a Pure Components w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const Header: FC<HeaderProps> = React.memo(function Header({
	children,
	color,
	onColorChanged,
}) {
	const renderCounter = useRenderCounter();
	const params = useParams();
	const { store, query, setSearchParams } = useURLSearchParams();
	const dispatch = useAppDispatch();

	return (
		<header className="App-header">
			<div className="background" style={{ backgroundColor: color }}>
				[{renderCounter}]
			</div>
			{children}
			<div className="App-header-subbar">
				<button onClick={() => clearGlobalQueryCache(dispatch)}>
					Clear Store Cache
				</button>
				<button onClick={resetApolloCache}>Reset Apollo Cache</button>
				<input
					type="color"
					onChange={(evt) => onColorChanged(evt.target.value)}
					value={color}
					name="pick a color"
				/>
				<button onClick={() => refresh(dispatch, params?.userId)}>
					{getRefreshLabel(params?.userId)}
				</button>
			</div>
			<RadioSet
				className="App-header-choice App-choice-store"
				name="store"
				legend="Store"
				choices={STORE_LIBRARY_CHOICES}
				selected={store}
				onSelect={(evt) => {
					setSearchParams({
						store: evt.target.id,
						query,
					});
					// Reload page to apply change
					window.location.reload();
				}}
			/>
			<RadioSet
				className="App-header-choice App-choice-query"
				name="query"
				legend="Query"
				choices={QUERY_LIBRARY_CHOICES}
				selected={query}
				onSelect={(evt) => {
					setSearchParams({
						store,
						query: evt.target.id,
					});
					// Reload page to apply change
					window.location.reload();
				}}
			/>
		</header>
	);
});

export default Header;
