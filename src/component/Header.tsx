import React, { FC, PropsWithChildren } from "react";
import { useParams } from "react-router-dom";
import {
	clearGlobalQueryCache,
	refresh,
	resetApolloCache,
} from "../apollo/localState";
import useRenderCounter from "../hooks/useRenderCounter";
import useURLSearchParams from "../hooks/useURLSearchParams";
import RadioSet from "./RadioSet";

type HeaderProps = PropsWithChildren<{
	color: string;
	onColorChanged: (value: string) => void;
}>;

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

	return (
		<header className="App-header">
			<div className="background" style={{ backgroundColor: color }}>
				[{renderCounter}]
			</div>
			{children}
			<div className="App-header-subbar">
				<button onClick={clearGlobalQueryCache}>
					Clear Redux Cache
				</button>
				<button onClick={resetApolloCache}>Reset Apollo Cache</button>
				<input
					type="color"
					onChange={(evt) => onColorChanged(evt.target.value)}
					value={color}
					name="pick a color"
				/>
				<button onClick={() => refresh(params?.userId)}>
					Refresh
					{params?.userId != null
						? ` (usr ${
								params.userId.length > 5
									? params.userId.substring(0, 2) +
									  "..." +
									  params.userId.substring(
											params.userId.length - 3
									  )
									: params.userId
						  })`
						: " (users)"}
				</button>
			</div>
			<RadioSet
				className="App-header-choice App-choice-store"
				name="store"
				legend="Store"
				choices={[
					{ id: "react-state", label: "React State" },
					{ id: "reactive-var", label: "Reactive Var" },
				]}
				selected={store}
				onSelect={(evt) => {
					setSearchParams({
						store: evt.target.id,
						query,
					});
				}}
			/>
			<RadioSet
				className="App-header-choice App-choice-query"
				name="query"
				legend="Query"
				choices={[
					{ id: "apollo", label: "Apollo" },
					{ id: "redux", label: "Redux" },
					{ id: "react-query", label: "React Query" },
				]}
				selected={query}
				onSelect={(evt) => {
					setSearchParams({
						store,
						query: evt.target.id,
					});
				}}
			/>
		</header>
	);
});

export default Header;
