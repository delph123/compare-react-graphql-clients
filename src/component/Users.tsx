import React, { Dispatch, FC, SetStateAction, useState } from "react";
import useQuery from "../hooks/useQuery";
import useRenderCounter from "../hooks/useRenderCounter";
import { GetUsers } from "../queries/users";
import Loading from "./Loading";
import SettingsDialog, { SettingsParameters } from "./SettingsDialog";
import User from "./User";

interface UsersProps extends SettingsParameters {
	saveSettings: Dispatch<SetStateAction<SettingsParameters>>;
	backgroundColor?: string;
}

// Users is a Pure Components w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const Users: FC<UsersProps> = React.memo(function Users({
	ageAbove,
	ageBelow,
	categories,
	saveSettings,
	backgroundColor = "magenta",
}) {
	const renderCounter = useRenderCounter();
	const [settingsVisible, setSettingsVisible] = useState(false);

	const { data, loading, error, refetch } = useQuery(GetUsers, {
		variables: {
			filters: {
				ageAbove: ageAbove,
				ageBelow: ageBelow,
				types: categories,
			},
		},
	});

	if (error)
		return (
			<div>
				<p>Error :-/</p>
				<p>Caused by: {error.message}</p>
			</div>
		);

	return (
		<section
			className="App-section"
			style={{
				backgroundColor: backgroundColor,
			}}
		>
			[{renderCounter}]
			<h2 className="App-section-title">
				{!categories ? "ALL" : categories.join(" + ")}
				{!ageAbove ? "" : ` (above ${ageAbove})`}
				{!ageBelow ? "" : ` (below ${ageBelow})`}
			</h2>
			<div className="button-row">
				<button onClick={() => refetch()}>Refresh</button>
				<button onClick={() => setSettingsVisible(true)}>
					Settings
				</button>
			</div>
			{!data && loading ? (
				<p>
					<Loading />
				</p>
			) : (
				data.users.map((user: any) => {
					return (
						<p key={user.uuid}>
							<User userId={user.uuid} />
						</p>
					);
				})
			)}
			{settingsVisible && (
				<SettingsDialog
					initialValues={{
						ageAbove,
						ageBelow,
						categories,
					}}
					save={saveSettings}
					exit={() => setSettingsVisible(false)}
				/>
			)}
		</section>
	);
});

export default Users;
