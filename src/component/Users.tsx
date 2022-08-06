import React, { FC, useState } from "react";
import useQuery from "../hooks/useQuery";
import useRenderCounter from "../hooks/useRenderCounter";
import { GetUsers } from "../queries/users";
import Loading from "./Loading";
import SettingsDialog from "./SettingsDialog";
import User from "./User";

interface UsersProps {
	ageAbove?: number;
	ageBelow?: number;
	category?: string[];
	backgroundColor?: string;
}

// Users is a Pure Components w.r.t. its props so we can encaspsulate it
// in React.memo to avoid re-rendering when no prop has changed.
const Users: FC<UsersProps> = React.memo(function Users({
	ageAbove: initialAgeAbove,
	ageBelow: initialAgeBelow,
	category: initialCategory,
	backgroundColor = "magenta",
}) {
	const renderCounter = useRenderCounter();
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [ageAbove, setAgeAbove] = useState(initialAgeAbove);
	const [ageBelow, setAgeBelow] = useState(initialAgeBelow);
	const [category, setCategory] = useState(initialCategory);

	const { data, loading, error, refetch } = useQuery(GetUsers, {
		variables: {
			filters: {
				ageAbove: ageAbove,
				ageBelow: ageBelow,
				types: category,
			},
		},
	});

	const openSettingsPopup = function (visible = true) {
		setSettingsVisible(visible);
	};

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
				{!category ? "ALL" : category.join(" + ")}
				{!ageAbove ? "" : ` (above ${ageAbove})`}
				{!ageBelow ? "" : ` (below ${ageBelow})`}
			</h2>
			<div className="button-row">
				<button onClick={() => refetch()}>Refresh</button>
				<button onClick={() => openSettingsPopup()}>Settings</button>
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
						category,
					}}
					save={({ ageAbove, ageBelow, category }) => {
						setAgeAbove(ageAbove);
						setAgeBelow(ageBelow);
						setCategory(category);
					}}
					exit={() => openSettingsPopup(false)}
				/>
			)}
		</section>
	);
});

export default Users;
